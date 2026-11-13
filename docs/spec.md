# Grumpa's Chronicle — Game Spec

Snapshot of the live spec doc (https://claude.ai/artifact/BTNqyAKZptzJzAHxbq3R6X) as of 13 Nov 2026. If the two disagree, the live doc wins; update this file when it changes.

## Concept

Grumpa's Chronicle is a lightweight phone and computer game in which Grumpa travels through the ancient and pre-modern world as an elder adviser, makes the calls that commanders, magistrates and merchants actually faced, and is then shown what happened and what the evidence says. Between those turning points he can also wander a city on a given day or excavate a real site.

The design problem is unusual: the player knows more than nearly any game designer would. A trivia game would bore him in ten minutes, and a single fabricated detail will be caught and will cost the game its credibility. The game rests on three commitments.

1. Assume the canon, teach the margin. Livy, Polybius, Caesar, Thucydides, Herodotus, Plutarch and Tacitus are taken as known. New material comes from inscriptions, papyri, coins, excavation since roughly 2000, scientific methods (isotopes, ice cores, CT scanning) and live scholarly disputes.
2. Decisions before answers. Most scenes put Grumpa at a real decision point under the constraints of the moment, then reveal the outcome and the sources. Learning arrives as the consequence of a choice, which suits a player who would rather argue with the material than be lectured by it.
3. Every claim carries its source. Each fact links to an ancient author by book and chapter, an inscription or papyrus by corpus number, or a named modern study. Where scholars disagree, the game shows the positions rather than silently picking one.

Lightweight means no reflex mechanics, no timers, turn-based play and sessions of 10 to 20 minutes on an iPhone or a computer. Rich means dense content and careful illustration; the engine stays simple.

## Grumpa as protagonist

Grumpa enters each era as an elder whose age is an asset. The ancient world built institutions around old men's counsel, and the game uses them as his seat at the table.

| Wing | Grumpa's role | Why it fits |
| --- | --- | --- |
| Roman Republic | Consular senator in the consilium of a magistrate | No upper age limit; Cato the Elder was still prosecuting and speaking in his 80s |
| Samnites | Elder of the touto advising the meddíss túvtíks | The Samnite chief magistrate; Herennius Pontius plays this part at the Caudine Forks (Livy 9.3) |
| Roman Empire | Amicus principis or provincial legate | The emperor's council of friends; Pliny's letters to Trajan as template |
| Greece | Member of the Spartan gerousia, or an Athenian bouleutes | The gerousia was 28 men over 60 plus the two kings (Plutarch, Lycurgus 26) |
| Egypt | Senior scribe of the treasury or of the Place of Truth at Deir el-Medina | Scribes held the records, rations and accounts |
| Middle Ages | Abbey librarian, or adviser to the Commune of Rome after 1144 | Keeps the Roman thread running through the medieval wing |
| Renaissance | Medici bank auditor or humanist adviser | Bridges economics and the recovery of classical texts |

His look follows the Lucia's-game character, drawn in a more refined illustrative style: white hair parted to the side, glasses, hook nose, and a solid, blocky build, squarer and less round than his Lucia's-game avatar. Each wing dresses him correctly for his rank and date (a toga with the senatorial latus clavus and black calcei senatorii in the Republic; a plain tribon cloak at Sparta; a red Florentine lucco in the Renaissance), so his wardrobe becomes a teaching surface.

Voice: characters treat him as the most learned man in the room, and some of them argue with him. Generals, merchants and scribes push back from their own interests, which gives him something to reason against. Narration is dry and precise, never cute.

Family threads stay light and optional. Noni can appear in the hub; Lucia can leave a drawing on his desk after each completed campaign. One Easter egg ties back to Lucia's game: the magic meatballs become a real Roman recipe, isicia omentata from Apicius (2.1), which he can unlock in the Codex.

## Structure

The home screen is Grumpa's study, and every path into the game starts there: an era from the shelf, a theme from the lens rack, or a place on the map table. Some days he will want the Samnite Wars end to end, other days he will want to trace the shield from the hoplite aspis to the scutum to the kite shield.

Each wing holds two to four campaigns, plus Wander (a day in one of its cities), Excavate (a field season at one of its sites), a Codex of reference cards, an Armory and wardrobe, and the Daily Dig. Lenses hold no content of their own; they filter every wing's scenes and cards by theme and add a cross-era timeline for that theme, such as money from aes rude to the Venetian ducat.

Wings: Roman Republic; Samnites and Italic peoples; Roman Empire; Greece; Egypt; Late Antiquity and Byzantium; Middle Ages; Renaissance. Lenses: War and strategy; Arms and armour; Dress; Technology; Economics.

Progression is gentle. Finishing a scene earns a laurel and unlocks its Codex cards. A poor decision plays out its consequences and can be replayed; there is no game-over screen. The Notebook keeps every card he flags as new to him, every dispute he logs, and his own annotations, and exports to PDF.

Later wings worth considering: Carthage and the Punic world, the Etruscans and regal Rome, Persia and the Near East.

## Gameplay modes

Eight modes share one content library. The Consilium carries most of the play; the others give variety and serve the lenses.

### The Consilium (decision scenes)

A dated situation is briefed in the voices of the participants: forces, supply, politics, religion, what is and is not known. Grumpa picks from three or four options, one of them the historical choice, and can add a reasoned note. He then sees the consequence (clearly labelled as counterfactual if he diverged), then What happened with sources, then The deeper cut: one or two specialist facts he is unlikely to know. Scoring rewards reasoning from what contemporaries could know, never hindsight or matching history.

Example: the Caudine Forks, 321 BC. Grumpa plays Herennius Pontius, summoned by his son Gavius after the Roman army is trapped. Livy (9.3) has him advise either releasing the Romans unharmed or killing them all, and warn that any middle course is the worst. The Samnites chose the middle course, the yoke, and Rome repudiated the sponsio (Livy 9.8–11).

### Field Command (battles)

Turn-based, one screen, 8 to 20 units on a grid, no micromanagement. Units carry historically grounded traits: a single pilum volley before contact, triarii held as a last reserve, a phalanx strong frontally and brittle on its flanks (Polybius 18.28–32), Numidian horse that skirmishes and refuses shock. Afterwards a toggle overlays the historical deployment and a panel sets out where the sources disagree. Candidates: Kadesh, Gaugamela, Sentinum, Cannae, Cynoscephalae, Pydna, Alesia (siege variant), Adrianople, Hastings, Courtrai.

### The Forum (economics)

Small simulations with real parameters and visible assumptions. Grumpa moves a policy lever, sees a modelled response, then sees the documentary record. Given his economics doctorate, each model shows its equations and calibration in an expandable panel. Candidates:

- Debase the coinage: set the silver content of the denarius or antoninianus and watch hoarding, prices and seigniorage, calibrated to assay data.
- Diocletian's Price Edict (301) as a binding ceiling; Lactantius (De Mortibus Persecutorum 7) reports goods vanishing from sale and blood shed over trifles.
- The grain dole: from Gaius Gracchus' subsidised price (123 BC) to Clodius' free grain (58 BC), with fiscal cost and the rise in recipients.
- Tax farming in Asia as a principal-agent problem after the lex Sempronia gave the publicani its tithe.
- Ration arrears and the workers' strike at Deir el-Medina under Ramesses III (Turin Strike Papyrus).
- Florentine bills of exchange as a way to earn interest without breaching the usury ban.

### Wander (a day in the city)

Grumpa arrives in a city on a fixed date and spends the day there: illustrated places joined on a map, people to talk to, things to buy, details to notice; tapping any detail opens its Codex card. First city: Rome, 15 March 44 BC. Later days: Pompeii in autumn 79; Hadrian's Rome in 125; Athens in 431; Alexandria under Ptolemy II; Florence in 1478. Built from the Severan Marble Plan, Lanciani's Forma Urbis Romae and Carandini's Atlante di Roma antica; prices from documents such as CIL IV 1679.

### Excavate (a field season)

A real site and a season to dig it: open trenches, take layers down in order, record finds, date them as an archaeologist would (stratigraphy and a Harris matrix, coin terminus post quem, Dressel's amphora typology, sigillata stamps, tree rings), and decide what a layer means before the published interpretation is revealed. Sites: Pompeii (down through the Sullan colony of 80 BC into the Samnite town), Pietrabbondante, Vindolanda, Kalkriese, Sant'Omobono, Monte Testaccio, Deir el-Medina, Wadi al-Jarf.

### Armory and wardrobe

Dress-up with teeth. Prompts such as "equip a hastatus at Zama, 202 BC" or "dress a senator attending the Senate in mourning". Anachronisms are flagged with an explanation and the find that dates the item. A reverse mode shows a figure and asks him to date it from the kit alone.

### The Source Desk

Puzzles built on primary evidence, some arising from Excavate: restore the gaps in an inscription, read a coin legend in Oscan script, place a papyrus fragment, find the interpolation. Latin is shown untranslated by default, with English or Italian on tap; Greek and Oscan come with a translation.

### Daily Dig

One artifact a day with a five-minute question and a streak counter.

## Content depth standard

Every scene must carry at least one specialist or frontier fact, and every claim must be checkable.

| Tier | Covers | Examples | Target share |
| --- | --- | --- | --- |
| 1 Canon | Narrative historians and famous events | Livy, Polybius, Caesar, Thucydides | ~20%, framing only |
| 2 Specialist | Inscriptions, coins, papyri, technical writers, major commentaries | ILS 2487; Vegetius; Frontinus; Oakley on Livy | ~50% |
| 3 Frontier | Excavation and science since ~2000; live debates | McConnell et al. 2018; Egadi rams; Seymour et al. 2023; Wadi al-Jarf | ~30% |

Rules for every card and scene:

1. No number or claim without a citation: ancient author with book and chapter, a corpus number, or a named modern study.
2. Each statement carries a confidence label: attested, inferred, reconstructed, or counterfactual.
3. Ancient figures are shown as ancient figures (Cannae: Polybius 3.117 vs Livy 22.49).
4. Live disputes are shown as named positions.
5. Grumpa can rule. Every card has knew it / new to me / I dispute this. A dispute is one tap plus a typed or dictated note, saved to his Notebook against that card and sent to Matthew; accepted corrections appear credited as Grumpa's ruling.

Calibration: difficulty by topic rises each time he marks knew it.

Reference spine: Oakley, Commentary on Livy VI–X; Walbank, Commentary on Polybius; Crawford, RRC; Salmon, Samnium and the Samnites; Scheidel, Morris and Saller (eds.), Cambridge Economic History of the Greco-Roman World; Temin, The Roman Market Economy; Bishop and Coulston, Roman Military Equipment; Sebesta and Bonfante (eds.), The World of Roman Costume; Oleson (ed.), Oxford Handbook of Engineering and Technology; Kemp, Ancient Egypt; de Roover, Medici Bank; Spufford, Money and Its Use in Medieval Europe. Online corpora: Perseus, EDCS, papyri.info, CRRO, Pleiades, ORBIS.

## Era wings (content seeds)

Seeds for the pipeline. Every item still goes through the checker before it ships.

- Roman Republic: Lapis Satricanus; the dictator years; lex Claudia of 218 (Livy 21.63); Morgantina and the denarius c. 211; Egadi rams; Asculum sling bullets (CIL IX 6086); the burials in the Forum Boarium after Cannae (Livy 22.57).
- Samnites: ver sacrum (Strabo 5.4.12); Pentri, Caraceni, Caudini, Hirpini; Pietrabbondante; the Agnone tablet; the Linen Legion (Livy 10.38); Samnite shields and the gladiator type (Livy 9.40); Sallust, Catiline 51.38; triple-disc cuirass and bronze belts; VITELIU coinage; the Colline Gate and Plutarch, Sulla 30.
- Roman Empire: Kalkriese and the VAR countermarks; Vindolanda 291 and 164; Hadrian at Lambaesis; Masada pay record; Monte Testaccio; the Muziris papyrus; the Dura-Europos scutum; Barbegal.
- Greece: Themistocles' naval bill (Ath. Pol. 22.7); Olympias; the kleroterion; Sphacteria (Thuc. 4.38); Antikythera; the sarissa.
- Egypt: Diary of Merer; the Egyptian-Hittite treaty; Turin Strike Papyrus; Tutankhamun's meteoritic dagger; the Tarkhan dress; Revenue Laws papyrus.
- Late Antiquity and Byzantium: the solidus; silkworms (Procopius, Wars 8.17); the Strategikon; Greek fire.
- Middle Ages: Charlemagne's £sd; the Commune of Rome and Cola di Rienzo; Visby; Courtrai and Lynn White; the Statute of Labourers; the commenda and the Champagne fairs.
- Renaissance: Poggio and Lucretius; the Laocoön; Brunelleschi's hoist; the Medici bank and Pacioli; Machiavelli on Ravenna; Bodin's Response to Malestroit.

## Lenses

| Lens | Thread | Signature feature | Anchor works |
| --- | --- | --- | --- |
| War and strategy | Logistics; command under uncertainty; siegecraft | Supply calculator (ORBIS; Polybius 6.39 ration) | Engels; Roth; Goldsworthy |
| Arms and armour | Shield, helmet and sword lineages | Rotatable plates with find spot and dating evidence | Bishop and Coulston; Connolly |
| Dress | Status in cloth, colour, footwear; sumptuary law | Wardrobe challenge | Sebesta and Bonfante; Croom |
| Technology | Water, concrete, mechanisms, mills, lifting | Interactive cutaways | Vitruvius; Frontinus; Hero; Oleson |
| Economics | Money, state finance, trade, real wages | Forum simulations; cross-era price and wage dataset | Finley; Temin; Scheidel, Morris and Saller; Spufford |

## Look, sound and readability

Each wing borrows its visual language from its own period's art: Pompeian fresco and Peutinger-style maps for Rome; Paestan tomb painting for the Samnites; red- and black-figure for Greece; tomb-painting registers for Egypt; mosaic and gold ground for Byzantium; illuminated manuscript for the Middle Ages; perspective drawing and intarsia for the Renaissance. Flat vector illustration. Sparse optional audio; restored pronunciation clips; text-to-speech narration available.

Readability rules: body text 20 px minimum with a size control to 28 px; serif for reading; high contrast; tap targets 48 px or more; no swipes, drags or double-taps; no timers; autosave after every choice; iPhone portrait and desktop browser both primary; Codex and citations open without losing his place.

## Architecture and content pipeline

Static web app on GitHub Pages, installable to his iPhone home screen as a progressive web app and playable in any desktop browser. Content is data, separate from the engine. Progress syncs between iPhone and computer; each device is tied to his save once by a private personal link, and he never logs in.

Pipeline per scene: research (draft from named sources) → independent verification by a fresh agent → Matthew's review → release; Grumpa's rulings feed back as corrections.

## Scope

Every era opens at launch, Rome deepest, and depth arrives in additions.

| Release | Campaigns | Battles | Wander and Excavate | Forum and other modes |
| --- | --- | --- | --- | --- |
| Launch | Samnites: Caudine Forks to Sentinum (7 scenes). Republic: the Second Punic War from the Senate (7). Empire: Varus and the German frontier (5). One ~5-scene campaign in each other era: Greece, Themistocles from Laurion to Salamis; Egypt, Kadesh and the treaty; Byzantium, Belisarius and the Gothic War in Italy; Middle Ages, the Commune of Rome to Cola di Rienzo; Renaissance, Machiavelli and the Florentine militia | Sentinum; Cannae | Wander Rome, 15 March 44 BC. Excavate Pompeii down to the Samnite town | Forum: Hannibalic-war cuts to the as and the denarius. Armory: Samnite warrior, Republican legionary, senator, Athenian hoplite. ~15 Source Desk puzzles, ~250 Codex cards, 60 days of Daily Dig |
| Addition 1: Rome and money | Republic: the Gracchi. Empire: the third-century crisis from the treasury | Pydna | Wander Pompeii, autumn 79. Excavate Vindolanda | Forum: debasement; Diocletian's Edict; the grain dole. Armory: imperial legionary, auxiliary |
| Addition 2: Italy and the wider world | Samnites: the Social War and the Colline Gate. Greece: Pylos and Sphacteria. Egypt: Deir el-Medina. Renaissance: the Medici bank | Gaugamela; Cynoscephalae | Wander Hadrian's Rome, 125. Excavate Pietrabbondante | Forum: Ptolemaic oil monopoly; Florentine bills of exchange. Armory: Macedonian phalangite, Egyptian chariot warrior |
| After that | Set by his play and his disputes | | | |

## Decisions from Matthew (13 Nov 2026)

- Device: iPhone and computer; no iPad.
- Languages: reads Latin, fluent Italian (first language), conversational French. Latin shown untranslated by default, English or Italian on tap.
- Depth: deepest in Rome, interested in everything.
- Feel: rich and accurate without feeling like study. Decision scenes at the centre; Wander and Excavate as additional modes. He has always wanted to do archaeology.
- Name and art: Grumpa, matured from the Lucia's-game avatar, blockier and less round.
- Disputes: whatever is easiest for him; one tap, saved and sent automatically.
- Timing: as soon as practical.
- Sync: personal link once per device; no login.
