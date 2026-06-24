/**
 * @fileoverview launch / preview opener tests
 */

const {
  buildSimpleBrowserUri,
  shouldTryEditorPreview,
  commandExists,
} = require('../dist/backlog/launch');

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

let passed = 0;

if (
  test('buildSimpleBrowserUri encodes url', () => {
    const uri = buildSimpleBrowserUri('http://localhost:4173', 'cursor');
    assert(uri.startsWith('cursor://vscode.simple-browser/show?url='));
    assert(uri.includes('localhost'));
  })
) {
  passed++;
}

if (
  test('shouldTryEditorPreview respects AWP_KANBAN_FORCE_BROWSER', () => {
    const prev = process.env.AWP_KANBAN_FORCE_BROWSER;
    process.env.AWP_KANBAN_FORCE_BROWSER = '1';
    assert(!shouldTryEditorPreview(), 'forced browser skips preview');
    if (prev === undefined) delete process.env.AWP_KANBAN_FORCE_BROWSER;
    else process.env.AWP_KANBAN_FORCE_BROWSER = prev;
  })
) {
  passed++;
}

if (
  test('commandExists finds node', () => {
    assert(commandExists('node'), 'node should exist');
  })
) {
  passed++;
}

console.log(`\n${passed}/3 launch tests passed`);
process.exit(passed === 3 ? 0 : 1);
