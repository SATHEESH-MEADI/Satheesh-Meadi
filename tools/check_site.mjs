import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { trips, seasonDates, projects, tripPhoto } from '../scripts/content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
assert.equal((html.match(/<h1>/g) || []).length, 1, 'One primary heading');
assert.ok(/<meta\s+name="description"/.test(html), 'Description metadata is present');
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (/^(https?:|mailto:)/.test(target)) continue;
  if (target.startsWith('#')) assert.ok(ids.includes(target.slice(1)), `Missing anchor ${target}`);
  else await access(resolve(root, target));
}
// Protect the distinction between distinct travel dates and individual site visits.
assert.equal(trips.length, 11);
assert.equal(new Set(trips.map((t) => t.date)).size, 11);
assert.equal(
  trips.reduce((n, t) => n + t.sites.length, 0),
  36,
);
for (const [region, dates, visits] of [
  ['caddo', 7, 7],
  ['altus', 7, 11],
  ['panhandle', 4, 18],
]) {
  assert.equal(
    trips.filter((t) => t.sites.some((s) => s.region === region)).length,
    dates,
    region + ' date count',
  );
  assert.equal(
    trips.flatMap((t) => t.sites).filter((s) => s.region === region).length,
    visits,
    region + ' site count',
  );
}
for (const trip of trips) {
  assert.ok(
    !['2026-08-26', '2026-08-31'].includes(trip.date),
    'Exclude dates without Satheesh attendance',
  );
  assert.equal(
    new Set(trip.sites.map((s) => s.name)).size,
    trip.sites.length,
    'No duplicate sites on one date',
  );
  await access(resolve(root, `images/fieldwork/${trip.image}.webp`));
}
for (const date of seasonDates) {
  assert.ok(trips.some((t) => t.date === date && t.sites.some((s) => s.region === 'caddo')));
  await access(resolve(root, `images/fieldwork/season-${date}.webp`));
}
for (const match of html.matchAll(/data-project="([^"]+)"/g))
  assert.ok(projects[match[1]], 'Project details missing');
const manifest = JSON.parse(await readFile(resolve(root, 'docs/asset-provenance.json'), 'utf8'));
for (const trip of trips) {
  for (const region of new Set(['all', ...trip.sites.map((site) => site.region)])) {
    const photo = tripPhoto(trip, region);
    const entry = manifest.find((m) => m.asset === `images/fieldwork/${photo.image}.webp`);
    assert.ok(entry, `Missing photo provenance: ${region} ${trip.date}`);
    assert.ok(
      entry.source_relative_to_field_trips.includes(trip.date),
      'Capture date must match trip date',
    );
    if (region !== 'all') {
      const prefix = { caddo: '2026_CRS/', altus: '2026_Altus/', panhandle: '2026_Panhandle_PDS/' }[
        region
      ];
      assert.ok(
        entry.source_relative_to_field_trips.startsWith(prefix),
        `Wrong region photo: ${region} ${trip.date}`,
      );
    }
    assert.ok(
      !/Muller|Frantz|McMurray|EastMiller|Freeman/i.test(photo.caption),
      'No producer names in photo captions',
    );
  }
}
for (const entry of manifest) {
  await access(resolve(root, entry.asset));
  assert.match(entry.source_sha256, /^[a-f0-9]{64}$/);
}
console.log(
  'PASS: local links and images, unique anchors, project details, 11 travel dates / 36 site visits, regional counts, seven dated season frames, and source manifest.',
);
