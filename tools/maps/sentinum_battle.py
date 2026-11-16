"""Draws art/scenes/sentinum-battle.svg: the battle in the ager Sentinas (295 BC) as Livy 10.27.8-10.29.16 tells it.
A diagram of his words in four panels, not a plan of the field. Ours: orientation, spacing, the place of the
Samnite camp (put behind the Gallic wing because the Samnites flee past the Gallic line to reach it, 10.29.11),
the order of the legions inside each wing, and which way round the horse rides.
Run: python3 tools/maps/sentinum_battle.py"""
import pathlib
R, S, G, INK, GREY = '#3a2a1e', '#9b2d20', '#2f6a5a', '#3a2a1e', '#5b5047'
o = []
def blk(x, y, c, w=38, h=16, rot=0, extra=''):
    t = f' transform="rotate({rot} {x+w/2} {y+h/2})"' if rot else ''
    o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}"{t}{extra}/>')
def dia(x, y, c, r=9):
    o.append(f'<path d="M{x} {y-r}L{x+r} {y}L{x} {y+r}L{x-r} {y}Z" fill="{c}"/>')
def txt(x, y, s, c=INK, a='start', size=21, it=False, b=False):
    o.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{c}" text-anchor="{a}"' + (' font-style="italic"' if it else '') + (' font-weight="bold"' if b else '') + f'>{s}</text>')
def arr(d, c, w=3, dash=''):
    m = {R: 'ai', S: 'ar', G: 'ag'}[c]
    o.append(f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{w}"' + (f' stroke-dasharray="{dash}"' if dash else '') + f' marker-end="url(#{m})"/>')
def camp(x, y, op=1):
    o.append(f'<g opacity="{op}"><rect x="{x}" y="{y}" width="76" height="40" fill="#f6efe0" stroke="{S}" stroke-width="2.5"/><path d="M{x} {y+20}h76M{x+38} {y}v40" stroke="{S}" stroke-width="1"/></g>')
def chariot(x, y):
    o.append(f'<g><rect x="{x-11}" y="{y-7}" width="22" height="11" fill="{G}"/><circle cx="{x-8}" cy="{y+7}" r="5" fill="#f1e7cf" stroke="{G}" stroke-width="2.5"/><circle cx="{x+8}" cy="{y+7}" r="5" fill="#f1e7cf" stroke="{G}" stroke-width="2.5"/></g>')
PH = 340
def panel(n, title, cite):
    y0 = 14 + (n - 1) * (PH + 52)
    o.append(f'<text x="14" y="{y0+22}" font-size="23" fill="{INK}" font-weight="bold">{n}. {title}</text>')
    o.append(f'<text x="746" y="{y0+22}" font-size="20" fill="{GREY}" text-anchor="end">{cite}</text>')
    o.append(f'<g transform="translate(0 {y0+34})">')
    o.append(f'<rect x="8" y="0" width="744" height="{PH}" rx="6" fill="#e3d2ad" stroke="#d9c08f" stroke-width="2"/>')
H = 14 + 4 * (PH + 52) + 20
o.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 {H}" font-family="Iowan Old Style, Palatino, Georgia, serif" role="img" aria-label="Diagram in four panels of the battle in the territory of Sentinum in 295 BC as Livy describes it">')
o.append('<defs>' + ''.join(f'<marker id="{i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{c}"/></marker>' for i, c in (('ai', R), ('ar', S), ('ag', G))) + '</defs>')
o.append(f'<rect width="760" height="{H}" fill="#f1e7cf"/>')
GX = [50, 98, 146, 194, 242, 290]      # the wing facing Decius
SX = [432, 480, 528, 576, 624, 672]    # the wing facing Fabius

# 1. The lines (10.27.8-11)
panel(1, 'The lines', 'Livy 10.27.8–11')
camp(40, 12); txt(128, 40, 'Samnite camp')
txt(189, 86, 'Gauls: right wing', G, 'middle'); txt(571, 86, 'Samnites: left wing', S, 'middle')
for x in GX: blk(x, 98, G)
for x in SX: blk(x, 98, S)
# the hind and the wolf between the lines (10.27.8-9)
o.append(f'<circle cx="380" cy="152" r="4" fill="{GREY}"/>')
o.append(f'<path d="M374 146 L340 122" fill="none" stroke="{GREY}" stroke-width="2.5" marker-end="url(#ai)"/>')
o.append(f'<path d="M380 160 V200" fill="none" stroke="{GREY}" stroke-width="2.5" marker-end="url(#ai)"/>')
txt(326, 158, 'cerva ad Gallos', GREY, 'end', 20, True); txt(396, 176, 'lupus ad Romanos', GREY, 'start', 20, True)
for x in GX + SX: blk(x, 206, R)
txt(117, 248, 'legio V', R, 'middle'); txt(261, 248, 'legio VI', R, 'middle')
txt(499, 248, 'legio I', R, 'middle'); txt(643, 248, 'legio III', R, 'middle')
for x in (470, 530, 590, 650): blk(x, 262, R, 30, 12)
txt(189, 290, 'Decius: left wing', R, 'middle'); txt(571, 300, 'Fabius: right wing,', R, 'middle'); txt(571, 324, 'reserves kept back', R, 'middle')
o.append('</g>')

# 2. The Roman left (10.28.6-18)
panel(2, 'Decius’ wing', 'Livy 10.28.6–18')
for i, x in enumerate([60, 108, 156, 204, 252, 300, 348, 396]): blk(x, 70, G)
# Gallic horse twice driven off (10.28.8)
for x, y in ((90, 34), (114, 30), (138, 36)): dia(x, y, G)
txt(160, 42, 'Gallic horse, twice driven off', G)
# Roman horse carried too far, in among the foot (10.28.8); chariots come on (10.28.9)
for x, y in ((150, 112), (176, 106), (202, 114), (228, 108)): dia(x, y, R)
for x, y in ((560, 86), (604, 100), (648, 82)): chariot(x, y)
arr('M540 100 H260', G, 3)
txt(730, 138, 'essedis carrisque', G, 'end', 21, True)
# the horse scatters and rides down its own front ranks (10.28.10-11)
arr('M160 124 Q150 160 120 186', R, 2.5, '8 6'); arr('M214 126 Q230 160 262 186', R, 2.5, '8 6')
for x, r in ((60, -14), (108, 10), (156, -8), (204, 16), (252, -12), (300, 6)): blk(x, 200, R, 38, 16, r)
blk(348, 200, R); blk(396, 200, R)
# Decius devotes himself and rides into the densest of the Gauls (10.28.13-18)
o.append(f'<circle cx="372" cy="170" r="14" fill="none" stroke="{R}" stroke-width="2.5"/>'); dia(372, 170, R)
arr('M372 154 V96', R, 3.5)
txt(396, 176, 'Decius, devotus', R)
txt(24, 252, 'The Roman horse is carried in among the foot; chariots', INK)
txt(24, 278, 'and wagons scatter it and it breaks its own front ranks.', INK)
txt(24, 304, 'Decius devotes himself and the enemy, rides where', INK)
txt(24, 330, 'the Gauls are thickest and is killed.', INK)
o.append('</g>')

# 3. The shield-wall; Fabius moves (10.29.5-11)
panel(3, 'The shield-wall; Fabius attacks', 'Livy 10.29.5–11')
camp(40, 12, 0.7)
# Gauls close-packed behind their shields (10.29.6)
o.append(f'<rect x="96" y="112" width="216" height="40" fill="{G}" stroke="{INK}" stroke-width="3"/>')
txt(204, 104, 'testudo', G, 'middle', 21, True)
for x in (110, 150, 190, 230, 270, 300): arr(f'M{x} 198 V160', R, 1.8)
for x in GX: blk(x, 204, R)
txt(24, 248, 'pila gathered up and thrown', R)
# Scipio and Marcius with reserves from the rear line (10.29.5)
arr('M500 264 Q410 276 336 236', R, 3)
txt(24, 300, 'Scipio and Marcius bring reserves', R); txt(24, 326, 'from the rear line', R)
# Fabius: horse round to the Samnite flank, then the legions (10.29.9-10)
for x in SX: blk(x, 204, R)
for x, y in ((716, 190), (728, 166), (734, 140)): dia(x, y, R)
arr('M730 124 Q726 108 706 104', R, 2.5)
arr('M500 198 V150', R, 3); arr('M640 198 V150', R, 3)
for x, r in ((440, -16), (500, 12), (560, -10), (620, 18), (668, -8)): blk(x, 112, S, 38, 16, r)
# the Samnites flee past the Gallic line to the camp (10.29.11)
arr('M520 100 Q360 40 126 36', S, 3.5, '10 6')
txt(736, 60, 'Samnites flee past the', S, 'end'); txt(736, 84, 'Gallic line to the camp', S, 'end')
txt(736, 300, 'Fabius: horse to the flank,', R, 'end'); txt(736, 326, 'then legions and reserves', R, 'end')
o.append('</g>')

# 4. The end (10.29.12-16)
panel(4, 'The camp and the Gallic rear', 'Livy 10.29.12–16')
camp(40, 16)
for x, y, r in ((128, 14, -18), (134, 40, 12), (176, 22, -8), (182, 50, 20)): blk(x, y, S, 34, 14, r)
o.append(f'<path d="M124 62l14 14M138 62l-14 14" stroke="{INK}" stroke-width="3.5"/>')
txt(40, 100, 'Gellius Egnatius falls', S); txt(40, 124, 'under the rampart', S)
o.append(f'<rect x="300" y="150" width="216" height="40" fill="{G}" stroke="{INK}" stroke-width="3"/>')
txt(288, 178, 'Gauls', G, 'end')
for x in (300, 348, 396, 444): blk(x, 222, R)
# Fabius to the Samnite camp (10.29.14)
arr('M700 150 Q560 14 232 34', R, 3.5)
txt(736, 44, 'Fabius to the camp', R, 'end')
# Campanian horse round to the Gallic rear; principes of the third legion follow (10.29.12-13)
for x, y in ((566, 132), (584, 150), (602, 168)): dia(x, y, R)
arr('M556 122 Q520 108 470 140', R, 3)
for x in (620, 664): blk(x, 196, R, 34, 14)
arr('M636 190 Q630 150 600 138', R, 2.5, '8 6')
txt(736, 268, 'Campanian horse, about 500', R, 'end'); txt(736, 292, '(Livy’s figure), round to the rear;', GREY, 'end', 20)
txt(736, 318, 'principes of legio III follow', R, 'end')
txt(24, 300, 'Camp taken; the Gauls', INK); txt(24, 326, 'surrounded from behind', INK)
o.append('</g>')
o.append(f'<text x="380" y="{H-10}" font-size="18" fill="{GREY}" text-anchor="middle" font-style="italic">A diagram of Livy 10.27.8–10.29.16, not a plan of the field.</text>')
o.append('</svg>')
out = pathlib.Path(__file__).resolve().parent.parent.parent / 'art' / 'scenes' / 'sentinum-battle.svg'
out.write_text('\n'.join(o) + '\n', encoding='utf8'); print(out)
