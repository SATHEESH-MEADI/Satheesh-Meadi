"""Read dated Altus originals and create website derivatives only."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--field-root', type=Path, required=True)
args = parser.parse_args()
manifest_path = root / 'docs/asset-provenance.json'
manifest = json.loads(manifest_path.read_text())
for date in ['2026-06-15', '2026-06-30', '2026-07-08', '2026-07-20', '2026-07-30', '2026-08-12', '2026-08-19']:
    folder = args.field_root / '2026_Altus/Muller Merrit River/Photos' / date
    candidates = sorted([p for p in folder.iterdir() if p.suffix.lower() in ['.jpg', '.jpeg'] and ('field' in p.stem.lower() or 'view_from_truck' in p.stem.lower())], key=lambda p: ('overview' not in p.stem.lower(), p.name))
    assert candidates, f'No matching photograph for {date}'
    source = candidates[0]
    before = hashlib.sha256(source.read_bytes()).hexdigest()
    asset = f'images/fieldwork/altus-{date}.webp'
    with Image.open(source) as original:
        im = ImageOps.exif_transpose(original).convert('RGB')
        im.thumbnail((1600, 1200))
        im.save(root / asset, 'WEBP', quality=82, method=6)
    assert before == hashlib.sha256(source.read_bytes()).hexdigest()
    manifest = [m for m in manifest if m['asset'] != asset]
    manifest.append({'asset': asset, 'source_relative_to_field_trips': source.relative_to(args.field_root).as_posix(), 'source_sha256': before})
    print(date, source.name)
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
