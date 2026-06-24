/**
 * @fileoverview base tool user.md preservation tests
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { handleBaseTool } = require('../dist/tools/base');

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

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'user-md-test-'));
const ideaPath = path.join(tmp, 'idea.md');
fs.writeFileSync(ideaPath, '# My idea\n\nBuild a methane monitoring POC.\n');

const minimalMvpArgs = {
  appDir: tmp,
  backlogName: 'demo',
  projectType: 'mvp',
  mvpCoreValueProposition: {
    problem: 'Test problem',
    primaryUser: 'Operator',
    coreUserJourney: 'Monitor and alert',
  },
  mvpEssentialFeatures: ['Dashboard'],
  mvpTechnologies: ['Node'],
  mvpPhases: ['Phase 1'],
};

let passed = 0;

if (
  test('base MODE 2 with userSource creates user.md', () => {
    const dir = path.join(tmp, 'text-only');
    fs.mkdirSync(dir, { recursive: true });
    const result = handleBaseTool({
      ...minimalMvpArgs,
      appDir: dir,
      backlogName: 'text',
      userSource: 'We need a quick dashboard for methane leaks.',
    });
    assert(!result.isError, 'should succeed');
    const userPath = path.join(dir, 'agentic-sdlc', 'backlog-text', 'mvp', 'user.md');
    assert(fs.existsSync(userPath), 'user.md exists');
    const content = fs.readFileSync(userPath, 'utf8');
    assert(content.includes('User Source Material'), 'has header');
    assert(content.includes('methane leaks'), 'has user text');
    assert(fs.existsSync(path.join(dir, 'agentic-sdlc', 'backlog-text', 'mvp', 'base.md')));
  })
) {
  passed++;
}

if (
  test('base MODE 2 with userSourceFile copies file content', () => {
    const dir = path.join(tmp, 'file-only');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'idea.md'), 'File-backed brief content.');
    const result = handleBaseTool({
      ...minimalMvpArgs,
      appDir: dir,
      backlogName: 'file',
      userSourceFile: 'idea.md',
    });
    assert(!result.isError, 'should succeed');
    const userPath = path.join(dir, 'agentic-sdlc', 'backlog-file', 'mvp', 'user.md');
    const content = fs.readFileSync(userPath, 'utf8');
    assert(content.includes('**Source file:** idea.md'), 'records source file');
    assert(content.includes('File-backed brief content'), 'has file content');
  })
) {
  passed++;
}

if (
  test('base MODE 2 auto-detects idea.md at project root', () => {
    const dir = path.join(tmp, 'auto-detect');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'idea1.md'), 'Auto-detected idea brief.');
    const result = handleBaseTool({
      ...minimalMvpArgs,
      appDir: dir,
      backlogName: 'auto',
    });
    assert(!result.isError, 'should succeed');
    assert(result.content[0].text.includes('Auto-detected'), 'mentions auto-detect');
    const userPath = path.join(dir, 'agentic-sdlc', 'backlog-auto', 'mvp', 'user.md');
    assert(fs.existsSync(userPath), 'user.md exists');
    assert(fs.readFileSync(userPath, 'utf8').includes('Auto-detected idea brief'), 'has file content');
  })
) {
  passed++;
}

if (
  test('base MODE 2 without user source warns but still creates base.md', () => {
    const dir = path.join(tmp, 'no-user');
    fs.mkdirSync(dir, { recursive: true });
    const result = handleBaseTool({
      ...minimalMvpArgs,
      appDir: dir,
      backlogName: 'nouser',
    });
    assert(!result.isError, 'should succeed');
    assert(result.content[0].text.includes('no user brief file found') || result.content[0].text.includes('user.md was not created'), 'warns');
    const userPath = path.join(dir, 'agentic-sdlc', 'backlog-nouser', 'mvp', 'user.md');
    assert(!fs.existsSync(userPath), 'user.md not created');
    assert(fs.existsSync(path.join(dir, 'agentic-sdlc', 'backlog-nouser', 'mvp', 'base.md')));
  })
) {
  passed++;
}

console.log(`\n${passed}/4 user.md tests passed`);
process.exit(passed === 4 ? 0 : 1);
