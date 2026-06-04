---
description: Run a GAP analysis of this client against the official Akeneo REST API and report missing/mismatched endpoints
argument-hint: "[resource] [implement]"
---

Run an endpoint-coverage **GAP analysis** of this Akeneo PIM API client against the official
Akeneo REST API documentation, then report the findings.

Follow the **`akeneo-api-gap-analysis`** skill (`.claude/skills/akeneo-api-gap-analysis/SKILL.md`)
and the conventions in `CLAUDE.md`.

Arguments (optional): `$ARGUMENTS`
- A **resource name** (e.g. `channels`, `assets`, `workflows`) scopes the analysis to that
  resource — pass it to the script as `--filter <resource>`.
- The word **`implement`** (or `fix`) means: after reporting, implement the missing endpoints
  and fix discrepancies/type mismatches. Otherwise this is **read-only** (audit + report).

## Do this

1. **Run the deterministic script** (the factual backbone). Add `--filter <resource>` if a
   resource was given:
   ```bash
   node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs
   ```
   It downloads + caches the Akeneo OpenAPI spec and prints, per resource:
   ✅ implemented · ❌ missing · ⚠️ review. If the spec download is blocked, retry with network
   access or note it; the spec is cached for 24h after the first successful fetch.

2. **Verify every ❌ and ⚠️ by reading the relevant `src/services/api/**` file** — do not trust
   the bucket blindly. Distinguish: a truly missing operation, a **discrepancy** (code calls a
   different path/method than documented), a **wrong-endpoint bug** (a service whose endpoint URL
   doesn't match its resource — this makes the real path look "missing"), or a rare scanner false
   negative. Pull the authoritative operation/schema from the spec to confirm (see the skill's
   Step 3).

3. **Type check** the implemented operations for the resource(s) in scope: diff
   `src/types/<resource>.type.ts` and the service's param/request types against the spec's
   `parameters`, request body, and `components.schemas` — flag missing fields, wrong types, and
   wrong optionality.

4. **Report** concisely, grouped by resource and tied to `src/...:line`:
   - coverage (implemented / total, %),
   - ❌ missing operations (method + path + tag + the file that should hold them),
   - ⚠️ discrepancies and wrong-endpoint bugs,
   - type mismatches.

5. **If `$ARGUMENTS` requests implementation** (`implement`/`fix`): delegate to the
   **`akeneo-api-auditor`** agent to implement the gaps following the `CLAUDE.md` checklist
   (types → service → barrels/`AkeneoClient` wiring → unit + e2e tests), respecting the
   one-dependency rule and 100% coverage, then run `npm run lint:check && npm test` and re-run
   the script to confirm the gaps are closed. If not requested, end with a copy-paste-ready
   action list and offer to implement.
