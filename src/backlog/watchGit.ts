import * as fs from 'fs';
import * as path from 'path';

/** Watch git refs/logs so the Kanban server can push commit updates over SSE. */
export function watchGitHead(
  appDir: string,
  onChange: () => void,
  debounceMs = 400
): void {
  const gitDir = path.join(appDir, '.git');
  if (!fs.existsSync(gitDir)) return;

  let debounce: ReturnType<typeof setTimeout> | null = null;
  const fire = () => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => onChange(), debounceMs);
  };

  const watchFile = (file: string) => {
    if (!fs.existsSync(file)) return;
    fs.watch(file, fire);
  };

  watchFile(path.join(gitDir, 'logs', 'HEAD'));
  watchFile(path.join(gitDir, 'HEAD'));

  const refsHeads = path.join(gitDir, 'refs', 'heads');
  if (!fs.existsSync(refsHeads)) return;

  try {
    fs.watch(refsHeads, { recursive: true }, fire);
  } catch {
    for (const name of fs.readdirSync(refsHeads)) {
      watchFile(path.join(refsHeads, name));
    }
  }
}
