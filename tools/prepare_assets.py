"""Create web-sized derivatives; never modify research originals.

Run with --field-root pointing to the 2026 Field Trips directory.
The manifest records source-relative paths and hashes for provenance.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--field-root', type=Path, required=True)
args = parser.parse_args()
out = ROOT / 'images' / 'fieldwork'
out.mkdir(parents=True, exist_ok=True)
sources = {
    'crs-installation': '2026_CRS/Photos/2026-06-15/All_Sensors_Overview_1.jpg',
    'crs-july': '2026_CRS/Photos/2026-07-30/Field_View_over_Truck.jpg',
    'canopy-sensor': '2026_CRS/Photos/2026-07-30/Only_Height_adjusted_sensor.jpg',
    'altus-installation': '2026_Altus/SWREC/Photos/2026-07-20/All_Sensors_overview.jpeg',
    'muller-field': '2026_Altus/Muller Merrit River/Photos/2026-06-30/View_From_truck.jpg',
    'panhandle-sorghum': '2026_Panhandle_PDS/B4_Frantz_Frantz/Photos/2026_Sorghum/2026-07-10/Field_Overview.jpg',
    'panhandle-sunflower': '2026_Panhandle_PDS/C2_Arthaud_Billy/Photos/2026_Sunflower/2026-07-10/Field_Overview.jpg',
    'panhandle-august-05': '2026_Panhandle_PDS/T7_Martinez_McMurray/Photos/2026_Corn/2026-08-05/Field_Overview.jpg',
    'panhandle-august-14': '2026_Panhandle_PDS/T8_Martinez_EMiller/Photos/2026_Corn/2026-08-14/Field_Overview.jpg',
    'panhandle-august-21': '2026_Panhandle_PDS/T1_Freeman_Freeman/Photos/2026_Corn/2026-08-21/Broken_Sensors_1.jpg',
}
for date in ['2026-06-15','2026-06-30','2026-07-08','2026-07-20','2026-07-30','2026-08-12','2026-08-19']:
    folder=args.field_root / '2026_CRS' / 'Photos' / date
    candidates=sorted([p for p in folder.iterdir() if p.suffix.lower() in ['.jpg','.jpeg'] and ('field' in p.stem.lower() or 'overview' in p.stem.lower())],key=lambda p:('field' not in p.stem.lower(),p.name))
    if candidates: sources['season-'+date]=candidates[0].relative_to(args.field_root).as_posix()
manifest_path = ROOT / 'docs/asset-provenance.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
for name, rel in sources.items():
    src=args.field_root / rel
    before=hashlib.sha256(src.read_bytes()).hexdigest()
    with Image.open(src) as original:
        im=ImageOps.exif_transpose(original).convert('RGB')
        im.thumbnail((1600,1200))
        im.save(out / (name+'.webp'),'WEBP',quality=82,method=6)
    assert before == hashlib.sha256(src.read_bytes()).hexdigest(), 'Source changed during read'
    asset = 'images/fieldwork/'+name+'.webp'
    manifest = [entry for entry in manifest if entry['asset'] != asset]
    manifest.append({'asset':asset,'source_relative_to_field_trips':rel,'source_sha256':before})
    print(name,im.size,(out/(name+'.webp')).stat().st_size)
# The professional portrait is managed separately by prepare_portrait.py.
(ROOT/'docs').mkdir(exist_ok=True)
(ROOT/'docs/asset-provenance.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
