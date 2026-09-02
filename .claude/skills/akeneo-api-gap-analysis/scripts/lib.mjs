/**
 * Shared, dependency-free helpers for the Akeneo API audit scripts
 * (gap-analysis.mjs and spec-diff.mjs). Node >= 20 built-ins only.
 *
 *   - spec loading (with a best-effort 24h cache) and operation extraction,
 *   - endpoint path normalization ({param} / ${var} -> "*"),
 *   - static scanning of src/services/api for the endpoints the client calls,
 *   - classification of a documented operation as implemented / review / missing.
 *
 * Nothing here writes to the source tree.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const DEFAULT_SPEC_URL =
  'https://storage.googleapis.com/akecld-prd-pim-saas-shared-openapi-spec/openapi.json';
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export const HTTP_METHODS = ['get', 'post', 'patch', 'put', 'delete'];

export const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const SKILL_DIR = path.resolve(SCRIPTS_DIR, '..');
export const REPO_DIR = path.resolve(SKILL_DIR, '../../..');

// ── path normalization ────────────────────────────────────────────────────
// Reduce a path to a comparable signature: keep from the first "/api/" segment,
// turn every {param} or ${var} placeholder into "*", and drop query strings.
export function normalizePath(raw) {
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

export function sig(method, normPath) {
  return `${method.toUpperCase()} ${normPath}`;
}

// ── spec loading ──────────────────────────────────────────────────────────
// opts: { spec: <url|path>, cache?: <path>, refresh?: boolean }
export async function loadSpec(opts) {
  const isUrl = /^https?:\/\//i.test(opts.spec);
  if (!isUrl) {
    return JSON.parse(fs.readFileSync(opts.spec, 'utf8'));
  }
  const cachePath = opts.cache || path.join(os.tmpdir(), 'akeneo-openapi-cache.json');
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
export function extractSpecOperations(spec) {
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

// Scan a source dir; returns { bySignature: Map<sig, Set<relfile>>, byFile: [...] }.
export function scanSource(srcDir) {
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

// Default src dir: assume cwd is the repo root, else resolve relative to the scripts.
export function resolveSrcDir(src) {
  let dir = src;
  if (!dir) {
    const candidates = [path.join(process.cwd(), 'src'), path.join(REPO_DIR, 'src')];
    dir = candidates.find((c) => fs.existsSync(c)) || candidates[0];
  }
  if (!fs.existsSync(dir)) {
    throw new Error(`Source directory not found: ${dir}`);
  }
  return dir;
}

// ── analysis ──────────────────────────────────────────────────────────────
function resourceBase(normPath) {
  return (normPath || '').replace(/^\/api\/rest\/v1\//, '').split('/')[0];
}

// Precompute what the classification needs from a scanSource() result.
export function buildImplementationIndex(impl) {
  const { bySignature } = impl;
  // For "review" detection: which base resources exist in code at all.
  const bases = new Set();
  for (const s of bySignature.keys()) {
    const seg = resourceBase(s.split(' ')[1]);
    if (seg) bases.add(seg);
  }
  return { bySignature, bases };
}

// implemented: a service calls exactly this METHOD + normalized path.
// review:      the base resource exists in code but this operation didn't match.
// missing:     no service touches the base resource at all.
export function classify(method, normPath, index) {
  const signature = sig(method, normPath);
  const files = index.bySignature.get(signature);
  if (files) return { status: 'implemented', files: [...files] };
  if (index.bases.has(resourceBase(normPath))) return { status: 'review', files: [] };
  return { status: 'missing', files: [] };
}

export function analyze(specOps, impl) {
  const index = buildImplementationIndex(impl);
  return specOps.map((op) => ({ ...op, ...classify(op.method, op.normPath, index) }));
}

// Keep only the rows whose tag or path contains the (case-insensitive) filter.
export function filterRows(rows, filter) {
  if (!filter) return rows;
  const f = filter.toLowerCase();
  return rows.filter((r) => r.tag.toLowerCase().includes(f) || r.path.toLowerCase().includes(f));
}
