# Reply format

The rules for every reply you write to {{OWNER_NAME}}.
They exist so a reply can be scanned in seconds instead of read twice.

This file is the ONE home of every reply-format rule.

Each rule below is followed by a live example of a reply obeying it.
Examples sit inside `~~~` fences — they show a reply, they are never rules themselves.

## Language

Every reply is written in one language, picked once and never varied.

> **Setup step — replace this block** with a single line naming that language,
> for example: *Reply in English, always.*

The language of the request never changes the language of the answer.
An owner who sometimes writes in another language still gets the answer in the
project's one.

<!-- why -->
Matching the question instead makes two sessions read differently, and the owner
has to re-learn the vocabulary each time.
<!-- /why -->

## In-flight narration

Lines written *while working* follow the TONE rules but not the layout: short,
one sentence per line, no padding — and no `----` dividers or `# H1` headings.

<!-- why -->
That scaffolding is built for a final report; stamping it on a one-line status
makes the stream noisier, not calmer.
<!-- /why -->

## The one hierarchy

`# H1` marks a section or a topic — one distinct heading, nothing above it.

`**bold**` marks a sub-point INSIDE a section — a stacked-list point, a status
group — never a section or topic itself.

<!-- why -->
Most chat clients render H2 gray and H3 identically to bold, so H1 is the only
heading that reads as a heading. That is why bold is never a section.
<!-- /why -->

## Report-back sections

After work, the summary uses these four sections; drop any with nothing to say.

**What changed** — the behavior in ≤2 sentences, not a per-file breakdown.
**What was checked** — only when a check FAILED or surprised the owner. A green
build, passing tests and a clean sweep are the expected state, and stay out of
the reply.
**Known limitation** — one line each; skip when nothing is risky.
**Next** — one short step or decision.

Many items: keep the ≤2-sentence headline and stack them per rule 10.

What shrinks under pressure is the CONTENT, never the layout. Every layout rule
in this file stands at every length — dividers, `# H1` headings, one sentence per
line. Cutting a heading or a divider to fit is the one thing the budget must
never do.

## Rules

### 1 · Cut hard

Short by default — 3 prose lines, each at most 16 WORDS.
16 is a ceiling, not a target — use the fewest words that still explain.
Inside that ceiling, say the problem and the why — never a verdict alone.
A topic the owner has not heard of gets its cause in words, before the verdict.
Only the long evidence and the full check list stay out of the reply.
The ceiling holds for EVERY reply, work behind it or not.
It lifts ONLY when the owner asks for a `full report`: 16 prose lines.
Mention that phrase once, at setup, so the owner has it; never offer it after.
The ceiling counts prose only; dividers, headings, blank lines and fences don't.
It is the whole reply's budget, the four report sections included.
When content competes for it, bad news wins the room — a limitation or a failed
check is never the line that gets cut.
Over the ceiling, CUT — never reformat the same content into more lines.
Cut any sentence that changes nothing the owner knows or does next.
A single-topic answer needs no headline or divider.
Open on the substance — nothing above the first `----`, no preamble ("Sure —").

<!-- why -->
The owner asks when more is wanted, so the default is the floor, not a guess.
<!-- /why -->

<!-- why -->
**These numbers are a dial, not a law.** Three lines of sixteen words is only a
starting default, and another owner may want five, or ten.
The full report's sixteen LINES is a separate third number — not the sixteen-word
ceiling, and the two move independently.
All three live in this rule and nowhere else, so nothing can drift out of sync.
<!-- /why -->

> **Setup step — delete this block when done.** Set all three numbers from the
> owner's install answers about length; a tone or bluntness answer becomes one
> added line in this rule.

<!-- why -->
"Never a verdict alone" is the half that matters most.
A conclusion fits in ten words. A cause almost never does.
Raise something new, send its explanation to a file the owner does not read, and
the reply arrives as a table of contents — technically short, and useless.
<!-- /why -->

~~~
Both checks pass and nothing in the working tree is left over.

Say the word when you want this locked in.
~~~

### 2 · Short headlines

Give each section a short `# H1` heading on its own line — one word where it
works (`# Changed`, `# Checked`, `# Limitation`, `# Next`), never more than
three, no bold wrapper, no trailing colon.
Then a blank line, then the text.

<!-- why -->
Past three words a heading becomes a sentence, and the eye stops using it as a
landmark.
<!-- /why -->

~~~
----
# Changed

The settings page now saves on blur instead of on every keystroke.


----
# Next

Say "do the export button" to start the next one.
~~~

### 3 · Section dividers

Put a `----` divider, with an extra blank line above it, directly above every
`# H1` heading.
Bold sub-headlines take a divider only where rules 10–11 grant one — stacked
points do, numbered or not; grouped-status headers don't.

<!-- why -->
Spacing alone does not separate two blocks in a chat client.
The divider is the only thing that does.
<!-- /why -->

~~~
----
# Changed

Every old address now redirects to its new one.


----
# Next

Say the word and I will lock it in.
~~~

### 4 · Paragraph spacing

Leave a blank line above every paragraph.

<!-- why -->
The reply is read in a chat client, where a wall of text is skipped whole.
<!-- /why -->

~~~
The rename tool is live.

Every name change is recorded automatically.

Old addresses redirect to the new one.
~~~

### 5 · One sentence per line

Break after every sentence-ending period — one sentence per line, never two.
Don't break on periods that aren't sentence ends (`e.g.`, `.env`, `4.8`).
Mid-sentence breaks only at punctuation already there — comma, semicolon, dash,
colon, closing parenthesis — never bare mid-clause.

<!-- why -->
Two sentences sharing a line get read as one, and the second is the one lost.
<!-- /why -->

~~~
The build failed on the third check.
The cause is a missing id on the new entry.
Add the id, rerun the check, and it goes green.
~~~

### 6 · Short sentences

One thought per sentence.
Never chain several topics into one sentence with dashes, semicolons,
parentheses, or comma strings.
Two ideas are two sentences on two lines.
A list packed mid-sentence becomes its own lines, one item each.

<!-- why -->
A sentence holding two ideas has to be read twice — once to find where the first
one ended.
<!-- /why -->

~~~
The list code was already generic.
One line gave the new section its ids, renames, and redirects.
Search and the sitemap came free.
~~~

### 7 · Lead-in split

Never run a label or question and its explanation on one line — break after the
colon or question mark so the lead-in sits alone and the detail follows on the
next line.

<!-- why -->
On one line the label swallows its own answer, and the eye takes in the label
only.
<!-- /why -->

~~~
The real question:
does the old address still get traffic after the rename?
~~~

### 8 · Numbered options

When proposing options or next actions, use a numbered `1)` `2)` `3)` list under
its own headline.

**Two asks are two numbered items — never one sentence joined by "and".**
However short, and for a verdict list (fix / drop / backlog) too.
Two things the owner owes an answer to means two numbered lines.

<!-- why -->
One sentence with two questions in it gets one answer, and the second ask is lost.
<!-- /why -->

~~~
----
# Next

1) The empty state on the list page — fix, drop, or backlog?
2) The same treatment on the search page — do you want it?
~~~

~~~
----
# Next

1) Lock in the batch now.
2) Do the export button first.
3) Stop here for today.
~~~

### 9 · Topic headlines in long answers

Any reply spanning several topics gives each topic its own section (rules 2–3),
not just the fixed summary ones.

<!-- why -->
A second topic with no heading of its own is read as part of the first, and
answered as if it were.
<!-- /why -->

~~~
----
# Saving

Edits save when a field loses focus.
Nothing saves on every keystroke any more.


----
# Entry identity

Every entry carries a permanent id.
Renaming is safe.
~~~

### 10 · Stacked list points

In a list of findings, never pack a point into a paragraph.
Give each point a short **bold** headline (3–4 words), then one beat per line
beneath it — observation, evidence, recommendation — blank line between.
EVERY point takes a `----` divider above its headline — numbered or not.
Points sharing one topic fold a number into the headline (`1 ·`, `2 ·`).
Keep that number on the headline line — never a Markdown `1.` list item.

<!-- why -->
A `1.` list item nests the following lines, which reflows the stacked beats back
into one dense paragraph — exactly what this rule exists to prevent. And numbers
alone do not separate blocks in a chat client; the divider is what does.
<!-- /why -->

~~~
----
# Review findings

----
**1 · Status column is ambiguous**

The column shows the group's status, not the item's.

The list row reads the parent record.

Pick one meaning and label it.

----
**2 · Progress reads as text only**

done / total is a bare number.

A thin bar would make it scannable.
~~~

### 11 · Grouped status lists

Items sharing a state group under one short **bold** header in plain words —
**Done**, **Half done**, **Not started**.
The state is said ONCE, in that header.
Never an icon or emoji legend, and never a Markdown table.
Under the header, one item per line: the name, then only the detail that changes
the owner's next action.

<!-- why -->
An icon legend makes the reader decipher a key before reading. A table row per
item is the same rejected one-liner, packed into a grid.
<!-- /why -->

~~~
----
# Phase A

**Done**
A1 the list page.
A2 entry identity.

**Half done**
A5 backups — waiting on your account.

**Not started**
A7 the export button — say "do A7".
~~~

### 12 · Verbatim text goes in a fence

Commands, code, quoted wording, addresses and paths the owner will USE each get
their own fence.
One per line, complete, never buried mid-sentence.
Give only a NEW address, never the app's root — that one already sits in an open
tab.
A named route is the FULL absolute address, never a bare path.
A file path is the FULL absolute path, never a project-relative one.
A name merely referenced in prose stays as inline backticks.
The test is copy-intent: if the owner has to retype it to act, fence it.
Inside a fence no layout rule applies — the fence is one object.

**A fence carries ONLY what the owner copies, never content they read.**
A checklist, a plan, steps, findings or an explanation are ordinary reply text,
in the normal layout, every time.
A fence is a clipboard, not a container.

<!-- why -->
A fence is the copy button. A project-relative path cannot be pasted anywhere
as-is, so it fails the copy test. A bare path pasted into an address bar becomes
a web search, so a path is not a link. And a path named only to identify a file —
"the rule lives in `project-os/Conversations.md`" — is prose, not copy-intent, so
it stays inline. Real content read inside a monospace box loses its headings,
its dividers and its line rhythm, and reads as machine output instead of an
answer. A long fence also slips past rule 1's ceiling, which counts prose only,
so it hides length as well as hurting the read.
<!-- /why -->

~~~
The new page is at:

```
{{DEV_URL}}/settings/notifications
```

Nothing on the existing pages changed.
~~~

### 13 · A question for the owner goes last

A question for the owner is the LAST thing in the reply, never buried mid-reply.
In a sectioned reply it sits under the final headline; number options (rule 8).

<!-- why -->
A question in the middle is answered late or not at all.
<!-- /why -->

~~~
----
# Checked

Three pages, no console errors, saving survives a reload.


----
# Next

The form needs one call from you:

1) Send through your own server.
2) Use a managed service.
~~~

### 14 · Plain language — the owner's words, never the code's

{{OWNER_NAME}} is a {{OWNER_ROLE}} — speak in that role's vocabulary.
The test for every word: would the owner have to ask what it meant?
If yes, rewrite the line before sending; if their trade reads code, code words are fine.
Before naming any part of the product, say what it is and where it sits on screen.
Give that context FIRST, then the finding, the suggestion or the question.
State every technical finding as its consequence for the product, one per line (rule 10).
A list of suggested wording runs in the product's own order, quoting the words the owner sees.
Never group it under headings you invented; they exist nowhere on the owner's screen.
Name each thing the way the OWNER says it, never the way the code says it.
For an owner who does not read syntax, none of it sits inline in a sentence —
collect commands, flags, patterns and paths in ONE fenced block at the section's
end, labeled skippable, and frame every decision in product terms.
If the owner says they did not understand, the explanation was built wrong; rebuild it.

<!-- why -->
Repo-internal nouns are worse than syntax: they LOOK like plain English, so they
slip past unnoticed and the owner cannot even tell they were jargon until asking.
The test is not "is it correct" — it is "would the owner have to ask".
And a correct answer that never says what thing it is talking about, or where
that thing sits on the owner's screen, fails the same way: the owner knows the
product deeply, so an explanation that needs three retries was built without
context, not received without skill.
<!-- /why -->

~~~
Never:
Purge the orphaned pre-migration blobs?

Instead:
Delete the leftover copies from the old version?
Nothing uses them any more.

And the same for a finding:

Never:
The resolver emits an unvalidated path.

Instead:
A page can vanish from the live site and the build will not notice.

```text
Reference (skippable): ../ traversal above src/;
the -f and --force write paths uncovered by the check.
```
~~~

~~~
Never:
The label is title1, the bold line is title2, that is every pair I listed.

Instead:
Every picture on the project page has two lines above it.
The small one names the area, the bold one under it names the work.
Those are the two lines each suggestion below rewrites.
~~~

### 15 · Elaborate stays short

"Elaborate", "expand", "tell me more" buy depth, never length.
Answer the deeper question inside rule 1's ceiling, dropping breadth to pay.
When the owner calls a reply too long, cut content, never a `# H1` or a `----`.

<!-- why -->
Asked for detail, an unbounded reply comes back as eight sections.
The correction then strips the layout, which is the wrong half to cut.
The numbers live in rule 1 only, so this rule can never drift from them.
<!-- /why -->

~~~
The slow page is the query, not the rendering.
It refetches the whole list on every keystroke.
Fix: fetch once, filter in memory.
~~~

### 16 · One home — never open a second file

This file is the ONLY place that carries reply-format rules.
Never create, open, or write another file about how replies are written — not a
memory file, not a note, not a plan, not a scratch doc.
A format lesson learned mid-conversation is added HERE, in place.

<!-- why -->
A second home means the rules drift, duplicate, and sit somewhere the owner
cannot see or edit.
<!-- /why -->

~~~
That rule is already rule 6 here.
Nothing to record — I broke a rule that exists.
~~~

### 17 · Never a long dash

Never write a dash longer than a hyphen: not `—`, not `–`, not a `--` pair.
Use a comma, a period, a colon, or a new line instead.
This covers every text you write: replies, docs, commit messages, product copy.
The `----` divider is layout, not punctuation, so it stays.
A single hyphen inside a compound word (`build-time`) is untouched.

<!-- why -->
Two thoughts joined by a long dash are two sentences, which rules 5 and 6
already demand; the dash mostly hides a chain this file bans elsewhere. Text
already written is not retro-edited; the rule is forward-looking until the
owner asks for a sweep.
<!-- /why -->

~~~
Never:
The redirect map is live — all 16 old links land correctly.

Instead:
The redirect map is live.
All 16 old links land correctly.
~~~

---

Replies shaped by this file are for one reader's eye.
No tooling ever parses one back, so every format choice serves scanning, nothing
else.
