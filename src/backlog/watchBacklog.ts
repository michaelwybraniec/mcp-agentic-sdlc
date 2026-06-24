import * as fs from 'fs';
import * as path from 'path';

function walkAndWatch(dir: string, onEvent: (filePath: string) => void): void {
  if (!fs.existsSync(dir)) return;
  fs.watch(dir, (_event, filename) => {
    if (filename) onEvent(path.join(dir, filename));
  });
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      walkAndWatch(path.join(dir, entry.name), onEvent);
    }
  }
}

/** Watch backlog markdown sources (recursive tasks/ + base + backlog). */
export function watchBacklogPaths(
  backlogDir: string,
  onChange: (filePath?: string) => void,
  debounceMs = 200
): void {
  let debounce: ReturnType<typeof setTimeout> | null = null;
  const fire = (filePath?: string) => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => onChange(filePath), debounceMs);
  };

  const tasksDir = path.join(backlogDir, 'tasks');
  if (fs.existsSync(tasksDir)) {
    try {
      fs.watch(tasksDir, { recursive: true }, (_event, filename) => {
        if (filename) fire(path.join(tasksDir, filename));
        else fire(tasksDir);
      });
    } catch {
      walkAndWatch(tasksDir, (p) => fire(p));
    }
  }

  for (const name of ['base.md', 'backlog.md']) {
    const file = path.join(backlogDir, name);
    if (fs.existsSync(file)) {
      fs.watch(file, () => fire(file));
    }
  }
}
