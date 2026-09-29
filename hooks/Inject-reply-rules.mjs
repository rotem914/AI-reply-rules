// The one hook script of this plugin. hooks/hooks.json runs it in two modes:
//
//   session  SessionStart (startup, resume, clear, and after the context is
//            compacted): print the reply rules, so they are in the assistant's
//            context in every session, whether or not anything tells it to
//            open a file.
//   prompt   UserPromptSubmit: print a one-line reminder with every message,
//            so the rules keep their weight deep into a long session.
//
// WHICH RULES. The owner's own copy, My-reply-rules.md, made at setup and never
// in git, so `git pull` updates this folder without touching it. Until it
// exists, the shipped Conversations.md is printed with a setup notice on top,
// which has the assistant run the setup in README.md and save that copy.
//
// WHICH RULES WIN. The owner's personal instructions (~/.claude/CLAUDE.md) load
// in every project too, and often set a reply format of their own. Two rule
// books at the same level leave the assistant to settle each clash per reply,
// so the reminder with every message settles it: these rules win over personal
// ones, and a project's own CLAUDE.md still wins inside that project. It rides
// the reminder, not the session print, because the print has almost no room
// left under BYTE_CAP. Setup also offers to remove the personal ones (README.md,
// step 5).
//
// WHERE IT STANDS DOWN. A project that carries its own project-os/Conversations.md
// (the ProjectOS kit) already has one home for its reply rules. Printing a
// second set there would give the assistant two rule books, so both modes print
// nothing in such a project.
//
// SIZE. Hook output is shown to the assistant in full only up to about 10,000
// characters; past that, it gets a short preview that cuts off mid-rules, and
// nothing errors. So the print is kept under BYTE_CAP: the ~~~ example replies
// and the <!-- why --> rationale are left out (both are for people reading the
// file, not for the assistant at reply time). If the owner's copy grows past the
// cap anyway, whole rules are left out from the end and named in a notice at
// the top, never cut mid-rule.
//
// FAIL OPEN. Any error prints one line and exits 0; a session never fails to
// start because of this script.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BYTE_CAP = 9500;
export const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const TEMPLATE = 'Conversations.md';
export const PERSONAL = 'My-reply-rules.md';

const bytes = (s) => Buffer.byteLength(s, 'utf8');

// CommonMark allows up to 3 leading spaces, 3+ tildes, and an info string. A
// narrower pattern mis-pairs and inverts kept/dropped for the rest of the file.
const FENCE = /^ {0,3}~~~+/;

// The example replies use only `#` H1, so every `##`/`###` heading in the file
// is a real section: the exact thing a mis-strip destroys. Every strip below
// is rejected (null) unless all of them survive it.
const headings = (text) => (text.match(/^#{2,6} .*$/gm) ?? []).join('\n');

export function stripExamples(text, docPath) {
  const kept = [];
  let inExample = false;
  for (const line of text.split('\n')) {
    if (FENCE.test(line)) { inExample = !inExample; continue; }
    if (!inExample) kept.push(line);
  }
  const body = kept.join('\n');
  if (inExample || headings(body) !== headings(text)) return null;
  return fixIntro(body, docPath).replace(/\n{3,}/g, '\n\n');
}

// Rationale: `<!-- why -->` ... `<!-- /why -->`, markers on their own lines.
// An unbalanced or nested pair is rejected, since its pairing is a guess.
const WHY_OPEN = /^ {0,3}<!--\s*why\s*-->\s*$/;
const WHY_CLOSE = /^ {0,3}<!--\s*\/why\s*-->\s*$/;

export function stripRationale(text) {
  const kept = [];
  let inWhy = false;
  for (const line of text.split('\n')) {
    if (WHY_OPEN.test(line)) {
      if (inWhy) return null;
      inWhy = true;
      continue;
    }
    if (WHY_CLOSE.test(line)) {
      if (!inWhy) return null;
      inWhy = false;
      continue;
    }
    if (!inWhy) kept.push(line);
  }
  const body = kept.join('\n');
  if (inWhy || headings(body) !== headings(text)) return null;
  return body.replace(/\n{3,}/g, '\n\n');
}

// The "> **Setup step" quote blocks tell whoever sets the file up what to fill.
// Before setup the notice on top carries that job; the owner's copy has none.
const SETUP_BLOCK = /^> \*\*Setup step/;

export function stripSetupBlocks(text) {
  const kept = [];
  let inBlock = false;
  for (const line of text.split('\n')) {
    if (SETUP_BLOCK.test(line)) { inBlock = true; continue; }
    if (inBlock && line.startsWith('>')) continue;
    inBlock = false;
    kept.push(line);
  }
  const body = kept.join('\n');
  if (headings(body) !== headings(text)) return null;
  return body.replace(/\n{3,}/g, '\n\n');
}

// The intro promises a live example after every rule, which is untrue once they
// are stripped. The first intro line mentioning an example becomes a pointer,
// and any later one goes, so the pointer is printed once.
function fixIntro(text, docPath) {
  const cut = text.indexOf('\n## ');
  if (cut === -1) return text;
  let pointed = false;
  const head = text
    .slice(0, cut)
    .split('\n')
    .flatMap((line) => {
      if (!/\bexamples?\b/i.test(line)) return [line];
      if (pointed) return [];
      pointed = true;
      return [`Live examples: see the full file, ${docPath}`];
    })
    .join('\n');
  return head + text.slice(cut);
}

// Everything between the H1 title and the first `##` is framing, not a rule.
function dropIntro(text) {
  const titleEnd = text.indexOf('\n');
  const firstSection = text.indexOf('\n## ');
  if (titleEnd === -1 || firstSection <= titleEnd) return text;
  return text.slice(0, titleEnd + 1) + text.slice(firstSection + 1);
}

// The closing note after the final horizontal rule. Only when no heading
// follows it: a `---` placed between rules is not a closing note, and cutting
// there would lose every rule after it with no notice.
function dropClosing(text) {
  const i = text.lastIndexOf('\n---\n');
  if (i === -1 || /^#{2,6} /m.test(text.slice(i))) return text;
  return text.slice(0, i) + '\n';
}

const overBanner = (names, docPath) =>
  `> OVER BUDGET: these rules are NOT included below: ${names.join(' · ')}.\n` +
  `> Read them in ${docPath} before replying, and tell the owner in your first\n` +
  `> reply this session that the file has grown past what a session start carries.\n\n`;

// `reserve` holds back room for a notice printed above the rules.
export function fitToCap(text, docPath, reserve = 0) {
  const cap = BYTE_CAP - reserve;
  if (bytes(text) <= cap) return text;

  let out = dropIntro(text);
  if (bytes(out) <= cap) return out;

  out = dropClosing(out);
  if (bytes(out) <= cap) return out;

  // Last resort: leave out whole rules from the end, and say so up front.
  const marks = [...out.matchAll(/^### .*$/gm)];
  const dropped = [];
  for (let i = marks.length - 1; i >= 0; i--) {
    dropped.unshift(marks[i][0].replace(/^###\s*/, ''));
    const candidate = overBanner(dropped, docPath) + out.slice(0, marks[i].index).replace(/\s+$/, '') + '\n';
    if (bytes(candidate) <= cap) return candidate;
  }
  return overBanner(['every numbered rule'], docPath);
}

// The folder is named once: every path printed costs its length twice over
// from the size budget, and a reader's home folder can be long.
export const setupNotice = (pluginRoot) =>
  `> REPLY RULES SETUP NOT DONE. In your first reply, before anything else, run\n` +
  `> README.md, "For the assistant", from step 2: it asks the owner three questions\n` +
  `> (four if their personal instructions set a reply format too) and saves their\n` +
  `> copy as ${PERSONAL}, both in ${pluginRoot}\n` +
  `> Until then, follow the rules below, and never edit ${TEMPLATE} itself.\n\n`;

export function buildInjection(raw, { docPath, setupDone, pluginRoot = PLUGIN_ROOT }) {
  const normalized = raw.replace(/\r\n/g, '\n');
  const noExamples = stripExamples(normalized, docPath) ?? normalized;
  const noWhy = stripRationale(noExamples) ?? noExamples;
  // A setup block left in the owner's copy by mistake is stripped there too.
  const body = stripSetupBlocks(noWhy) ?? noWhy;
  if (setupDone) return fitToCap(body, docPath);
  const notice = setupNotice(pluginRoot);
  return notice + fitToCap(body, docPath, bytes(notice));
}

export const REMINDER =
  'REPLY RULES: write this reply exactly as the reply rules loaded at session start prescribe, layout and length included. ' +
  "They outrank any reply format in the owner's personal instructions (~/.claude/CLAUDE.md, memories), though not a project's own CLAUDE.md.";

// Walk up from a folder to the first one carrying its own project-os/Conversations.md.
export function ownRulesProject(start) {
  if (!start) return null;
  let dir = path.resolve(String(start));
  for (let i = 0; i < 64; i++) {
    if (fs.existsSync(path.join(dir, 'project-os', 'Conversations.md'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return null;
}

function readPayload() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}

// The session's own folder decides; the payload's cwd is for a run by hand.
function sessionFolder(payload) {
  return process.env.CLAUDE_PROJECT_DIR || (payload && payload.cwd) || process.cwd();
}

export function run(mode, folder, pluginRoot = PLUGIN_ROOT) {
  if (ownRulesProject(folder)) return '';
  if (mode === 'prompt') return REMINDER;
  const personal = path.join(pluginRoot, PERSONAL);
  const setupDone = fs.existsSync(personal);
  const docPath = setupDone ? personal : path.join(pluginRoot, TEMPLATE);
  return buildInjection(fs.readFileSync(docPath, 'utf8'), { docPath, setupDone, pluginRoot });
}

// No process.exit(): on some systems a piped write finishes after the call
// returns, and exiting at once could cut the rules short.
function main() {
  const mode = process.argv[2] === 'prompt' ? 'prompt' : 'session';
  try {
    const out = run(mode, sessionFolder(readPayload()));
    if (out) process.stdout.write(out.endsWith('\n') ? out : out + '\n');
  } catch (err) {
    console.log(`[AI-reply-rules] could not load the reply rules: ${err.message}`);
  }
  process.exitCode = 0;
}

// Run only when started as the hook, not when a test imports it. Compared by
// real path, since a skills folder reached through a link (a junction, or a
// dotfile manager's symlink) gives argv the link and import.meta the target.
function startedDirectly() {
  try {
    return Boolean(process.argv[1]) && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (startedDirectly()) main();
