#!/usr/bin/env bash
# Drive Claude Code (headless) to sync this client with the Akeneo REST API docs.
#
# The workflow (.github/workflows/akeneo-endpoint-sync.yml) runs two
# deterministic gates before this script and leaves their reports in the tree:
#   gap.json                 documented operations missing from the client
#   spec-changes.md / .json  documentation changes since the committed baseline
#                            snapshot (new/removed operations, parameters,
#                            request/response schemas, component schemas)
# This script turns them into a scoped prompt for Claude Code, which only edits
# the working tree. Committing + opening the PR is done by the workflow
# (peter-evans/create-pull-request). Claude writes a PR description to
# akeneo-pr-body.md.
#
# Priority: documentation CHANGES first — the PR moves the baseline snapshot, so
# they must be handled in the same PR. Missing endpoints are implemented one
# resource per run, and only when there are no changes to apply, so PRs stay
# small and reviewable.
#
# Reuses the repo's existing gap-analysis tooling and conventions:
#   - .claude/skills/akeneo-api-gap-analysis/SKILL.md   (the methodology)
#   - .claude/agents/akeneo-api-auditor.md              (the implementer playbook)
#   - CLAUDE.md                                         (architecture + checklist)
#
# Auth — one of the two is required. The OAuth token is preferred and is what a
# Claude Max/Pro subscription uses (generate it locally with `claude setup-token`):
#   CLAUDE_CODE_OAUTH_TOKEN  Max/Pro subscription token      (preferred)
#   ANTHROPIC_API_KEY        API Console pay-as-you-go key    (fallback)
# Other env:
#   CLAUDE_MODEL      (optional) model id, default claude-opus-5
#   RESOURCE_FILTER   (optional) limit MISSING-endpoint implementation to one resource (OpenAPI tag/path)
#   MISSING_COUNT     (optional) number of missing operations; derived from gap.json when unset
#   CHANGES_COUNT     (optional) number of documentation changes; derived from spec-changes.json when unset
#   DRY_RUN=1         print the prompt that would be sent and exit without calling Claude
set -euo pipefail

SNAPSHOT=".claude/skills/akeneo-api-gap-analysis/spec-snapshot.json"

# Derive the counts from the reports when the caller didn't pass them.
if [ -z "${MISSING_COUNT:-}" ]; then
  MISSING_COUNT=0
  if [ -s gap.json ]; then
    MISSING_COUNT=$(jq '[.operations[] | select(.status == "missing")] | length' gap.json)
  fi
fi
if [ -z "${CHANGES_COUNT:-}" ]; then
  CHANGES_COUNT=0
  if [ -s spec-changes.json ]; then
    CHANGES_COUNT=$(jq '.counts.total' spec-changes.json)
  fi
fi

if [ "$MISSING_COUNT" = "0" ] && [ "$CHANGES_COUNT" = "0" ]; then
  echo "Nothing to do: no missing endpoint and no documentation change." >&2
  exit 0
fi

# The claude CLI reads whichever auth env var is set (the OAuth token takes
# precedence); we just make sure at least one is present.
if [ "${DRY_RUN:-0}" != "1" ] && [ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ] && [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo "Error: set CLAUDE_CODE_OAUTH_TOKEN (from 'claude setup-token') or ANTHROPIC_API_KEY." >&2
  exit 1
fi
MODEL="${CLAUDE_MODEL:-claude-opus-5}"

# ── task for this run ──────────────────────────────────────────────────────
if [ "$CHANGES_COUNT" != "0" ]; then
  MODE="changes"
  read -r -d '' TASK <<EOT || true
Task for this run — APPLY THE DOCUMENTATION CHANGES (${CHANGES_COUNT} detected).

  1. Read spec-changes.md (human report) and spec-changes.json (same data,
     machine-readable). Every operation is annotated with the service file that
     implements it and every schema with the src/types file most likely holding
     it; each change row says where (request body / response / parameter /
     field) and gives the before/after values.
  2. For EACH entry, pull the authoritative current definition from the OpenAPI
     spec — a cached copy is at akeneo-openapi.json (see the skill's Step 3) —
     and apply it to the client:
       - CHANGED operation / schema / parameter -> update the entity type in
         src/types/<resource>.type.ts, the ...SearchParams / ...GetParams and the
         create/update request types, and the service method (path, HTTP method,
         parameters, headers) so they match the documentation exactly: field
         names, types, optionality, enum values, nullability.
       - ADDED operation -> implement it on the existing service (or as a new
         resource following the CLAUDE.md checklist when the base resource does
         not exist yet), with unit + e2e tests.
       - REMOVED operation -> do NOT delete the method (breaking change). Add a
         @deprecated JSDoc tag saying Akeneo no longer documents it, keep its
         tests, and list it in the PR body.
       - Changes on operations the client does not implement (annotated "not
         implemented" / "resource exists but ... not implemented") -> skip them
         and list them in the PR body under "Not applied".
       - Changes with no impact on the TypeScript surface (e.g. a default value
         or a numeric bound that is not modelled) -> no code change; say so in
         the PR body.
  3. Update the existing unit tests, e2e tests and tests/mocks/* to the new
     shapes; add tests for every new method. Coverage must stay 100%.
  4. Do NOT implement other missing endpoints this run (${MISSING_COUNT} are
     listed in gap.json; later runs handle them) unless they are part of the
     changes above.
EOT
else
  MODE="missing"
  if [ -n "${RESOURCE_FILTER:-}" ]; then
    SCOPE="Implement the missing operations for the '${RESOURCE_FILTER}' resource ONLY."
  else
    SCOPE="Pick ONE resource only this run: the documented resource (OpenAPI tag) that has the FEWEST missing operations. Implement just that one, to keep the PR small and reviewable."
  fi
  read -r -d '' TASK <<EOT || true
Task for this run — IMPLEMENT MISSING ENDPOINTS (${MISSING_COUNT} documented
operations are not implemented; the list is in gap.json, or re-run
  node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs --cache akeneo-openapi.json
with --json / --filter as needed).

  1. ${SCOPE}
  2. For every operation you implement, VERIFY it first by reading the relevant
     src/services/api/** file AND pulling the authoritative definition
     (parameters, request body, responses, schemas) from the OpenAPI spec — a
     cached copy is at akeneo-openapi.json. Do not guess. Skip anything that is
     actually already implemented (the static scan has false positives for
     dynamically-built paths).
  3. Implement following the CLAUDE.md "Adding an endpoint" checklist: types ->
     service method (mirror the closest existing service; BaseApi for full CRUD,
     standalone + completeEndpoint for nested/partial; reuse the bulk-upsert and
     pagination patterns verbatim) -> register any NEW resource in all barrels
     and in AkeneoClient -> unit tests (*.spec.ts) AND e2e tests
     (tests/<resource>.e2e-spec.ts with nock + tests/mocks/). Coverage must stay
     100%.
EOT
fi

read -r -d '' PROMPT <<EOP || true
You are running autonomously in CI. Goal: keep this client in sync with the
official Akeneo REST API documentation (OpenAPI spec) — endpoints, parameters
and TypeScript types — with tests, and leave the changes in the working tree
for a pull request.

Authoritative process and conventions — READ THESE FIRST and follow them exactly:
  1. CLAUDE.md (repo root) — architecture, the two service shapes, the
     "Adding an endpoint" checklist, the one-dependency rule (axios only), and
     the 100% coverage / lint requirements.
  2. .claude/skills/akeneo-api-gap-analysis/SKILL.md — the GAP-analysis and
     change-detection method.
  3. .claude/agents/akeneo-api-auditor.md — the implementer playbook.

Two deterministic reports were generated before you started. Do NOT regenerate
the snapshot and do NOT edit ${SNAPSHOT} — the workflow already refreshed it:
  - spec-changes.md / spec-changes.json — documentation changes since the
    committed baseline (${CHANGES_COUNT} change(s)).
  - gap.json — documented operations missing from the client (${MISSING_COUNT}).

${TASK}

Then validate: run "npm run lint:check" and "npm test" and fix until BOTH pass
with coverage intact. If, after a genuine effort, something still cannot be
made green, leave your best-effort changes and clearly note what remains.

Hard constraints:
  - Do NOT run any git command (no add/commit/push) and do NOT open a PR — the
    workflow handles that.
  - Do NOT add a runtime dependency (axios only) and do NOT edit package.json
    version, CHANGELOG.md, ${SNAPSHOT}, or files unrelated to the endpoints
    you touch.

Finally, write a concise Markdown PR description to akeneo-pr-body.md containing:
  - what you synced: per resource, the operations added/updated (METHOD + path)
    and the type/parameter changes applied (field -> what changed),
  - what you deliberately did NOT apply (with the reason), and any operation you
    marked @deprecated,
  - the files you created/changed,
  - the result of "npm run lint:check" and "npm test" (pass/fail + coverage).
EOP

if [ "${DRY_RUN:-0}" = "1" ]; then
  echo "→ DRY RUN (mode: ${MODE}, model: ${MODEL}) — prompt that would be sent:"
  echo "──────────────────────────────────────────────────────────────────────"
  echo "$PROMPT"
  exit 0
fi

echo "→ Running Claude Code (model: ${MODEL}, mode: ${MODE}) to sync the client…"
claude -p "$PROMPT" \
  --model "$MODEL" \
  --permission-mode acceptEdits \
  --allowedTools "Bash,Edit,Write,Read,Glob,Grep,WebFetch" \
  --max-turns 150

# Fallback PR body if Claude didn't write one (e.g. it bailed early).
if [ ! -s akeneo-pr-body.md ]; then
  {
    echo "## Akeneo API sync"
    echo
    echo "Automated run did not produce a description. Review the diff below; the"
    echo "implementation may be incomplete. See the job logs for details."
  } > akeneo-pr-body.md
fi

echo "→ Done. Working-tree changes:"
git status --short || true
