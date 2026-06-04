---
name: akeneo-api-gap-analysis
description: >-
  Audit this Akeneo PIM API client against the official Akeneo REST API
  documentation. Use when asked to check API/endpoint coverage, find or
  implement missing endpoints, run a GAP analysis, sync the client with the
  Akeneo docs/OpenAPI spec, or verify that TypeScript types match the
  documented request/response schemas.
---

# Akeneo REST API — GAP analysis

Compare this client against the official Akeneo OpenAPI spec, report which
documented operations are implemented / missing / need review, optionally
implement the missing ones, and verify that the TypeScript types match the
documented schemas.

**Read `CLAUDE.md` (repo root) first** — it defines the architecture, the
service/type conventions, and the "Adding an endpoint" checklist that all
generated code must follow. This skill is the *process*; `CLAUDE.md` is the
*style*.

## Sources of truth

- Machine-readable (preferred): `https://storage.googleapis.com/akecld-prd-pim-saas-shared-openapi-spec/openapi.json`
  — OpenAPI 3.1, ~152 operations across ~92 paths, grouped by `tags` that map
  almost 1:1 to the services in `src/services/api/`.
- Human index (fallback / cross-check): https://api.akeneo.com/api-reference-index.html

## Step 1 — Run the coverage script (deterministic backbone)

The script is dependency-free (Node ≥ 20 built-ins only) and **never writes to
the source tree**. From the repo root:

```bash
# Full markdown report
node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs

# One resource only (matches tag or path substring)
node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs --filter channels

# Machine-readable, for programmatic follow-up
node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs --json

# Re-download the spec (cached 24h in the OS tmp dir otherwise)
node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs --refresh

# Exit non-zero if anything is missing (for CI)
node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs --strict
```

`--help` lists all options (`--spec`, `--src`, `--cache`, `--filter`, `--json`,
`--refresh`, `--strict`).

What it does: downloads/caches the OpenAPI spec, enumerates every documented
operation (`METHOD path`), statically scans `src/` for the endpoint strings and
`httpClient` calls each service makes (including `BaseApi`-inherited CRUD,
`this.endpoint`, template literals, and `completeEndpoint(...)`), then matches
them on a normalized path signature (`{param}`/`${var}` → `*`).

## Step 2 — Interpret the three buckets

- **✅ implemented** — a service makes a call whose method + normalized path
  matches the documented operation. Trust these.
- **❌ missing** — no service touches that path's base resource at all. Likely a
  whole resource to add (e.g. a `*-api.service.ts` that doesn't exist yet), but
  **first confirm** it isn't a wrong-endpoint bug (a service pointing at the
  wrong URL will make its real endpoint look "missing").
- **⚠️ review** — the base resource exists but this exact operation didn't match.
  Always **open the service file and read it** before concluding. It is one of:
  1. a real **missing** operation (the method just isn't there), or
  2. a real **discrepancy** (the code calls a *different* path than documented —
     e.g. code `/catalogs/{id}/products/uuids` vs spec `/catalogs/{id}/product-uuids`), or
  3. a static-analysis false negative (rare; the path is built in a way the
     scanner couldn't resolve — confirm it truly matches the spec).

Do not treat ❌/⚠️ as automatically actionable — **verify each by reading the
relevant `src/services/api/**` file and the spec operation** before changing code.

## Step 3 — Verify a specific operation against the spec

For any operation you're confirming or implementing, pull its full definition
(parameters, request body, responses) from the spec rather than guessing:

```bash
node -e '
const u="https://storage.googleapis.com/akecld-prd-pim-saas-shared-openapi-spec/openapi.json";
fetch(u).then(r=>r.json()).then(s=>{
  const path="/api/rest/v1/channels"; const method="get";   // <-- edit
  console.log(JSON.stringify(s.paths[path][method], null, 2));
});'
```

To inspect a response/request schema by name, read `components.schemas.<Name>`
the same way. Use this to drive both the implementation and the **type check**.

## Step 4 — Implement missing endpoints (only if asked)

Follow the **"Adding an endpoint" checklist in `CLAUDE.md`**. In short:

1. Find the **closest existing service** of the same shape and copy its style
   (full CRUD → extend `BaseApi`; partial/nested/read-only → standalone class
   with `completeEndpoint` for sub-resources). Reuse the bulk-upsert and
   pagination patterns verbatim.
2. Add/adjust the entity in `src/types/<resource>.type.ts` and request/param
   types in the service file — names, types, and optionality must match the spec.
3. For a **new resource**, register it everywhere: `src/services/api/index.ts`
   (+ subfolder `index.ts` if nested), `src/akeneo-client.ts` (import + `readonly`
   field + constructor wiring), and `src/types/index.ts`.
4. Add unit tests (`*.spec.ts`, mock `httpClient`) and e2e tests
   (`tests/<resource>.e2e-spec.ts`, `nock` + `tests/mocks/`). **Coverage must
   stay 100%.**
5. Respect the **one-dependency rule** (`axios` only) and the lint caps
   (≤500 lines/file, ≤100 lines/function, complexity ≤20, no `console`).

For a **discrepancy** (wrong path/method in existing code), fix the endpoint
string/method and update the tests; call it out explicitly since it's a behavior
change.

## Step 5 — Type correspondence check

Beyond presence/absence, verify that implemented operations have correct types:

- For each entity, diff `src/types/<resource>.type.ts` against the spec's
  `components.schemas` (and the operation's request body / `200` response):
  every documented property present, correct primitive/array/object type,
  correct `required` vs optional (`?`), localized values as
  `{ [localeCode: string]: ... }`.
- Check `...SearchParams` / `...GetParams` against the operation's `parameters`
  (query params), and create/update request types against the request body.
- Report mismatches (missing field, wrong type, wrong optionality, extra field
  not in the spec) and fix them when implementing.

## Step 6 — Report and validate

- Summarize: coverage %, ❌ missing (with method + path + tag), ⚠️ discrepancies,
  and any type mismatches — grouped by resource, each tied to a `src/...` file.
- If you changed code: `npm run lint:check && npm test` must pass with coverage
  intact. Then re-run the script to confirm the gap is closed.

## Notes

- A few documented operations are infrastructure, not resource endpoints:
  `GET /api/rest/v1` (Overview) and `POST /api/oauth/v1/token` (Authentication,
  handled in `src/services/akeneo-api-client.ts`). Don't add resource services
  for these.
- The script caches the spec for 24h; pass `--refresh` if the docs may have
  changed.
