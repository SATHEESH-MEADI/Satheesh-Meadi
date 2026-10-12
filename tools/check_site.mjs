import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import {
  trips,
  seasonDates,
  projects,
  tripPhoto,
  gallery,
  credentials,
} from '../scripts/content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'One primary heading');
assert.ok(/<meta\s+name="description"/.test(html), 'Description metadata is present');
for (const anchor of [
  'home',
  'research',
  'fieldwork',
  'gallery',
  'projects',
  'publications',
  'about',
  'contact',
])
  assert.ok(ids.includes(anchor), `Section anchor #${anchor} is preserved`);
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (/^(https?:|mailto:)/.test(target)) continue;
  if (target.startsWith('#')) assert.ok(ids.includes(target.slice(1)), `Missing anchor ${target}`);
  else await access(resolve(root, target));
}
for (const match of html.matchAll(/\b(?:srcset|imagesrcset)="([^"]+)"/g)) {
  for (const candidate of match[1].split(',')) {
    const file = candidate.trim().split(/\s+/)[0];
    await access(resolve(root, file));
  }
}
// Typographic discipline: visible copy uses plain hyphens, never em or en dashes.
const visible = html.replace(/<script[\s\S]*?<\/script>/g, '');
assert.ok(!/[–—]/.test(visible), 'No em or en dashes in visible copy');
const content = await readFile(resolve(root, 'scripts/content.js'), 'utf8');
assert.ok(!/[–—]/.test(content), 'No em or en dashes in content strings');

// Protect the distinction between distinct travel dates and individual site visits.
const dateCount = trips.length;
const visitCount = trips.reduce((n, t) => n + t.sites.length, 0);
assert.equal(dateCount, new Set(trips.map((t) => t.date)).size, 'Every trip date is unique');
assert.equal(dateCount, 11, 'Documented fieldwork dates');
assert.equal(visitCount, 36, 'Documented site visits');
for (const [n, label] of [
  [dateCount, 'fieldwork dates'],
  [visitCount, 'site visits'],
])
  assert.ok(
    html.includes(`data-count="${n}">${n}</strong> ${label}`),
    `Stat ${n} ${label} matches content`,
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
  assert.ok(
    [...trip.date].every((c) => c !== ' '),
    'ISO date',
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
for (const item of gallery) {
  assert.ok(['wide', 'tall', 'square'].includes(item.size), 'Gallery tile size');
  assert.ok(item.alt && item.caption, 'Gallery items carry alt text and a caption');
  for (const width of [768, 1280, 1920]) {
    for (const ext of ['webp', 'avif']) {
      const asset = `images/field/${item.file}-${width}.${ext}`;
      await access(resolve(root, asset));
      assert.ok(
        manifest.some((m) => m.asset === asset),
        `Missing provenance: ${asset}`,
      );
    }
  }
  assert.ok(
    !/Muller|Frantz|McMurray|EastMiller|Freeman/i.test(item.caption + item.alt),
    'No producer names in gallery',
  );
}
assert.ok(credentials.length >= 4, 'Credentials listed');
for (const entry of manifest) {
  await access(resolve(root, entry.asset));
  assert.match(entry.source_sha256, /^[a-f0-9]{64}$/);
}
for (const file of [
  'fonts/bricolage-grotesque-latin.woff2',
  'fonts/martian-mono-latin.woff2',
  'vendor/motion.min.js',
])
  await access(resolve(root, file));
console.log(
  `PASS: links, images and srcsets, preserved anchors, no em dashes, ${dateCount} travel dates / ${visitCount} site visits, regional counts, seven season frames, gallery provenance, fonts and vendor files.`,
);
