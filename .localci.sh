#!/usr/bin/env bash
# localci-cost: light
#
# Pre-push gate for braintied/claude-plugins, run by git-local-ci
# (~/.agents/rules/ci-local.md). The repo has no package.json, so before this
# file every push printed "nothing to verify" and landed unchecked.
#
# Always checks the whole tree (about 20 s, mostly npx), so it ignores GIT_LOCAL_CI_BASE and
# GIT_LOCAL_CI_CHANGED_FILES and needs no GIT_LOCAL_CI_FULL handling.
#
#   1. claude plugin validate --strict: the marketplace and the plugin.
#      --strict because without it a SKILL.md with no frontmatter or no
#      description is only a warning and exits 0.
#   2. Every SKILL.md frontmatter parses, names its folder, has a description
#      (scripts/check-skill-frontmatter.mjs; validate passes a YAML syntax error).
#   3. node --check on every skill script (plugins/*/skills/*/scripts/*.mjs)
#      and on this repo's own scripts/.
#   4. Smoke: academy.mjs signed out (empty config dir) prints exactly the
#      one-line hint, exits 0, and is silent on the second run.
set -uo pipefail
cd "$(dirname "$0")"

fail=0
step() { printf '\n▸ %s\n' "$1"; }
bad() { printf '  ✘ %s\n' "$1"; fail=1; }

step "claude plugin validate --strict"
if ! command -v claude >/dev/null; then
  bad "claude CLI not on PATH; cannot validate the plugin"
else
  for target in . plugins/braintied; do
    if out=$(claude plugin validate --strict "$target" 2>&1); then
      printf '  ✔ %s\n' "$target"
    else
      printf '%s\n' "$out" | sed 's/^/    /'
      bad "claude plugin validate --strict $target"
    fi
  done
fi

step "SKILL.md frontmatter"
node scripts/check-skill-frontmatter.mjs . || bad "SKILL.md frontmatter"

step "node --check on scripts"
shopt -s nullglob
scripts=(plugins/*/skills/*/scripts/*.mjs plugins/*/skills/*/scripts/*.js scripts/*.mjs)
shopt -u nullglob
if [ "${#scripts[@]}" -eq 0 ]; then
  bad "no scripts found; the glob or the layout changed"
fi
for f in "${scripts[@]}"; do
  if err=$(node --check "$f" 2>&1); then
    printf '  ✔ %s\n' "$f"
  else
    printf '%s\n' "$err" | sed 's/^/    /'
    bad "node --check $f"
  fi
done

step "academy.mjs signal, signed out"
academy=plugins/braintied/skills/learn/scripts/academy.mjs
hint='Academy (optional): track your progress at braintied.com/academy with `npx @braintied/academy login`.'
cfg=$(mktemp -d)
trap 'rm -rf "$cfg"' EXIT
first=$(ACADEMY_CONFIG_DIR="$cfg" XDG_CONFIG_HOME="$cfg" node "$academy" signal x 2>&1); code=$?
if [ "$code" -ne 0 ]; then
  bad "first run exited $code (must always exit 0)"
elif [ "$first" != "$hint" ]; then
  printf '%s\n' "$first" | sed 's/^/    /'
  bad "first run must print only the one-line hint"
else
  printf '  ✔ first run: the hint, exit 0\n'
fi
second=$(ACADEMY_CONFIG_DIR="$cfg" XDG_CONFIG_HOME="$cfg" node "$academy" signal x 2>&1); code=$?
if [ "$code" -ne 0 ] || [ -n "$second" ]; then
  printf '%s\n' "$second" | sed 's/^/    /'
  bad "second run must be silent with exit 0 (got exit $code)"
else
  printf '  ✔ second run: silent, exit 0\n'
fi

echo
if [ "$fail" -ne 0 ]; then
  echo "claude-plugins gate: FAILED"
  exit 1
fi
echo "claude-plugins gate: passed"
