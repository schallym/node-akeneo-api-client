#!/usr/bin/env node
/**
 * Akeneo REST API — documentation change detection (spec diff).
 *
 * gap-analysis.mjs answers "which documented operations are NOT implemented?".
 * This script answers "what CHANGED in the documentation since we last looked?"
 * so that types, parameters and endpoints can be kept in sync.
 *
 * It normalizes the official OpenAPI spec down to what matters for this client
 * — every operation with its parameters, request body, line-delimited body
 * schema and 2xx responses, plus components.schemas / parameters /
 * securitySchemes — dropping prose (descriptions, summaries, validation notes),
 * examples and error responses, and sorting keys/arrays so the result is
 * stable. That normalized form is stored as the BASELINE SNAPSHOT
 * (<skill>/spec-snapshot.json, committed) and diffed against the live spec.
 *
 * Every added / removed / changed operation is annotated with the client file(s)
 * implementing it (same static scan as gap-analysis.mjs) and every changed
 * schema with the src/types file most likely holding it, so a human or Claude
 * knows exactly where to look.
 *
 * DETERMINISTIC, dependency-free (Node >= 20 built-ins). It only writes to the
 * snapshot file, and only when asked (--update-snapshot).
 *
 * Usage:
 *   node spec-diff.mjs [options]
 *
 * Options:
 *   --spec <url|path>    OpenAPI source. Default: official Akeneo spec URL.
 *   --snapshot <path>    Baseline snapshot. Default: <skill>/spec-snapshot.json.
 *   --src <dir>          Source dir to scan (implementation mapping). Default: <repo>/src.
 *   --cache <path>       Where to cache the downloaded spec. Default: OS tmp.
 *   --filter <text>      Only report operations whose tag/path — or schemas /
 *                        parameters whose name — contains <text>.
 *   --json               Emit machine-readable JSON instead of markdown.
 *   --refresh            Ignore the cache and re-download the spec.
 *   --update-snapshot    Rewrite the baseline with the current spec (creates it
 *                        when absent; no-op when nothing changed).
 *   --strict             Exit 1 when any change is detected.
 *   -h, --help           Show this help.
 *
 * Exit code is 0 on success (2 on error) regardless of changes unless --strict.
 * Without a baseline the report is empty and says so (`baseline: null`); pass
 * --update-snapshot to create the first one.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  DEFAULT_SPEC_URL,
  HTTP_METHODS,
  SKILL_DIR,
  buildImplementationIndex,
  classify,
  extractSpecOperations,
  loadSpec,
  normalizePath,
  resolveSrcDir,
  scanSource,
} from './lib.mjs';

export const DEFAULT_SNAPSHOT_PATH = path.join(SKILL_DIR, 'spec-snapshot.json');
const SNAPSHOT_FORMAT = 1;
const SNAPSHOT_COMMENT =
  'Normalized baseline of the Akeneo OpenAPI spec used to detect documentation changes. ' +
  'Generated — do not edit by hand. Refresh with: ' +
  'node .claude/skills/akeneo-api-gap-analysis/scripts/spec-diff.mjs --update-snapshot';

// Keys that carry prose / examples only: a change there never impacts the client.
const STRIP_KEYS = new Set([
  'description',
  'summary',
  'title',
  'example',
  'examples',
  'externalDocs',
  'x-validation-rules',
  'x-warning',
  'x-body-by-line', // prose; the machine-readable x-body-by-line-schema is kept
  'x-content-type',
  'x-code-samples',
  'x-codeSamples',
]);
const METHOD_ORDER = HTTP_METHODS.map((m) => m.toUpperCase());

// ── argument parsing ──────────────────────────────────────────────────────
function parseArgs(argv) {
  const opts = {
    spec: DEFAULT_SPEC_URL,
    snapshot: DEFAULT_SNAPSHOT_PATH,
    src: null,
    cache: null,
    filter: null,
    json: false,
    refresh: false,
    updateSnapshot: false,
    strict: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--spec') opts.spec = argv[++i];
    else if (a === '--snapshot') opts.snapshot = argv[++i];
    else if (a === '--src') opts.src = argv[++i];
    else if (a === '--cache') opts.cache = argv[++i];
    else if (a === '--filter') opts.filter = argv[++i];
    else if (a === '--json') opts.json = true;
    else if (a === '--refresh') opts.refresh = true;
    else if (a === '--update-snapshot') opts.updateSnapshot = true;
    else if (a === '--strict') opts.strict = true;
    else if (a === '-h' || a === '--help') opts.help = true;
    else throw new Error(`Unknown option: ${a}`);
  }
  return opts;
}

// ── normalization ─────────────────────────────────────────────────────────
const isPrimitive = (v) => v === null || typeof v !== 'object';
const comparePrimitive = (a, b) => String(a).localeCompare(String(b));

// Deep-normalize: drop prose keys, sort object keys, sort primitive arrays
// (order is irrelevant for `required`, `enum`, `type: [..]`), sort parameter
// lists by (in, name). Arrays of objects keep their order (allOf/oneOf).
function normalizeValue(value, key) {
  if (Array.isArray(value)) {
    const items = value.map((v) => normalizeValue(v));
    if (key === 'parameters' && items.every((p) => p && typeof p === 'object')) {
      return items.sort((a, b) => comparePrimitive(`${a.in}:${a.name}`, `${b.in}:${b.name}`));
    }
    if (items.every(isPrimitive)) return items.sort(comparePrimitive);
    return items;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) {
      if (STRIP_KEYS.has(k)) continue;
      out[k] = normalizeValue(value[k], k);
    }
    return out;
  }
  return value;
}

// An operation keeps everything but its non-2xx responses (error shapes are
// generic and not modelled by the client).
function normalizeOperation(op) {
  const out = normalizeValue(op);
  if (out.responses) {
    const kept = {};
    for (const code of Object.keys(out.responses)) {
      if (/^2\d\d$/.test(code)) kept[code] = out.responses[code];
    }
    out.responses = kept;
  }
  return out;
}

export function buildSnapshot(spec, source) {
  const operations = {};
  for (const rawPath of Object.keys(spec.paths || {}).sort()) {
    const item = spec.paths[rawPath];
    for (const method of HTTP_METHODS) {
      if (!item[method]) continue;
      operations[`${method.toUpperCase()} ${rawPath}`] = normalizeOperation(item[method]);
    }
  }
  const components = spec.components || {};
  return {
    $comment: SNAPSHOT_COMMENT,
    format: SNAPSHOT_FORMAT,
    source,
    capturedAt: new Date().toISOString(),
    spec: { openapi: spec.openapi || spec.swagger, title: spec.info?.title, version: spec.info?.version },
    operations,
    schemas: normalizeValue(components.schemas || {}),
    parameters: normalizeValue(components.parameters || {}),
    securitySchemes: normalizeValue(components.securitySchemes || {}),
  };
}

// Everything that should count as "the same baseline" (i.e. not the timestamp).
function snapshotContent(snapshot) {
  const { capturedAt, ...rest } = snapshot; // eslint-disable-line no-unused-vars
  return JSON.stringify(rest);
}

function readSnapshot(file) {
  if (!fs.existsSync(file)) return null;
  const snapshot = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (snapshot.format !== SNAPSHOT_FORMAT) {
    throw new Error(
      `Snapshot ${file} has format ${snapshot.format}, expected ${SNAPSHOT_FORMAT}. Regenerate it with --update-snapshot.`,
    );
  }
  return snapshot;
}

// ── deep diff ─────────────────────────────────────────────────────────────
// Values are normalized (sorted keys), so JSON equality is structural equality.
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const paramKey = (p) => `${p.in}:${p.name}`;

// Collect leaf-level changes between two normalized values into `out`:
// { kind: 'added'|'removed'|'changed', path: [segments], before?, after? }.
function diffValues(before, after, trail, out) {
  if (same(before, after)) return;
  const bothObjects = before && after && typeof before === 'object' && typeof after === 'object';
  if (bothObjects && !Array.isArray(before) && !Array.isArray(after)) {
    for (const k of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
      if (!(k in before)) out.push({ kind: 'added', path: [...trail, k], after: after[k] });
      else if (!(k in after)) out.push({ kind: 'removed', path: [...trail, k], before: before[k] });
      else diffValues(before[k], after[k], [...trail, k], out);
    }
    return;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    diffArrays(before, after, trail, out);
    return;
  }
  out.push({ kind: 'changed', path: trail, before, after });
}

function diffArrays(before, after, trail, out) {
  if (before.every(isPrimitive) && after.every(isPrimitive)) {
    // Sets of primitives (required, enum, type[]): report each element.
    const b = new Set(before.map(String));
    const a = new Set(after.map(String));
    for (const v of before) if (!a.has(String(v))) out.push({ kind: 'removed', path: trail, before: v });
    for (const v of after) if (!b.has(String(v))) out.push({ kind: 'added', path: trail, after: v });
    return;
  }
  const isParams = trail[trail.length - 1] === 'parameters';
  if (isParams) {
    // Parameters are matched by (in, name), not by position.
    const bMap = new Map(before.map((p) => [paramKey(p), p]));
    const aMap = new Map(after.map((p) => [paramKey(p), p]));
    for (const k of [...new Set([...bMap.keys(), ...aMap.keys()])].sort()) {
      if (!bMap.has(k)) out.push({ kind: 'added', path: [...trail, k], after: aMap.get(k) });
      else if (!aMap.has(k)) out.push({ kind: 'removed', path: [...trail, k], before: bMap.get(k) });
      else diffValues(bMap.get(k), aMap.get(k), [...trail, k], out);
    }
    return;
  }
  // Arrays of objects (allOf/oneOf/anyOf…): compare position-wise.
  const len = Math.max(before.length, after.length);
  for (let i = 0; i < len; i++) {
    const seg = `[${i}]`;
    if (i >= before.length) out.push({ kind: 'added', path: [...trail, seg], after: after[i] });
    else if (i >= after.length) out.push({ kind: 'removed', path: [...trail, seg], before: before[i] });
    else diffValues(before[i], after[i], [...trail, seg], out);
  }
}

// Diff two { key -> normalized value } maps into { added, removed, changed }.
function diffMaps(before, after) {
  const result = { added: [], removed: [], changed: [] };
  for (const key of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
    if (!(key in before)) result.added.push({ key, value: after[key] });
    else if (!(key in after)) result.removed.push({ key, value: before[key] });
    else {
      const changes = [];
      diffValues(before[key], after[key], [], changes);
      if (changes.length) result.changed.push({ key, changes });
    }
  }
  return result;
}

// ── mapping to the client ─────────────────────────────────────────────────
// Which src/types file most likely holds a given schema name (or tag)?
// 1) a file exporting `type <PascalCase(name)>`; 2) <kebab(name)>.type.ts,
// progressively dropping trailing segments (family_create -> family) and
// trying the plural; 3) a unique file starting with the first segment.
function createTypeFileResolver(srcDir) {
  const typesDir = path.join(srcDir, 'types');
  const files = fs.existsSync(typesDir)
    ? fs.readdirSync(typesDir).filter((f) => f.endsWith('.type.ts'))
    : [];
  const contents = new Map(files.map((f) => [f, fs.readFileSync(path.join(typesDir, f), 'utf8')]));
  const rel = (f) => path.relative(process.cwd(), path.join(typesDir, f));
  const cache = new Map();

  return (name) => {
    if (!name) return [];
    if (cache.has(name)) return cache.get(name);
    const words = name
      .toLowerCase()
      .replace(/\[.*?\]/g, '')
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
    const pascal = words.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
    let hits = files.filter((f) => new RegExp(`export\\s+type\\s+${pascal}\\b`).test(contents.get(f)));
    for (let n = words.length; n > 0 && hits.length === 0; n--) {
      const kebab = words.slice(0, n).join('-');
      hits = files.filter((f) => f === `${kebab}.type.ts` || f === `${kebab}s.type.ts` || f === `${kebab}ies.type.ts`);
    }
    if (hits.length === 0 && words.length) {
      const byPrefix = files.filter((f) => f.startsWith(`${words[0]}-`) || f.startsWith(`${words[0]}.`));
      if (byPrefix.length === 1) hits = byPrefix;
    }
    const result = hits.map(rel);
    cache.set(name, result);
    return result;
  };
}

function splitKey(key) {
  const idx = key.indexOf(' ');
  return { method: key.slice(0, idx), path: key.slice(idx + 1) };
}

// ── report ────────────────────────────────────────────────────────────────
function annotateOperation(entry, liveOps, index, typeFiles, isCurrent) {
  const { method, path: rawPath } = splitKey(entry.key);
  const live = liveOps.get(entry.key);
  const tag = live?.tag || (entry.value?.tags || [])[0] || 'Untagged';
  return {
    key: entry.key,
    method,
    path: rawPath,
    tag,
    operationId: live?.operationId || entry.value?.operationId || '',
    summary: isCurrent ? live?.summary || '' : '',
    implementation: classify(method, normalizePath(rawPath), index),
    typeFiles: typeFiles(tag),
    ...(entry.changes ? { changes: entry.changes } : {}),
  };
}

function annotateNamed(entry, typeFiles) {
  return { name: entry.key, typeFiles: typeFiles(entry.key), ...(entry.changes ? { changes: entry.changes } : {}) };
}

function matches(text, filter) {
  return !filter || text.toLowerCase().includes(filter.toLowerCase());
}

function buildReport({ baseline, current, spec, impl, srcDir, opts, snapshotUpdated, bootstrapped }) {
  const liveOps = new Map(extractSpecOperations(spec).map((o) => [`${o.method} ${o.path}`, o]));
  const index = buildImplementationIndex(impl);
  const typeFiles = createTypeFileResolver(srcDir);
  const empty = () => ({ added: [], removed: [], changed: [] });

  const sections = { operations: empty(), schemas: empty(), parameters: empty(), securitySchemes: empty() };
  if (baseline) {
    const ops = diffMaps(baseline.operations, current.operations);
    for (const bucket of ['added', 'removed', 'changed']) {
      sections.operations[bucket] = ops[bucket]
        .map((e) => annotateOperation(e, liveOps, index, typeFiles, bucket !== 'removed'))
        .filter((o) => matches(o.tag, opts.filter) || matches(o.path, opts.filter));
      for (const name of ['schemas', 'parameters', 'securitySchemes']) {
        sections[name][bucket] = diffMaps(baseline[name] || {}, current[name] || {})
          [bucket].map((e) => annotateNamed(e, typeFiles))
          .filter((e) => matches(e.name, opts.filter));
      }
    }
  }
  const counts = { added: 0, removed: 0, changed: 0, total: 0 };
  for (const section of Object.values(sections)) {
    for (const bucket of ['added', 'removed', 'changed']) counts[bucket] += section[bucket].length;
  }
  counts.total = counts.added + counts.removed + counts.changed;

  return {
    generatedAt: new Date().toISOString(),
    source: opts.spec,
    snapshotPath: path.relative(process.cwd(), opts.snapshot),
    baseline: baseline ? { capturedAt: baseline.capturedAt, version: baseline.spec?.version } : null,
    current: current.spec,
    bootstrapped,
    snapshotUpdated,
    filter: opts.filter || null,
    counts,
    ...sections,
  };
}

// ── rendering ─────────────────────────────────────────────────────────────
const KIND_ICON = { added: '➕', removed: '➖', changed: '✏️' };
const STATUS_ICON = { implemented: '✅', missing: '❌', review: '⚠️' };
const MAX_ROWS = 40;
const MAX_VALUE = 100;

const md = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const code = (s) => `\`${md(s)}\``;

function fmtValue(v) {
  if (v === undefined) return '—';
  const s = JSON.stringify(v);
  return code(s.length > MAX_VALUE ? `${s.slice(0, MAX_VALUE)}…` : s);
}

// Turn a change path into something a reader can locate in the docs.
function fmtPath(segments) {
  const out = [];
  let i = 0;
  const startsWith = (...parts) => parts.every((p, j) => segments[i + j] === p);
  while (i < segments.length) {
    if (startsWith('requestBody', 'content')) {
      out.push(`request body (${segments[i + 2]})`);
      i += segments[i + 3] === 'schema' ? 4 : 3;
    } else if (startsWith('responses') && segments[i + 2] === 'content') {
      out.push(`response ${segments[i + 1]} (${segments[i + 3]})`);
      i += segments[i + 4] === 'schema' ? 5 : 4;
    } else if (startsWith('x-body-by-line-schema')) {
      out.push('line-delimited body schema');
      i += 1;
    } else if (startsWith('parameters') && segments[i + 1]) {
      const [where, name] = segments[i + 1].split(':');
      out.push(`parameter ${code(name)} (${where})`);
      i += 2;
    } else if (startsWith('properties') && segments[i + 1] !== undefined) {
      out.push(code(segments[i + 1]));
      i += 2;
    } else {
      out.push(md(segments[i]));
      i += 1;
    }
  }
  return out.join(' › ') || '(root)';
}

function implementationLabel(o) {
  const { status, files } = o.implementation;
  if (status === 'implemented') return `${STATUS_ICON.implemented} implemented in ${files.map(code).join(', ')}`;
  if (status === 'review') return `${STATUS_ICON.review} resource exists but this operation is not implemented`;
  return `${STATUS_ICON.missing} not implemented`;
}

function typeFilesLabel(files) {
  return files.length ? `likely types: ${files.map(code).join(', ')}` : 'types: — (no matching src/types file)';
}

function renderChangesTable(changes, lines) {
  lines.push('| Change | Where | Before | After |');
  lines.push('| :---: | --- | --- | --- |');
  for (const c of changes.slice(0, MAX_ROWS)) {
    lines.push(`| ${KIND_ICON[c.kind]} | ${fmtPath(c.path)} | ${fmtValue(c.before)} | ${fmtValue(c.after)} |`);
  }
  if (changes.length > MAX_ROWS) lines.push(`| … | _${changes.length - MAX_ROWS} more (see --json)_ | | |`);
  lines.push('');
}

function renderOperations(section, lines) {
  lines.push('## Operations');
  lines.push('');
  for (const bucket of ['added', 'removed']) {
    const items = section[bucket];
    if (!items.length) continue;
    lines.push(`### ${KIND_ICON[bucket]} ${bucket[0].toUpperCase()}${bucket.slice(1)} (${items.length})`);
    lines.push('');
    for (const o of items) {
      const summary = o.summary ? ` — ${md(o.summary)}` : '';
      lines.push(`- **${o.method}** ${code(o.path)}${summary} _(tag: ${md(o.tag)})_ — ${implementationLabel(o)}`);
    }
    lines.push('');
  }
  if (section.changed.length) {
    lines.push(`### ${KIND_ICON.changed} Changed (${section.changed.length})`);
    lines.push('');
    for (const o of section.changed) {
      const summary = o.summary ? ` — ${md(o.summary)}` : '';
      lines.push(`#### ${o.method} ${code(o.path)}${summary} _(tag: ${md(o.tag)})_`);
      lines.push('');
      lines.push(`${implementationLabel(o)} · ${typeFilesLabel(o.typeFiles)}`);
      lines.push('');
      renderChangesTable(o.changes, lines);
    }
  }
}

function renderNamed(title, subtitle, section, lines) {
  lines.push(`## ${title} (${code(subtitle)})`);
  lines.push('');
  for (const bucket of ['added', 'removed']) {
    const items = section[bucket];
    if (!items.length) continue;
    lines.push(`### ${KIND_ICON[bucket]} ${bucket[0].toUpperCase()}${bucket.slice(1)} (${items.length})`);
    lines.push('');
    for (const e of items) lines.push(`- ${code(e.name)} — ${typeFilesLabel(e.typeFiles)}`);
    lines.push('');
  }
  if (section.changed.length) {
    lines.push(`### ${KIND_ICON.changed} Changed (${section.changed.length})`);
    lines.push('');
    for (const e of section.changed) {
      lines.push(`#### ${code(e.name)} — ${typeFilesLabel(e.typeFiles)}`);
      lines.push('');
      renderChangesTable(e.changes, lines);
    }
  }
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# Akeneo REST API — Documentation changes');
  lines.push('');
  lines.push(`- Source: ${report.source}`);
  lines.push(`- Snapshot: ${code(report.snapshotPath)}`);
  if (report.baseline) {
    lines.push(`- Baseline: captured ${report.baseline.capturedAt} (spec v${report.baseline.version || '?'}) · Current: spec v${report.current?.version || '?'} (OpenAPI ${report.current?.openapi || '?'})`);
  }
  lines.push(`- Generated: ${report.generatedAt}`);
  if (report.filter) lines.push(`- Filter: ${code(report.filter)}`);
  lines.push('');

  if (!report.baseline) {
    lines.push(
      report.bootstrapped
        ? '**No baseline existed — the snapshot was created from the current documentation.** Nothing to compare yet; the next run will report changes against it.'
        : '**No baseline snapshot found.** Run with `--update-snapshot` to create one; changes can only be reported against a baseline.',
    );
    lines.push('');
    return lines.join('\n');
  }

  const c = report.counts;
  if (c.total === 0) {
    lines.push('**No changes** — the current documentation matches the baseline snapshot.');
    lines.push('');
    return lines.join('\n');
  }
  lines.push(`**${c.total} change(s) since the baseline: ${c.added} added · ${c.removed} removed · ${c.changed} changed**`);
  if (report.snapshotUpdated) lines.push('');
  if (report.snapshotUpdated) lines.push('> The snapshot was updated to the current documentation (`--update-snapshot`).');
  lines.push('');
  lines.push(`| Section | ${KIND_ICON.added} Added | ${KIND_ICON.removed} Removed | ${KIND_ICON.changed} Changed |`);
  lines.push('| --- | :---: | :---: | :---: |');
  const sections = [
    ['Operations', report.operations],
    ['Schemas', report.schemas],
    ['Parameters', report.parameters],
    ['Security schemes', report.securitySchemes],
  ];
  for (const [name, s] of sections) {
    lines.push(`| ${name} | ${s.added.length} | ${s.removed.length} | ${s.changed.length} |`);
  }
  lines.push('');
  lines.push('> Legend — ➕ added · ➖ removed · ✏️ changed. Prose, examples and error responses are ignored; only what can affect endpoints, parameters and types is compared. "Where" paths follow the OpenAPI structure (`request body`, `response 200`, `parameter x (query)`, `` `field` `` for a schema property).');
  lines.push('');

  const has = (s) => s.added.length + s.removed.length + s.changed.length > 0;
  if (has(report.operations)) renderOperations(report.operations, lines);
  if (has(report.schemas)) renderNamed('Schemas', 'components.schemas', report.schemas, lines);
  if (has(report.parameters)) renderNamed('Reusable parameters', 'components.parameters', report.parameters, lines);
  if (has(report.securitySchemes)) renderNamed('Security schemes', 'components.securitySchemes', report.securitySchemes, lines);
  return lines.join('\n');
}

// ── main ──────────────────────────────────────────────────────────────────
const HELP = `Akeneo REST API — documentation change detection (spec diff)

Usage: node spec-diff.mjs [options]

  --spec <url|path>    OpenAPI source (default: official Akeneo spec)
  --snapshot <path>    Baseline snapshot (default: <skill>/spec-snapshot.json)
  --src <dir>          Source dir to scan for the implementation mapping (default: <repo>/src)
  --cache <path>       Spec cache file (default: OS tmp)
  --filter <text>      Only operations whose tag/path, or schemas/parameters whose name, contains <text>
  --json               Emit JSON instead of markdown
  --refresh            Re-download the spec, ignore cache
  --update-snapshot    Rewrite the baseline snapshot with the current spec (creates it when absent)
  --strict             Exit 1 if any change is detected
  -h, --help           Show this help

Compares the live documentation with the committed baseline and reports added /
removed / changed operations, schemas and parameters, mapped to the client files
that implement them. See gap-analysis.mjs for endpoint coverage.
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
  const srcDir = resolveSrcDir(opts.src);
  opts.snapshot = path.resolve(opts.snapshot);

  const spec = await loadSpec(opts);
  const current = buildSnapshot(spec, opts.spec);
  const baseline = readSnapshot(opts.snapshot);
  const impl = scanSource(srcDir);

  let snapshotUpdated = false;
  const bootstrapped = opts.updateSnapshot && !baseline;
  if (opts.updateSnapshot) {
    if (!baseline || snapshotContent(baseline) !== snapshotContent(current)) {
      fs.mkdirSync(path.dirname(opts.snapshot), { recursive: true });
      fs.writeFileSync(opts.snapshot, `${JSON.stringify(current, null, 2)}\n`);
      snapshotUpdated = true;
      process.stderr.write(`spec-diff: snapshot ${baseline ? 'updated' : 'created'} at ${opts.snapshot}\n`);
    } else {
      process.stderr.write('spec-diff: snapshot already up to date\n');
    }
  }

  const report = buildReport({ baseline, current, spec, impl, srcDir, opts, snapshotUpdated, bootstrapped });
  process.stdout.write((opts.json ? JSON.stringify(report, null, 2) : renderMarkdown(report)) + '\n');

  if (opts.strict && report.counts.total > 0) process.exit(1);
}

main().catch((e) => {
  process.stderr.write(`spec-diff failed: ${e.stack || e.message}\n`);
  process.exit(2);
});
