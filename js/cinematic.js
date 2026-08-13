/* ============================================================
   cinematic.js — scroll engine for the Tonn Cable site
   reveals · counters · pinned "Line" build · parallax · lightbox
   Dependency-free.
   ============================================================ */
(function () {
  'use strict';
  const root = document.documentElement;

  /* ---- always open at the welcome cover ----
     Browsers default to scrollRestoration:'auto', which re-opens the page at the
     last scroll position. Force manual restoration and start at the top so the
     link always begins on the welcome slide. */
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  window.scrollTo(0, 0);
  /* Only reset to top on load if the user hasn't scrolled or navigated to a hash */
  window.addEventListener('load', function () {
    if (window.scrollY === 0 && !location.hash) window.scrollTo(0, 0);
  });

  /* ---- power-up intro loader ---- */
  const loader = document.getElementById('loader');
  if (loader) {
    if (sessionStorage.getItem('tcIntro')) { loader.remove(); }
    else {
      const finish = () => { loader.classList.add('done'); try { sessionStorage.setItem('tcIntro', '1'); } catch (e) {} setTimeout(() => loader.remove(), 700); };
      setTimeout(finish, 2050);
      loader.addEventListener('click', finish);
    }
  }

  /* ---- reveal on scroll + counters ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.hasAttribute('data-count')) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal],[data-count]').forEach(el => io.observe(el));

  /* ---- certificate focus modal (logo + certificate side by side) ---- */
  (function certModal() {
    const modal = document.getElementById('certmodal');
    const cards = document.querySelectorAll('.cert[data-cert]');
    if (!modal || !cards.length) return;
    const logoImg = modal.querySelector('.certmodal__logo img');
    const title = modal.querySelector('.certmodal__title');
    const docImg = modal.querySelector('.certmodal__doc img');
    function open(card) {
      const lg = card.querySelector('.cert__img img');
      const nm = card.querySelector('.cert__name');
      logoImg.src = lg ? lg.getAttribute('src') : '';
      title.textContent = nm ? nm.textContent : '';
      docImg.src = card.getAttribute('data-cert');
      modal.classList.add('open');
    }
    function close() { modal.classList.remove('open'); docImg.removeAttribute('src'); }
    document.addEventListener('click', e => { const c = e.target.closest('.cert[data-cert]'); if (c) open(c); });
    modal.addEventListener('click', e => { if (e.target === modal || e.target.classList.contains('certmodal__close')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();

  /* ---- interactive TRAIN-TRACK timeline (gentle wave) ---- */
  (function trainTimeline() {
    const track = document.getElementById('traintl');
    if (!track) return;
    const stops = track.querySelectorAll('.tstop');
    const nodes = track.querySelectorAll('.tnode');
    const rail = track.querySelector('.traintl__rail');
    const svg = track.querySelector('.traintl__svg');
    const base = track.querySelector('.traintl__base');
    const fill = track.querySelector('.traintl__fill');
    const train = track.querySelector('.traintl__train');
    const bg = track.querySelector('.traintl__bg');
    const n = stops.length;
    if (!n || !svg) return;

    let pts = [], totalLen = 0, cur = -1;
    const SVGH = 120;

    function smoothPath(p) {
      if (p.length < 2) return '';
      let d = 'M' + p[0].x.toFixed(1) + ',' + p[0].y.toFixed(1);
      for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p[i + 1];
        const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
        d += ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + p2.x.toFixed(1) + ',' + p2.y.toFixed(1);
      }
      return d;
    }

    function layout() {
      const W = rail.clientWidth || 800;
      const amp = Math.min(34, W * 0.035);     // gentle wave height
      const mid = SVGH / 2;
      pts = [];
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) / n * W;
        const y = mid + amp * Math.sin(i / (n - 1) * Math.PI * 2.5);
        pts.push({ x: x, y: y });
      }
      const d = smoothPath(pts);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + SVGH);
      svg.setAttribute('width', W); svg.setAttribute('height', SVGH);
      base.setAttribute('d', d); fill.setAttribute('d', d);
      totalLen = fill.getTotalLength();
      fill.style.strokeDasharray = totalLen;
      nodes.forEach((node, i) => { node.style.left = pts[i].x + 'px'; node.style.top = pts[i].y + 'px'; });
    }

    function apply() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      if (totalLen) {
        const len = progress * totalLen;
        fill.style.strokeDashoffset = (totalLen - len);
        const pt = fill.getPointAtLength(len);
        train.style.left = pt.x + 'px'; train.style.top = pt.y + 'px';
      }
      const idx = Math.round(progress * (n - 1));
      if (idx !== cur) {
        if (cur >= 0) { stops[cur].classList.remove('is-on'); nodes[cur].classList.remove('is-on'); }
        stops[idx].classList.add('is-on'); nodes[idx].classList.add('is-on');
        if (bg) {
          const src = stops[idx].getAttribute('data-bg');
          if (src) { bg.style.backgroundImage = 'url("' + src + '")'; bg.style.backgroundSize = stops[idx].getAttribute('data-bgsize') || (stops[idx].getAttribute('data-bgfull') ? 'cover' : ''); bg.style.backgroundPosition = stops[idx].getAttribute('data-bgpos') || ''; bg.style.setProperty('--bgop', stops[idx].getAttribute('data-bgop') || ''); bg.classList.toggle('is-full', !!stops[idx].getAttribute('data-bgfull')); bg.classList.toggle('is-blur', !!stops[idx].getAttribute('data-bgblur')); bg.classList.add('is-on'); }
          else bg.classList.remove('is-on');
        }
        cur = idx;
      }
    }
    function onScroll() { apply(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { layout(); apply(); });

    nodes.forEach((node, i) => node.addEventListener('click', () => {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const P = n > 1 ? i / (n - 1) : 0;
      window.scrollTo({ top: window.scrollY + r.top + P * total, behavior: 'smooth' });
    }));

    stops[0].classList.add('is-on'); nodes[0].classList.add('is-on'); cur = 0;
    if (bg && stops[0].getAttribute('data-bg')) { bg.style.backgroundImage = 'url("' + stops[0].getAttribute('data-bg') + '")'; bg.style.backgroundSize = stops[0].getAttribute('data-bgsize') || (stops[0].getAttribute('data-bgfull') ? 'cover' : ''); bg.style.backgroundPosition = stops[0].getAttribute('data-bgpos') || ''; bg.style.setProperty('--bgop', stops[0].getAttribute('data-bgop') || ''); bg.classList.toggle('is-full', !!stops[0].getAttribute('data-bgfull')); bg.classList.add('is-on'); }
    layout();
    apply();
  })();

  function countUp(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const dur = 1700, t0 = performance.now();
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  /* ---- mouse parallax (CSS vars) ---- */
  let mx = 0, my = 0, praf = null;
  window.addEventListener('pointermove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!praf) praf = requestAnimationFrame(() => { praf = null; root.style.setProperty('--mx', mx.toFixed(3)); root.style.setProperty('--my', my.toFixed(3)); });
  }, { passive: true });

  /* ---- The Line: pinned scroll builds the cable ---- */
  const line = document.getElementById('line');
  const cable = document.getElementById('cable');
  let lineUpdate = null;
  if (line && cable) {
    const order = ['conductor', 'insulation', 'bedding', 'armour', 'sheath'];
    const discs = order.map(k => cable.querySelector('.disc--' + k));
    const stations = [].slice.call(line.querySelectorAll('.station'));
    const rail = [].slice.call(line.querySelectorAll('.rail b'));
    /* cable stays static on scroll; only drag rotates it — smoothed
       with easing toward a target plus a little release momentum */
    let spin = 0;                        // only horizontal spin
    let tSpin = 0, vSpin = 0;
    let drag = false, lx = 0, raf = null;
    const apply = () => {
      cable.style.setProperty('--spin', spin.toFixed(2) + 'deg');
      cable.style.setProperty('--tilt', '0deg');           // always face front
    };
    apply();
    const tick = () => {
      if (!drag) { tSpin += vSpin; vSpin *= 0.94; }        // coast after release
      spin += (tSpin - spin) * 0.18;                       // smooth ease
      apply();
      const moving = drag || Math.abs(tSpin - spin) > 0.05 || Math.abs(vSpin) > 0.05;
      if (moving) { raf = requestAnimationFrame(tick); } else { raf = null; }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    cable.addEventListener('pointerdown', e => {
      drag = true; vSpin = 0; lx = e.clientX;
      try { cable.setPointerCapture(e.pointerId); } catch (x) {}
      kick();
    });
    cable.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = (e.clientX - lx) * 0.4;
      tSpin += dx; vSpin = dx;
      lx = e.clientX;
      kick();
    });
    const endDrag = () => { drag = false; kick(); };
    cable.addEventListener('pointerup', endDrag);
    cable.addEventListener('pointercancel', endDrag);
    lineUpdate = function () {
      const total = line.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -line.getBoundingClientRect().top / total));
      discs.forEach((d, i) => { if (d) d.classList.toggle('is-built', p >= (i === 0 ? 0 : i * 0.2)); });
      const si = Math.min(stations.length - 1, Math.floor(p * stations.length * 0.999));
      stations.forEach((el, i) => el.classList.toggle('is-active', i === si));
      rail.forEach((b, i) => b.classList.toggle('on', i <= si));
      line.classList.toggle('is-charged', p >= 0.985);
    };
  }

  /* ---- scroll progress bar + line ---- */
  const sbar = document.getElementById('sbar');
  let sraf = null;
  function onScroll() {
    sraf = null;
    if (sbar) { const max = root.scrollHeight - root.clientHeight; sbar.style.transform = 'scaleX(' + (max > 0 ? root.scrollTop / max : 0) + ')'; }
    if (lineUpdate) lineUpdate();
  }
  window.addEventListener('scroll', () => { if (!sraf) sraf = requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---- lightbox ---- */
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = lb.querySelector('.lightbox__img');
    const lb3d = document.getElementById('lb3d');
    const close = () => { lb.classList.remove('open'); lb.classList.remove('diagram'); lb.classList.remove('mode3d'); if (window.ProductCable3D) window.ProductCable3D.stop(); };
    lb.addEventListener('click', close);
    if (lb3d) {
      lb3d.addEventListener('click', e => e.stopPropagation());
      lb3d.addEventListener('pointerdown', e => e.stopPropagation());
      document.querySelectorAll('[data-cable]').forEach(el => el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        lb.classList.add('open', 'mode3d');
        if (window.ProductCable3D && window.ProductCable3D.supported()) {
          window.ProductCable3D.mount(lb3d);
          window.ProductCable3D.show(el.getAttribute('data-cable'));
          window.ProductCable3D.resize();
          window.ProductCable3D.start();
        }
      }));
    }
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    lb.addEventListener('pointermove', e => {
      if (!lb.classList.contains('diagram')) return;
      const rx = (e.clientX / window.innerWidth - .5) * 2, ry = (e.clientY / window.innerHeight - .5) * 2;
      lbImg.style.setProperty('--lx', (rx * 16).toFixed(1) + 'deg');
      lbImg.style.setProperty('--ly', (-ry * 13).toFixed(1) + 'deg');
    });
    let gallery = [], galleryCaps = [], galleryIdx = 0;
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    const lbCap = document.getElementById('lbCap');
    function setCap() { if (lbCap) lbCap.textContent = galleryCaps[galleryIdx] || ''; }
    function openGallery(items, caps, idx) {
      gallery = items; galleryCaps = caps || []; galleryIdx = idx;
      lbImg.src = gallery[galleryIdx];
      setCap();
      lb.classList.add('open');
      lb.classList.toggle('has-gallery', gallery.length > 1);
    }
    function navGallery(dir) {
      // Past the last image on forward, or before the first on back → close
      if ((dir > 0 && galleryIdx === gallery.length - 1) || (dir < 0 && galleryIdx === 0)) {
        close();
        return;
      }
      galleryIdx += dir;
      lbImg.src = gallery[galleryIdx];
      setCap();
    }
    if (lbPrev) { lbPrev.addEventListener('click', e => { e.stopPropagation(); navGallery(-1); }); }
    if (lbNext) { lbNext.addEventListener('click', e => { e.stopPropagation(); navGallery(1); }); }
    window.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); navGallery(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); e.stopImmediatePropagation(); navGallery(-1); }
    }, { capture: true });
    document.querySelectorAll('[data-zoom]').forEach(el => el.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const src = el.getAttribute('data-zoom');
      if (!src) return;
      const group = el.closest('.pstage__photos, .pstep__gallery');
      if (group) {
        const zoomEls = Array.from(group.querySelectorAll('[data-zoom]'));
        const items = zoomEls.map(e => e.getAttribute('data-zoom'));
        const caps = zoomEls.map(e => { const c = e.querySelector('.pshot__cap, figcaption'); return c ? c.textContent.trim() : ''; });
        const idx = items.indexOf(src);
        openGallery(items, caps, idx);
      } else {
        const cap = el.querySelector('.pshot__cap, figcaption');
        gallery = [src]; galleryCaps = [cap ? cap.textContent.trim() : '']; galleryIdx = 0;
        lbImg.src = src; setCap(); lb.classList.add('open'); lb.classList.remove('has-gallery');
      }
    }));
  }

  /* ---- factory video: play when in view + sound toggle ---- */
  const vid = document.getElementById('factoryVid');
  const sbtn = document.getElementById('soundBtn');
  if (vid) {
    new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) vid.play().catch(() => {}); else vid.pause();
    }), { threshold: 0.25 }).observe(vid);
    if (sbtn) sbtn.addEventListener('click', () => {
      vid.muted = !vid.muted;
      sbtn.textContent = vid.muted ? '🔊 Sound on' : '🔇 Mute';
      if (!vid.muted) vid.play().catch(() => {});
    });
    /* stay muted by default — sound only turns on when the user clicks the button */
  }

  /* ---- YouTube corporate film (click-to-load facade) ---- */
  const fac = document.getElementById('ytfacade');
  if (fac) fac.addEventListener('click', () => {
    const id = fac.getAttribute('data-id');
    const ifr = document.createElement('iframe');
    ifr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    ifr.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    ifr.setAttribute('allowfullscreen', '');
    ifr.title = 'Tonn Cable Corporate Video';
    fac.replaceWith(ifr);
  });

  /* ---- 3D cable as an ambient hero background (auto-rotating) ---- */
  const heroCable = document.getElementById('heroCable');
  if (heroCable && window.CableViz && window.CableViz.mount(heroCable)) {
    window.CableViz.show([['sheath'], ['armour'], ['xlpe'], ['screen'], ['cu']]);
    const heroSec = document.getElementById('hero');
    if (heroSec && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) window.CableViz.start(); else window.CableViz.stop(); });
      }, { threshold: 0.04 }).observe(heroSec);
    }
  }

  /* ---- modern "certified by" logo grid (logo-ready) ---- */
  const trustGrid = document.getElementById('trustGrid');
  if (trustGrid) {
    const CERTS = [
      { key: 'iso', n: 'ISO 9001:2015', t: 'Quality' },
      { key: 'sirim', n: 'SIRIM', t: 'Certified' },
      { key: 'tuv', n: 'TÜV SÜD PSB', t: 'Certified' },
      { key: 'bomba', n: 'BOMBA', t: 'Approved' },
      { key: 'jkr', n: 'JKR', t: 'Listed' },
      { key: 'st', n: 'Suruhanjaya Tenaga', t: 'Approved' },
      { key: 'tnb', n: 'TNB', t: 'Approved' },
      { key: 'sesb', n: 'SESB', t: 'Approved' },
      { key: 'sarawak', n: 'Sarawak Energy', t: 'Approved' }
    ];
    trustGrid.innerHTML = CERTS.map(c => '<div class="trust__item"><img class="trust__logo" src="assets/img/logos/' + c.key + '.png" alt="' + c.n + '"><span class="trust__name" style="display:none">' + c.n + '</span><span class="trust__tag">' + c.t + '</span></div>').join('');
    trustGrid.querySelectorAll('.trust__logo').forEach(img => img.addEventListener('error', () => {
      img.style.display = 'none';
      const nm = img.parentNode.querySelector('.trust__name'); if (nm) nm.style.display = 'block';
    }));
  }

  /* ---- The Line: real round wires — 61-strand conductor + single-ring armour ---- */
  (function () {
    const cable3d = document.getElementById('cable');
    if (!cable3d) return;
    const circ = (cx, cy, r, fill) =>
      '<circle cx="' + cx.toFixed(2) + '" cy="' + cy.toFixed(2) + '" r="' + r.toFixed(2) +
      '" fill="' + fill + '" stroke="rgba(0,0,0,.30)" stroke-width="0.5"/>';
    const svg = (defs, body) =>
      '<svg class="strands" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">' +
      '<defs>' + defs + '</defs>' + body + '</svg>';
    const grad = (id, a, b, c) =>
      '<radialGradient id="' + id + '" cx="0.38" cy="0.34" r="0.72">' +
      '<stop offset="0" stop-color="' + a + '"/><stop offset="0.5" stop-color="' + b +
      '"/><stop offset="1" stop-color="' + c + '"/></radialGradient>';

    // Conductor: exactly 61 round copper wires (concentric lay 1 + 6 + 12 + 18 + 24)
    const cond = cable3d.querySelector('.disc--conductor');
    if (cond) {
      const rings = [1, 6, 12, 18, 24], wr = 10; let body = '';
      rings.forEach((n, k) => {
        if (k === 0) { body += circ(100, 100, wr, 'url(#cuw)'); return; }
        const rad = k * 2 * wr;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * 2 * Math.PI;
          body += circ(100 + rad * Math.cos(a), 100 + rad * Math.sin(a), wr, 'url(#cuw)');
        }
      });
      cond.innerHTML = svg(grad('cuw', '#FCE2B0', '#D98A38', '#864E1A'), body);
    }

    // Armour: one ring of small round steel wires hugging the insulation
    const arm = cable3d.querySelector('.disc--armour');
    if (arm) {
      const aN = 44, aRad = 94, awr = 6.7; let body = '';
      for (let i = 0; i < aN; i++) {
        const a = (i / aN) * 2 * Math.PI;
        body += circ(100 + aRad * Math.cos(a), 100 + aRad * Math.sin(a), awr, 'url(#stw)');
      }
      arm.innerHTML = svg(grad('stw', '#EEF2F8', '#AEB6C2', '#5b626e'), body);
    }
  })();

  /* ---- recognitions logo marquee (logo-ready, name fallback) ---- */
  const certMq = document.getElementById('certMarquee');
  if (certMq) {
    const LOGOS = [
      { k: 'iso', n: 'ISO 9001:2015' }, { k: 'sirim', n: 'SIRIM' }, { k: 'tuv', n: 'TÜV SÜD PSB' },
      { k: 'mcma', n: 'MCMA' }, { k: 'teeam', n: 'TEEAM' }, { k: 'tnb', n: 'TNB' },
      { k: 'st', n: 'Suruhanjaya Tenaga' }, { k: 'sesb', n: 'SESB' }, { k: 'sarawak', n: 'Sarawak Energy' },
      { k: 'bomba', n: 'BOMBA' }, { k: 'jkr', n: 'JKR' }, { k: 'sni', n: 'SNI' }, { k: 'sirim-eco', n: 'SIRIM Eco-Label' }
    ];
    const item = c => '<span class="logomq__item"><img src="assets/img/logos/' + c.k + '.png" alt="' + c.n + '"><b>' + c.n + '</b></span>';
    const set = LOGOS.map(item).join('');
    certMq.innerHTML = set + set;   // duplicate for a seamless loop
    certMq.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
      img.style.display = 'none';
      const b = img.parentNode.querySelector('b'); if (b) b.style.display = 'flex';
    }));
  }

  /* ---- nav dot highlighting ---- */
  const navlinks = [].slice.call(document.querySelectorAll('.nav__dot'));
  const secs = navlinks.map(a => document.querySelector(a.getAttribute('href')));
  if (navlinks.length) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { const i = secs.indexOf(e.target); navlinks.forEach((a, j) => a.classList.toggle('on', j === i)); } });
    }, { threshold: 0.5 });
    secs.forEach(s => s && navIo.observe(s));
  }
})();

/* Process photo collage — set columns based on image count */
(function(){
  document.querySelectorAll('.pstage__photos').forEach(function(wrap){
    var n = wrap.querySelectorAll('.pshot').length;
    var cols = n <= 3 ? 3 : n === 4 ? 4 : n === 5 ? 3 : n === 6 ? 3 : n <= 8 ? 4 : 5;
    wrap.setAttribute('data-cols', cols);
  });
})();

/* Cert slider: clone cards once for a seamless marquee loop */
(function(){
  var track = document.querySelector('.certtrack');
  if (!track) return;
  track.innerHTML += track.innerHTML;
})();
