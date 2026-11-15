# Content schema

All content is JSON under `content/`. The engine reads `content/index.json`, then each scene file it lists.

## index.json

```json
{
  "wings": [
    {
      "id": "samnites",
      "title": "Samnites and Italic peoples",
      "dates": "c. 600–82 BC",
      "blurb": "One line for the shelf.",
      "palette": "samnite",
      "campaigns": [
        {
          "id": "caudium-sentinum",
          "title": "From the Caudine Forks to Sentinum",
          "release": "launch",
          "scenes": [
            { "id": "samnites-01-caudine-forks", "file": "scenes/samnites/caudine-forks.json", "title": "The Caudine Forks", "date": "321–320 BC" },
            { "id": "samnites-02-…", "title": "…", "planned": true }
          ]
        }
      ]
    }
  ],
  "lenses": [{ "id": "war", "title": "War and strategy" }]
}
```

A scene with `"planned": true` and no `file` shows as "in preparation".

Maps that the engine draws tappable places on are listed once under `maps`, with the same bounds the drawing script used (`[lon0, lon1, lat0, lat1]`, equirectangular, as in `tools/maps/*.py`):

```json
"maps": { "samnium": { "src": "art/scenes/samnite-campaign.svg", "bounds": [13.05, 15.55, 40.72, 41.85], "alt": "…", "credit": "Pleiades ids, coastline source" } }
```

A campaign with `"map": "samnium"` gets a campaign screen (`#/campaign/<id>`): the map with a marker for each scene that has a `site` (`{"label", "lon", "lat", "pleiades"}`, lit when the scene is finished), the scene list, and the record of Grumpa's counsel beside each decision's `outcome`.

## Scene file

```json
{
  "id": "samnites-01-caudine-forks",
  "wing": "samnites",
  "campaign": "caudium-sentinum",
  "title": "The Caudine Forks",
  "place": "Samnium",
  "date": "321–320 BC",
  "role": "Herennius Pontius",
  "outfit": "samnite-elder",
  "lenses": ["war", "law"],
  "status": "draft | checked",
  "verified": { "by": "checker agent", "date": "YYYY-MM-DD", "notes": "…" },
  "sources": { "Livy": { "label": "Livy, Ab urbe condita (Perseus)", "url": "…" } },

  "steps": [ <step>, … ],
  "cards": [ <card>, … ]
}
```

### Steps

Played in order. Kinds:

- `{"kind": "brief", "id", "speaker", "blocks": [<block>…]}` — narration or a character speaking.
- `{"kind": "decision", "id", "prompt", "options": [<option>…], "outcome": <block>, "map"?: {…}}` — Grumpa chooses; the chosen option's consequence is shown, and the choice is saved. `outcome` is one short block saying what was actually done; the campaign screen shows it beside his counsel. Optional `map` makes the decision answerable from a map: `{"id": "samnium", "places": [{"id", "label", "lon", "lat", "pleiades"}…], "caption": <block>}`; each option with a `place` is shown when that place is tapped. A place with no known site has no lon/lat: give `"unlocated": true`, the position of its drawn label box as `"at": [x%, y%]` and its size as `"box": [w%, h%]`, and never draw it as a point.
- `{"kind": "reveal", "id", "title", "blocks": [<block>…]}` — what happened, with sources.
- `{"kind": "cards", "id", "title", "cards": ["card-id", …]}` — the deeper cut; these cards unlock in the Codex.

### Block

```json
{
  "id": "unique-within-scene",
  "text": "Plain prose. No HTML.",
  "cites": ["Livy 9.3.6"],
  "confidence": "attested | inferred | reconstructed | counterfactual",
  "quote": { "la": "Latin", "en": "English", "en_src": "Roberts 1912 | ours", "it": "Italiano", "it_src": "ours", "cite": "Livy 9.3.12" }
}
```

Only the Counterfactual tag shows on the page; the confidence label, cites and `note` open from the small † after each passage.

`quote` is optional and is shown in the original first, with English and Italian on tap. The original goes in `la`; for Greek add `"lang": "grc"`.

`figure` is optional; the block's `text` becomes its caption, and the caption's `cites` and `confidence` cover what the picture shows.

```json
"figure": {
  "kind": "drawing | map | photo",
  "src": "art/scenes/caudine-roads.svg  (or a Wikimedia Commons Special:FilePath URL for photos)",
  "alt": "What the picture shows, for screen readers.",
  "credit": "Required for anything not drawn by us: author, licence, source.",
  "credit_url": "The file's licence page."
}
```

Drawings and maps live in `art/` as SVG; keep labels at 19 px or more in a 760-wide viewBox so they stay readable on a phone. Photos must be public domain or openly licensed (CC0, CC BY, CC BY-SA), with the licence confirmed on the file page and credited in `credit`. Maps take ancient site positions from Pleiades (`isawnyu/pleiades.datasets` on GitHub, `data/gis/places.csv`) and cite the Pleiades ids.

### Option

```json
{
  "id": "release",
  "label": "What Grumpa can say, first person, short.",
  "kind": "historical | attested-advice | counterfactual",
  "place": "optional: the id of a place on the decision's map",
  "kind_note": "Shown after choosing, e.g. 'Herennius's first answer (Livy 9.3.6)'.",
  "consequence": [<block>…]
}
```

### Card

```json
{
  "id": "card-sponsio-foedus",
  "title": "Sponsio, not foedus",
  "tier": 1 | 2 | 3,
  "lens": "law",
  "blocks": [<block>…],
  "ruling": { "by": "Grumpa", "date": "…", "note": "…" }
}
```

Every block that states a fact needs `cites` and `confidence`. Card and block ids are what Grumpa's "knew it / new to me / dispute" taps refer to, so never reuse or renumber an id once shipped.
