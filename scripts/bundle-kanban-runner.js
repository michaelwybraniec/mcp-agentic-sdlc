#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const distBacklog = path.join(root, 'dist', 'backlog');
const runnerDir = path.join(root, 'src', 'templates', 'kanban', 'runner');

const files = [
  ['cli-standalone.js', 'cli.js'],
  'compiler.js',
  'server.js',
  'parser.js',
  'activity.js',
  'parseBaseMd.js',
  'types.js',
  'launch.js',
  'gitCommits.js',
  'watchBacklog.js',
  'watchGit.js',
];

if (!fs.existsSync(distBacklog)) {
  console.error('dist/backlog not found — run tsc first');
  process.exit(1);
}

fs.mkdirSync(runnerDir, { recursive: true });

for (const entry of files) {
  const [src, dest] = Array.isArray(entry) ? entry : [entry, entry];
  const srcPath = path.join(distBacklog, src);
  if (!fs.existsSync(srcPath)) {
    console.error(`Missing ${srcPath}`);
    process.exit(1);
  }
  fs.copyFileSync(srcPath, path.join(runnerDir, dest));
}

console.log(`Bundled kanban runner to ${runnerDir}`);
