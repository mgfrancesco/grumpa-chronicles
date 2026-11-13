# Setup: disputes inbox, sync, and Grumpa's devices

The game works without any of this; progress then stays on each device and disputes stay in Grumpa's Notebook. These steps turn on two things: his disputes land in a Google Sheet you can read, and his progress follows him between iPhone and computer.

## 1. The Google Sheet and script (about 10 minutes, once)

1. Create a Google Sheet, e.g. "Grumpa's Chronicle — inbox".
2. In the sheet: Extensions → Apps Script. Delete the sample code and paste in `tools/apps-script/Code.gs`. Save.
3. Project Settings (gear icon) → Script properties → Add property. Name: `KEYS`. Value: Grumpa's personal key, a long random string (Claude can generate one; never commit it to the repo).
4. Deploy → New deployment → type: Web app. Execute as: Me. Who has access: Anyone. Deploy, authorize, and copy the web app URL (ends in `/exec`).
5. Put that URL in `js/config.js` as `endpoint`, commit and push (or ask Claude to).

The sheet will grow two tabs on first use: `Disputes` (one row per dispute or "new to me" mark) and `Saves` (his progress).

## 2. Grumpa's devices (once per device)

His personal link is the game's address with his key added:

`https://mgfrancesco.github.io/grumpa-chronicles/?key=HIS_KEY`

- iPhone: open the link in Safari, then Share → Add to Home Screen. Launch it from the home-screen icon from then on. (A home-screen app keeps its own storage, so add it from the link, not from the plain address.)
- Computer: open the link once in his usual browser and bookmark it.

Anyone holding the link can see and change his game progress, nothing else.

## 3. Processing disputes

Open a Claude Code session on this repo and paste the new rows from the `Disputes` tab. CLAUDE.md tells Claude how to check each one and propose a ruling for you to approve.
