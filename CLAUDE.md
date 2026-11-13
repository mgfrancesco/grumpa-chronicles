# Grumpa's Chronicle

A history game Matthew is building for his father, "Grumpa" (late 70s). Grumpa is the most knowledgeable person on Roman history Matthew knows, holds a PhD in economics, reads Latin, speaks Italian as his first language and some French. He plays on an iPhone and a computer. Full design: `docs/spec.md` (snapshot of the live spec doc linked at its top).

The one thing that matters most: **accuracy**. Grumpa will catch a fabricated or garbled detail immediately, and one such error costs the game its credibility. Every rule below serves that.

## How the repo is laid out

- `index.html`, `css/`, `js/` — the engine. Plain HTML, CSS and ES modules. No build step, no framework, no npm dependencies at runtime. GitHub Pages serves the repo root.
- `content/` — all game content as JSON. `content/index.json` lists wings, campaigns and scene files. Schema: `content/SCHEMA.md`.
- `art/` — SVG art (Grumpa portraits live in `js/art.js` as functions so outfits can vary).
- `tools/apps-script/` — the Google Apps Script that receives disputes and syncs saves. Setup: `docs/setup.md`.
- `.claude/agents/` — `researcher` drafts content; `checker` verifies it independently.

Run locally: `python3 -m http.server 8000` from the repo root, then open http://localhost:8000. Test at iPhone size (390×844) and desktop.

## Content rules (non-negotiable)

1. Every factual statement carries `cites`: an ancient author with book.chapter(.section), a corpus number (CIL, ILS, RRC, P.Oxy., Tab. Vindol.), or a named modern study with year. No citation, no claim.
2. Every statement carries a `confidence`: `attested` (a source says it), `inferred` (scholarly inference from sources), `reconstructed` (modern reconstruction), `counterfactual` (game invention, always labelled on screen).
3. Never invent a citation, inscription number, quotation, name or figure. If you cannot find it in a source you have actually opened, leave it out.
4. Ancient numbers are reported as ancient numbers ("Livy gives…"), and where sources disagree both are shown.
5. Scholarly disputes are shown as named positions, not resolved silently.
6. Latin quotations come from the Latin text, checked against Perseus (the PerseusDL `canonical-latinLit` repo on GitHub is reachable from the shell; its OCR has errors such as `ranus` for `manus`, so correct obvious typos and say so in `verified.notes`). Every quotation carries an English and an Italian rendering. English: Roberts 1912 (public domain) for Livy, marked `"en_src": "Roberts 1912"`, or our own, marked `"ours"`. Italian is always our own, marked `"ours"`. Never paste a modern copyrighted translation.
7. Nothing ships with `"status": "draft"`. A scene becomes `"checked"` only after the `checker` agent has verified every cite against a source it opened, and its findings are fixed. Record the check in `verified`.
8. Each scene needs at least one Tier 2 or Tier 3 fact (see spec, Content depth standard).

## Writing style

- Dry, precise, plain prose. Short sentences. Grumpa is treated as the most learned man in the room.
- Latin terms he would know stay in Latin without gloss (sponsio, fetiales, consilium).
- No "it's not X, it's Y" constructions. No exclamation marks. No cute narration.
- Counterfactual consequences are short, plausible, and say plainly that no source tests them.

## Workflow for new content

1. `researcher` agent drafts the scene or card set into `content/` with status `draft`, saving the source text it used under `sources/` notes in its report.
2. `checker` agent (fresh context, did not write it) verifies every claim and quotation and returns a list of failures.
3. Fix or cut every failure, then have the checker re-verify the changed blocks. Set `status: "checked"`, fill `verified`, and run `python3 tools/validate.py` (must pass).
4. Matthew reviews in the browser, then commits and pushes. Do not push without Matthew's say-so.

## Grumpa's disputes

Disputes arrive in Matthew's Google Sheet (see `docs/setup.md`). To process them: for each, find the card or scene by id, check the dispute against sources, and propose one of three outcomes to Matthew: (a) Grumpa is right, so correct the content and add `"ruling": {"by": "Grumpa", "date": …, "note": …}`; (b) genuine scholarly disagreement, so add his view as a named position; (c) sources are against him, so keep the content and draft a short note explaining why. Matthew decides.

## Art

Grumpa: white hair parted to the side, round dark-framed glasses, hook nose, fair skin, solid blocky build (squarer and less round than his avatar in Lucia's game, `mgfrancesco/lucia-adventures`). Dressed correctly for each wing and rank. Flat vector style in each wing's period idiom (see spec).

## Readability (hard rules)

Body text ≥ 20 px with a size control to 28 px; serif for reading; high contrast; tap targets ≥ 48 px; no swipes, drags, double-taps or timers; autosave after every choice.
