import {
  trips,
  seasonDates,
  projects,
  tripPhoto,
  gallery,
  credentials,
  regionNames,
} from './content.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const dateLabel = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date + 'T12:00:00Z'));
const monthLabel = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
    .format(new Date(date + 'T12:00:00Z'))
    .toUpperCase();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const EASE = [0.16, 1, 0.3, 1];

// Motion (vendored, MIT). The page is fully usable if it fails to load.
let motion = null;
try {
  motion = await import('../vendor/motion.min.js');
} catch (error) {
  console.info('Motion library unavailable, CSS fallbacks active:', error.message);
}

/* ---------- Header and navigation ---------- */
const header = $('#site-header');
const menu = $('.menu-toggle');
const navigation = $('#navigation');
function closeMenu(restoreFocus = false) {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width:801px)').addEventListener('change', () => closeMenu());
$('#year').textContent = new Date().getFullYear();

// The header is transparent over the photograph and solid once the hero scrolls away.
const hero = $('#home');
new IntersectionObserver(
  ([entry]) => header.classList.toggle('solid', entry.intersectionRatio < 0.9),
  { threshold: [0.9, 1] },
).observe(hero);

/* ---------- Hero: the authored moment ---------- */
const heading = $('[data-reveal-words]');
const words = heading.textContent.trim().split(' ');
heading.innerHTML = words
  .map(
    (word, i) =>
      `<span class="w" style="opacity:0">${escapeHTML(word)}${i < words.length - 1 ? ' ' : ''}</span>`,
  )
  .join('');
const wordEls = $$('.w', heading);
function revealHero() {
  hero.classList.add('revealed');
  if (motion && !reduceMotion.matches) {
    motion.animate(
      wordEls,
      { opacity: [0, 1], y: [28, 0] },
      { duration: 0.9, delay: motion.stagger(0.07, { startDelay: 0.35 }), ease: EASE },
    );
  } else wordEls.forEach((w) => (w.style.opacity = '1'));
  $$('.hero [data-reveal]').forEach((el) => el.classList.add('in'));
}
if (document.fonts?.ready) document.fonts.ready.then(revealHero);
else revealHero();

// Scroll-linked: the field recedes as the reader moves into the page.
if (motion && !reduceMotion.matches) {
  const media = $('.hero-media img');
  const content = $('.hero-content');
  motion.scroll(
    (progress) => {
      media.style.transform = `scale(${1 + progress * 0.08})`;
      content.style.transform = `translateY(${progress * -56}px)`;
      content.style.opacity = String(1 - Math.min(1, progress * 1.4));
    },
    { target: hero, offset: ['start start', 'end start'] },
  );
}

/* ---------- Scroll reveals and counters ---------- */
const revealTargets = $$('[data-reveal]').filter((el) => !el.closest('.hero'));
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.classList.add('in'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = $$('[data-reveal]', entry.target.parentElement);
        const index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(index, 5) * 0.06}s`;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  revealTargets.forEach((el) => observer.observe(el));
}
function watchCounters(root = document) {
  const counters = $$('[data-count]', root);
  if (!counters.length) return;
  if (!motion || reduceMotion.matches) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        const target = Number(entry.target.dataset.count);
        motion.animate(0, target, {
          duration: 1.4,
          ease: EASE,
          onUpdate: (v) => (entry.target.textContent = String(Math.round(v))),
        });
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => io.observe(el));
}
watchCounters();

/* ---------- Research: pinned field model follows the reading position ---------- */
const layerCopy = {
  canopy: 'Infrared sensing of the canopy',
  water: 'Root zone water, four depths',
  data: 'Measurements to models',
};
let sceneController;
let activeLayer = 'canopy';
function setLayer(layer, fromScroll = false) {
  activeLayer = layer;
  $$('[data-layer]').forEach((other) =>
    other.setAttribute('aria-pressed', String(other.dataset.layer === layer)),
  );
  $('#layer-description').textContent = layerCopy[layer];
  sceneController?.setLayer(layer);
  $$('.research-item').forEach((item) =>
    item.classList.toggle('active', item.dataset.layerTrigger === layer),
  );
  if (!fromScroll) $('.research-items').classList.remove('pinned');
}
$$('[data-layer]').forEach((button) =>
  button.addEventListener('click', () => setLayer(button.dataset.layer)),
);
const storyMedia = window.matchMedia('(min-width: 901px)');
function watchStory() {
  if (!storyMedia.matches) {
    $('.research-items').classList.remove('pinned');
    return;
  }
  const items = $$('.research-item');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $('.research-items').classList.add('pinned');
          setLayer(entry.target.dataset.layerTrigger, true);
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  );
  items.forEach((item) => io.observe(item));
  if (motion && !reduceMotion.matches) {
    motion.scroll((p) => sceneController?.setRotation(-0.13 + (p - 0.5) * 0.9), {
      target: $('.research-story'),
      offset: ['start end', 'end start'],
    });
  }
}
watchStory();
async function loadScene() {
  if (reduceMotion.matches || navigator.connection?.saveData) return;
  try {
    const { createFieldScene } = await import('./scene.js');
    sceneController = createFieldScene($('#field-canvas'), $('#scene-viewport'));
    sceneController.setLayer(activeLayer);
  } catch (error) {
    console.info('Static field illustration active:', error.message);
  }
}
if ('requestIdleCallback' in window) requestIdleCallback(loadScene, { timeout: 1800 });
else setTimeout(loadScene, 120);

/* ---------- Field journal ---------- */
let selectedRegion = 'all';
let selectedDate = trips[0].date;
function visibleTrips() {
  return trips.filter(
    (trip) => selectedRegion === 'all' || trip.sites.some((site) => site.region === selectedRegion),
  );
}
function activeSites(trip) {
  return trip.sites.filter((site) => selectedRegion === 'all' || site.region === selectedRegion);
}
function regionLabel(trip) {
  if (selectedRegion !== 'all') return regionNames[selectedRegion];
  const regions = [...new Set(trip.sites.map((s) => s.region))].map((r) => regionNames[r]);
  return regions.join(' and ');
}
function renderTrip() {
  const trip = trips.find((t) => t.date === selectedDate);
  const sites = activeSites(trip);
  const photo = tripPhoto(trip, selectedRegion);
  const caption = `${photo.caption}, ${dateLabel(trip.date)}`;
  $$('.trip-button').forEach((button) => {
    const pressed = button.dataset.date === selectedDate;
    button.setAttribute('aria-pressed', String(pressed));
    button.setAttribute('aria-selected', String(pressed));
  });
  $('#trip-detail').innerHTML =
    `<img class="trip-photo" src="images/fieldwork/${photo.image}.webp" alt="${escapeHTML(caption)}" width="1600" height="900" loading="lazy" decoding="async">` +
    `<p class="trip-photo-caption mono">${escapeHTML(caption)}</p>` +
    `<div class="trip-body"><p class="mono">${escapeHTML(trip.category)}</p><h3>${escapeHTML(trip.title)}</h3><p>${escapeHTML(trip.summary)}</p>` +
    `<div class="trip-sites"><p class="mono">${sites.length} ${sites.length === 1 ? 'site' : 'sites'}${selectedRegion === 'all' ? ' visited' : ' in this region'}, ${trip.sites.length} that day</p><ul>${sites
      .map((site) => `<li>${escapeHTML(site.name)}</li>`)
      .join('')}</ul></div></div>`;
}
function renderTripList() {
  const filtered = visibleTrips();
  if (!filtered.some((t) => t.date === selectedDate)) selectedDate = filtered[0].date;
  $('#trip-list').innerHTML = filtered
    .map((trip) => {
      const sites = activeSites(trip);
      const region = regionLabel(trip);
      const pressed = trip.date === selectedDate;
      return `<button class="trip-button" role="option" data-date="${trip.date}" aria-pressed="${pressed}" aria-selected="${pressed}" aria-label="${dateLabel(trip.date)}, ${region}, ${sites.length} site ${sites.length === 1 ? 'visit' : 'visits'}"><span class="trip-day">${trip.date.slice(8)}</span><span class="trip-month">${monthLabel(trip.date)} ${trip.date.slice(0, 4)}</span><span class="trip-region">${escapeHTML(region)}<small>${sites.length} ${sites.length === 1 ? 'site' : 'sites'}</small></span></button>`;
    })
    .join('');
  renderTrip();
}
function updateRegionCounts() {
  $$('[data-region-dates]').forEach((el) => {
    const region = el.dataset.regionDates;
    const n = trips.filter((t) => t.sites.some((s) => s.region === region)).length;
    el.textContent = `${n} ${n === 1 ? 'date' : 'dates'}`;
  });
}
$$('[data-region]').forEach((button) =>
  button.addEventListener('click', () => {
    selectedRegion = button.dataset.region;
    $$('[data-region]').forEach((other) =>
      other.setAttribute('aria-pressed', String(other.dataset.region === selectedRegion)),
    );
    renderTripList();
    $('.trip-strip').scrollTo({ left: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  }),
);
$('#trip-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-date]');
  if (!button) return;
  selectedDate = button.dataset.date;
  renderTrip();
  button.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
    behavior: reduceMotion.matches ? 'instant' : 'smooth',
  });
  if (window.matchMedia('(max-width:900px)').matches && event.detail > 0) {
    $('#trip-detail').scrollIntoView({
      block: 'start',
      behavior: reduceMotion.matches ? 'instant' : 'smooth',
    });
  }
});
$('#trip-list').addEventListener('keydown', (event) => {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  const buttons = $$('.trip-button');
  const index = buttons.findIndex((b) => b.dataset.date === selectedDate);
  let next = index;
  if (event.key === 'ArrowRight') next = Math.min(buttons.length - 1, index + 1);
  if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = buttons.length - 1;
  event.preventDefault();
  buttons[next].focus();
  buttons[next].click();
});
updateRegionCounts();
renderTripList();

/* ---------- Season frames ---------- */
const seasonImage = $('#season-image');
seasonDates.forEach((date) => {
  const img = new Image();
  img.src = `images/fieldwork/season-${date}.webp`;
});
let fadeTimer;
$('#season-range').addEventListener('input', (event) => {
  const date = seasonDates[Number(event.target.value)];
  const label = dateLabel(date);
  const swap = () => {
    seasonImage.src = `images/fieldwork/season-${date}.webp`;
    seasonImage.alt = `Cotton field at Caddo Research Station on ${label}`;
    seasonImage.classList.remove('fading');
  };
  clearTimeout(fadeTimer);
  if (reduceMotion.matches) swap();
  else {
    seasonImage.classList.add('fading');
    fadeTimer = setTimeout(swap, 160);
  }
  $('#season-date').textContent = label;
  $('#season-date').dateTime = date;
  event.target.setAttribute('aria-valuetext', label);
});

/* ---------- Gallery ---------- */
const sources = (file, widths) => ({
  avif: widths.map((w) => `images/field/${file}-${w}.avif ${w}w`).join(', '),
  webp: widths.map((w) => `images/field/${file}-${w}.webp ${w}w`).join(', '),
});
$('#gallery-grid').innerHTML = gallery
  .map((item, i) => {
    const s = sources(item.file, [768, 1280, 1920]);
    const sizes =
      item.size === 'wide'
        ? '(max-width: 900px) 100vw, 60vw'
        : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 30vw';
    return `<figure class="gallery-item ${item.size}" data-reveal data-index="${i}" tabindex="0" role="button" aria-label="Open photograph: ${escapeHTML(item.caption)}"><picture><source type="image/avif" srcset="${s.avif}" sizes="${sizes}"><img src="images/field/${item.file}-1280.webp" srcset="${s.webp}" sizes="${sizes}" alt="${escapeHTML(item.alt)}" loading="lazy" decoding="async" width="1280" height="720"${item.position ? ` style="object-position:${item.position}"` : ''}></picture><figcaption>${escapeHTML(item.caption)}</figcaption></figure>`;
  })
  .join('');
const photoDialog = $('#photo-dialog');
let photoOpener;
function openPhoto(index) {
  const item = gallery[index];
  const s = sources(item.file, [768, 1280, 1920]);
  $('#photo-dialog-content').innerHTML =
    `<picture><source type="image/avif" srcset="${s.avif}" sizes="96vw"><img src="images/field/${item.file}-1920.webp" srcset="${s.webp}" sizes="96vw" alt="${escapeHTML(item.alt)}" width="1920" height="1080"></picture>` +
    `<figcaption><span>${escapeHTML(item.caption)}</span><span class="mono">${index + 1} of ${gallery.length}</span></figcaption>`;
  photoDialog.showModal();
  document.body.style.overflow = 'hidden';
}
$('#gallery-grid').addEventListener('click', (event) => {
  const figure = event.target.closest('.gallery-item');
  if (!figure) return;
  photoOpener = figure;
  openPhoto(Number(figure.dataset.index));
});
$('#gallery-grid').addEventListener('keydown', (event) => {
  const figure = event.target.closest('.gallery-item');
  if (figure && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    photoOpener = figure;
    openPhoto(Number(figure.dataset.index));
  }
});
photoDialog.addEventListener('keydown', (event) => {
  if (!photoOpener) return;
  const current = Number(photoOpener.dataset.index);
  if (event.key === 'ArrowRight')
    (openPhoto((current + 1) % gallery.length),
      (photoOpener = $$('.gallery-item')[(current + 1) % gallery.length]));
  if (event.key === 'ArrowLeft')
    (openPhoto((current - 1 + gallery.length) % gallery.length),
      (photoOpener = $$('.gallery-item')[(current - 1 + gallery.length) % gallery.length]));
});
// Newly rendered gallery tiles join the reveal observer.
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  const tiles = $$('.gallery-item');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${(Number(entry.target.dataset.index) % 3) * 0.08}s`;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );
  tiles.forEach((tile) => io.observe(tile));
} else $$('.gallery-item').forEach((tile) => tile.classList.add('in'));

/* ---------- Credentials ---------- */
$('#credential-list').innerHTML = credentials
  .map(
    (c) =>
      `<li><span class="mono">${escapeHTML(c.mono)}</span><strong>${escapeHTML(c.title)}</strong><p>${escapeHTML(c.detail)}</p></li>`,
  )
  .join('');
{
  const items = $$('#credential-list li');
  if (reduceMotion.matches || !('IntersectionObserver' in window))
    items.forEach((li) => li.classList.add('in'));
  else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = `${items.indexOf(entry.target) * 0.12}s`;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }),
      { threshold: 0.4 },
    );
    items.forEach((li) => io.observe(li));
  }
}

/* ---------- Dialogs ---------- */
const dialog = $('#project-dialog');
let dialogOpener;
$$('[data-project]').forEach((button) =>
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    dialogOpener = button;
    const ongoing = button.dataset.project === 'humidity' || button.dataset.project === 'openet';
    $('#dialog-content').innerHTML =
      `<p class="mono">${escapeHTML(project.category)}</p><h2 id="dialog-title">${escapeHTML(project.title)}</h2>` +
      `<h3>The question</h3><p>${escapeHTML(project.problem)}</p><h3>My contribution</h3><p>${escapeHTML(project.contribution)}</p>` +
      `<h3>${ongoing ? 'Current direction' : 'The work'}</h3><p>${escapeHTML(project.outcome)}</p>` +
      `<div class="dialog-tags">${project.tools.map((t) => `<span>${escapeHTML(t)}</span>`).join('')}</div>` +
      `<a class="button button-primary" href="${project.link}" ${project.link.startsWith('https:') ? 'target="_blank" rel="noopener"' : ''}>${escapeHTML(project.linkLabel)}</a>` +
      `<p class="detail-source">${escapeHTML(project.source)}</p>`;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }),
);
[dialog, photoDialog].forEach((d) => {
  $('.dialog-close', d).addEventListener('click', () => d.close());
  d.addEventListener('click', (event) => {
    if (event.target === d) {
      const bounds = d.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        d.close();
    }
    if (event.target.closest('a[href^="#"]')) d.close();
  });
  d.addEventListener('close', () => {
    document.body.style.overflow = '';
    (d === dialog ? dialogOpener : photoOpener)?.focus({ preventScroll: true });
  });
});

/* ---------- Publication tabs ---------- */
$$('[data-publications]').forEach((button) =>
  button.addEventListener('click', () => {
    $$('[data-publications]').forEach((other) =>
      other.setAttribute('aria-pressed', String(other === button)),
    );
    $$('.publication-panel').forEach(
      (panel) => (panel.hidden = panel.id !== button.dataset.publications),
    );
  }),
);
