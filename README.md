# AI reply rules

Seventeen rules that make an AI assistant's replies easy to read: short, one
sentence per line, clear headings, the question last.

View the full rules and examples here: [Teach your AI to be easy to read](https://rotem-e.com/knowledge-base/teach-your-ai-to-be-easy-to-read).

A rules file on its own is not enough. An assistant opens it only when something
tells it to, and a long session drifts away from it. This repo is a Claude Code
plugin that loads the rules into every session and reminds the assistant of them
with every message.

## Install

The easy way: give Claude Code the link to this page and say **install**. It runs
the command below, asks you three questions, and that's it.

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
too. If it also says how replies should look, these rules win where the two
differ, since the reminder with every message says so. A project's own
`CLAUDE.md` still wins inside that project.

Setup never changes your personal instructions file, or any file outside the
plugin folder. If you want a single rule book, remove the reply rules from that
file yourself.

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

## Codex and other assistants

The hook works in Claude Code only. Anywhere else, paste your copy into the file
that assistant reads at the start of every session (for Codex, `AGENTS.md`).

## For the assistant

Follow these steps when the owner gives you this link and says install, or when
the session-start notice says the reply rules setup is not done.

**Setup changes nothing outside the plugin folder.** Never edit, move or trim
`~/.claude/CLAUDE.md`, a memory file, or any project file, even when the reply
rules in it clash with these, and never offer to. Those files govern every
session and every project; the reminder with each message already settles the
clash.

1. **Clone.** Run the command under Install. If the folder is already there, run
   the command under Update instead. If your environment refuses the command,
   give it to the owner to run in the chat box with `!` in front.
2. **Ask three questions, in one message** (through the question panel if you
   have one): the owner's name; their role, in their own words; and the one
   language every reply is written in. For the language, offer the one they
   have been writing in, and English.
3. **Make their copy.** Copy `Conversations.md` in the plugin folder to
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
4. **Tell the owner** the rules load from the next session, so they should start
   a new one. Mention once that the words `full report` lift the length limit
   for a single reply (rule 1).

By [Rotem Elimelech](https://rotem-e.com)
