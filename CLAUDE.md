# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`@schally/node-akeneo-api-client` — a TypeScript client for the **Akeneo PIM REST API**
(Cloud / PIM SaaS, Community & Enterprise). It exposes a strongly-typed wrapper around every
Akeneo REST endpoint plus authentication (classic connection + App token, with automatic token
refresh). Published to npm, built to `dist/`, consumed by Node ≥ 20.

## Golden rules

1. **One runtime dependency only: `axios`.** This is a hard constraint. Do **not** add any
   runtime dependency. Anything else (HTTP, parsing, utilities) must use Node built-ins or
   `axios`. Dev-only tooling is fine in `devDependencies`.
2. **100% test coverage is required** for lines, functions, branches, and statements
   (enforced via Jest — see `jest.config.js`). Every new method needs unit + e2e tests.
3. **Match the existing conventions exactly** — new endpoints must look like the ones already
   written (see "Adding an endpoint" below). Consistency over cleverness.
4. **Lint/format must pass**: `npm run lint:check`. Prettier: single quotes, trailing commas,
   `printWidth: 120`. ESLint caps: max 500 lines/file, 100 lines/function, complexity 20,
   max 6 params, max depth 5; `no-console`; sorted imports.

## Commands

```bash
npm run build         # tsc -> dist/ (tsconfig.build.json)
npm test              # jest (unit *.spec.ts + e2e tests/*.e2e-spec.ts) with coverage
npm run test:cov      # jest --coverage
npm run lint          # eslint src/ tests/
npm run lint:check    # eslint + prettier --check
npm run format        # prettier --write
```

Run a single test file: `npx jest src/services/api/families-api.service.spec.ts`.

## Architecture

Three layers, top to bottom:

- **`src/akeneo-client.ts` → `AkeneoClient`** — the public entry point. Holds one `readonly`
  field per resource (`products`, `families`, …), instantiates every API service in its
  constructor, and exposes the raw `httpClient`. `createClient(config)` in `src/index.ts` is a
  thin factory.
- **`src/services/akeneo-api-client.ts` → `AkeneoApiClient`** — owns the configured axios
  instance. Builds it from either an `AkeneoAuthConnectionConfig` (clientId/secret/username/
  password → OAuth password grant, auto-refresh on 401/403 via interceptors) or an
  `AkeneoAuthAppConfig` (App token via `X-PIM-*` headers). All services call
  `this.client.httpClient`.
- **`src/services/api/**` → resource services** — one service per Akeneo resource. This is
  where ~all endpoint code lives and where new endpoints go.

```
src/
├── akeneo-client.ts            # AkeneoClient (public facade) + barrel
├── index.ts                    # exports + createClient()
├── services/
│   ├── akeneo-api-client.ts    # AkeneoApiClient (axios + auth)
│   ├── index.ts                # barrel
│   └── api/
│       ├── base-api.service.ts # BaseApi<...> generic CRUD
│       ├── <resource>-api.service.ts        # one per resource
│       ├── <resource>-api.service.spec.ts   # unit tests (alongside)
│       ├── index.ts            # barrel — every service re-exported here
│       ├── asset-manager/      # nested sub-resources (own index.ts)
│       ├── catalog-for-apps/
│       └── reference-entities/
└── types/
    ├── <resource>.type.ts      # one per resource, exported via index.ts
    ├── api.type.ts             # PaginatedResponse<T>
    └── index.ts                # barrel
tests/                          # *.e2e-spec.ts (nock), mocks/, akeneo-client-test.utils.ts
```

## Service conventions

There are **two service shapes**; pick the one the resource fits:

**A. Full CRUD → extend `BaseApi`.** When the resource supports the standard
get/list/create/update/delete on `/<resource>` and `/<resource>/{code}`:

```ts
export class FamiliesApi extends BaseApi<Family, null, FamiliesSearchParams, CreateFamilyRequest, Partial<Family>> {
  constructor(client: AkeneoApiClient) {
    super(client, '/api/rest/v1/families'); // <-- the endpoint; double-check it!
  }
  // add resource-specific methods (sub-resources, bulk, drafts, …) here
}
```

`BaseApi<ApiEntityType, GetParamsType, SearchParamsType, CreateRequestType, UpdateRequestType>`
provides `get(id, params?)`, `list(params?)`, `create(data)`, `update(id, data)`, `delete(id)`.
If the API doesn't support an inherited verb, override it to `throw new Error('Method not
implemented. ... not supported by the API.')` (see `attributes-api.service.ts`).

**B. Partial / non-standard → standalone class.** When the resource is read-only, has only
nested routes, or doesn't match CRUD (e.g. `currencies`, `locales`, `permissions`,
`workflow.api.ts`, `jobs`, `utilities`, the aggregators):

```ts
export class CurrenciesApi {
  private readonly endpoint: string;
  constructor(private readonly client: AkeneoApiClient) {
    this.endpoint = '/api/rest/v1/currencies';
  }
  async get(code: string): Promise<Currency> {
    return this.client.httpClient.get(`${this.endpoint}/${code}`).then((r) => r.data);
  }
  async list(params?: CurrenciesSearchParams): Promise<PaginatedResponse<Currency>> {
    return this.client.httpClient.get(this.endpoint, { params }).then((r) => r.data);
  }
}
```

Shared patterns to reuse:

- **Endpoint string** lives in `super(client, '...')` or `this.endpoint = '...'`. Nested
  resources keep a placeholder and resolve it with a private `completeEndpoint(code)` that does
  `this.endpoint.replace('{some_code}', code)` (see `reference-entities/` and `asset-manager/`).
- **Lists** return `PaginatedResponse<T>` (`src/types/api.type.ts`).
- **Search/Get params** are declared as exported `...SearchParams` / `...GetParams` types in the
  same file.
- **Create/Update bodies** are derived from the entity type, e.g.
  `Partial<Omit<Family, 'code'>> & Required<Pick<Family, 'code'>>`.
- **Bulk upsert** (`updateOrCreateSeveral`) PATCHes newline-delimited JSON with
  `Content-Type: application/vnd.akeneo.collection+json` and parses the line-delimited response.
  Copy the exact implementation from `families`/`products`/`attributes`.
- **Nested sub-resources** (records, options, assets…) live in a subfolder, are instantiated as
  `readonly` fields on the parent service, and re-exported from the subfolder `index.ts`.

## Types

- One file per resource: `src/types/<resource>.type.ts`, `export type` (not `interface`),
  `snake_case` fields (mirror the Akeneo JSON wire format exactly), localized maps typed as
  `{ [localeCode: string]: string }`.
- Re-export from `src/types/index.ts`. Services import from `'../../types'`.

## Adding an endpoint (checklist)

When implementing a missing endpoint, mirror the closest existing resource and:

1. **Types** — add/adjust the entity in `src/types/<resource>.type.ts`; verify every field name,
   type, and optionality against the OpenAPI spec. Export it from `src/types/index.ts`.
2. **Service** — add the method to the matching `*-api.service.ts` (or create a new service file
   following shape A or B). Define its `...SearchParams` / request/response types in the file.
3. **New resource only** — register it in **all** the barrels and the facade:
   - `src/services/api/index.ts` (and the subfolder `index.ts` if nested),
   - `src/akeneo-client.ts` (import, `readonly` field, instantiate in constructor),
   - `src/types/index.ts` for its types.
4. **Tests** — unit test alongside as `*.spec.ts` (mock `httpClient`, see
   `families-api.service.spec.ts`), and e2e in `tests/<resource>.e2e-spec.ts` using `nock` +
   `setupAkeneoClient()` from `tests/akeneo-client-test.utils.ts`, with a mock in `tests/mocks/`.
   Keep coverage at 100%.
5. **Verify** — `npm run lint:check && npm test`.

## Source of truth: the Akeneo API

- Human reference index: https://api.akeneo.com/api-reference-index.html
- **Machine-readable OpenAPI 3.1 spec** (use this for analysis):
  `https://storage.googleapis.com/akecld-prd-pim-saas-shared-openapi-spec/openapi.json`
  (~5 MB, ~92 paths / ~152 operations, grouped by `tags` that map ~1:1 to the services here).

## Endpoint coverage / GAP analysis

This repo ships tooling to check the client against the live Akeneo spec and implement what's
missing — use it whenever asked to "check coverage", "find missing endpoints", or "sync with the
docs":

- **Command:** `/akeneo-gap-analysis [resource]` — runs the analysis and reports the gaps.
- **Skill:** `akeneo-api-gap-analysis` — the methodology + the deterministic comparison script
  at `.claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs` (Node built-ins only; run
  `node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs --help`).
- **Agent:** `akeneo-api-auditor` — subagent that performs the full audit and implements missing
  endpoints + fixes type mismatches following the conventions above.

The script prints, per resource: ✅ implemented · ❌ missing · ⚠️ review (resource exists but an
operation didn't statically match — verify by reading the service, the path may be built
dynamically, or it may be a real gap/discrepancy). Treat ⚠️ and ❌ as findings to confirm by
reading the code before implementing.
