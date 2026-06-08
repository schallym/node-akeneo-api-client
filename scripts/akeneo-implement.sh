#!/usr/bin/env bash
# Drive Claude Code (headless) to implement missing Akeneo endpoints.
#
# Reuses the repo's existing gap-analysis tooling and conventions:
#   - .claude/skills/akeneo-api-gap-analysis/SKILL.md   (the methodology)
#   - .claude/agents/akeneo-api-auditor.md              (the implementer playbook)
#   - CLAUDE.md                                         (architecture + checklist)
#
# Claude only edits the working tree here; committing + opening the PR is done by
# the workflow (peter-evans/create-pull-request). It writes a PR description to
# akeneo-pr-body.md.
#
# Auth — one of the two is required. The OAuth token is preferred and is what a
# Claude Max/Pro subscription uses (generate it locally with `claude setup-token`):
#   CLAUDE_CODE_OAUTH_TOKEN  Max/Pro subscription token      (preferred)
#   ANTHROPIC_API_KEY        API Console pay-as-you-go key    (fallback)
# Other env:
#   CLAUDE_MODEL        (optional) — model id, default claude-opus-4-8
#   RESOURCE_FILTER     (optional) — limit to a single resource (OpenAPI tag/path)
set -euo pipefail

# The claude CLI reads whichever auth env var is set (the OAuth token takes
# precedence); we just make sure at least one is present.
if [ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ] && [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo "Error: set CLAUDE_CODE_OAUTH_TOKEN (from 'claude setup-token') or ANTHROPIC_API_KEY." >&2
  exit 1
fi
MODEL="${CLAUDE_MODEL:-claude-opus-4-8}"

# Scope the run to keep PRs small and reviewable.
if [ -n "${RESOURCE_FILTER:-}" ]; then
  SCOPE="Implement the missing operations for the '${RESOURCE_FILTER}' resource ONLY."
else
  SCOPE="Pick ONE resource only this run: the documented resource (OpenAPI tag) that has the FEWEST missing operations. Implement just that one, to keep the PR small and reviewable."
fi

read -r -d '' PROMPT <<EOF || true
You are running autonomously in CI. Goal: raise this client's Akeneo REST API
endpoint coverage by implementing currently-missing endpoints, with tests, and
leave the changes staged in the working tree for a pull request.

Authoritative process and conventions — READ THESE FIRST and follow them exactly:
  1. CLAUDE.md (repo root) — architecture, the two service shapes, the
     "Adding an endpoint" checklist, the one-dependency rule (axios only), and
     the 100% coverage / lint requirements.
  2. .claude/skills/akeneo-api-gap-analysis/SKILL.md — the GAP-analysis method.
  3. .claude/agents/akeneo-api-auditor.md — the implementer playbook.

Steps:
  1. Run the deterministic coverage script to get the current gap:
       node .claude/skills/akeneo-api-gap-analysis/scripts/gap-analysis.mjs --refresh
     (use --json / --filter as needed).
  2. ${SCOPE}
  3. For every operation you implement, VERIFY it first by reading the relevant
     src/services/api/** file AND pulling the authoritative definition
     (parameters, request body, responses, schemas) from the OpenAPI spec — do
     not guess. Skip anything that is actually already implemented (the static
     scan has false positives for dynamically-built paths).
  4. Implement following the CLAUDE.md "Adding an endpoint" checklist: types ->
     service method (mirror the closest existing service; BaseApi for full CRUD,
     standalone + completeEndpoint for nested/partial; reuse the bulk-upsert and
     pagination patterns verbatim) -> register any NEW resource in all barrels
     and in AkeneoClient -> unit tests (*.spec.ts) AND e2e tests
     (tests/<resource>.e2e-spec.ts with nock + tests/mocks/). Coverage must stay
     100%.
  5. Validate: run "npm run lint:check" and "npm test" and fix until BOTH pass
     with coverage intact. If, after a genuine effort, something still cannot be
     made green, leave your best-effort changes and clearly note what remains.

Hard constraints:
  - Do NOT run any git command (no add/commit/push) and do NOT open a PR — the
    workflow handles that.
  - Do NOT add a runtime dependency (axios only) and do NOT edit package.json
    version, CHANGELOG.md, or files unrelated to the endpoints you implement.

Finally, write a concise Markdown PR description to akeneo-pr-body.md containing:
  - the resource you implemented and the exact operations added (METHOD + path),
  - the files you created/changed,
  - the result of "npm run lint:check" and "npm test" (pass/fail + coverage).
EOF

echo "→ Running Claude Code (model: ${MODEL}) to implement missing endpoints…"
claude -p "$PROMPT" \
  --model "$MODEL" \
  --permission-mode acceptEdits \
  --allowedTools "Bash,Edit,Write,Read,Glob,Grep,WebFetch" \
  --max-turns 150

# Fallback PR body if Claude didn't write one (e.g. it bailed early).
if [ ! -s akeneo-pr-body.md ]; then
  {
    echo "## Akeneo endpoint sync"
    echo
    echo "Automated run did not produce a description. Review the diff below; the"
    echo "implementation may be incomplete. See the job logs for details."
  } > akeneo-pr-body.md
fi

echo "→ Done. Working-tree changes:"
git status --short || true
