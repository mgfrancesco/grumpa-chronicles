"""Draws art/scenes/samnite-campaign.svg: the Samnite campaign map, from the Caudine Forks to Sora and Lautulae.

Extends tools/maps/caudium_strategic.py (same style, same sources) westward to Sora,
Lautulae and Tarracina. The engine places tappable markers over this map by projecting
lon/lat with the same bounds, so BOUNDS here must match "maps.samnium.bounds" in
content/index.json.

Coastline: Natural Earth 10 m land (public domain), fetched from GitHub.
Ancient sites: Pleiades gazetteer representative points (CC BY), ids in PLACES.
Plistica (Pleiades 438810, "Plistia") has no coordinates in Pleiades; it is drawn only
as an unlocated label near Saticula, never as a point.
Run: python3 tools/maps/samnite_campaign.py /path/to/ne_10m_land.geojson
"""
import json, math, sys
from shapely.geometry import shape, box, Point
from shapely.ops import unary_union

LON0, LON1, LAT0, LAT1 = 13.05, 15.55, 40.72, 41.85   # = maps.samnium.bounds
W = 760
KX = W / (LON1 - LON0)
KY = KX / math.cos(math.radians((LAT0 + LAT1) / 2))
H = round((LAT1 - LAT0) * KY)

def xy(lon, lat):
    return (lon - LON0) * KX, (LAT1 - lat) * KY

# Pleiades ids and representative points (data/gis/places.csv, isawnyu/pleiades.datasets)
PLACES = {
    'Capua': (432754, 14.250207, 41.086093),
    'Saticula': (433105, 14.501299, 41.090948),
    'Caudium': (432773, 14.636761, 41.062550),
    'Maleventum': (432721, 14.781161, 41.130437),
    'Luceria': (442640, 15.335475, 41.508648),
    'Allifae': (432658, 14.330592, 41.328486),
    'Sora': (433126, 13.613958, 41.720336),
    'Fundi': (432855, 13.427922, 41.357429),
    'Tarracina': (433143, 13.248850, 41.291169),
    'Lautulae': (432903, 13.264, 41.324),
    'Furculae Caudinae': (432856, 14.538246, 41.031362),
}

land = json.load(open(sys.argv[1]))
frame = box(LON0 - .5, LAT0 - .5, LON1 + .5, LAT1 + .5)
geoms = [shape(f['geometry']).intersection(frame) for f in land['features']]
geoms = unary_union([g for g in geoms if not g.is_empty]).simplify(0.004)

def ring_d(coords):
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in (xy(*c) for c in coords)) + 'Z'

polys = getattr(geoms, 'geoms', [geoms])
land_d = ' '.join(ring_d(p.exterior.coords) for p in polys if p.area > 0.0003)

def on_land(lon, lat):
    return geoms.contains(Point(lon, lat))

SEAS = {'MARE INFERVM': (13.7, 40.88)}  # the Adriatic lies north-east of this frame
for name, (lon, lat) in SEAS.items():
    assert not on_land(lon, lat), name

INK, RED, OCHRE, SEA, LAND = '#3a2a1e', '#9b2d20', '#b98a3e', '#d9ddd2', '#f1e7cf'

def mountain(lon, lat, s=1.0):
    x, y = xy(lon, lat)
    w, h = 13 * s, 10 * s
    return f'<path d="M{x-w/2:.1f} {y+h/2:.1f}L{x:.1f} {y-h/2:.1f}L{x+w/2:.1f} {y+h/2:.1f}" fill="#e3d2ad" stroke="{OCHRE}" stroke-width="1.2"/>'

# Decorative mountain clusters (not a survey).
clusters = [(13.95, 41.55), (14.3, 41.62), (14.85, 41.45), (15.05, 41.3), (13.45, 41.5), (14.15, 41.3)]
glyphs = []
for lon, lat in clusters:
    for dlon, dlat in ((0, 0), (0.07, 0.025), (-0.06, 0.03)):
        if on_land(lon + dlon, lat + dlat):
            glyphs.append(mountain(lon + dlon, lat + dlat, 1.1))

def town(name, dx=9, dy=-8, anchor='start', size=21, fill=INK):
    _, lon, lat = PLACES[name]
    x, y = xy(lon, lat)
    return (f'<g><rect x="{x-5:.1f}" y="{y-9:.1f}" width="4" height="9" fill="{RED}"/><rect x="{x+1:.1f}" y="{y-9:.1f}" width="4" height="9" fill="{RED}"/>'
            f'<rect x="{x-6:.1f}" y="{y-1:.1f}" width="12" height="3" fill="{INK}"/>'
            f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" text-anchor="{anchor}" font-size="{size}" font-weight="600" fill="{fill}">{name}</text></g>')

def cross(name, dx, dy, anchor, text):
    _, lon, lat = PLACES[name]
    x, y = xy(lon, lat)
    return (f'<g><path d="M{x-6:.1f} {y-6:.1f}L{x+6:.1f} {y+6:.1f}M{x+6:.1f} {y-6:.1f}L{x-6:.1f} {y+6:.1f}" stroke="{RED}" stroke-width="3"/>'
            f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" text-anchor="{anchor}" font-size="21" font-weight="600" fill="{RED}">{text}</text></g>')

def label(lon, lat, text, size=19, style='italic', fill=INK, anchor='middle', spacing='.18em'):
    x, y = xy(lon, lat)
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-size="{size}" font-style="{style}" letter-spacing="{spacing}" fill="{fill}">{text}</text>'

# Plistica: unlocated. A dashed box with a dashed leader towards Saticula, never a point.
sx, sy = xy(*PLACES['Saticula'][1:])
PLISTICA_BOX = (13.86, 41.47)   # label position only; Plistica has no known site
px, py = xy(*PLISTICA_BOX)
plistica = (f'<g><path d="M{px+60:.1f} {py+14:.1f}L{sx-4:.1f} {sy-16:.1f}" stroke="{INK}" stroke-width="1.5" stroke-dasharray="5 5" fill="none"/>'
            f'<rect x="{px-72:.1f}" y="{py-24:.1f}" width="210" height="52" rx="8" fill="{LAND}" stroke="{INK}" stroke-width="1.5" stroke-dasharray="6 4"/>'
            f'<text x="{px+33:.1f}" y="{py-2:.1f}" text-anchor="middle" font-size="20" font-weight="600" fill="{INK}">Plistica</text>'
            f'<text x="{px+33:.1f}" y="{py+19:.1f}" text-anchor="middle" font-size="17" font-style="italic" fill="{INK}">site unknown, near Saticula</text></g>')

km50 = 50 / 111 * KY
bx, by = W - 30 - round(km50), H - 22

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Iowan Old Style, Palatino, Georgia, serif" role="img" aria-label="Map of the Samnite campaign: Sora, Lautulae and Tarracina in the west; Capua, Saticula, Caudium and the Caudine Forks in the centre; Luceria in Apulia">
<rect width="{W}" height="{H}" fill="{SEA}"/>
<path d="{land_d}" fill="{LAND}" stroke="#7a5a3a" stroke-width="1.3" fill-rule="evenodd"/>
{''.join(glyphs)}
{label(*SEAS['MARE INFERVM'], 'MARE INFERVM', 19)}
{label(14.62, 41.52, 'SAMNIVM', 25, 'normal', RED, spacing='.35em')}
{label(15.30, 41.36, 'APVLIA', 21, 'normal', RED, spacing='.3em')}
{label(14.45, 40.83, 'CAMPANIA', 20, 'normal', RED, spacing='.3em')}
{label(13.08, 41.78, 'LATIVM', 20, 'normal', RED, 'start', spacing='.3em')}
{plistica}
{town('Sora', 10, -6)}
{town('Tarracina', 2, 28, 'start')}
{cross('Lautulae', 22, -12, 'start', 'Lautulae')}
{town('Capua', -10, -6, 'end')}
{town('Saticula', 0, -16, 'middle')}
{town('Allifae', 22, -6)}
{town('Caudium', 10, 8, 'start')}
{town('Maleventum', 10, -8)}
{town('Luceria', -10, -6, 'end')}
{cross('Furculae Caudinae', 6, 38, 'middle', 'Furculae Caudinae')}
<g><path d="M{bx} {by}h{km50:.1f}" stroke="{INK}" stroke-width="2"/><path d="M{bx} {by-5}v10M{bx+km50:.1f} {by-5}v10" stroke="{INK}" stroke-width="2"/>
<text x="{bx + km50/2:.1f}" y="{by-9}" text-anchor="middle" font-size="18" fill="{INK}">50 km</text></g>
</svg>'''
open('art/scenes/samnite-campaign.svg', 'w').write(svg)
print('wrote', W, H, 'bounds', [LON0, LON1, LAT0, LAT1])
print('plistica box centre %', round((px + 33) / W * 100, 1), round((py + 2) / H * 100, 1), 'size %', round(210 / W * 100, 1), round(52 / H * 100, 1))
