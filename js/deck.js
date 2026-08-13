/* ============================================================
   deck.js — slide engine (no dependencies)
   Loads window.SLIDES (from slides.js), renders, navigates.
   ============================================================ */
(function () {
  'use strict';
  const SLIDES = window.SLIDES || [];
  const stage    = document.getElementById('stage');
  const ov       = document.getElementById('overview');
  const ovGrid   = document.getElementById('ovGrid');
  const elCount  = document.getElementById('count');
  const elTotal  = document.getElementById('total');
  const elBar    = document.getElementById('progress');
  let index = 0, slides = [];

  /* ---- render ---------------------------------------------------- */
  function render() {
    stage.innerHTML = SLIDES.map((s, i) => {
      const theme = s.theme || 'light';
      const body  = typeof s.render === 'function' ? s.render(s) : (s.html || '');
      return `<section class="slide" data-theme="${theme}" data-i="${i}">${body}</section>`;
    }).join('');
    slides = Array.prototype.slice.call(stage.querySelectorAll('.slide'));
    ovGrid.innerHTML = SLIDES.map((s, i) =>
      `<button class="ov-item" data-theme="${s.theme || 'light'}" data-goto="${i}">
         <span class="ov-item__label">${s.navTitle || s.title || ('Slide ' + (i + 1))}</span>
         <span class="ov-item__n">${i + 1}</span>
       </button>`).join('');
    elTotal.textContent = SLIDES.length;
  }

  /* ---- lazy media ------------------------------------------------ */
  function loadMedia(i) {
    const s = slides[i]; if (!s) return;
    s.querySelectorAll('[data-src]').forEach(el => {
      const src = el.getAttribute('data-src');
      if (el.tagName === 'IMG') el.src = src;
      else el.style.backgroundImage = 'url("' + src + '")';
      el.removeAttribute('data-src');
    });
  }

  /* ---- count-up -------------------------------------------------- */
  function animateCounts(s) {
    s.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const dur = 1400, t0 = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---- scale to viewport ----------------------------------------- */
  function scale() {
    const sc = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    document.documentElement.style.setProperty('--scale', sc);
  }

  /* ---- navigation ------------------------------------------------ */
  function go(n) {
    n = Math.max(0, Math.min(SLIDES.length - 1, n));
    const prev = index; index = n;
    [n - 1, n, n + 1].forEach(loadMedia);
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === n);
      s.classList.toggle('is-prev', i === prev && prev !== n);
    });
    animateCounts(slides[n]);
    elCount.textContent = n + 1;
    elBar.style.width = (SLIDES.length > 1 ? n / (SLIDES.length - 1) * 100 : 100) + '%';
    const hash = '#/' + (n + 1);
    if (location.hash !== hash) history.replaceState(null, '', hash);
    ovGrid.querySelectorAll('.ov-item').forEach((b, i) => b.classList.toggle('is-current', i === n));
  }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);
  window.deckGo = go; // QA hook

  /* ---- overview -------------------------------------------------- */
  function toggleOverview(open) {
    if (open === undefined) open = !ov.classList.contains('is-open');
    ov.classList.toggle('is-open', open);
  }

  /* ---- fullscreen ------------------------------------------------ */
  function toggleFullscreen() {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function(){})();
    else document.exitFullscreen();
  }

  /* ---- events ---------------------------------------------------- */
  window.addEventListener('keydown', e => {
    if (ov.classList.contains('is-open')) {
      if (['Escape', 'o', 'O'].includes(e.key)) toggleOverview(false);
      return;
    }
    switch (e.key) {
      case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
      case 'Home': go(0); break;
      case 'End': go(SLIDES.length - 1); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'o': case 'O': case 'Escape': toggleOverview(true); break;
    }
  });

  ovGrid.addEventListener('click', e => {
    const b = e.target.closest('[data-goto]'); if (!b) return;
    go(+b.getAttribute('data-goto')); toggleOverview(false);
  });

  document.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => {
    const a = b.getAttribute('data-action');
    if (a === 'next') next(); else if (a === 'prev') prev();
    else if (a === 'overview') toggleOverview(); else if (a === 'fullscreen') toggleFullscreen();
  }));

  // touch swipe
  let tx = 0, ty = 0;
  window.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
  }, { passive: true });

  window.addEventListener('resize', scale);

  /* ---- mouse parallax: set --mx/--my on the active slide --------- */
  let pmRaf = null;
  window.addEventListener('pointermove', e => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!pmRaf) pmRaf = requestAnimationFrame(() => {
      pmRaf = null;
      const s = slides[index];
      if (s) { s.style.setProperty('--mx', mx.toFixed(3)); s.style.setProperty('--my', my.toFixed(3)); }
    });
  }, { passive: true });

  /* ---- 3D cable: highlight a layer on hover --------------------- */
  function setHot(slide, idx) {
    const cable = slide.querySelector('.cable3d'); if (!cable) return;
    cable.classList.toggle('has-hot', idx != null);
    cable.querySelectorAll('.ring').forEach(r => r.classList.toggle('is-hot', r.dataset.layer === idx));
    slide.querySelectorAll('.layers--int li').forEach(li => li.classList.toggle('is-hot', li.dataset.layer === idx));
  }
  stage.addEventListener('mouseover', e => {
    const el = e.target.closest('[data-layer]'), slide = e.target.closest('.slide');
    if (el && slide && slide.querySelector('.cable3d')) setHot(slide, el.dataset.layer);
  });
  stage.addEventListener('mouseout', e => {
    const x3 = e.target.closest('.xsec--3d'), slide = e.target.closest('.slide');
    if (x3 && slide && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.xsec--3d'))) setHot(slide, null);
  });

  /* ---- click-to-enlarge lightbox -------------------------------- */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="lightbox__close" aria-label="Close">&times;</button><div class="lightbox__img"></div>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('.lightbox__img');
  const closeLB = () => lb.classList.remove('is-open');
  lb.addEventListener('click', closeLB);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('is-open')) { e.stopPropagation(); closeLB(); } }, true);
  stage.addEventListener('click', e => {
    const holder = e.target.closest('.pc__img, .step__img, .lcard__img, .cmp__img, .split__media, .xsec:not(.xsec--3d) .xsec__media');
    if (!holder) return;
    const im = holder.querySelector('.bleed__img');
    const bg = im && getComputedStyle(im).backgroundImage;
    const m = bg && bg.match(/url\("?([^")]+)"?\)/);
    if (m && m[1] && m[1] !== 'none') { lbImg.style.backgroundImage = 'url("' + m[1] + '")'; lb.classList.add('is-open'); }
  });

  /* ---- init ------------------------------------------------------ */
  render();
  scale();
  const fromHash = parseInt((location.hash.match(/#\/(\d+)/) || [])[1], 10);
  go(isNaN(fromHash) ? 0 : fromHash - 1);
})();
