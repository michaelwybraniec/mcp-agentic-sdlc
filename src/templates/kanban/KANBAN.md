# Live Kanban Board

The Kanban runner lives in this folder. No project-root `package.json` is required.

## Start live board

`init` starts the board automatically. It opens in **Cursor Simple Browser** (or VS Code Simple Browser) when Cursor/VS Code is available; otherwise the system browser opens at http://localhost:4173.

To start manually:

```bash
cd agentic-sdlc/kanban
npm run watch
```

Environment: `AWP_KANBAN_NO_OPEN=1` disables open; `AWP_KANBAN_FORCE_BROWSER=1` skips preview and uses the external browser only. CLI flag: `npm run watch -- --no-open`

If port 4173 is already in use, `watch` syncs backlog, opens preview, and **still watches** task markdown for live updates:

```bash
npm run open    # sync + open preview only (use when board is already running)
```

**Agents**: the board updates only when task `.md` files change (`# Status`, `## Activity`, move to `tasks/completed/`). Git commits and app code alone do not move cards.

### AWP command bar

The board header includes buttons for the seven AWP procedures from `AWP.md`: **Check**, **Start**, **Update**, **Commit**, **Next**, **Auto**, **Handoff**. Click a button to copy the command — paste it into your agent chat.

### After init — choose how to begin

The agent should **ask you** which command to run (not assume `awp next`):

| Command | When to use |
|---------|-------------|
| **`awp start`** | **Recommended after init** — readiness checks, then first task on Kanban |
| `awp next` | One task at a time (ongoing work) |
| `awp auto` | All remaining tasks in sequence |

| Button | Command | Meaning |
|--------|---------|---------|
| Check | `awp check` | Restore context; find current step |
| **Start** | **`awp start`** | **First task** — checks + `backlog_sync` startTaskId |
| Update | `awp update` | Sync docs and task markdown |
| Commit | `awp commit` | Commit with commitStandard |
| Next | `awp next` | One task: update → commit → next |
| **Auto** | **`awp auto strict`** | Strict loop — one task, one commit, checkpoint per iteration |
| Handoff | `awp handoff` | Transfer context to human |

### Agent commits panel

Below the activity feed, **Agent commits** lists recent git commits matching the AWP commit standard (`type(scope step): subject`). Updates live automatically (git watcher + 3s poll). Requires a git repo at the project root.

To skip auto-open: `npm run watch -- --no-open` or set `AWP_KANBAN_NO_OPEN=1`

## One-liner (no npm script)

```bash
node agentic-sdlc/kanban/runner/cli.js watch
```

## Other commands

```bash
npm run sync    # recompile backlog.json from markdown
npm run serve   # serve board without file watching
```

`appDir` is read automatically from `.kanban-config.json` — no `--appDir` flag needed when run from this directory.
