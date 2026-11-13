"""Draws art/scenes/caudine-roads.svg: the two roads from Calatia to Luceria (Livy 9.2.6).

Coastline: Natural Earth 10 m land (public domain), fetched from GitHub.
Ancient sites: Pleiades gazetteer representative points (CC BY), ids in PLACES.
Run: python3 tools/maps/caudium_strategic.py /path/to/ne_10m_land.geojson
"""
import json, math, sys
from shapely.geometry import shape, box, Point
from shapely.ops import unary_union

LON0, LON1, LAT0, LAT1 = 13.55, 16.05, 40.72, 42.1
W = 760
KX = W / (LON1 - LON0)
KY = KX / math.cos(math.radians((LAT0 + LAT1) / 2))
H = round((LAT1 - LAT0) * KY)

def xy(lon, lat):
    return (lon - LON0) * KX, (LAT1 - lat) * KY

# Pleiades ids and representative points (data/gis/places.csv, isawnyu/pleiades.datasets)
PLACES = {
    'Capua': (432754, 14.250207, 41.086093),
    'Calatia': (432738, 14.356247, 41.044283),
    'Caudium': (432773, 14.636761, 41.062550),
    'Maleventum': (432721, 14.781161, 41.130437),  # renamed Beneventum later (Livy 9.27.14)
    'Luceria': (442640, 15.335475, 41.508648),
    'Furculae Caudinae': (432856, 14.538246, 41.031362),
}

land = json.load(open(sys.argv[1]))
frame = box(LON0 - .5, LAT0 - .5, LON1 + .5, LAT1 + .5)
geoms = [shape(f['geometry']).intersection(frame) for f in land['features']]
geoms = unary_union([g for g in geoms if not g.is_empty]).simplify(0.006)

def ring_d(coords):
    pts = [xy(x, y) for x, y in coords]
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'

polys = getattr(geoms, 'geoms', [geoms])
land_d = ' '.join(ring_d(p.exterior.coords) for p in polys if p.area > 0.0005)

def on_land(lon, lat):
    return geoms.contains(Point(lon, lat))

for name, lonlat in {'MARE INFERVM': (13.9, 40.8), 'MARE SVPERVM': (15.5, 42.05)}.items():
    assert not on_land(*lonlat), name

INK, RED, OCHRE, SEA, LAND = '#3a2a1e', '#9b2d20', '#b98a3e', '#d9ddd2', '#f1e7cf'

def mountain(lon, lat, s=1.0):
    x, y = xy(lon, lat)
    w, h = 13 * s, 10 * s
    return f'<path d="M{x-w/2:.1f} {y+h/2:.1f}L{x:.1f} {y-h/2:.1f}L{x+w/2:.1f} {y+h/2:.1f}" fill="#e3d2ad" stroke="{OCHRE}" stroke-width="1.2"/>'

# Decorative mountain clusters in the Samnite uplands (not a survey).
clusters = [(14.0, 41.75), (14.85, 41.62), (15.0, 41.5), (15.25, 41.0), (14.05, 41.45)]
glyphs = []
for lon, lat in clusters:
    for dlon, dlat in ((0, 0), (0.07, 0.025), (-0.06, 0.03)):
        if on_land(lon + dlon, lat + dlat):
            glyphs.append(mountain(lon + dlon, lat + dlat, 1.15))

def town(name, dx=8, dy=-8, anchor='start', size=23, weight='600'):
    pid, lon, lat = PLACES[name]
    x, y = xy(lon, lat)
    return (f'<g><rect x="{x-5:.1f}" y="{y-9:.1f}" width="4" height="9" fill="{RED}"/><rect x="{x+1:.1f}" y="{y-9:.1f}" width="4" height="9" fill="{RED}"/>'
            f'<rect x="{x-6:.1f}" y="{y-1:.1f}" width="12" height="3" fill="{INK}"/>'
            f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" text-anchor="{anchor}" font-size="{size}" font-weight="{weight}" fill="{INK}">{name}</text></g>')

def path(points, **kw):
    pts = [xy(*p) for p in points]
    d = 'M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    attrs = ' '.join(f'{k.replace("_", "-")}="{v}"' for k, v in kw.items())
    return f'<path d="{d}" fill="none" {attrs}/>'

P = {k: (v[1], v[2]) for k, v in PLACES.items()}
# Livy gives no waypoints after the Forks, so the onward road is only a direction arrow.
fl = P['Furculae Caudinae']; lu = P['Luceria']
onward = [(14.57, 41.12), (15.05, 41.40)]
march = [P['Calatia'], P['Furculae Caudinae']]

fx, fy = xy(*P['Furculae Caudinae'])
# km scale: 1 degree of latitude ~ 111 km
km50 = 50 / 111 * KY
sx, sy = W - 40 - round(50 / 111 * KY), H - 28

def label(lon, lat, text, size=13, style='italic', fill=INK, anchor='middle', spacing='.18em'):
    x, y = xy(lon, lat)
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-size="{size}" font-style="{style}" letter-spacing="{spacing}" fill="{fill}">{text}</text>'

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="Iowan Old Style, Palatino, Georgia, serif" role="img" aria-label="Map: Calatia, the Caudine Forks and Luceria in 321 BC">
<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="{RED}"/></marker></defs>
<rect width="{W}" height="{H}" fill="{SEA}"/>
<path d="{land_d}" fill="{LAND}" stroke="#7a5a3a" stroke-width="1.3" fill-rule="evenodd"/>
{''.join(glyphs)}
{label(13.76, 40.95, 'MARE', 19)}
{label(13.76, 40.95, 'INFERVM', 19).replace('y="', 'dy="24" y="')}
{label(15.5, 42.04, 'MARE SVPERVM', 20)}
{label(14.55, 41.55, 'SAMNIVM', 26, 'normal', RED, spacing='.35em')}
{label(15.7, 41.25, 'APVLIA', 23, 'normal', RED, spacing='.35em')}
{label(14.05, 41.22, 'CAMPANIA', 22, 'normal', RED, spacing='.3em')}
{path(onward, stroke=RED, stroke_width=3, stroke_dasharray='10 7', marker_end='url(#ar)')}
{path(march, stroke=RED, stroke_width=4)}
{town('Capua', -10, -6, 'end')}
{town('Calatia', -10, 24, 'end')}
{town('Caudium', 4, 30, 'start')}
{town('Maleventum', 8, -8)}
{town('Luceria', 8, -8)}
<g><circle cx="{fx:.1f}" cy="{fy:.1f}" r="11" fill="none" stroke="{RED}" stroke-width="2.5"/>
<path d="M{fx-6:.1f} {fy-6:.1f}L{fx+6:.1f} {fy+6:.1f}M{fx+6:.1f} {fy-6:.1f}L{fx-6:.1f} {fy+6:.1f}" stroke="{RED}" stroke-width="2.5"/>
<text x="{fx+14:.1f}" y="{fy+50:.1f}" text-anchor="middle" font-size="23" font-weight="600" fill="{RED}">Furculae Caudinae</text></g>
{label(15.2, 41.9, 'Livy\u2019s other road ran along this coast:', 19, 'italic', '#4a3d31', 'end', '0')}
{label(15.2, 41.9, 'longer, open, safer (9.2.6)', 19, 'italic', '#4a3d31', 'end', '0').replace('y="', 'dy="24" y="')}
{label(15.08, 41.34, 'the short road,', 21, 'italic', RED, 'start', '0')}
{label(15.08, 41.34, 'on to Luceria', 21, 'italic', RED, 'start', '0').replace('y="', 'dy="24" y="')}
<g><path d="M{sx} {sy}h{km50:.1f}" stroke="{INK}" stroke-width="2"/><path d="M{sx} {sy-5}v10M{sx+km50:.1f} {sy-5}v10" stroke="{INK}" stroke-width="2"/>
<text x="{sx + km50/2:.1f}" y="{sy-9}" text-anchor="middle" font-size="18" fill="{INK}">50 km</text></g>
</svg>'''
open('art/scenes/caudine-roads.svg', 'w').write(svg)
print('wrote', W, H)
