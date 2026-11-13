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
- `{"kind": "decision", "id", "prompt", "options": [<option>…]}` — Grumpa chooses; the chosen option's consequence is shown, and the choice is saved.
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

`quote` is optional and is shown in Latin first, with English and Italian on tap.

### Option

```json
{
  "id": "release",
  "label": "What Grumpa can say, first person, short.",
  "kind": "historical | attested-advice | counterfactual",
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
