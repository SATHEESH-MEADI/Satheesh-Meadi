"""Create the website portrait from a professional original, without altering it."""
import argparse
import hashlib
import io
import json
from pathlib import Path
from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
args = parser.parse_args()
original_bytes = args.source.read_bytes()
source_hash = hashlib.sha256(original_bytes).hexdigest()
with Image.open(io.BytesIO(original_bytes)) as source:
    source_size = source.size
    portrait = ImageOps.exif_transpose(source).convert('RGB')
    if source.info.get('icc_profile'):
        portrait = ImageCms.profileToProfile(
            portrait,
            ImageCms.ImageCmsProfile(io.BytesIO(source.info['icc_profile'])),
            ImageCms.createProfile('sRGB'), outputMode='RGB')
    portrait.thumbnail((1400, 1800), Image.Resampling.LANCZOS)
    output = ROOT / 'images' / 'portrait.webp'
    portrait.save(output, 'WEBP', quality=90, method=6)
assert hashlib.sha256(args.source.read_bytes()).hexdigest() == source_hash
manifest = {
    'asset': 'images/portrait.webp',
    'source_filename': args.source.name,
    'source_sha256': source_hash,
    'original_dimensions': source_size,
    'web_dimensions': portrait.size,
    'output_sha256': hashlib.sha256(output.read_bytes()).hexdigest(),
    'processing': 'EXIF orientation, sRGB conversion when profiled, proportional resize, WebP export; no retouching; no source modification',
}
(ROOT / 'docs' / 'portrait-provenance.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
print(json.dumps(manifest, indent=2))
print('Web image bytes:', output.stat().st_size)
