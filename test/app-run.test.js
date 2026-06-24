/**
 * @fileoverview App run script detection and generation
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  detectAppRunInfo,
  ensureRunAppScript,
  buildRunAppScriptContent,
  RUN_APP_SCRIPT_REL,
} = require('../dist/backlog/appRun');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (e) {
    console.error(`✗ ${name}`);
    console.error(`  ${e.message}`);
    return false;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

test('detectAppRunInfo prefers dev script', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'app-run-'));
  fs.writeFileSync(
    path.join(tmp, 'package.json'),
    JSON.stringify({ scripts: { dev: 'vite', start: 'node server.js' } })
  );
  const info = detectAppRunInfo(tmp);
  assert(info.hasPackageJson);
  assert(info.startScript === 'dev');
  assert(info.oneLiner === 'npm install && npm run dev');
  assert(info.hintUrl === 'http://localhost:5173');
});

test('ensureRunAppScript creates scripts/run-app.sh', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'app-run-script-'));
  fs.writeFileSync(
    path.join(tmp, 'package.json'),
    JSON.stringify({ scripts: { dev: 'next dev' } })
  );
  const info = ensureRunAppScript(tmp);
  const scriptPath = path.join(tmp, RUN_APP_SCRIPT_REL);
  assert(fs.existsSync(scriptPath), 'script should exist');
  const content = fs.readFileSync(scriptPath, 'utf8');
  assert(content.includes('npm install'));
  assert(content.includes('npm run dev'));
  assert(content === buildRunAppScriptContent(info));
});
