/* ============================================================
   undersize3d.js — two live inline 3D cables (Undersized vs
   Standard) that share ONE rotation: drag either and both turn
   together; they auto-spin 360° in sync. No click needed.
   Pauses when the section is offscreen.
   ============================================================ */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') return;
  var COPPER = { c: 0xF09636, m: 0.92, r: 0.15 }, GREEN = { c: 0x22CB46, m: 0.1, r: 0.46 };
  function mat(s) { return new THREE.MeshStandardMaterial({ color: s.c, metalness: s.m, roughness: s.r }); }
  function hexPositions(rings, wr) {
    var p = [];
    rings.forEach(function (cnt, k) {
      if (k === 0) { p.push([0, 0]); return; }
      var rad = k * 2 * wr;
      for (var i = 0; i < cnt; i++) { var a = i / cnt * Math.PI * 2; p.push([Math.cos(a) * rad, Math.sin(a) * rad]); }
    });
    return p;
  }
  var tonnMaps = null;
  function makeTonnMaps() {
    function draw(bg, fg, srgb) {
      var c = document.createElement('canvas'); c.width = 512; c.height = 512;
      var x = c.getContext('2d');
      x.fillStyle = bg; x.fillRect(0, 0, 512, 512);
      x.save(); x.translate(256, 256); x.rotate(Math.PI / 2);   // one line of text, along the cable axis
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = 'bold 44px Arial, sans-serif'; x.fillStyle = fg;
      x.fillText('TONN CABLE', 0, 0);
      x.restore();
      var t = new THREE.CanvasTexture(c); if (srgb && THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; return t;
    }
    return { map: draw('#22cb46', '#63e283', true), bump: draw('#808080', '#ffffff', false) };
  }
  function roundedCylGeo(r, len, fil, seg) {
    fil = Math.min(fil, r * 0.49, len * 0.49);
    var hl = len / 2, pts = [], s = 6, i, a;
    pts.push(new THREE.Vector2(0, -hl)); pts.push(new THREE.Vector2(r - fil, -hl));
    for (i = 1; i <= s; i++) { a = -Math.PI / 2 + (i / s) * (Math.PI / 2); pts.push(new THREE.Vector2(r - fil + fil * Math.cos(a), -hl + fil + fil * Math.sin(a))); }
    pts.push(new THREE.Vector2(r, hl - fil));
    for (i = 1; i <= s; i++) { a = (i / s) * (Math.PI / 2); pts.push(new THREE.Vector2(r - fil + fil * Math.cos(a), hl - fil + fil * Math.sin(a))); }
    pts.push(new THREE.Vector2(0, hl));
    return new THREE.LatheGeometry(pts, seg);
  }
  function buildCable(condWR, engrave, sheathR) {
    sheathR = sheathR || 0.5;
    var g = new THREE.Group(), sheathLen = 3.4, condLen = 4.4, base = -sheathLen / 2;
    var sheathMat;
    if (engrave) { var tm = (tonnMaps || (tonnMaps = makeTonnMaps())); sheathMat = new THREE.MeshStandardMaterial({ map: tm.map, bumpMap: tm.bump, bumpScale: 0.03, metalness: 0.16, roughness: 0.5 }); }
    else sheathMat = mat(GREEN);
    g.add(new THREE.Mesh(engrave ? new THREE.CylinderGeometry(sheathR, sheathR, sheathLen, 64, 1, false) : roundedCylGeo(sheathR, sheathLen, 0.03, 64), sheathMat));
    var pts = hexPositions([1, 6], condWR);
    var im = new THREE.InstancedMesh(roundedCylGeo(condWR * 0.95, condLen, condWR * 0.2, 32), mat(COPPER), pts.length);
    var d = new THREE.Object3D();
    pts.forEach(function (pp, i) { d.position.set(pp[0], base + condLen / 2, pp[1]); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    im.instanceMatrix.needsUpdate = true; g.add(im);
    return g;
  }

  var viewers = [], shared = { y: -0.3, x: -0.4, dist: 7.5, dragging: false }, raf = null, lastX = 0, lastY = 0;

  function tick() {
    raf = requestAnimationFrame(tick);
    for (var i = 0; i < viewers.length; i++) viewers[i].render(shared.y, shared.x);
  }
  function startAll() { if (!raf && viewers.length) tick(); }
  function stopAll() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  // simple gradient reflection map so metals (copper) actually shine
  function makeEnv(renderer) {
    var pmrem = new THREE.PMREMGenerator(renderer);
    var es = new THREE.Scene();
    var cv = document.createElement('canvas'); cv.width = 16; cv.height = 64;
    var cx = cv.getContext('2d'); var g = cx.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0, '#eef2f8'); g.addColorStop(0.45, '#8b909c'); g.addColorStop(1, '#101015');
    cx.fillStyle = g; cx.fillRect(0, 0, 16, 64);
    es.add(new THREE.Mesh(new THREE.SphereGeometry(12, 24, 16), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), side: THREE.BackSide })));
    var env = pmrem.fromScene(es, 0.1).texture; pmrem.dispose(); return env;
  }

  function makeViewer(el, condWR, engrave, sheathR) {
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); if (!renderer.getContext()) throw 0; } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    var dom = renderer.domElement; dom.style.cssText = 'width:100%;height:100%;display:block;cursor:grab;touch-action:none'; el.appendChild(dom);
    var scene = new THREE.Scene(); scene.environment = makeEnv(renderer);
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100); camera.position.set(0, 0.5, shared.dist); camera.lookAt(0, 0.5, 0);
    scene.add(new THREE.AmbientLight(0x55555f, 0.5));
    scene.add(new THREE.HemisphereLight(0xc9cedb, 0x26212c, 0.5));
    var key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(4, 7, 6); scene.add(key);
    var rim = new THREE.PointLight(0xED1B9C, 0.3, 60); rim.position.set(-5, 2, -6); scene.add(rim);
    var root = new THREE.Group(); root.add(buildCable(condWR, engrave, sheathR)); root.scale.setScalar(0.98); scene.add(root);
    function resize() { var w = el.clientWidth || 300, h = el.clientHeight || 220; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    function move(e) { shared.y += (e.clientX - lastX) * 0.01; shared.x += (e.clientY - lastY) * 0.006; lastX = e.clientX; lastY = e.clientY; }
    function up() { shared.dragging = false; dom.style.cursor = 'grab'; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); }
    function down(e) { shared.dragging = true; lastX = e.clientX; lastY = e.clientY; dom.style.cursor = 'grabbing'; try { e.preventDefault(); } catch (x) {} window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); }
    function wheel(e) { e.preventDefault(); shared.dist = Math.max(3.5, Math.min(14, shared.dist + e.deltaY * 0.01)); }
    dom.addEventListener('pointerdown', down);
    dom.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('resize', resize);
    resize();
    return { render: function (y, x) { camera.position.z = shared.dist; camera.lookAt(0, 0.5, 0); root.rotation.y = y; root.rotation.x = x; renderer.render(scene, camera); }, resize: resize };
  }

  function init() {
    var a = document.getElementById('us3dBad'), b = document.getElementById('us3dGood');
    var v1 = a ? makeViewer(a, 0.066, false, 0.5) : null, v2 = b ? makeViewer(b, 0.12, true, 0.5) : null;
    if (v1) viewers.push(v1); if (v2) viewers.push(v2);
    viewers.forEach(function (v) { v.render(shared.y, shared.x); });   // first frame
    // render only while the comparison is on-screen and the tab is visible — saves battery, prevents stutter
    var host = document.getElementById('undersize-content') || (a && a.closest('section')) || a;
    var onscreen = !('IntersectionObserver' in window);
    function update() { if (onscreen && !document.hidden) startAll(); else stopAll(); }
    if (host && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { onscreen = es.some(function (e) { return e.isIntersecting; }); update(); }, { rootMargin: '200px 0px' }).observe(host);
    }
    document.addEventListener('visibilitychange', update);
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
