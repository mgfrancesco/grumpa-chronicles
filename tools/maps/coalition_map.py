"""Draws art/scenes/coalition-map.svg: central Italy from Samnium to Etruria and Umbria, 296-295 BC.

Modelled on tools/maps/samnite_campaign.py (same style, same sources). It shows only places
Livy names in 10.16-10.21 (296 BC) and, in grey lettering, three he names in the next year's
narrative (Clusium 10.25.11, ager Sentinas 10.27.1, Perusia 10.30.2), so the
Sentinum scene can reuse the map. Livy gives no route for the Samnite march to Etruria in 296,
and no place for the Etruscan council or the allied camp: no route is drawn, and the camp is a
labelled box, never a point. Murgantia, Romulea and Ferentinum have no known sites (Pleiades
438790, 438820/446286, 438734): one labelled box, never points.

Coastline: Natural Earth 10 m land (public domain).
Ancient sites: Pleiades gazetteer representative points (CC BY), ids in PLACES.
Run: python3 tools/maps/coalition_map.py /path/to/ne_10m_land.geojson
"""
import json, math, sys
from shapely.geometry import shape, box, Point
from shapely.ops import unary_union

LON0, LON1, LAT0, LAT1 = 10.75, 15.55, 40.85, 43.75
W = 760
KX = W / (LON1 - LON0)
KY = KX / math.cos(math.radians((LAT0 + LAT1) / 2))
H = round((LAT1 - LAT0) * KY)

def xy(lon, lat):
    return (lon - LON0) * KX, (LAT1 - lat) * KY

# Pleiades ids and representative points (data/gis/places.csv, isawnyu/pleiades.datasets)
PLACES = {
    'Roma': (423025, 12.491258, 41.889977),
    'Clusium': (413096, 11.947736, 43.016515),
    'Perusia': (413248, 12.389909, 43.111192),
    'Sentinum': (413312, 12.855963, 43.427013),
    'Cales': (432739, 14.132125, 41.199961),
    'Minturnae': (432940, 13.768418, 41.242153),
    'ager Falernus': (432828, 13.984144, 41.194485),
    'Volturnus': (433211, 14.203684, 41.288561),
}
# Region lettering is centred on the Pleiades representative points of the regions.
REGIONS = {
    'ETRVRIA': (413122, 11.533775, 42.673438),
    'VMBRIA': (413360, 12.630480, 42.915566),
    'SAMNIVM': (433078, 14.620402, 41.583415),
}

land = json.load(open(sys.argv[1]))
frame = box(LON0 - .5, LAT0 - .5, LON1 + .5, LAT1 + .5)
geoms = [shape(f['geometry']).intersection(frame) for f in land['features']]
geoms = unary_union([g for g in geoms if not g.is_empty]).simplify(0.006)

def ring_d(coords):
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in (xy(*c) for c in coords)) + 'Z'

polys = getattr(geoms, 'geoms', [geoms])
land_d = ' '.join(ring_d(p.exterior.coords) for p in polys if p.area > 0.0005)

def on_land(lon, lat):
    return geoms.contains(Point(lon, lat))

SEAS = {'MARE INFERVM': (11.75, 41.45), 'MARE SVPERVM': (14.55, 43.2)}
for name, (lon, lat) in SEAS.items():
    assert not on_land(lon, lat), name
for name, (_, lon, lat) in list(PLACES.items()) + list(REGIONS.items()):
    assert on_land(lon, lat), name

INK, RED, OCHRE, SEA, LAND, GREY = '#3a2a1e', '#9b2d20', '#b98a3e', '#d9ddd2', '#f1e7cf', '#6d5c4c'

def town(name, dx=9, dy=-8, anchor='start', size=21, fill=INK, mark=RED):
    _, lon, lat = PLACES[name]
    x, y = xy(lon, lat)
    return (f'<g><rect x="{x-5:.1f}" y="{y-9:.1f}" width="4" height="9" fill="{mark}"/><rect x="{x+1:.1f}" y="{y-9:.1f}" width="4" height="9" fill="{mark}"/>'
            f'<rect x="{x-6:.1f}" y="{y-1:.1f}" width="12" height="3" fill="{INK}"/>'
            f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" text-anchor="{anchor}" font-size="{size}" font-weight="600" fill="{fill}">{name}</text></g>')

def district(name, dx, dy, anchor):
    _, lon, lat = PLACES[name]
    x, y = xy(lon, lat)
    return (f'<g><circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="none" stroke="{INK}" stroke-width="1.8"/>'
            f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" text-anchor="{anchor}" font-size="19" font-style="italic" fill="{INK}">{name}</text></g>')

def label(lon, lat, text, size=19, style='italic', fill=INK, anchor='middle', spacing='.18em'):
    x, y = xy(lon, lat)
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-size="{size}" font-style="{style}" letter-spacing="{spacing}" fill="{fill}">{text}</text>'

def note_box(cx, cy, w, lines):
    h = 12 + 23 * len(lines)
    out = [f'<rect x="{cx-w/2:.1f}" y="{cy-h/2:.1f}" width="{w}" height="{h}" rx="8" fill="{LAND}" stroke="{INK}" stroke-width="1.5" stroke-dasharray="6 4"/>']
    for i, (t, bold) in enumerate(lines):
        out.append(f'<text x="{cx:.1f}" y="{cy-h/2+25+23*i:.1f}" text-anchor="middle" font-size="19" '
                   + ('font-weight="600"' if bold else 'font-style="italic"') + f' fill="{INK}">{t}</text>')
    return '<g>' + ''.join(out) + '</g>'

# Unlocated: label boxes only. Positions are label positions, not sites.
cx1, cy1 = xy(11.62, 43.38)
camp = note_box(cx1, cy1, 252, [('Etruscan council and', True), ('Samnite camp, 296', True), ('place not given', False)])
cx2, cy2 = xy(14.01, 41.95)
towns = note_box(cx2, cy2, 216, [('Murgantia, Romulea,', True), ('Ferentinum', True), ('sites unknown', False)])

vx, vy = xy(*PLACES['Volturnus'][1:])
km50 = 50 / 111 * KY
bx, by = 26, H - 22

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Iowan Old Style, Palatino, Georgia, serif" role="img" aria-label="Map of central Italy in 296 BC: Samnium in the south-east; Cales, the ager Falernus, the Volturnus and Minturnae near the west coast; Rome; Etruria and Umbria to the north, with Clusium, Perusia and Sentinum. The Samnite camp in Etruria and the towns Murgantia, Romulea and Ferentinum are labelled boxes without a site. No route is drawn.">
<rect width="{W}" height="{H}" fill="{SEA}"/>
<path d="{land_d}" fill="{LAND}" stroke="#7a5a3a" stroke-width="1.3" fill-rule="evenodd"/>
{label(*SEAS['MARE INFERVM'], 'MARE INFERVM', 19)}
{label(*SEAS['MARE SVPERVM'], 'MARE SVPERVM', 19)}
{label(REGIONS['ETRVRIA'][1], REGIONS['ETRVRIA'][2], 'ETRVRIA', 25, 'normal', RED, spacing='.25em')}
{label(REGIONS['VMBRIA'][1], REGIONS['VMBRIA'][2] - 0.27, 'VMBRIA', 23, 'normal', RED, spacing='.35em')}
{label(REGIONS['SAMNIVM'][1], REGIONS['SAMNIVM'][2], 'SAMNIVM', 25, 'normal', RED, spacing='.35em')}
{camp}
{towns}
{town('Roma', 12, 4, 'start', 23)}
{town('Clusium', -10, 22, 'end', 20, GREY, GREY)}
{town('Perusia', 6, 26, 'start', 20, GREY, GREY)}
{town('Sentinum', 12, -4, 'start', 20, GREY, GREY)}
{town('Minturnae', -10, -8, 'end')}
{town('Cales', 12, 2, 'start')}
{district('ager Falernus', 2, 28, 'start')}
<text x="{vx+10:.1f}" y="{vy-24:.1f}" text-anchor="start" font-size="19" font-style="italic" fill="{INK}">Volturnus fl.</text>
<g><path d="M{bx} {by}h{km50:.1f}" stroke="{INK}" stroke-width="2"/><path d="M{bx} {by-5}v10M{bx+km50:.1f} {by-5}v10" stroke="{INK}" stroke-width="2"/>
<text x="{bx + km50/2:.1f}" y="{by-9}" text-anchor="middle" font-size="19" fill="{INK}">50 km</text></g>
</svg>'''
open('art/scenes/coalition-map.svg', 'w').write(svg)
print('wrote', W, H, 'bounds', [LON0, LON1, LAT0, LAT1])
