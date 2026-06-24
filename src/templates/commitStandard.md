# Commit Standard

`type(scope step): subject`

**Types**: feat, fix, docs, test, chore  
**Rules**: Reference **one** step/task id per commit, imperative mood, concise  
**Examples**: `feat(api 2.1): add endpoint`, `docs(readme 3.2): update usage`  

**awp auto**: One commit **per task** after that task's work — never a range (`1.0-9.0`) or a single "deliver all phases" commit.

| Valid | Invalid |
|-------|---------|
| `feat(console 1.0): scaffold mobile-first layout` | `feat(console 1.0-9.0): deliver POC via awp auto` |
| `feat(console 2.0): add simulation service` | One commit at the end covering tasks 1–9 |

**Note**: Never use "AI" in commit messages (AWP 1.11).
