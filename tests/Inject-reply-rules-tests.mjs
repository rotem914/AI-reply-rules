// Tests for hooks/Inject-reply-rules.mjs. Run from the repo root:
//   node tests/Inject-reply-rules-tests.mjs
// They run against the REAL Conversations.md, so a rule added to it that pushes
// the session-start print past its size budget fails here, before it ships.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  BYTE_CAP, PLUGIN_ROOT, TEMPLATE, PERSONAL, REMINDER,
  stripExamples, stripRationale, stripSetupBlocks, buildInjection, run, ownRulesProject,
} from '../hooks/Inject-reply-rules.mjs';

const raw = fs.readFileSync(path.join(PLUGIN_ROOT, TEMPLATE), 'utf8').replace(/\r\n/g, '\n');
const bytes = (s) => Buffer.byteLength(s, 'utf8');
const rules = (s) => (s.match(/^### .*$/gm) ?? []).map((h) => h.replace(/^### /, ''));
const ALL_RULES = rules(raw);
const TMP = path.join(PLUGIN_ROOT, 'tests', '.tmp');

// A plugin folder far longer than most, since the path is printed three times.
const LONG_ROOT = 'C:\\Users\\A-Rather-Long-Account-Name\\.claude\\skills\\ai-reply-rules';
const docIn = (root, file) => path.join(root, file);

// What step 4 of the README's "For the assistant" produces.
function filledCopy(text) {
  return text
    .replace(/\{\{OWNER_NAME\}\}/g, 'Alexandra Rivera-Montgomery')
    .replace(/\{\{OWNER_ROLE\}\}/g, 'senior product designer')
    .replace(/\{\{DEV_URL\}\}/g, 'http://localhost:3000')
    .replace(/^> \*\*Setup step.*\n(?:>.*\n)*/m, 'Reply in English, always.\n')
    .replace(/^> \*\*Setup step.*\n(?:>.*\n)*/m, '');
}

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    console.error(`  FAIL  ${name}\n        ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('Inject-reply-rules: the shipped file');

check('it has the seventeen rules', () => assert.equal(ALL_RULES.length, 17));

check('every strip accepts it, so nothing falls back to the untrimmed file', () => {
  const a = stripExamples(raw, 'x');
  assert.ok(a, 'the example strip was rejected');
  const b = stripRationale(a);
  assert.ok(b, 'the rationale strip was rejected');
  assert.ok(stripSetupBlocks(b), 'the setup-block strip was rejected');
});

console.log('Inject-reply-rules: before setup');

const before = buildInjection(raw, { docPath: docIn(LONG_ROOT, TEMPLATE), setupDone: false, pluginRoot: LONG_ROOT });

check('all seventeen rules fit under the cap, even from a long folder path', () => {
  assert.ok(bytes(before) <= BYTE_CAP, `${bytes(before)} bytes`);
  assert.deepEqual(rules(before), ALL_RULES);
});

check('the setup notice comes first and names the copy to save, and where', () => {
  assert.ok(before.startsWith('> REPLY RULES SETUP NOT DONE'));
  assert.ok(before.includes(PERSONAL));
  assert.ok(before.includes(LONG_ROOT));
});

check('a much longer folder path still costs no rule', () => {
  const huge = 'C:\\Users\\' + 'x'.repeat(120) + '\\.claude\\skills\\ai-reply-rules';
  const out = buildInjection(raw, { docPath: docIn(huge, TEMPLATE), setupDone: false, pluginRoot: huge });
  assert.ok(bytes(out) <= BYTE_CAP, `${bytes(out)} bytes`);
  assert.deepEqual(rules(out), ALL_RULES);
});

check('no example reply, rationale or setup block leaks in', () => {
  assert.ok(!before.includes('Purge the orphaned'), 'an example leaked');
  assert.ok(!before.includes('These numbers are a dial'), 'rationale leaked');
  assert.ok(!before.includes('<!--'), 'a marker leaked');
  assert.ok(!before.includes('Setup step'), 'a setup block leaked');
});

check('the pointer to the full file is printed once', () => {
  assert.equal(before.split('Live examples: see the full file').length - 1, 1);
});

console.log('Inject-reply-rules: after setup');

const personal = filledCopy(raw);
const after = buildInjection(personal, { docPath: docIn(LONG_ROOT, PERSONAL), setupDone: true, pluginRoot: LONG_ROOT });

check('the filled copy has no blanks left', () => assert.ok(!/\{\{|Setup step/.test(personal)));

check('all seventeen rules fit, with no notice on top', () => {
  assert.ok(bytes(after) <= BYTE_CAP, `${bytes(after)} bytes`);
  assert.deepEqual(rules(after), ALL_RULES);
  assert.ok(after.startsWith('# '), 'something sits above the title');
});

check('an owner copy grown past the cap loses whole rules from the end, named on top', () => {
  const grown = personal.replace(/\n---\n/, '\n### 18 · A long new rule\n\n' + 'One more line of a rule.\n'.repeat(120) + '\n---\n');
  const out = buildInjection(grown, { docPath: 'the file', setupDone: true });
  assert.ok(bytes(out) <= BYTE_CAP, `${bytes(out)} bytes`);
  assert.ok(out.startsWith('> OVER BUDGET'));
  assert.ok(out.includes('18 · A long new rule'), 'the dropped rule is not named');
  assert.ok(!out.includes('One more line of a rule.'), 'a rule was cut mid-way');
});

check('a divider between rules is never mistaken for the closing note', () => {
  const noClosing = personal.slice(0, personal.lastIndexOf('\n---\n') + 1);
  const moved = noClosing.replace('\n### 16 ', '\n---\n\n### 16 ') + 'One more line of a rule.\n'.repeat(60);
  const out = buildInjection(moved, { docPath: 'the file', setupDone: true });
  assert.ok(bytes(out) <= BYTE_CAP, `${bytes(out)} bytes`);
  const missing = ALL_RULES.filter((r) => !rules(out).includes(r));
  for (const r of missing) assert.ok(out.includes(r), `rule "${r}" was dropped without being named`);
});

check("a setup block left in the owner's copy is not printed", () => {
  const leftover = personal.replace('## Rules\n', '## Rules\n\n> **Setup step: delete this block when done.** Leftover.\n');
  const out = buildInjection(leftover, { docPath: 'x', setupDone: true });
  assert.ok(!out.includes('Setup step'));
});

check('an unbalanced why marker keeps the rationale rather than guess', () => {
  const broken = raw.replace('<!-- /why -->', '');
  assert.equal(stripRationale(stripExamples(broken, 'x')), null);
  const out = buildInjection(broken, { docPath: 'x', setupDone: true });
  assert.ok(rules(out).length > 0);
});

console.log('Inject-reply-rules: the reminder');

check('it says these rules outrank personal instructions, not a project', () => {
  assert.ok(REMINDER.includes('~/.claude/CLAUDE.md'));
  assert.ok(REMINDER.includes("not a project's own CLAUDE.md"));
  assert.ok(!REMINDER.includes('\n'), 'the reminder is one line');
});

console.log('Inject-reply-rules: where it runs');

fs.rmSync(TMP, { recursive: true, force: true });
try {
  const kitProject = path.join(TMP, 'kit-project');
  const plain = path.join(TMP, 'plain-project', 'src');
  const plugin = path.join(TMP, 'plugin');
  fs.mkdirSync(path.join(kitProject, 'project-os'), { recursive: true });
  fs.writeFileSync(path.join(kitProject, 'project-os', 'Conversations.md'), '# Its own rules\n');
  fs.mkdirSync(path.join(kitProject, 'app'), { recursive: true });
  fs.mkdirSync(plain, { recursive: true });
  fs.mkdirSync(plugin, { recursive: true });
  fs.copyFileSync(path.join(PLUGIN_ROOT, TEMPLATE), path.join(plugin, TEMPLATE));

  check('a project with its own reply rules gets nothing, from any folder inside it', () => {
    assert.ok(ownRulesProject(path.join(kitProject, 'app')));
    assert.equal(run('session', path.join(kitProject, 'app'), plugin), '');
    assert.equal(run('prompt', kitProject, plugin), '');
  });

  check('any other project gets the rules, and the reminder with each message', () => {
    assert.ok(run('session', plain, plugin).startsWith('> REPLY RULES SETUP NOT DONE'));
    assert.equal(run('prompt', plain, plugin), REMINDER);
  });

  check("once the owner's copy exists, it is the one printed", () => {
    fs.writeFileSync(path.join(plugin, PERSONAL), personal);
    const out = run('session', plain, plugin);
    assert.ok(out.startsWith('# '), 'the setup notice is still there');
    assert.ok(out.includes('Alexandra Rivera-Montgomery'));
  });

  check('as a real hook process: reads the session folder, prints, exits 0', () => {
    const script = path.join(PLUGIN_ROOT, 'hooks', 'Inject-reply-rules.mjs');
    const env = { ...process.env, CLAUDE_PROJECT_DIR: plain };
    const r = spawnSync(process.execPath, [script, 'session'], { input: JSON.stringify({ cwd: plain }), env, encoding: 'utf8' });
    assert.equal(r.status, 0);
    assert.ok(r.stdout.includes('### 17'), 'the rules were not printed');
    const k = spawnSync(process.execPath, [script, 'prompt'], { input: '{}', env: { ...env, CLAUDE_PROJECT_DIR: kitProject }, encoding: 'utf8' });
    assert.equal(k.status, 0);
    assert.equal(k.stdout, '');
  });

  check('run through a linked folder, as a skills folder can be, it still prints', () => {
    const link = path.join(TMP, 'linked-hooks');
    fs.symlinkSync(path.join(PLUGIN_ROOT, 'hooks'), link, 'junction');
    const r = spawnSync(process.execPath, [path.join(link, 'Inject-reply-rules.mjs'), 'prompt'], {
      input: '{}', env: { ...process.env, CLAUDE_PROJECT_DIR: plain }, encoding: 'utf8',
    });
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), REMINDER);
  });

  check('hooks.json points at this script, in both modes', () => {
    const cfg = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, 'hooks', 'hooks.json'), 'utf8'));
    const args = (event) => cfg.hooks[event][0].hooks[0].args;
    assert.deepEqual(args('SessionStart'), ['${CLAUDE_PLUGIN_ROOT}/hooks/Inject-reply-rules.mjs', 'session']);
    assert.deepEqual(args('UserPromptSubmit'), ['${CLAUDE_PLUGIN_ROOT}/hooks/Inject-reply-rules.mjs', 'prompt']);
  });
} finally {
  fs.rmSync(TMP, { recursive: true, force: true });
}

console.log(process.exitCode ? 'Inject-reply-rules-tests: FAILED' : `Inject-reply-rules-tests: all ${passed} cases passed.`);
