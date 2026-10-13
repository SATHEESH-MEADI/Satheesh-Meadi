import {
  trips,
  seasonDates,
  projects,
  tripPhoto,
  gallery,
  service,
  skills,
  tools,
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
const shortDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(new Date(date + 'T12:00:00Z'))
    .toUpperCase();
const monthLabel = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
    .format(new Date(date + 'T12:00:00Z'))
    .toUpperCase();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const EASE = [0.16, 1, 0.3, 1];
const NAV_H = 72;
const html = document.documentElement;

// Vendored libraries (MIT). The page stays fully usable if either fails to load.
let motion = null;
let lenis = null;
try {
  motion = await import('../vendor/motion.min.js');
} catch (error) {
  console.info('Motion unavailable, CSS fallbacks active:', error.message);
}
if (!reduceMotion.matches) {
  try {
    const { Lenis } = await import('../vendor/lenis.min.js');
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, touchMultiplier: 1.4 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  } catch (error) {
    console.info('Smooth scrolling unavailable:', error.message);
  }
}
if (reduceMotion.matches) html.classList.add('no-motion');

function scrollToTarget(target, immediate = false) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  if (lenis && !immediate)
    lenis.scrollTo(el, { offset: 0, duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4) }); // scroll-padding-top supplies the header offset
  else el.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start' });
}
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.closest('dialog')) return;
  const target = $(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  history.pushState(null, '', link.getAttribute('href'));
  scrollToTarget(target);
});
if (location.hash && $(location.hash)) setTimeout(() => scrollToTarget(location.hash, true), 50);

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

const hero = $('#home');
new IntersectionObserver(
  ([entry]) => header.classList.toggle('solid', entry.intersectionRatio < 0.92),
  {
    threshold: [0.92, 1],
  },
).observe(hero);
// Hide the bar while reading downward, bring it back on the first upward scroll.
let lastY = window.scrollY;
let ticking = false;
window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const down = y > lastY + 4 && y > window.innerHeight * 0.6;
      const up = y < lastY - 4;
      if (down && !navigation.classList.contains('open')) header.classList.add('hidden-up');
      if (up || y < 80) header.classList.remove('hidden-up');
      lastY = y;
      ticking = false;
    });
  },
  { passive: true },
);

/* ---------- Colour journey: the page ground follows the section in the middle of the viewport ---------- */
const themed = $$('[data-bg]');
{
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        html.style.setProperty('--bg', entry.target.dataset.bg);
        html.dataset.theme = entry.target.dataset.theme || 'dark';
        $('meta[name="theme-color"]').setAttribute('content', entry.target.dataset.bg);
      });
    },
    { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
  );
  themed.forEach((section) => io.observe(section));
}

/* ---------- Headings settle word by word; blocks rise once ---------- */
$$('[data-words]').forEach((heading) => {
  const words = heading.textContent.trim().split(/\s+/);
  heading.innerHTML = words
    .map(
      (word, i) => `<span class="w">${escapeHTML(word)}${i < words.length - 1 ? ' ' : ''}</span>`,
    )
    .join('');
});
function revealWords(heading, startDelay = 0) {
  if (heading.classList.contains('in')) return;
  const words = $$('.w', heading);
  if (motion && !reduceMotion.matches) {
    motion.animate(
      words,
      { opacity: [0, 1], y: ['0.55em', '0em'], filter: ['blur(6px)', 'blur(0px)'] },
      { duration: 0.9, delay: motion.stagger(0.055, { startDelay }), ease: EASE },
    );
    setTimeout(() => heading.classList.add('in'), (startDelay + 0.9 + words.length * 0.055) * 1000);
  } else heading.classList.add('in');
}
function revealHero() {
  hero.classList.add('revealed');
  revealWords($('.hero h1'), 0.45);
  $$('.hero [data-reveal]').forEach((el) => el.classList.add('in'));
}
if (document.fonts?.ready) document.fonts.ready.then(revealHero);
else revealHero();

const revealTargets = $$('[data-reveal]').filter((el) => !el.closest('.hero'));
const wordTargets = $$('[data-words]').filter((el) => !el.closest('.hero'));
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.classList.add('in'));
  wordTargets.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.hasAttribute('data-words')) revealWords(el);
        else {
          const siblings = $$('[data-reveal]', el.parentElement);
          const index = Math.max(0, siblings.indexOf(el));
          el.style.transitionDelay = `${Math.min(index, 5) * 0.07}s`;
          el.classList.add('in');
        }
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  [...wordTargets, ...revealTargets].forEach((el) => io.observe(el));
}

// Hero photograph recedes as the reader moves into the page.
if (motion && !reduceMotion.matches) {
  const content = $('.hero-content');
  const stamp = $('.hero-stamp');
  motion.scroll(
    (progress) => {
      content.style.transform = `translateY(${progress * -70}px)`;
      content.style.opacity = String(1 - Math.min(1, progress * 1.5));
      stamp.style.opacity = String(1 - Math.min(1, progress * 2));
    },
    { target: hero, offset: ['start start', 'end start'] },
  );
}

/* ---------- Counters, marquee and magnetic buttons ---------- */
if (motion && !reduceMotion.matches) {
  const seen = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        const target = Number(entry.target.dataset.count);
        motion.animate(0, target, {
          duration: 1.6,
          ease: EASE,
          onUpdate: (v) => (entry.target.textContent = String(Math.round(v))),
        });
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );
  $$('[data-count]').forEach((el) => io.observe(el));
}
{
  const marquee = $('.marquee');
  if (marquee && !reduceMotion.matches)
    new IntersectionObserver(([entry]) => marquee.classList.toggle('live', entry.isIntersecting), {
      threshold: 0,
    }).observe(marquee);
}
if (finePointer.matches && !reduceMotion.matches) {
  $$('[data-magnetic]').forEach((el) => {
    let frame = 0;
    el.addEventListener('pointermove', (event) => {
      const r = el.getBoundingClientRect();
      const dx = (event.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (event.clientY - (r.top + r.height / 2)) / r.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      el.style.transform = '';
    });
  });
}

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
if (window.matchMedia('(min-width: 901px)').matches) {
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
  $$('.research-item').forEach((item) => io.observe(item));
  if (motion && !reduceMotion.matches) {
    motion.scroll((p) => sceneController?.setRotation(-0.13 + (p - 0.5) * 0.9), {
      target: $('.research-story'),
      offset: ['start end', 'end start'],
    });
  }
}
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
const visibleTrips = () =>
  trips.filter(
    (trip) => selectedRegion === 'all' || trip.sites.some((site) => site.region === selectedRegion),
  );
const activeSites = (trip) =>
  trip.sites.filter((site) => selectedRegion === 'all' || site.region === selectedRegion);
function regionLabel(trip) {
  if (selectedRegion !== 'all') return regionNames[selectedRegion];
  return [...new Set(trip.sites.map((s) => s.region))].map((r) => regionNames[r]).join(' and ');
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
$$('[data-region-dates]').forEach((el) => {
  const n = trips.filter((t) => t.sites.some((s) => s.region === el.dataset.regionDates)).length;
  el.textContent = `${n} ${n === 1 ? 'date' : 'dates'}`;
});
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
  if (window.matchMedia('(max-width:900px)').matches && event.detail > 0)
    scrollToTarget($('#trip-detail'));
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
renderTripList();

/* ---------- Season: a horizontal walk through seven dated frames ---------- */
const track = $('#season-track');
track.innerHTML = seasonDates
  .map(
    (date, i) =>
      `<figure class="season-frame"><img src="images/fieldwork/season-${date}.webp" alt="Cotton field at Caddo Research Station on ${dateLabel(date)}" width="1600" height="900" loading="lazy" decoding="async"><figcaption class="mono"><time datetime="${date}">${shortDate(date)}</time><span class="frame-index">${i + 1} of ${seasonDates.length}</span></figcaption></figure>`,
  )
  .join('');
const pinMedia = window.matchMedia('(min-width: 801px)');
function setupSeason() {
  const pin = $('#season-pin');
  const bar = $('#season-progress-bar');
  if (reduceMotion.matches || !motion || !pinMedia.matches) {
    html.classList.add('no-pin');
    return;
  }
  html.classList.remove('no-pin');
  const travel = () => Math.max(0, track.scrollWidth - window.innerWidth + 0);
  const apply = () => pin.style.setProperty('--season-travel', `${Math.round(travel() * 0.75)}px`);
  apply();
  new ResizeObserver(apply).observe(track);
  motion.scroll(
    (p) => {
      track.style.transform = `translate3d(${-travel() * p}px, 0, 0)`;
      bar.style.transform = `scaleX(${p})`;
    },
    { target: pin, offset: ['start start', 'end end'] },
  );
}
setupSeason();
track.addEventListener('keydown', (event) => {
  if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
  event.preventDefault();
  if (html.classList.contains('no-pin'))
    track.scrollBy({ left: event.key === 'ArrowRight' ? 400 : -400, behavior: 'smooth' });
  else window.scrollBy({ top: event.key === 'ArrowRight' ? 320 : -320, behavior: 'smooth' });
});

/* ---------- Gallery ---------- */
const sources = (file, widths) => ({
  avif: widths.map((w) => `images/field/${file}-${w}.avif ${w}w`).join(', '),
  webp: widths.map((w) => `images/field/${file}-${w}.webp ${w}w`).join(', '),
});
$('#gallery-grid').innerHTML = gallery
  .map((item, i) => {
    const s = sources(item.file, [768, 1280, 1920, 2576]);
    const sizes =
      item.size === 'tall' ? '(max-width: 900px) 100vw, 42vw' : '(max-width: 900px) 100vw, 58vw';
    return `<figure class="gallery-item ${item.size}" data-index="${i}" tabindex="0" role="button" aria-label="Open photograph: ${escapeHTML(item.caption)}"><picture><source type="image/avif" srcset="${s.avif}" sizes="${sizes}"><img src="images/field/${item.file}-1280.webp" srcset="${s.webp}" sizes="${sizes}" alt="${escapeHTML(item.alt)}" loading="lazy" decoding="async" width="1280" height="720" style="object-position:${item.position}"></picture><figcaption><span>${escapeHTML(item.caption)}</span><span class="mono">${String(i + 1).padStart(2, '0')}</span></figcaption></figure>`;
  })
  .join('');
{
  const tiles = $$('.gallery-item');
  if (reduceMotion.matches || !('IntersectionObserver' in window))
    tiles.forEach((tile) => tile.classList.add('in'));
  else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = `${Number(entry.target.dataset.index) * 0.1}s`;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );
    tiles.forEach((tile) => io.observe(tile));
    if (motion)
      tiles.forEach((tile) => {
        const img = $('img', tile);
        motion.scroll((p) => img.style.setProperty('--py', `${(p - 0.5) * -14}%`), {
          target: tile,
          offset: ['start end', 'end start'],
        });
      });
  }
}
const photoDialog = $('#photo-dialog');
let photoOpener;
function openPhoto(index) {
  const item = gallery[index];
  const s = sources(item.file, [768, 1280, 1920, 2576]);
  $('#photo-dialog-content').innerHTML =
    `<picture><source type="image/avif" srcset="${s.avif}" sizes="96vw"><img src="images/field/${item.file}-1920.webp" srcset="${s.webp}" sizes="96vw" alt="${escapeHTML(item.alt)}" width="2576" height="1449"></picture>` +
    `<figcaption><span>${escapeHTML(item.caption)}</span><span class="mono">${index + 1} of ${gallery.length}</span></figcaption>`;
  if (!photoDialog.open) {
    photoDialog.showModal();
    lenis?.stop();
    document.body.style.overflow = 'hidden';
  }
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
  let next = null;
  if (event.key === 'ArrowRight') next = (current + 1) % gallery.length;
  if (event.key === 'ArrowLeft') next = (current - 1 + gallery.length) % gallery.length;
  if (next === null) return;
  photoOpener = $$('.gallery-item')[next];
  openPhoto(next);
});

/* ---------- Skills, tools, service ---------- */
$('#skills-grid').innerHTML = skills
  .map(
    (group, i) =>
      `<div class="skill-group" data-reveal><p class="mono">${String(i + 1).padStart(2, '0')}</p><h3>${escapeHTML(group.group)}</h3><ul>${group.items
        .map((item) => `<li>${escapeHTML(item)}</li>`)
        .join('')}</ul></div>`,
  )
  .join('');
$('#tool-wall').innerHTML = tools
  .map(
    ([id, name]) =>
      `<li tabindex="0" aria-label="${escapeHTML(name)}"><svg aria-hidden="true"><use href="images/tool-logos.svg#logo-${id}"></use></svg><span aria-hidden="true">${escapeHTML(name)}</span></li>`,
  )
  .join('');
$('#service-list').innerHTML = service
  .map(
    (s) =>
      `<li data-reveal><p class="kind mono">${escapeHTML(s.kind)}</p><div><h3>${escapeHTML(s.title)}</h3><p class="org">${escapeHTML(s.org)}</p><p class="text">${escapeHTML(s.text)}</p></div><p class="when mono">${escapeHTML(s.when)}</p></li>`,
  )
  .join('');
// Late-rendered blocks join the reveal observer.
{
  const late = $$('#skills-grid [data-reveal], #service-list [data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window))
    late.forEach((el) => el.classList.add('in'));
  else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const siblings = $$('[data-reveal]', entry.target.parentElement);
          entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target), 6) * 0.07}s`;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );
    late.forEach((el) => io.observe(el));
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
    lenis?.stop();
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
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) {
      event.preventDefault();
      d.close();
      setTimeout(() => scrollToTarget(anchor.getAttribute('href')), 60);
    }
  });
  d.addEventListener('close', () => {
    document.body.style.overflow = '';
    lenis?.start();
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
