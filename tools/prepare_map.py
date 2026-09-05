"""Project the Census ACS2024 1:5M Oklahoma boundary into the inline SVG."""
import json
import math
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
data = json.loads((root / 'docs/oklahoma-boundary.geojson').read_text())
geometry = data['features'][0]['geometry']
assert data['features'][0]['properties']['NAME'] == 'Oklahoma'
rings = geometry['coordinates'] if geometry['type'] == 'Polygon' else [r for p in geometry['coordinates'] for r in p]
cosine = math.cos(math.radians(36))
points = [(lon * cosine, -lat) for ring in rings for lon, lat in ring]
left, right = min(p[0] for p in points), max(p[0] for p in points)
top, bottom = min(p[1] for p in points), max(p[1] for p in points)
scale = min(560 / (right-left), 270 / (bottom-top))
dx, dy = (620-(right-left)*scale)/2, (350-(bottom-top)*scale)/2
def project(lon, lat):
    return ((lon*cosine-left)*scale+dx, (-lat-top)*scale+dy)
path = ' '.join('M' + ' L'.join(f'{x:.2f},{y:.2f}' for x,y in [project(*p) for p in ring]) + ' Z' for ring in rings)
x,y = project(-97.058,36.116)
svg = f'''<svg viewBox="0 0 620 350" role="img" aria-label="Oklahoma state boundary with regional fieldwork markers and Stillwater">
                  <path d="{path}" fill="#fe5c00" fill-opacity=".20" stroke="#fe5c00" stroke-width="2" stroke-linejoin="round" />
                  <circle cx="{x:.2f}" cy="{y:.2f}" r="4" fill="#f5f0e6" />
                  <text x="{x+10:.2f}" y="{y+4:.2f}" fill="#f5f0e6" font-size="12">Stillwater</text>
                </svg>'''
html_path = root / 'index.html'
html = html_path.read_text(encoding='utf-8')
start = html.index('<svg', html.index('<div class="oklahoma-map">'))
end = html.index('</svg>',start)+6
html = html[:start]+svg+html[end:]
html = html.replace('↗ N', '↑ N').replace('Regional overview; routes and marker positions are schematic.', 'U.S. Census state boundary · markers show approximate regions.')
html_path.write_text(html,encoding='utf-8')
css_path=root/'styles/main.css'
css=css_path.read_text()
for name,lon,lat in [('panhandle',-101.6,36.75),('caddo',-98.45,35.15),('altus',-99.33,34.64)]:
    x,y=project(lon,lat)
    css=re.sub(r'\.pin-'+name+r' \{[^}]*\}',f'.pin-{name} {{\n  left: {100*x/620:.3f}%;\n  top: {100*y/350:.3f}%;\n}}',css)
css_path.write_text(css)
