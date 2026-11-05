const $ = id => document.getElementById(id);
const rooms = {
  ocean: { name: 'The Ocean Suite', rate: 2850, image: 'assets/ocean-suite.jpg', eyebrow: '01 / OCEAN & SKY', description: 'Open the timber doors, let the salt air in, and watch the Indian Ocean from your own private balcony. Warm oak, natural linen and a wonderfully comfortable king-size bed make this a space to settle into.', amenities: ['King-size bed', 'Private ocean-view balcony', '42 m² of breathing room', 'En-suite bathroom', 'Breakfast included', 'Wi-Fi & coffee station'] },
  dune: { name: 'The Dune Suite', rate: 2450, image: 'assets/dune-suite.jpg', eyebrow: '02 / SAND & STILLNESS', description: 'A quieter corner of the house, with soft light moving across warm plaster walls and fynbos just outside your window. Thoughtfully simple, beautifully comfortable, and made for the days you want to do a little less.', amenities: ['Queen-size bed', 'Dune & fynbos outlook', '36 m² of quiet comfort', 'En-suite bathroom', 'Breakfast included', 'Wi-Fi & coffee station'] }
};
const guides = {
  coast: { number: '01', title: 'Follow the shoreline.', description: 'Wide-open sand, salt on your skin and the sound of the Indian Ocean. Wilderness is made for long beach walks and stopping simply because the view asks you to.', list: ['Wander along Wilderness Beach', 'Watch the surf at the Touw River mouth', 'Take your time with an ocean-view picnic'], link: 'https://www.sanparks.org/parks/garden-route/what-to-do/activities/beach-access' },
  nature: { number: '02', title: 'Take the scenic way.', description: 'Trade the shoreline for a little green. The Wilderness section of Garden Route National Park brings together indigenous forest, lakes and the winding Touw River. Leave time to see where the day takes you.', list: ['Paddle the Touw River from Ebb-and-Flow', 'Look for kingfishers along the water', 'Explore the Wilderness section of the park'], link: 'https://www.sanparks.org/parks/garden-route/what-to-do/activities/water-sports' },
  slow: { number: '03', title: 'Let the day unfold.', description: 'You don’t have to go far to feel a world away. Start with a slow breakfast, wander into the village for coffee, then find your way back to a book, a sun lounger and a wonderfully empty afternoon.', list: ['Settle in for an unhurried breakfast', 'Find a coffee spot in Wilderness village', 'Come home for an afternoon by the pool'], link: 'https://visitgeorge.co.za/' }
};
const money = value => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value);
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const parseDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(NaN);
const nextDay = value => { const date = parseDate(value); date.setDate(date.getDate() + 1); return dateKey(date); };
const formattedDate = value => parseDate(value).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
const utcDay = value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const [year, month, day] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};
const nightCount = () => (utcDay($('departure').value) - utcDay($('arrival').value)) / 86400000;
let selectedRoom = 'ocean';
let lastDialogTrigger = null;

const menu = document.querySelector('.menu-toggle');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); $('mobile-nav').hidden = true; }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); $('mobile-nav').hidden = !open; });
$('mobile-nav').addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
window.matchMedia('(min-width: 641px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

function openDialog(dialog, trigger) { lastDialogTrigger = trigger; dialog.showModal(); document.body.classList.add('modal-open'); }
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastDialogTrigger?.focus({ preventScroll: true }); });
});
document.querySelectorAll('[data-room]').forEach(button => button.addEventListener('click', () => {
  selectedRoom = button.dataset.room;
  const room = rooms[selectedRoom];
  $('room-photo').src = room.image; $('room-photo').alt = `${room.name}, a coastal guest house concept`;
  $('room-eyebrow').textContent = room.eyebrow; $('room-title').textContent = room.name; $('room-description').textContent = room.description; $('room-rate').textContent = money(room.rate);
  $('room-amenities').replaceChildren(...room.amenities.map(amenity => { const li = document.createElement('li'); li.textContent = amenity; return li; }));
  openDialog($('room-dialog'), button);
}));
$('choose-suite').addEventListener('click', () => {
  $('room-dialog').close();
  $('plan').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  $('stay-form').dataset.suite = selectedRoom;
  $('arrival').focus({ preventScroll: true });
});

const today = dateKey(new Date());
const initialArrival = new Date(); initialArrival.setDate(initialArrival.getDate() + 7);
$('arrival').min = today; $('arrival').value = dateKey(initialArrival);
$('departure').min = nextDay($('arrival').value); $('departure').value = nextDay(nextDay($('arrival').value));
$('arrival').addEventListener('change', () => {
  $('date-error').textContent = ''; $('arrival').setCustomValidity('');
  if (!Number.isFinite(parseDate($('arrival').value).getTime())) return;
  $('departure').min = nextDay($('arrival').value);
  if ($('departure').value <= $('arrival').value) $('departure').value = nextDay(nextDay($('arrival').value));
  $('departure').setCustomValidity('');
});
$('departure').addEventListener('change', () => { $('departure').setCustomValidity(''); $('date-error').textContent = ''; });
function refreshEstimate() {
  const nights = nightCount();
  $('estimate-label').textContent = `${nights} ${nights === 1 ? 'night' : 'nights'} · ${rooms[selectedRoom].name}`;
  $('estimate-total').textContent = money(nights * rooms[selectedRoom].rate);
  $('stay-preview').hidden = true; $('preview-stay').hidden = false;
}
function buildBookingChoices() {
  $('booking-choices').replaceChildren(...Object.entries(rooms).map(([id, room]) => {
    const label = document.createElement('label'); label.className = 'booking-choice';
    const input = document.createElement('input'); input.type = 'radio'; input.name = 'booking-room'; input.value = id; input.checked = id === selectedRoom;
    const photo = document.createElement('img'); photo.src = room.image; photo.alt = ''; photo.width = 86; photo.height = 76;
    const copy = document.createElement('span'); copy.className = 'booking-choice-copy';
    const name = document.createElement('strong'); name.textContent = room.name;
    const detail = document.createElement('small'); detail.textContent = id === 'ocean' ? 'Ocean view · King bed' : 'Dune outlook · Queen bed'; copy.append(name, detail);
    const rate = document.createElement('span'); rate.className = 'booking-choice-rate'; rate.textContent = money(room.rate);
    const unit = document.createElement('small'); unit.textContent = 'per night'; rate.append(unit);
    input.addEventListener('change', () => { selectedRoom = id; refreshEstimate(); });
    label.append(input, photo, copy, rate); return label;
  }));
}
$('stay-form').addEventListener('submit', event => {
  event.preventDefault();
  const arrival = $('arrival'), departure = $('departure');
  arrival.min = dateKey(new Date());
  if (arrival.value < arrival.min) { arrival.setCustomValidity('Choose today or a future arrival date.'); $('date-error').textContent = 'Choose today or a future arrival date.'; arrival.reportValidity(); return; }
  if (!Number.isFinite(nightCount()) || nightCount() < 1) { departure.setCustomValidity('Departure must be after your arrival.'); $('date-error').textContent = 'Departure must be after your arrival.'; departure.reportValidity(); return; }
  if (!$('stay-form').reportValidity()) return;
  if ($('stay-form').dataset.suite) { selectedRoom = $('stay-form').dataset.suite; delete $('stay-form').dataset.suite; }
  $('stay-dates').textContent = `${formattedDate(arrival.value)} – ${formattedDate(departure.value)} · ${$('guests').value} ${$('guests').value === '1' ? 'guest' : 'guests'}`;
  buildBookingChoices(); refreshEstimate(); openDialog($('booking-dialog'), $('stay-form').querySelector('button'));
});
$('preview-stay').addEventListener('click', () => {
  const nights = nightCount();
  $('stay-preview-text').textContent = `${nights} ${nights === 1 ? 'night' : 'nights'} in ${rooms[selectedRoom].name}, ${formattedDate($('arrival').value)} to ${formattedDate($('departure').value)}, for ${$('guests').value} ${$('guests').value === '1' ? 'guest' : 'guests'}. Your illustrative total is ${money(nights * rooms[selectedRoom].rate)}, including breakfast.`;
  $('stay-preview').hidden = false; $('preview-stay').hidden = true;
  $('stay-preview').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});

const guideTabs = [...document.querySelectorAll('[data-guide]')];
function chooseGuide(tab, focus = false) {
  const guide = guides[tab.dataset.guide];
  guideTabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
  $('guide-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('.guide-number').textContent = guide.number; $('guide-title').textContent = guide.title; $('guide-description').textContent = guide.description; $('guide-link').href = guide.link;
  $('guide-list').replaceChildren(...guide.list.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
  if (focus) tab.focus();
}
guideTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => chooseGuide(tab));
  tab.addEventListener('keydown', event => { let target; if (event.key === 'ArrowRight') target = guideTabs[(index + 1) % guideTabs.length]; if (event.key === 'ArrowLeft') target = guideTabs[(index + guideTabs.length - 1) % guideTabs.length]; if (event.key === 'Home') target = guideTabs[0]; if (event.key === 'End') target = guideTabs.at(-1); if (target) { event.preventDefault(); chooseGuide(target, true); } });
});
$('year').textContent = new Date().getFullYear();
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: .08 });
  document.querySelectorAll('[data-reveal]').forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
  motion.addEventListener('change', event => { if (event.matches) { observer.disconnect(); document.querySelectorAll('.reveal-ready').forEach(element => element.classList.add('is-visible')); } });
}
