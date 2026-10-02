/* SWS — SCADA Room case study. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // CLIENT NAMES — keep false until written publicity approval is received.
  // When approved: set SHOW_CLIENT_NAMES = true and fill in CLIENT_NAMES below.
  // Every element marked data-client="…" in index.html is then rewritten.
  // ---------------------------------------------------------------------------
  const SHOW_CLIENT_NAMES = false;
  const CLIENT_NAMES = {
    'project': '',        // e.g. "<Client> — <Project name>"            (eyebrow in hero)
    'project-lower': '',  // e.g. "<Client>'s <project name> in the Eastern Province" (overview sentence)
  };

  const CONTACT_EMAIL = 'INFO@SWSWELD.COM';

  // Gallery: image base name in assets/img (expects -800.jpg and -1600.jpg) + caption. wide = spans 2 columns.
  const GALLERY = [
    { src: 'loadout-night', alt: 'SCADA Room on the lowbed trailer under floodlights', cap: 'Loaded and secured for dispatch on 30 Sep 2026', wide: true },
    { src: 'crane-lift', alt: 'Crane lifting the SCADA Room by its spreader beam', cap: 'Crane lift on the lifting trunnions' },
    { src: 'welding', alt: 'Welder in protective gear working on the shelter door frame', cap: 'In-house welding and fabrication' },
    { src: 'bolted-connection', alt: 'Bolted lifting trunnion on the skid beam', cap: 'Lifting trunnion on the HEB 240 skid' },
    { src: 'skid-frame', alt: 'Skid frame with cable tray beneath the shelter', cap: 'Skid, supports and cable tray' },
    { src: 'three-quarter', alt: 'SCADA Room on its skid with stairs, doors open', cap: 'Completed shelter on its skid with stairs and platform', wide: true },
    { src: 'db-panel', alt: 'Open distribution board with breakers and colour-coded wiring', cap: 'Power distribution board' },
    { src: 'interior', alt: 'Interior ceiling with conduit, lighting and split A/C unit', cap: 'Interior: sandwich panels, conduit and split A/C' },
    { src: 'hvac', alt: 'Caged external A/C condensers on the shelter wall', cap: 'Split A/C condensers with protective cages' },
    { src: 'fire-exit', alt: 'Illuminated exit sign and alarm sounder above the door', cap: 'Fire & gas devices and emergency exit signage' },
    { src: 'crane-lift-wide', alt: 'Crane positioning the SCADA Room onto the trailer at night', cap: 'Night load-out', wide: true },
    { src: 'base-plate', alt: 'Painted support column on its base plate', cap: 'Support column and base plate after coating' },
    { src: 'cable-tray', alt: 'Cable tray run beneath the shelter floor', cap: 'Cable tray routing under the skid' },
    { src: 'inspection', alt: 'Engineer checking the shelter door hardware', cap: 'Final checks before presentation' },
    { src: 'hero-yard', alt: 'SCADA Room on its skid in the fabrication yard', cap: 'In the yard at Dammam 2nd Industrial City' },
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // --- Client names -----------------------------------------------------------
  if (SHOW_CLIENT_NAMES) {
    $$('[data-client]').forEach((el) => {
      const v = CLIENT_NAMES[el.dataset.client];
      if (v) el.textContent = v;
    });
  }

  // --- Mailto links -----------------------------------------------------------
  const briefing = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Capability Briefing Request — E-House / SCADA Room')}`
    + `&body=${encodeURIComponent('Hello SWS team,\n\nWe would like a capability briefing on your E-House / shelter fabrication.\n\nCompany:\nProject:\nTimeline:\n\nRegards,')}`;
  $$('[data-mailto="briefing"]').forEach((a) => a.setAttribute('href', briefing));

  // --- Gallery + lightbox -----------------------------------------------------
  const list = $('#gallery-list');
  if (list) {
    list.innerHTML = GALLERY.map((g, i) => `
      <li class="${g.wide ? 'is-wide' : ''}">
        <button type="button" data-index="${i}" aria-label="Open photo: ${g.cap}">
          <img src="assets/img/${g.src}-800.jpg" srcset="assets/img/${g.src}-800.jpg 800w, assets/img/${g.src}-1600.jpg 1600w"
               sizes="(min-width: 900px) ${g.wide ? '50vw' : '25vw'}, (min-width: 600px) 33vw, 50vw"
               alt="${g.alt}" loading="lazy" decoding="async" width="800" height="600">
          <span class="cap">${g.cap}</span>
        </button>
      </li>`).join('');
  }

  const lb = $('#lightbox');
  const lbImg = $('#lb-img');
  const lbCap = $('#lb-cap');
  let current = 0;
  let opener = null;

  function show(i) {
    current = (i + GALLERY.length) % GALLERY.length;
    const g = GALLERY[current];
    lbImg.src = `assets/img/${g.src}-1600.jpg`;
    lbImg.alt = g.alt;
    lbCap.textContent = `${g.cap}  ·  ${current + 1} / ${GALLERY.length}`;
  }
  function open(i, btn) {
    opener = btn;
    show(i);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    $('.lb-close', lb).focus();
  }
  function close() {
    if (typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open');
  }

  if (list && lb) {
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-index]');
      if (btn) open(+btn.dataset.index, btn);
    });
    lb.addEventListener('click', (e) => {
      const act = e.target.closest('[data-lb]')?.dataset.lb;
      if (act === 'close') close();
      else if (act === 'prev') show(current - 1);
      else if (act === 'next') show(current + 1);
      else if (e.target === lb) close(); // backdrop click
    });
    lb.addEventListener('close', () => opener && opener.focus());
    lb.addEventListener('keydown', (e) => {
      const rtl = document.dir === 'rtl';
      if (e.key === 'ArrowRight') show(current + (rtl ? -1 : 1));
      if (e.key === 'ArrowLeft') show(current + (rtl ? 1 : -1));
    });
    // Swipe on touch devices
    let x0 = null;
    lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // --- Counters ---------------------------------------------------------------
  const counters = $$('.count');
  function runCounter(el) {
    const target = +el.dataset.target;
    if (reduceMotion) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  }

  // --- Reveal on scroll ------------------------------------------------------
  const revealTargets = $$('.section-title, .tl-item, .spec-col, .proof-item, .cred, .video-grid figure');
  if ('IntersectionObserver' in window) {
    if (!reduceMotion) {
      document.documentElement.classList.add('js-reveal');
      revealTargets.forEach((el) => el.classList.add('reveal'));
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        if (en.target.classList.contains('count')) runCounter(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.2 });
    revealTargets.forEach((el) => io.observe(el));
    counters.forEach((el) => io.observe(el));
  }

  // --- Contact form → mailto ---------------------------------------------------
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach((f) => {
        const bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && ok) { f.focus(); ok = false; }
      });
      const note = $('#form-note');
      if (!ok) { note.textContent = 'Please complete name, a valid email and your message.'; return; }
      const d = Object.fromEntries(new FormData(form));
      const subject = `Enquiry from ${d.name}${d.company ? ' — ' + d.company : ''}`;
      const body = `${d.message}\n\n—\n${d.name}\n${d.company || ''}\n${d.email}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = 'Your email app should open with the message ready to send.';
    });
  }

  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
