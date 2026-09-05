import { trips, seasonDates, projects, tripPhoto } from './content.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
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

// Navigation remains a conventional, keyboard-accessible document navigation.
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

// The date list counts a trip day once even when multiple sites were visited.
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
function renderTrip() {
  const trip = trips.find((t) => t.date === selectedDate);
  const sites = activeSites(trip);
  const photo = tripPhoto(trip, selectedRegion);
  const caption = `${photo.caption} · ${dateLabel(trip.date)}`;
  $$('.trip-button').forEach((button) =>
    button.setAttribute('aria-pressed', String(button.dataset.date === selectedDate)),
  );
  $('#trip-detail').innerHTML =
    `<img class="trip-photo" src="images/fieldwork/${photo.image}.webp" alt="${escapeHTML(caption)}" width="1600" height="900" loading="lazy"><p class="trip-photo-caption">${escapeHTML(caption)}</p><div class="trip-body"><p class="eyebrow">${dateLabel(trip.date).toUpperCase()} · ${escapeHTML(trip.category)}</p><h3>${escapeHTML(trip.title)}</h3><p class="trip-summary-label">Full-day field notes</p><p>${escapeHTML(trip.summary)}</p><div class="trip-sites"><h4>${sites.length} ${sites.length === 1 ? 'SITE' : 'SITES'}${selectedRegion === 'all' ? ' VISITED' : ' IN THIS REGION'} / ${trip.sites.length} TOTAL THAT DAY</h4><ul>${sites.map((site) => `<li>${escapeHTML(site.name)}</li>`).join('')}</ul></div></div>`;
}
function renderTripList() {
  const filtered = visibleTrips();
  if (!filtered.some((t) => t.date === selectedDate)) selectedDate = filtered[0].date;
  $('#trip-list').innerHTML = filtered
    .map((trip) => {
      const sites = activeSites(trip);
      const regionName =
        selectedRegion === 'all'
          ? trip.sites.some((s) => s.region === 'panhandle')
            ? 'Panhandle'
            : 'Caddo & Altus'
          : { caddo: 'Caddo', altus: 'Altus', panhandle: 'Panhandle' }[selectedRegion];
      return `<button class="trip-button" data-date="${trip.date}" aria-pressed="${trip.date === selectedDate}" aria-label="${dateLabel(trip.date)} — ${regionName}, ${sites.length} site visits"><span class="trip-day">${trip.date.slice(8)}<small>${monthLabel(trip.date)}</small></span><span class="trip-label">${regionName}<small>${sites.length} ${sites.length === 1 ? 'site' : 'sites'} · ${escapeHTML(trip.category.split(' / ')[0].toLowerCase())}</small></span><span class="trip-arrow" aria-hidden="true">↗</span></button>`;
    })
    .join('');
  renderTrip();
}
$$('[data-region]').forEach((button) =>
  button.addEventListener('click', () => {
    selectedRegion = button.dataset.region;
    $$('[data-region]').forEach((other) =>
      other.setAttribute('aria-pressed', String(other.dataset.region === selectedRegion)),
    );
    renderTripList();
  }),
);
$('#trip-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-date]');
  if (button) {
    selectedDate = button.dataset.date;
    renderTrip();
    if (window.matchMedia('(max-width:600px)').matches && event.detail > 0) {
      $('#trip-detail').scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    }
  }
});
renderTripList();

// Every season frame has a real capture-folder date, with no fabricated crop measurements.
$('#season-range').addEventListener('input', (event) => {
  const date = seasonDates[Number(event.target.value)];
  const label = dateLabel(date);
  $('#season-image').src = `images/fieldwork/season-${date}.webp`;
  $('#season-image').alt = `Cotton field at Caddo Research Station on ${label}`;
  $('#season-date').textContent = label;
  $('#season-date').dateTime = date;
  event.target.setAttribute('aria-valuetext', label);
});

// Native dialog supplies Escape handling, focus containment, and return to the opener.
const dialog = $('#project-dialog');
let dialogOpener;
$$('[data-project]').forEach((button) =>
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    dialogOpener = button;
    $('#dialog-content').innerHTML =
      `<p class="eyebrow">${escapeHTML(project.category)}</p><h2 id="dialog-title">${escapeHTML(project.title)}</h2><h3>The question</h3><p>${escapeHTML(project.problem)}</p><h3>My contribution</h3><p>${escapeHTML(project.contribution)}</p><h3>${button.dataset.project === 'humidity' || button.dataset.project === 'openet' ? 'Current direction' : 'The work'}</h3><p>${escapeHTML(project.outcome)}</p><div class="tags">${project.tools.map((t) => `<span>${escapeHTML(t)}</span>`).join('')}</div><a class="button button-orange" href="${project.link}" ${project.link.startsWith('https:') ? 'target="_blank" rel="noopener"' : ''}>${escapeHTML(project.linkLabel)} <span aria-hidden="true">↗</span></a><p class="detail-source">${escapeHTML(project.source)}</p>`;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }),
);
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }
  if (event.target.closest('a[href^="#"]')) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  dialogOpener?.focus({ preventScroll: true });
});
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

// UI text is independent of WebGL; low-power or unsupported devices retain the illustration.
const layerCopy = {
  canopy: [
    'Measuring canopy temperature to understand how crops respond to water stress.',
    '#research',
  ],
  water: [
    'Looking beneath the canopy: soil moisture, roots, and the water available to a crop.',
    '#fieldwork',
  ],
  data: [
    'Connecting field measurements to models that support better irrigation decisions.',
    '#projects',
  ],
};
let sceneController;
let activeLayer = 'canopy';
$$('[data-layer]').forEach((button) =>
  button.addEventListener('click', () => {
    activeLayer = button.dataset.layer;
    $$('[data-layer]').forEach((other) =>
      other.setAttribute('aria-pressed', String(other === button)),
    );
    $('#layer-description').textContent = layerCopy[activeLayer][0];
    $('#layer-link').href = layerCopy[activeLayer][1];
    sceneController?.setLayer(activeLayer);
  }),
);
async function loadScene() {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    navigator.connection?.saveData
  )
    return;
  try {
    const { createFieldScene } = await import('./scene.js');
    sceneController = createFieldScene($('#field-canvas'), $('#scene-viewport'));
    sceneController.setLayer(activeLayer);
  } catch (error) {
    console.info('Static field illustration active:', error.message);
  }
}
if ('requestIdleCallback' in window) requestIdleCallback(loadScene, { timeout: 1600 });
else setTimeout(loadScene, 100);
