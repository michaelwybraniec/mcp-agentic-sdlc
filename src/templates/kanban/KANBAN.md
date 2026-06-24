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

### AWP command bar

The board header includes buttons for common AWP chat commands: **Start**, **Update**, **Commit**, **Next**, **Check**, **Handoff**. Click a button to copy the command (e.g. `awp next`) — paste it into your agent chat.

**Start** copies `awp check` (find the current actionable step per AWP.md).

### Agent commits panel

Below the command bar, **Agent commits** lists recent git commits matching the AWP commit standard (`type(scope step): subject`). Refreshes when the backlog updates. Requires a git repo at the project root.

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
