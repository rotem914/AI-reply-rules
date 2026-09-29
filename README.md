# AI reply rules

Seventeen rules that make an AI assistant's replies easy to read: short, one
sentence per line, clear headings, the question last.

**See exactly what the rules are, with a live example of each, in the article
[Teach your AI to be easy to read](https://rotem-e.com/knowledge-base/teach-your-ai-to-be-easy-to-read).**

A rules file on its own is not enough. An assistant opens it only when something
tells it to, and a long session drifts away from it. This repo is a Claude Code
plugin that loads the rules into every session and reminds the assistant of them
with every message.

## Install

The easy way: give Claude Code the link to this page and say **install**. It runs
the command below, asks you three questions, and that's it. A fourth comes only
when your personal instructions already set how replies look (see below).

Or run the command yourself, once per computer. It works in Windows PowerShell,
in a macOS or Linux terminal, and in Claude Code's chat box with `!` in front
(not in the old Windows Command Prompt). It needs `git` and `node`.

```
git clone https://github.com/rotem914/AI-reply-rules "$HOME/.claude/skills/ai-reply-rules"
```

Then start a new session. Its first reply asks your name, your role, and the
language you want replies in, and saves your own copy of the rules.

## What it does

- At the start of every session, and again when a long session is compacted,
  your rules are loaded into the assistant's context.
- With every message you send, one line reminds it to follow them, over any
  reply format in your personal instructions.
- In a project that carries its own `project-os/Conversations.md` (the
  [ProjectOS](https://github.com/rotem914/ProjectOS) kit), it stays silent, so
  that project's own rules are the only ones in play.

## If you already have reply rules

Your personal instructions file, `~/.claude/CLAUDE.md`, loads in every session
too. If it also says how replies should look, the assistant gets two rule books
that disagree, and settles the clash differently from one reply to the next.

So setup looks there first. If it finds rules about reply format, it asks
whether to remove them from that file. Say yes, and it saves a copy of the whole
file beside it as `CLAUDE.md.before-reply-rules`, removes only the reply-format
rules, and leaves everything else as it was. A preference of yours that these
rules don't cover, and don't contradict, moves into your copy of the rules.

Say no, and nothing in that file changes. These rules still win where the two
differ, since the reminder with every message says so. A project's own
`CLAUDE.md` still wins inside that project.

## Change a rule

Your copy is `My-reply-rules.md`, in the plugin folder:

```
~/.claude/skills/ai-reply-rules/My-reply-rules.md
```

Edit it, and the next session loads the change.

A session start carries about 10,000 characters, so what the assistant receives
leaves out the example replies and the notes marked `<!-- why -->`, which are
there for you. If your copy grows past that anyway, the rules that no longer fit
are named at the top, and the assistant reads them from the file.

## Update

```
git -C "$HOME/.claude/skills/ai-reply-rules" pull
```

This updates `Conversations.md`, the shipped rules, and never touches your copy.
To bring a new version into your copy, ask the assistant to compare the two files
and carry the changes over.

## Remove

Delete the folder `~/.claude/skills/ai-reply-rules`.

If setup removed rules from your `~/.claude/CLAUDE.md`, they are still in
`~/.claude/CLAUDE.md.before-reply-rules`. Copy back the ones you want.

## Codex and other assistants

The hook works in Claude Code only. Anywhere else, paste your copy into the file
that assistant reads at the start of every session (for Codex, `AGENTS.md`).

## For the assistant

Follow these steps when the owner gives you this link and says install, or when
the session-start notice says the reply rules setup is not done.

1. **Clone.** Run the command under Install. If the folder is already there, run
   the command under Update instead. If your environment refuses the command,
   give it to the owner to run in the chat box with `!` in front.
2. **Look for a second rule book.** Read `~/.claude/CLAUDE.md` and any file it
   pulls in with `@`. Note every rule about how a reply looks: length, layout,
   headings, report sections, diagrams, tone, dashes, reply language. Pronouns,
   working habits and anything else not about a reply's look are not reply
   rules. No file, or none found: skip the fourth question below and step 5.
3. **Ask the questions, in one message** (through the question panel if you
   have one): the owner's name; their role, in their own words; and the one
   language every reply is written in. For the language, offer first the one
   their personal instructions name, if any, else the one they have been
   writing in; also offer English. Only when step 2 found reply rules, add a
   fourth: "Your personal instructions also set how replies look. Remove those
   rules from that file, so these are the only ones?" Offer "Remove them
   (recommended), a copy of the file is kept" and "Keep the file as it is".
4. **Make their copy.** Copy `Conversations.md` in the plugin folder to
   `My-reply-rules.md` in the same folder. In the copy:
   - replace `{{OWNER_NAME}}` with their name and `{{OWNER_ROLE}}` with their
     role, worded to read right after "is a" (`product designer`, not
     `a product designer`);
   - replace the quote block in the Language section that starts with
     "Setup step" with one line naming their language, for example
     `Reply in English, always.`;
   - delete the quote block in rule 1 that starts with "Setup step". The length
     limits ship as written; never ask about them;
   - replace `{{DEV_URL}}` with the address their app runs on locally, or with
     `http://localhost:3000` if they have none.

   Change nothing else. If saving the copy there is refused, say so and ask the
   owner to allow it. Never save it anywhere else.

   From then on, every change to the rules, including a lesson rule 16 tells you
   to add, goes into `My-reply-rules.md`. Never edit `Conversations.md`: it is
   the shipped file, and an edit there makes the next update fail.
5. **Retire the other rules**, only when the owner said remove. First copy
   `~/.claude/CLAUDE.md` to `~/.claude/CLAUDE.md.before-reply-rules`, whole and
   unchanged; if that copy fails, stop and change nothing. Then delete from
   `CLAUDE.md` only the rules step 2 noted, and a heading left with nothing
   under it. Every other line stays word for word. A file pulled in with `@`
   is edited the same way, with its own copy beside it. A noted rule that no
   rule here covers or contradicts moves into `My-reply-rules.md`, as one line
   in the rule it belongs to. Keep a list of what moved, and of what was
   dropped because a rule here contradicts it.
6. **Tell the owner** the rules load from the next session, so they should start
   a new one. Mention once that the words `full report` lift the length limit
   for a single reply (rule 1). If step 5 ran, name what moved and what was
   dropped, one line each, and where the copy of their file is.

By [Rotem Elimelech](https://rotem-e.com)
