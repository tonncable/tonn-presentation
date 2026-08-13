/* ============================================================
   presenter.js — presenter-friendly controls for the talk
   • Fullscreen toggle (button + F key)
   • Slide-style section navigation: → ↓ Space / PageDown = next,
     ← ↑ PageUp = previous, Home/End = first/last
   • One-time on-screen hint
   ============================================================ */
(function () {
  'use strict';
  var secs = [].slice.call(document.querySelectorAll('section[id]'));
  function absTop(el) { return Math.round(el.getBoundingClientRect().top + window.scrollY); }
  function go(dir) {
    var y = window.scrollY, target = null, i, t;
    if (dir > 0) { for (i = 0; i < secs.length; i++) { t = absTop(secs[i]); if (t > y + 14) { target = t; break; } } }
    else { for (i = secs.length - 1; i >= 0; i--) { t = absTop(secs[i]); if (t < y - 14) { target = t; break; } } }
    if (target != null) window.scrollTo({ top: target, behavior: 'smooth' });
  }

  /* ---- fullscreen ---- */
  function fsOn() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function toggleFs() {
    var el = document.documentElement;
    if (!fsOn()) { (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el); }
    else { (document.exitFullscreen || document.webkitExitFullscreen || function () {}).call(document); }
  }
  var btn = document.createElement('button');
  btn.className = 'fsbtn'; btn.type = 'button'; btn.title = 'Full screen (F)'; btn.setAttribute('aria-label', 'Toggle full screen');
  btn.textContent = '⛶';
  btn.addEventListener('click', function () { toggleFs(); btn.blur(); });
  document.body.appendChild(btn);

  /* theme toggle lives in index.html (#themeToggle) — single source of truth */
  function sync() { var on = !!fsOn(); btn.classList.toggle('on', on); btn.textContent = on ? '⤢' : '⛶'; btn.title = on ? 'Exit full screen (F)' : 'Full screen (F)'; }
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);

  /* ---- keyboard ---- */
  window.addEventListener('keydown', function (e) {
    var tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    var lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('open')) return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': e.preventDefault(); go(1); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': e.preventDefault(); go(-1); break;
      case 'Home': e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      case 'End': e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); break;
      case 'f': case 'F': toggleFs(); break;
    }
  });

  /* ---- one-time hint ---- */
  try {
    if (!sessionStorage.getItem('tcPresHint')) {
      var hint = document.createElement('div'); hint.className = 'preshint';
      hint.innerHTML = 'Use <b>&larr;</b> <b>&rarr;</b> or <b>Space</b> to move &middot; <b>F</b> for full screen';
      document.body.appendChild(hint);
      setTimeout(function () { hint.classList.add('show'); }, 500);
      setTimeout(function () { hint.classList.remove('show'); setTimeout(function () { hint.remove(); }, 600); }, 5600);
      sessionStorage.setItem('tcPresHint', '1');
    }
  } catch (e) {}
})();
