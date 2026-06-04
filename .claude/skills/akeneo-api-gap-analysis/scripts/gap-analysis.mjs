#!/usr/bin/env node
/**
 * Akeneo REST API — endpoint coverage (GAP) analysis.
 *
 * Compares the official Akeneo OpenAPI specification against the endpoints
 * implemented in this client (src/services/api) and reports which documented
 * operations are implemented, missing, or need manual review.
 *
 * The script is DETERMINISTIC and dependency-free (Node >= 20 built-ins only:
 * fetch, fs, path). It never writes to the source tree. It is meant to be the
 * factual backbone of the analysis — a human or Claude reviews the
 * "missing"/"review" buckets afterwards, because the client builds some paths
 * dynamically and static extraction cannot be 100% perfect.
 *
 * Usage:
 *   node gap-analysis.mjs [options]
 *
 * Options:
 *   --spec <url|path>   OpenAPI source. Default: official Akeneo spec URL.
 *   --src <dir>         Source dir to scan. Default: <repo>/src.
 *   --cache <path>      Where to cache the downloaded spec. Default: OS tmp.
 *   --filter <text>     Only report operations whose tag/path contains <text>.
 *   --json              Emit machine-readable JSON instead of markdown.
 *   --refresh           Ignore the cache and re-download the spec.
 *   --no-color          Disable ANSI colors in the markdown summary.
 *   -h, --help          Show this help.
 *
 * Exit code is 0 on success regardless of gaps (so it can be used in reports);
 * pass --strict to exit 1 when any documented operation is missing.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_SPEC_URL =
  'https://storage.googleapis.com/akecld-prd-pim-saas-shared-openapi-spec/openapi.json';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const HTTP_METHODS = ['get', 'post', 'patch', 'put', 'delete'];

// ── argument parsing ──────────────────────────────────────────────────────
function parseArgs(argv) {
  const opts = {
    spec: DEFAULT_SPEC_URL,
    src: null,
    cache: null,
    filter: null,
    json: false,
    refresh: false,
    strict: false,
    color: true,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--spec') opts.spec = argv[++i];
    else if (a === '--src') opts.src = argv[++i];
    else if (a === '--cache') opts.cache = argv[++i];
    else if (a === '--filter') opts.filter = argv[++i];
    else if (a === '--json') opts.json = true;
    else if (a === '--refresh') opts.refresh = true;
    else if (a === '--strict') opts.strict = true;
    else if (a === '--no-color') opts.color = false;
    else if (a === '-h' || a === '--help') opts.help = true;
    else throw new Error(`Unknown option: ${a}`);
  }
  return opts;
}

// ── path normalization ────────────────────────────────────────────────────
// Reduce a path to a comparable signature: keep from the first "/api/" segment,
// turn every {param} or ${var} placeholder into "*", and drop query strings.
function normalizePath(raw) {
  if (!raw) return null;
  let p = raw.trim();
  const apiIdx = p.indexOf('/api/');
  if (apiIdx >= 0) p = p.slice(apiIdx);
  p = p.split('?')[0];
  // Order matters: strip ${var} (template literals) before {param} (OpenAPI),
  // otherwise the inner {var} of ${var} is consumed first and leaves a "$".
  p = p.replace(/\$\{[^}]*\}/g, '*'); // ${var} -> *
  p = p.replace(/\{[^}]*\}/g, '*'); // {code} -> *
  p = p.replace(/\/+/g, '/'); // collapse //
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function sig(method, normPath) {
  return `${method.toUpperCase()} ${normPath}`;
}

// ── spec loading ──────────────────────────────────────────────────────────
async function loadSpec(opts) {
  const isUrl = /^https?:\/\//i.test(opts.spec);
  if (!isUrl) {
    return JSON.parse(fs.readFileSync(opts.spec, 'utf8'));
  }
  const cachePath =
    opts.cache || path.join(os.tmpdir(), 'akeneo-openapi-cache.json');
  if (!opts.refresh && fs.existsSync(cachePath)) {
    const age = Date.now() - fs.statSync(cachePath).mtimeMs;
    if (age < CACHE_TTL_MS) {
      try {
        return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      } catch {
        /* fall through and re-fetch */
      }
    }
  }
  const res = await fetch(opts.spec);
  if (!res.ok) {
    throw new Error(`Failed to fetch spec (${res.status}) from ${opts.spec}`);
  }
  const text = await res.text();
  try {
    fs.writeFileSync(cachePath, text);
  } catch {
    /* cache is best-effort */
  }
  return JSON.parse(text);
}

// Build the list of documented operations from the OpenAPI paths object.
function extractSpecOperations(spec) {
  const ops = [];
  const paths = spec.paths || {};
  for (const rawPath of Object.keys(paths)) {
    const item = paths[rawPath];
    for (const method of HTTP_METHODS) {
      const op = item[method];
      if (!op) continue;
      const tag = (op.tags && op.tags[0]) || 'Untagged';
      ops.push({
        method: method.toUpperCase(),
        path: rawPath,
        normPath: normalizePath(rawPath),
        signature: sig(method, normalizePath(rawPath)),
        tag,
        operationId: op.operationId || '',
        summary: (op.summary || '').replace(/\s+/g, ' ').trim(),
        deprecated: !!op.deprecated,
      });
    }
  }
  return ops;
}

// ── source scanning ───────────────────────────────────────────────────────
function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walk(full, acc);
    } else if (
      entry.name.endsWith('.ts') &&
      !entry.name.endsWith('.spec.ts') &&
      !entry.name.endsWith('.e2e-spec.ts') &&
      entry.name !== 'index.ts'
    ) {
      acc.push(full);
    }
  }
  return acc;
}

// Resolve the `endpoint` literal(s) declared in a service file.
function findEndpointLiterals(code) {
  const literals = [];
  const patterns = [
    /super\s*\(\s*[^,]+,\s*[`'"]([^`'"]+)[`'"]/g, // super(client, '<ep>')
    /\bthis\.endpoint\s*=\s*[`'"]([^`'"]+)[`'"]/g, // this.endpoint = '<ep>'
    /\bendpoint\s*(?::\s*string)?\s*=\s*[`'"]([^`'"]+)[`'"]/g, // endpoint = '<ep>'
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(code)) !== null) {
      if (m[1].includes('/api/')) literals.push(m[1]);
    }
  }
  return [...new Set(literals)];
}

// Resolve a single call-argument expression into a normalized path.
function resolveArgToPath(arg, endpoint) {
  let p = arg;
  // ${this.completeEndpoint(...)} -> the endpoint literal (with its {param}s)
  p = p.replace(/\$\{\s*this\.completeEndpoint\([^)]*\)\s*\}/g, endpoint || '');
  // ${this.endpoint} -> endpoint literal
  p = p.replace(/\$\{\s*this\.endpoint\s*\}/g, endpoint || '');
  return normalizePath(p);
}

// Extract implemented {method, normPath} signatures from one file's source.
function extractImplementedFromFile(code) {
  const found = []; // { method, normPath }
  const endpoints = findEndpointLiterals(code);
  const primaryEndpoint = endpoints.find((e) => e.startsWith('/api/')) || endpoints[0] || '';

  // 1) Any class extending BaseApi inherits get/list/create/update/delete.
  if (/extends\s+BaseApi\b/.test(code) && primaryEndpoint) {
    const base = normalizePath(primaryEndpoint);
    found.push({ method: 'GET', normPath: base }); // list()
    found.push({ method: 'GET', normPath: `${base}/*` }); // get(id)
    found.push({ method: 'POST', normPath: base }); // create()
    found.push({ method: 'PATCH', normPath: `${base}/*` }); // update(id)
    found.push({ method: 'DELETE', normPath: `${base}/*` }); // delete(id)
  }

  // 2) Explicit httpClient calls: .get/.post/.patch/.put/.delete( <arg> ...)
  //    Capture the first argument when it is a string/template literal or
  //    a bare `this.endpoint` reference.
  const callRe =
    /\.(get|post|patch|put|delete)\s*\(\s*(`[^`]*`|'[^']*'|"[^"]*"|this\.completeEndpoint\([^)]*\)|this\.endpoint\b)/g;
  let m;
  while ((m = callRe.exec(code)) !== null) {
    const method = m[1].toUpperCase();
    const arg = m[2];
    // Bare endpoint references (no template): the resolved path is the endpoint
    // itself. `completeEndpoint(x)` just substitutes the {param} placeholder.
    if (arg === 'this.endpoint' || arg.startsWith('this.completeEndpoint')) {
      found.push({ method, normPath: normalizePath(primaryEndpoint) });
      continue;
    }
    const np = resolveArgToPath(arg.slice(1, -1), primaryEndpoint); // strip quotes/backticks
    if (np && np.includes('/api/')) found.push({ method, normPath: np });
  }

  return { endpoints, primaryEndpoint, signatures: found };
}

function scanSource(srcDir) {
  const files = walk(srcDir);
  const bySignature = new Map(); // signature -> Set<relfile>
  const byFile = []; // { file, primaryEndpoint, signatures: [sig] }
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    const { primaryEndpoint, signatures } = extractImplementedFromFile(code);
    if (signatures.length === 0) continue;
    const rel = path.relative(process.cwd(), file);
    const sigStrings = [];
    for (const s of signatures) {
      if (!s.normPath) continue;
      const signature = sig(s.method, s.normPath);
      sigStrings.push(signature);
      if (!bySignature.has(signature)) bySignature.set(signature, new Set());
      bySignature.get(signature).add(rel);
    }
    byFile.push({ file: rel, primaryEndpoint, signatures: [...new Set(sigStrings)] });
  }
  return { bySignature, byFile };
}

// ── analysis ──────────────────────────────────────────────────────────────
function analyze(specOps, impl) {
  const { bySignature } = impl;
  // For "review" detection: which base resources exist in code at all.
  const implementedBases = new Set();
  for (const s of bySignature.keys()) {
    const p = s.split(' ')[1] || '';
    const seg = p.replace(/^\/api\/rest\/v1\//, '').split('/')[0];
    if (seg) implementedBases.add(seg);
  }

  const rows = specOps.map((op) => {
    const exact = bySignature.has(op.signature);
    const base = op.normPath.replace(/^\/api\/rest\/v1\//, '').split('/')[0];
    let status;
    if (exact) status = 'implemented';
    else if (implementedBases.has(base)) status = 'review'; // resource exists, this op not matched
    else status = 'missing';
    return {
      ...op,
      status,
      files: exact ? [...bySignature.get(op.signature)] : [],
    };
  });
  return rows;
}

// ── reporting ─────────────────────────────────────────────────────────────
const ICON = { implemented: '✅', missing: '❌', review: '⚠️' };

function renderMarkdown(rows, spec, opts) {
  const filter = opts.filter ? opts.filter.toLowerCase() : null;
  const filtered = filter
    ? rows.filter(
        (r) =>
          r.tag.toLowerCase().includes(filter) ||
          r.path.toLowerCase().includes(filter),
      )
    : rows;

  const counts = { implemented: 0, missing: 0, review: 0 };
  for (const r of filtered) counts[r.status]++;
  const total = filtered.length;
  const pct = total ? Math.round((counts.implemented / total) * 100) : 0;

  const lines = [];
  lines.push('# Akeneo REST API — GAP Analysis');
  lines.push('');
  lines.push(`- Spec: \`${spec.info?.title || 'Akeneo API'}\` v${spec.info?.version || '?'} (OpenAPI ${spec.openapi || spec.swagger || '?'})`);
  lines.push(`- Generated: ${new Date().toISOString()}`);
  if (filter) lines.push(`- Filter: \`${opts.filter}\``);
  lines.push('');
  lines.push(`**Coverage: ${counts.implemented}/${total} documented operations (${pct}%)**`);
  lines.push('');
  lines.push(`| ${ICON.implemented} Implemented | ${ICON.missing} Missing | ${ICON.review} Review |`);
  lines.push('| --- | --- | --- |');
  lines.push(`| ${counts.implemented} | ${counts.missing} | ${counts.review} |`);
  lines.push('');
  lines.push('> Legend — ✅ implemented · ❌ missing (resource not implemented at all) · ⚠️ review (resource exists but this exact operation was not statically matched; verify by reading the service, the path may be built dynamically).');
  lines.push('');

  // Group by tag, preserving spec tag order when available.
  const tagOrder = (spec.tags || []).map((t) => t.name);
  const byTag = new Map();
  for (const r of filtered) {
    if (!byTag.has(r.tag)) byTag.set(r.tag, []);
    byTag.get(r.tag).push(r);
  }
  const orderedTags = [
    ...tagOrder.filter((t) => byTag.has(t)),
    ...[...byTag.keys()].filter((t) => !tagOrder.includes(t)),
  ];

  for (const tag of orderedTags) {
    const ops = byTag.get(tag);
    const tagImpl = ops.filter((o) => o.status === 'implemented').length;
    lines.push(`## ${tag}  (${tagImpl}/${ops.length})`);
    lines.push('');
    lines.push('| Status | Method | Path | Summary | Implemented in |');
    lines.push('| :---: | --- | --- | --- | --- |');
    for (const o of ops) {
      const files = o.files.length ? o.files.join('<br>') : '—';
      const summary = (o.summary || '').replace(/\|/g, '\\|').slice(0, 80);
      lines.push(
        `| ${ICON[o.status]} | ${o.method} | \`${o.path}\` | ${summary} | ${files} |`,
      );
    }
    lines.push('');
  }

  // Actionable appendix.
  const missing = filtered.filter((r) => r.status === 'missing');
  const review = filtered.filter((r) => r.status === 'review');
  if (missing.length) {
    lines.push('## ❌ Missing operations (action required)');
    lines.push('');
    for (const o of missing) lines.push(`- **${o.method}** \`${o.path}\` — ${o.summary} _(tag: ${o.tag})_`);
    lines.push('');
  }
  if (review.length) {
    lines.push('## ⚠️ Operations to verify manually');
    lines.push('');
    for (const o of review) lines.push(`- **${o.method}** \`${o.path}\` — ${o.summary} _(tag: ${o.tag})_`);
    lines.push('');
  }
  return lines.join('\n');
}

function renderJson(rows, spec, opts) {
  const filter = opts.filter ? opts.filter.toLowerCase() : null;
  const filtered = filter
    ? rows.filter(
        (r) =>
          r.tag.toLowerCase().includes(filter) ||
          r.path.toLowerCase().includes(filter),
      )
    : rows;
  const counts = { implemented: 0, missing: 0, review: 0 };
  for (const r of filtered) counts[r.status]++;
  return JSON.stringify(
    {
      spec: {
        title: spec.info?.title,
        version: spec.info?.version,
        openapi: spec.openapi || spec.swagger,
      },
      generatedAt: new Date().toISOString(),
      filter: opts.filter || null,
      counts,
      total: filtered.length,
      operations: filtered,
    },
    null,
    2,
  );
}

// ── main ──────────────────────────────────────────────────────────────────
const HELP = `Akeneo REST API — GAP analysis

Usage: node gap-analysis.mjs [options]

  --spec <url|path>   OpenAPI source (default: official Akeneo spec)
  --src <dir>         Source dir to scan (default: <repo>/src)
  --cache <path>      Spec cache file (default: OS tmp)
  --filter <text>     Only operations whose tag/path contains <text>
  --json              Emit JSON instead of markdown
  --refresh           Re-download the spec, ignore cache
  --strict            Exit 1 if any documented operation is missing
  --no-color          (reserved)
  -h, --help          Show this help
`;

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    process.stderr.write(`${e.message}\n\n${HELP}`);
    process.exit(2);
  }
  if (opts.help) {
    process.stdout.write(HELP);
    return;
  }
  // Default src dir: assume cwd is the repo root, else resolve relative to script.
  if (!opts.src) {
    const candidates = [
      path.join(process.cwd(), 'src'),
      path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../../src'),
    ];
    opts.src = candidates.find((c) => fs.existsSync(c)) || candidates[0];
  }
  if (!fs.existsSync(opts.src)) {
    throw new Error(`Source directory not found: ${opts.src}`);
  }

  const spec = await loadSpec(opts);
  const specOps = extractSpecOperations(spec);
  const impl = scanSource(opts.src);
  const rows = analyze(specOps, impl);

  const out = opts.json
    ? renderJson(rows, spec, opts)
    : renderMarkdown(rows, spec, opts);
  process.stdout.write(out + '\n');

  if (opts.strict) {
    const anyMissing = rows.some((r) => r.status === 'missing');
    if (anyMissing) process.exit(1);
  }
}

main().catch((e) => {
  process.stderr.write(`gap-analysis failed: ${e.stack || e.message}\n`);
  process.exit(2);
});
