// =============================================================
//  Logistics Partner Network — page scripts (uses LF from data.js)
// =============================================================
document.documentElement.classList.remove('no-js');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const params = new URLSearchParams(location.search);

// ---------- Icons ----------
const ICONS = {
  pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  glass: '<path d="M7 3h10l-1 9a4 4 0 0 1-8 0L7 3Z"/><path d="M12 16v5M8 21h8"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  brick: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9.5h18M3 14.5h18M9 4v5.5M15 9.5v5M9 14.5V20"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  shirt: '<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0Z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  truck: '<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/>',
};
const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.box}</svg>`;

function truckArt(type) {
  const fridge = type === 'Refrigerated';
  const flat = type === 'Flatbed' || type === 'Tipper';
  const body = flat
    ? `<rect x="8" y="58" width="150" height="10" rx="2" fill="#3a4350"/>${type === 'Tipper' ? '<path d="M14 58 L30 28 H150 L156 58 Z" fill="#22303a" stroke="#4a5563"/>' : '<rect x="20" y="40" width="40" height="18" rx="2" fill="#22303a" stroke="#4a5563"/><rect x="64" y="34" width="50" height="24" rx="2" fill="#22303a" stroke="#4a5563"/>'}`
    : `<rect x="8" y="14" width="150" height="54" rx="4" fill="#1a222c" stroke="#3a4350"/><rect x="8" y="14" width="150" height="10" rx="4" fill="#D4AF37"/>${fridge ? '<rect x="16" y="30" width="22" height="16" rx="3" fill="#0F5D4E"/><path d="M27 33v10M22 38h10" stroke="#F5EEDC" stroke-width="2"/>' : ''}`;
  return `<svg viewBox="0 0 230 96" aria-hidden="true">
    <ellipse cx="118" cy="90" rx="110" ry="4" fill="#000" opacity=".45"/>
    ${body}
    <path d="M162 30h32c6 0 10 3 13 8l12 18v14h-57Z" fill="#0F5D4E"/>
    <path d="M170 36h22c3 0 5 1 7 4l7 11h-36Z" fill="#b9d8cf"/>
    <rect x="160" y="64" width="62" height="6" rx="2" fill="#072b24"/>
    <g fill="#05070a"><circle cx="38" cy="76" r="11"/><circle cx="66" cy="76" r="11"/><circle cx="188" cy="76" r="11"/></g>
    <g fill="#D4AF37"><circle cx="38" cy="76" r="4.5"/><circle cx="66" cy="76" r="4.5"/><circle cx="188" cy="76" r="4.5"/></g>
  </svg>`;
}

// ---------- Mobile menu ----------
const nav = $('.nav');
const menuBtn = $('.menu-btn');
if (nav && menuBtn) {
  const setOpen = (o) => { nav.classList.toggle('is-open', o); menuBtn.setAttribute('aria-expanded', String(o)); menuBtn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); };
  menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  $$('.nav-links a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (innerWidth > 900) setOpen(false); });
}
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// ---------- Toast ----------
function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}

// ---------- Reveal ----------
function reveal() {
  const els = $$('.reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.1 });
  els.forEach((e) => io.observe(e));
}

// ---------- Shared renderers ----------
function truckCard(t) {
  return `<article class="tcard reveal">
    <div class="tcard-media">
      <span class="badge${t.available ? '' : ' busy'}">${t.available ? 'Available' : 'On a trip'}</span>
      ${truckArt(t.type)}
    </div>
    <div class="tcard-body">
      <h3>${esc(t.type)} · ${esc(t.capacity)}t</h3>
      <div class="owner"><svg class="verified" viewBox="0 0 24 24" fill="#D4AF37" aria-hidden="true"><path d="M12 2 9.5 4.5 6 4l-.5 3.5L2.5 10 4 13l-1 3.5 3.5 1L8 21l3-1.5 3 1.5 1.5-3.5 3.5-1L20 13l1.5-3-3-2.5L18 4l-3.5.5L12 2Z"/><path d="m8.5 12 2.3 2.3 4.7-4.6" stroke="#0B0F14" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>${esc(t.owner)}</div>
      <div class="specs">
        <div>Base<b>${esc(t.city)}</b></div>
        <div>Model<b>${esc(t.model || '—')}</b></div>
        <div>Per km<b>${LF.naira(t.km)}</b></div>
        <div>Plate<b>${esc(t.plate || '—')}</b></div>
      </div>
      <div class="price-row">
        <div><strong>${LF.naira(t.day)}</strong> <small>/ day</small></div>
        ${t.available
          ? `<a class="btn btn-primary btn-sm" href="/lease?truck=${encodeURIComponent(t.id)}">Lease truck</a>`
          : '<button class="btn btn-light btn-sm" disabled>Unavailable</button>'}
      </div>
    </div>
  </article>`;
}

function fillSelect(sel, items, { placeholder } = {}) {
  if (!sel) return;
  sel.innerHTML = (placeholder ? `<option value="">${esc(placeholder)}</option>` : '') +
    items.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('');
}
const cityOptions = () => Object.keys(LF.CITIES).sort().map((c) => [c, c]);

// =============================================================
//  PAGES
// =============================================================
const page = document.body.dataset.page;

// ---------- Home ----------
if (page === 'home') {
  const featured = $('#featured');
  if (featured) featured.innerHTML = LF.allTrucks().filter((t) => t.available).slice(0, 3).map(truckCard).join('');
  const goods = $('#goods-grid');
  if (goods) goods.innerHTML = LF.GOODS.map((g) => `<button type="button" class="goods reveal" data-goods="${g.id}" aria-haspopup="dialog"><span class="icon">${svg(g.icon)}</span><span>${esc(g.short)}<small>${esc(g.note)}</small></span><span class="go">${svg('arrow')}</span></button>`).join('');

  // Shipment dialog: describe the load, then continue to the lease form
  const dlg = $('#ship-dialog'), sform = $('#ship-form');
  if (dlg && sform) {
    const sStatus = $('.form-status', sform);
    fillSelect($('#ship-nature'), LF.NATURES.map((n) => [n, n]), { placeholder: 'Select nature' });
    fillSelect($('#ship-unit'), LF.UNITS.map((u) => [u, u]));
    fillSelect($('#ship-speed'), LF.SPEEDS.map((x) => [x.id, x.name + (x.surcharge ? ` · +${Math.round(x.surcharge * 100)}%` : '')]));
    fillSelect($('#ship-from'), cityOptions(), { placeholder: 'Pickup city' });
    fillSelect($('#ship-to'), cityOptions(), { placeholder: 'Delivery city' });
    const defaultNature = { drugs: 'Temperature-controlled', glass: 'Fragile', food: 'Perishable', electronics: 'High value', building: 'Heavy / bulky', solar: 'Fragile' };
    goods.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-goods]'); if (!b) return;
      const g = LF.GOODS.find((x) => x.id === b.dataset.goods);
      sform.reset(); sStatus.textContent = ''; sStatus.className = 'form-status';
      $$('.field-err', sform).forEach((el) => el.classList.remove('field-err'));
      $('#ship-goods').value = g.id;
      $('#ship-title').textContent = `Ship ${g.short.toLowerCase()}`;
      $('#ship-note').textContent = g.note + (g.surcharge ? ` · ${Math.round(g.surcharge * 100)}% handling` : '');
      $('#ship-icon').innerHTML = svg(g.icon);
      if (defaultNature[g.id]) sform.elements.nature.value = defaultNature[g.id];
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      setTimeout(() => sform.elements.detail.focus(), 50);
    });
    $('.dlg-close', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    sform.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.field-err', sform).forEach((el) => el.classList.remove('field-err'));
      const d = Object.fromEntries(new FormData(sform));
      const bad = ['detail', 'nature', 'weight', 'qty', 'speed', 'from', 'to'].filter((k) => !String(d[k] || '').trim() || (['weight', 'qty'].includes(k) && !(Number(d[k]) > 0)));
      if (d.from && d.to && d.from === d.to) bad.push('to');
      if (Number(d.weight) > 30) bad.push('weight');
      bad.forEach((k) => sform.elements[k].classList.add('field-err'));
      if (bad.length) {
        sStatus.className = 'form-status err';
        sStatus.textContent = Number(d.weight) > 30 ? 'Our largest trucks carry 30 tonnes — please split the load or lower the weight.' : (d.from && d.from === d.to ? 'Pickup and delivery cities must be different.' : 'Please complete the highlighted fields.');
        $('.field-err', sform)?.focus();
        return;
      }
      const q = new URLSearchParams({ goods: d.goods, detail: d.detail.trim(), nature: d.nature, weight: d.weight, qty: d.qty, unit: d.unit, speed: d.speed, from: d.from, to: d.to });
      if (d.addr.trim()) q.set('addr', d.addr.trim());
      location.href = '/lease?' + q.toString();
    });
  }
}

// Clear a field's error outline as soon as the visitor edits it
document.addEventListener('input', (e) => { if (e.target.classList?.contains('field-err')) e.target.classList.remove('field-err'); });
document.addEventListener('change', (e) => { if (e.target.classList?.contains('field-err')) e.target.classList.remove('field-err'); });

// ---------- Tap / hover cards: tap toggles the highlighted state on touch screens ----------
$$('.tap-card').forEach((card) => {
  const toggle = () => {
    const on = !card.classList.contains('is-on');
    $$('.tap-card.is-on').forEach((c) => c.classList.remove('is-on'));
    card.classList.toggle('is-on', on);
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});
document.addEventListener('click', (e) => { if (!e.target.closest('.tap-card')) $$('.tap-card.is-on').forEach((c) => c.classList.remove('is-on')); });

// Quick-track forms (home hero + anywhere)
$$('form[data-track]').forEach((f) => f.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = (new FormData(f).get('id') || '').toString().trim();
  location.href = '/track' + (id ? '?id=' + encodeURIComponent(id.toUpperCase()) : '');
}));

// ---------- Trucks marketplace ----------
if (page === 'trucks') {
  const grid = $('#truck-grid'), count = $('#result-count');
  const fCity = $('#f-city'), fType = $('#f-type'), fCap = $('#f-cap'), fAvail = $('#f-avail');
  fillSelect(fCity, cityOptions(), { placeholder: 'All cities' });
  fillSelect(fType, LF.TRUCK_TYPES.map((t) => [t, t]), { placeholder: 'All truck types' });
  if (params.get('city')) fCity.value = params.get('city');
  function render() {
    const cap = Number(fCap.value || 0);
    const list = LF.allTrucks().filter((t) =>
      (!fCity.value || t.city === fCity.value) &&
      (!fType.value || t.type === fType.value) &&
      t.capacity >= cap &&
      (fAvail.value !== 'available' || t.available));
    count.textContent = `${list.length} truck${list.length === 1 ? '' : 's'} found`;
    grid.innerHTML = list.length ? list.map(truckCard).join('') : '<div class="empty">No trucks match these filters. Try another city or a smaller capacity.</div>';
    reveal();
  }
  [fCity, fType, fCap, fAvail].forEach((el) => el.addEventListener('change', render));
  render();
}

// ---------- Lease a truck ----------
if (page === 'lease') {
  const form = $('#lease-form');
  const truckSel = $('#truck'), fromSel = $('#from'), toSel = $('#to'), goodsSel = $('#goods');
  const kmIn = $('#km'), daysIn = $('#days'), weightIn = $('#weight'), startIn = $('#start');
  const speedSel = $('#speed'), natureSel = $('#nature'), unitSel = $('#unit');
  const status = $('.form-status', form);

  const available = LF.allTrucks().filter((t) => t.available);
  fillSelect(truckSel, available.map((t) => [t.id, `${t.type} · ${t.capacity}t — ${t.owner} (${t.city})`]), { placeholder: 'Choose a truck' });
  fillSelect(fromSel, cityOptions(), { placeholder: 'Pickup city (Point A)' });
  fillSelect(toSel, cityOptions(), { placeholder: 'Destination (Point B)' });
  fillSelect(goodsSel, LF.GOODS.map((g) => [g.id, g.name]), { placeholder: 'Select type of goods' });
  fillSelect(speedSel, LF.SPEEDS.map((x) => [x.id, x.name + (x.surcharge ? ` · +${Math.round(x.surcharge * 100)}%` : '')]));
  fillSelect(natureSel, LF.NATURES.map((n) => [n, n]), { placeholder: 'Select nature' });
  fillSelect(unitSel, LF.UNITS.map((u) => [u, u]));

  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  startIn.min = today.toISOString().slice(0, 10);
  startIn.value = startIn.min;

  const pre = params.get('truck') && LF.findTruck(params.get('truck'));
  if (pre && pre.available) { truckSel.value = pre.id; fromSel.value = pre.city; }

  // Prefill from the "Goods we move" form on the home page
  const setIf = (el, v) => { if (el && v != null && v !== '') { el.value = v; } };
  if (params.get('goods')) {
    setIf(goodsSel, params.get('goods')); setIf(form.elements.goodsDetail, params.get('detail'));
    setIf(natureSel, params.get('nature')); setIf(weightIn, params.get('weight'));
    setIf(form.elements.qty, params.get('qty')); setIf(unitSel, params.get('unit'));
    setIf(speedSel, params.get('speed')); setIf(fromSel, params.get('from'));
    setIf(toSel, params.get('to')); setIf(form.elements.addr, params.get('addr'));
    if (!pre) {
      // Suggest the cheapest available truck big enough for the load, preferring one based at the pickup city
      const w = Number(params.get('weight')) || 0;
      const fits = available.filter((t) => t.capacity >= w).sort((a, b) => (b.city === fromSel.value) - (a.city === fromSel.value) || a.day - b.day);
      if (fits[0]) truckSel.value = fits[0].id;
    }
    const note = document.createElement('p');
    note.className = 'prefill-note';
    note.textContent = 'We’ve filled in your goods details and suggested a truck that fits your load. Add your company details to book.';
    form.prepend(note);
  }

  let kmTouched = false;
  kmIn.addEventListener('input', () => { kmTouched = true; update(); });
  function autoKm() {
    if (fromSel.value && toSel.value && !kmTouched) kmIn.value = LF.distanceKm(fromSel.value, toSel.value) || '';
  }
  [fromSel, toSel].forEach((s) => s.addEventListener('change', () => { kmTouched = false; autoKm(); update(); }));
  [truckSel, goodsSel, daysIn, weightIn, speedSel].forEach((s) => s.addEventListener('input', update));

  function update() {
    const t = LF.findTruck(truckSel.value);
    const days = Math.max(0, Number(daysIn.value) || 0);
    const km = Math.max(0, Number(kmIn.value) || 0);
    const q = LF.quote({ truck: t, days, km, goodsId: goodsSel.value, speedId: speedSel.value });
    $('#q-truck').innerHTML = t
      ? `<span class="icon">${svg('truck')}</span><div><b>${esc(t.type)} · ${esc(t.capacity)}t</b><span>${esc(t.owner)} · ${LF.naira(t.day)}/day · ${LF.naira(t.km)}/km</span></div>`
      : `<span class="icon">${svg('truck')}</span><div><b>No truck selected</b><span>Choose a truck to see pricing</span></div>`;
    $('#q-lease').textContent = `${LF.naira(q.lease)}`;
    $('#q-lease-l').textContent = `Truck lease (${days} day${days === 1 ? '' : 's'})`;
    $('#q-dist').textContent = LF.naira(q.distance);
    $('#q-dist-l').textContent = `Distance (${km.toLocaleString()} km)`;
    $('#q-hand').textContent = LF.naira(q.handling);
    $('#q-hand-l').textContent = `Goods handling (${Math.round(q.handlingRate * 100)}%)`;
    $('#q-speed').textContent = LF.naira(q.speed);
    $('#q-speed-l').textContent = `Delivery: ${q.speedInfo.short}${q.speedRate ? ` (+${Math.round(q.speedRate * 100)}%)` : ''}`;
    $('#q-ins').textContent = LF.naira(q.insurance);
    $('#q-fee').textContent = LF.naira(q.fee);
    $('#q-total').textContent = LF.naira(q.total);
    $('#q-owner').textContent = t ? `${LF.naira(q.ownerGets)} goes to ${t.owner}.` : '';
    $('#q-eta').textContent = km ? `Estimated driving time: about ${LF.hoursFor(km)} hours.` : '';
    weightIn.max = t ? t.capacity : '';
    return { t, q, days, km };
  }
  autoKm(); update();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    $$('.field-err', form).forEach((el) => el.classList.remove('field-err'));
    const d = Object.fromEntries(new FormData(form));
    const { t, q, days, km } = update();
    const errors = [];
    const need = (name, msg) => { if (!String(d[name] || '').trim()) { errors.push(msg); form.elements[name].classList.add('field-err'); } };
    need('company', 'company name'); need('email', 'email'); need('purpose', 'purpose');
    need('goods', 'type of goods'); need('truck', 'truck'); need('from', 'pickup city'); need('to', 'destination');
    if (d.from && d.to && d.from === d.to) { errors.push('different pickup and destination'); toSel.classList.add('field-err'); }
    if (!(days >= 1)) { errors.push('duration of at least 1 day'); daysIn.classList.add('field-err'); }
    if (!(km >= 1)) { errors.push('distance'); kmIn.classList.add('field-err'); }
    if (t && Number(d.weight) > t.capacity) { errors.push(`load within the truck's ${t.capacity}t capacity`); weightIn.classList.add('field-err'); }
    if (d.goods === 'general' && !String(d.goodsDetail || '').trim()) { errors.push('a description of the goods'); form.elements.goodsDetail.classList.add('field-err'); }
    if (errors.length) {
      status.className = 'form-status err';
      status.textContent = 'Please add: ' + errors.join(', ') + '.';
      $('.field-err', form)?.focus();
      return;
    }
    const booking = {
      id: LF.newTrackingId(), createdAt: Date.now(),
      company: d.company.trim(), email: d.email.trim(), phone: (d.phone || '').trim(), purpose: d.purpose.trim(),
      goodsId: d.goods, goodsDetail: (d.goodsDetail || '').trim(), weight: Number(d.weight) || null,
      nature: d.nature || '', qty: Number(d.qty) || null, unit: d.unit || '', speed: d.speed || 'standard', addr: (d.addr || '').trim(),
      from: d.from, to: d.to, km, days, start: d.start, truckId: t.id, total: q.total, ownerGets: q.ownerGets,
    };
    LF.saveBooking(booking);
    $('#lease-wrap').hidden = true;
    const c = $('#confirm');
    c.hidden = false;
    $('#c-id').textContent = booking.id;
    $('#c-summary').innerHTML = [
      ['Company', booking.company], ['Truck', `${t.type} · ${t.owner}`],
      ['Route', `${booking.from} → ${booking.to} (${km.toLocaleString()} km)`], ['Duration', `${days} day${days === 1 ? '' : 's'} from ${booking.start}`],
      ['Goods', q.goods.short + (booking.goodsDetail ? ` — ${booking.goodsDetail}` : '')],
      ['Load', [booking.qty ? `${booking.qty.toLocaleString()} ${booking.unit}` : '', booking.weight ? `${booking.weight} t` : '', booking.nature].filter(Boolean).join(' · ') || '—'],
      ['Delivery', q.speedInfo.name + (booking.addr ? ` to ${booking.addr}` : '')], ['Total to pay', LF.naira(q.total)],
    ].map(([k, v]) => `<div>${esc(k)}<b>${esc(v)}</b></div>`).join('');
    $('#c-track').href = '/track?id=' + booking.id;
    $('#c-copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(booking.id); toast('Tracking ID copied'); } catch { toast('Tracking ID: ' + booking.id); }
    });
    scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Track a shipment ----------
if (page === 'track') {
  const form = $('#track-form'), input = $('#track-id'), out = $('#track-out');
  $('#demo-ids').innerHTML = 'Try a demo ID: ' + LF.DEMO.map((d) => `<button type="button" data-id="${d.id}">${d.id}</button>`).join('') +
    (LF.myBookings().length ? '<br>Your bookings: ' + LF.myBookings().slice(0, 4).map((b) => `<button type="button" data-id="${b.id}">${b.id}</button>`).join('') : '');
  $('#demo-ids').addEventListener('click', (e) => { const b = e.target.closest('button[data-id]'); if (b) { input.value = b.dataset.id; show(b.dataset.id, true); } });
  form.addEventListener('submit', (e) => { e.preventDefault(); show(input.value, true); });
  if (params.get('id')) { input.value = params.get('id'); show(params.get('id')); }

  function project([lat, lon]) { return [20 + ((lon - 2.4) / (14.9 - 2.4)) * 560, 20 + ((14 - lat) / (14 - 4.2)) * 330]; }

  function show(id, push) {
    const s = LF.findShipment(id);
    if (push) history.replaceState(null, '', '/track?id=' + encodeURIComponent(String(id).trim().toUpperCase()));
    if (!s) {
      out.innerHTML = `<div class="not-found">No shipment found for <b>${esc(String(id).toUpperCase())}</b>. Check the ID and try again — it looks like <b>LPN-XXXXXX</b>.</div>`;
      return;
    }
    const truck = LF.findTruck(s.truckId) || {};
    const goods = LF.GOODS.find((g) => g.id === s.goodsId) || LF.GOODS[LF.GOODS.length - 1];
    const p = s.progress;
    const stage = p <= 0 ? 0 : p >= 1 ? 3 : p < 0.08 ? 1 : 2;
    const pill = stage === 3 ? ['done', 'Delivered'] : stage === 0 ? ['wait', 'Awaiting pickup'] : ['', 'In transit'];
    const [ax, ay] = project(LF.CITIES[s.from]), [bx, by] = project(LF.CITIES[s.to]);
    const tx = ax + (bx - ax) * p, ty = ay + (by - ay) * p;
    const kmLeft = Math.round(s.km * (1 - p));
    const hoursLeft = Math.ceil(kmLeft / 45);
    const near = (x, y) => Math.hypot(x - ax, y - ay) < 60 || Math.hypot(x - bx, y - by) < 60;
    const quiet = ['Abeokuta', 'Onitsha', 'Ibadan'];
    const cityDots = Object.entries(LF.CITIES).map(([name, ll]) => {
      const [x, y] = project(ll);
      if (name === s.from || name === s.to) return '';
      if (near(x, y)) return '';
      const left = name === 'Port Harcourt' || name === 'Benin City';
      const label = !quiet.includes(name)
        ? `<text x="${(x + (left ? -6 : 6)).toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${left ? 'end' : 'start'}" font-size="11" fill="#8b8676">${esc(name)}</text>` : '';
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#4a5563"/>${label}`;
    }).join('');
    const steps = [
      ['Booked', `Tracking ID issued to ${s.company}`],
      ['Picked up', `Loaded at ${s.from}`],
      ['In transit', p > 0 && p < 1 ? `${Math.round(p * 100)}% of the way · about ${kmLeft.toLocaleString()} km to go` : 'On the road to destination'],
      ['Delivered', `Arrived at ${s.to}`],
    ];
    out.innerHTML = `<div class="track-result">
      <section class="panel map-card">
        <div class="map-head"><h2>${esc(s.id)}</h2><span class="status-pill ${pill[0]}"><i></i>${pill[1]}</span></div>
        <div class="map">
          <svg viewBox="0 0 600 370" role="img" aria-label="Route from ${esc(s.from)} to ${esc(s.to)}">
            <defs><pattern id="gridp" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#172029" stroke-width="1"/></pattern></defs>
            <rect width="600" height="370" fill="url(#gridp)"/>
            ${cityDots}
            <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#26313c" stroke-width="5" stroke-linecap="round"/>
            <line x1="${ax}" y1="${ay}" x2="${tx}" y2="${ty}" stroke="#D4AF37" stroke-width="5" stroke-linecap="round"/>
            <circle cx="${ax}" cy="${ay}" r="9" fill="#0B0F14" stroke="#D4AF37" stroke-width="4"/>
            <circle cx="${bx}" cy="${by}" r="9" fill="#0B0F14" stroke="#3cc89c" stroke-width="4"/>
            <text x="${ax}" y="${ay - 16}" text-anchor="middle" font-size="13" font-weight="700" fill="#F5EEDC">A · ${esc(s.from)}</text>
            <text x="${bx}" y="${by + 26}" text-anchor="middle" font-size="13" font-weight="700" fill="#F5EEDC">B · ${esc(s.to)}</text>
            <g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)})">
              <circle r="20" fill="#D4AF37" opacity=".2"/>
              <circle r="13" fill="#D4AF37"/>
              <path d="M-7 -3h7v6h-7zM0 -1h3l3 3v1H0z" fill="#0B0F14"/>
            </g>
          </svg>
        </div>
        <div class="route-bar">
          <div class="route-ends"><div>Point A<b>${esc(s.from)}</b></div><div>Point B<b>${esc(s.to)}</b></div></div>
          <div class="progress" role="progressbar" aria-valuenow="${Math.round(p * 100)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${(p * 100).toFixed(1)}%"></i></div>
          <div class="progress-meta"><span>${Math.round(p * 100)}% complete · ${s.km.toLocaleString()} km route</span><span>${stage === 3 ? 'Delivered' : `ETA about ${hoursLeft} h`}</span></div>
        </div>
      </section>
      <aside class="panel">
        <h2>Shipment details</h2>
        <ol class="timeline">${steps.map((st, i) => `<li class="${i < stage || stage === 3 ? 'done' : i === stage ? 'now' : ''}"><b>${st[0]}</b>${esc(st[1])}</li>`).join('')}</ol>
        <div class="details">
          <div><span>Company</span><span>${esc(s.company)}</span></div>
          <div><span>Purpose</span><span>${esc(s.purpose || '—')}</span></div>
          <div><span>Goods</span><span>${esc(goods.short)}${s.goodsDetail ? ' — ' + esc(s.goodsDetail) : ''}</span></div>
          ${s.qty || s.weight || s.nature ? `<div><span>Load</span><span>${esc([s.qty ? `${Number(s.qty).toLocaleString()} ${s.unit || ''}` : '', s.weight ? `${s.weight} t` : '', s.nature].filter(Boolean).join(' · '))}</span></div>` : ''}
          <div><span>Delivery</span><span>${esc((LF.SPEEDS.find((x) => x.id === s.speed) || LF.SPEEDS[0]).name)}${s.addr ? ' — ' + esc(s.addr) : ''}</span></div>
          <div><span>Truck</span><span>${esc(truck.type || '')} · ${esc(truck.plate || '')}</span></div>
          <div><span>Operated by</span><span>${esc(truck.owner || '—')}</span></div>
          <div><span>Lease duration</span><span>${s.days} day${s.days === 1 ? '' : 's'}</span></div>
          <div><span>Amount</span><span>${LF.naira(s.total)}</span></div>
        </div>
        ${s.demo ? '<p class="qnote">Demo shipment. Positions are simulated for this concept site.</p>' : '<p class="qnote">Saved in this browser. Position is simulated for this concept site.</p>'}
      </aside>
    </div>`;
  }
}

// ---------- List your truck ----------
if (page === 'list') {
  const form = $('#list-form'), status = $('.form-status', form);
  fillSelect($('#l-type'), LF.TRUCK_TYPES.map((t) => [t, t]), { placeholder: 'Select truck type' });
  fillSelect($('#l-city'), cityOptions(), { placeholder: 'Select city' });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    $$('.field-err', form).forEach((el) => el.classList.remove('field-err'));
    const d = Object.fromEntries(new FormData(form));
    const missing = ['owner', 'email', 'type', 'capacity', 'city', 'day', 'km'].filter((k) => !String(d[k] || '').trim() || (['capacity', 'day', 'km'].includes(k) && !(Number(d[k]) > 0)));
    missing.forEach((k) => form.elements[k].classList.add('field-err'));
    if (missing.length) { status.className = 'form-status err'; status.textContent = 'Please complete the highlighted fields.'; $('.field-err', form)?.focus(); return; }
    const truck = {
      id: 'T-' + Date.now().toString(36).toUpperCase(), owner: d.owner.trim(), type: d.type, model: (d.model || '').trim(),
      capacity: Number(d.capacity), city: d.city, day: Math.round(Number(d.day)), km: Math.round(Number(d.km)),
      plate: (d.plate || '').trim().toUpperCase(), available: true,
    };
    LF.addTruck(truck);
    form.reset();
    status.className = 'form-status ok';
    status.innerHTML = `Your ${esc(truck.type.toLowerCase())} is now listed. <a href="/trucks?city=${encodeURIComponent(truck.city)}" style="text-decoration:underline">See it in the marketplace →</a>`;
    toast('Truck listed');
  });
}

reveal();
