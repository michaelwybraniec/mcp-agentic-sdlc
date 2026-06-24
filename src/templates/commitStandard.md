# Commit Standard

Based on [Conventional Commits](https://www.conventionalcommits.org/) with an AWP **task id** in scope.

## Format

```
type(scope taskId): subject

[optional body]

[optional footer]
```

**Example:** `fix(map 2.0): correct facility marker coordinates`

## Types (Conventional Commits + AWP)

| Type | When to use |
|------|-------------|
| `feat` | New behaviour for the active task |
| `fix` | Bug fix (see below) |
| `docs` | Documentation only |
| `test` | Tests only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `chore` | Tooling, deps, config — no production code behaviour change |
| `build` | Build system or external dependencies |
| `ci` | CI configuration |
| `revert` | Reverts a previous commit |

**Rules:** One **task id** per commit · imperative mood · concise subject · never use "AI" in messages (AWP 1.11).

## Granular commits (community practice)

Prefer **atomic commits** — one logical change per commit, not one blob per day:

| Good | Avoid |
|------|--------|
| `feat(console 2.0): add map tab shell` then `feat(console 2.0): wire facility markers` | `feat(console 2.0): map tab and markers and styles` |
| `fix(api 2.0): handle null facility id` | Mixing unrelated `fix` + `feat` in one commit |
| `test(console 2.0): add map tab render test` | `feat` commit that also reformats unrelated files |

During **awp auto**, still **one commit minimum per backlog task** when completing that task — but you may use **extra commits** on the same task id for granular steps (feat + test, or multiple small feats) before `completeTaskId`.

## Bug fixes

No separate `awp fix` command — use **awp update → commit → next** (or finish the active task) with type `fix`.

| Situation | Task id in commit | Kanban |
|-----------|-------------------|--------|
| Fix required to **finish the active planned task** (broken AC, regression in current work) | Active task, e.g. `fix(console 2.0): …` | Stay on same task; append `## Activity` |
| Bug **outside** current task scope, or found while on another task | Unplanned `U-n`, e.g. `fix(auth U-1): …` | Create `task-U-1.md` in `tasks/unplanned/` (ask human first); move via `backlog_sync` when done |
| Typo / lint / copy fix tied to current change | Same task id | Same commit or small follow-up `chore`/`fix` |

**Procedure:** Log out-of-scope bugs in AWP.md **Unplanned Tasks** (§1.8). Notify the human before creating `U-` tasks.

## awp auto

One commit **per task** when **completing** that task — never a range (`1.0-9.0`). Extra granular commits on the **same** task id before complete are allowed.

| Valid | Invalid |
|-------|---------|
| `feat(console 1.0): scaffold mobile-first layout` | `feat(console 1.0-9.0): deliver POC via awp auto` |
| `fix(console 2.0): null check on facility list` | One commit at the end covering tasks 1–9 |

## Optional body and footer

```
fix(map 2.0): correct facility marker coordinates

Markers used wrong lat/lng field from Climate TRACE export.

Fixes-off-by-one in priority queue when ties occur.
```

Use `BREAKING CHANGE:` in footer only when the human has approved a breaking change.
