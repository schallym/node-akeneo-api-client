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
 * To detect CHANGES in the documentation (types, parameters, new/removed
 * operations) rather than coverage, see spec-diff.mjs next to this file.
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

import process from 'node:process';
import {
  DEFAULT_SPEC_URL,
  analyze,
  extractSpecOperations,
  filterRows,
  loadSpec,
  resolveSrcDir,
  scanSource,
} from './lib.mjs';

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

// ── reporting ─────────────────────────────────────────────────────────────
const ICON = { implemented: '✅', missing: '❌', review: '⚠️' };

function renderMarkdown(rows, spec, opts) {
  const filter = opts.filter || null;
  const filtered = filterRows(rows, filter);

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
  const filtered = filterRows(rows, opts.filter || null);
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

See spec-diff.mjs to detect changes in the documentation itself.
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
  opts.src = resolveSrcDir(opts.src);

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
