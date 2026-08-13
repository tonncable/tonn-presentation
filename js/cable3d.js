/* ============================================================
   cable3d.js — real WebGL 3D cable (Three.js r128, global THREE)
   window.CableViz.mount(el) · .show(layers) · .stop()
   A "stripped cable" model: nested cylinders, inner layers
   protrude at the cut end (copper conductor sticks out most).
   ============================================================ */
(function () {
  'use strict';
  let renderer, scene, camera, group, raf = null, mounted = false, supported = true, t = 0;
  let dragging = false, lastX = 0, lastY = 0, container = null;
  let zoom = 8.8, targetZoom = 8.8;

  // material per layer kind (metalness kept moderate so colour reads without an env-map)
  const MAT = {
    cu:    { c: 0xF2922C, m: 0.92, r: 0.15 },
    al:    { c: 0xC9D0DA, m: 0.66, r: 0.36 },
    xlpe:  { c: 0x111116, m: 0.18, r: 0.5 },
    pvc:   { c: 0x2A2A32, m: 0.12, r: 0.74 },
    pvcred:{ c: 0xC0392B, m: 0.10, r: 0.55 },
    orange:{ c: 0xE8743B, m: 0.12, r: 0.54 },
    screen:{ c: 0x8f8a7c, m: 0.08, r: 0.6 },
    mica:  { c: 0xE8C36A, m: 0.45, r: 0.5 },
    armour:{ c: 0xC8CED8, m: 0.9,  r: 0.22 },
    sheath:{ c: 0x040405, m: 0.35, r: 0.32 }
  };

  // a cylinder with softly rounded (filleted) edges — lathe a profile with quarter-arc corners
  function roundedCylGeo(r, len, fil, seg) {
    fil = Math.min(fil, r * 0.49, len * 0.49);
    const hl = len / 2, pts = [], s = 6;
    let i, a;
    pts.push(new THREE.Vector2(0, -hl));
    pts.push(new THREE.Vector2(r - fil, -hl));
    for (i = 1; i <= s; i++) { a = -Math.PI / 2 + (i / s) * (Math.PI / 2); pts.push(new THREE.Vector2(r - fil + fil * Math.cos(a), -hl + fil + fil * Math.sin(a))); }
    pts.push(new THREE.Vector2(r, hl - fil));
    for (i = 1; i <= s; i++) { a = (i / s) * (Math.PI / 2); pts.push(new THREE.Vector2(r - fil + fil * Math.cos(a), hl - fil + fil * Math.sin(a))); }
    pts.push(new THREE.Vector2(0, hl));
    return new THREE.LatheGeometry(pts, seg);
  }

  // gradient reflection map so metals shine
  function makeEnv(renderer) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const es = new THREE.Scene();
    const cv = document.createElement('canvas'); cv.width = 16; cv.height = 64;
    const cx = cv.getContext('2d'); const g = cx.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0, '#eef2f8'); g.addColorStop(0.45, '#8b909c'); g.addColorStop(1, '#101015');
    cx.fillStyle = g; cx.fillRect(0, 0, 16, 64);
    es.add(new THREE.Mesh(new THREE.SphereGeometry(12, 24, 16), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), side: THREE.BackSide })));
    const env = pmrem.fromScene(es, 0.1).texture; pmrem.dispose(); return env;
  }

  function mount(el) {
    if (mounted) return supported;
    container = el;
    if (typeof THREE === 'undefined') { supported = false; return false; }
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      if (!renderer.getContext()) throw new Error('no ctx');
    } catch (e) { supported = false; return false; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    const dom = renderer.domElement;
    dom.style.width = '100%'; dom.style.height = '100%'; dom.style.display = 'block'; dom.style.cursor = 'grab';
    el.appendChild(dom);

    scene = new THREE.Scene(); scene.environment = makeEnv(renderer);
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.3, 8.8);

    scene.add(new THREE.AmbientLight(0x6a6a76, 0.55));
    scene.add(new THREE.HemisphereLight(0xc4c9d4, 0x2a2230, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 6, 7); scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff0e6, 0.9); fill.position.set(-3, 1, 3); scene.add(fill);
    const rim = new THREE.PointLight(0xED1B9C, 1.1, 60); rim.position.set(-5, 3, -6); scene.add(rim);

    group = new THREE.Group(); group.rotation.x = -0.34; scene.add(group);

    dom.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; dom.style.cursor = 'grabbing'; try { dom.setPointerCapture(e.pointerId); } catch (x) {} });
    dom.addEventListener('pointermove', e => {
      if (!dragging) return;
      group.rotation.y += (e.clientX - lastX) * 0.01;
      group.rotation.x = Math.max(-1.2, Math.min(0.6, group.rotation.x + (e.clientY - lastY) * 0.006));
      lastX = e.clientX; lastY = e.clientY;
    });
    const up = () => { dragging = false; dom.style.cursor = 'grab'; };
    dom.addEventListener('pointerup', up); dom.addEventListener('pointerleave', up);

    // scroll / pinch to zoom
    dom.addEventListener('wheel', e => {
      e.preventDefault();
      targetZoom = Math.max(3.5, Math.min(16, targetZoom + e.deltaY * 0.012));
    }, { passive: false });

    // pinch-to-zoom on touch
    let lastPinchDist = null;
    dom.addEventListener('touchstart', e => { if (e.touches.length === 2) lastPinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
    dom.addEventListener('touchmove', e => {
      if (e.touches.length === 2) {
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (lastPinchDist) targetZoom = Math.max(3.5, Math.min(16, targetZoom - (d - lastPinchDist) * 0.04));
        lastPinchDist = d;
      }
    }, { passive: true });
    dom.addEventListener('touchend', () => { lastPinchDist = null; }, { passive: true });
    window.addEventListener('resize', resize);
    mounted = true;
    return true;
  }

  function resize() {
    if (!renderer || !container) return;
    const w = container.clientWidth || 400, h = container.clientHeight || 400;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Lock the HORIZONTAL field of view so the full cable is framed identically
    // on every screen shape (wide or tall). We derive the vertical fov from a
    // fixed horizontal fov, instead of letting horizontal stretch with aspect.
    const HFOV = 46 * Math.PI / 180;               // constant horizontal coverage
    let vfov = 2 * Math.atan(Math.tan(HFOV / 2) / camera.aspect) * 180 / Math.PI;
    vfov = Math.max(28, Math.min(70, vfov));        // safety clamp
    camera.fov = vfov;
    camera.updateProjectionMatrix();
  }

  // concentric-lay strand pattern: 1 + 6 + 12 + 18 + 24 = 61 round wires
  function wirePositions(R) {
    const rings = [1, 6, 12, 18, 24], wr = R / 9, pts = [];
    rings.forEach((cnt, k) => {
      if (k === 0) { pts.push([0, 0]); return; }
      const rad = k * 2 * wr;
      for (let i = 0; i < cnt; i++) { const a = (i / cnt) * Math.PI * 2 + (k % 2 ? 0.26 : 0); pts.push([Math.cos(a) * rad, Math.sin(a) * rad]); }
    });
    return { pts, wr };
  }

  // a single ring of round wires filling the band between two radii (steel-wire armour)
  function ringPositions(rInner, rOuter) {
    const ringR = (rInner + rOuter) / 2, wr = (rOuter - rInner) / 2 * 0.94;
    const cnt = Math.max(24, Math.round(Math.PI * ringR / wr)), pts = [];
    for (let i = 0; i < cnt; i++) { const a = (i / cnt) * Math.PI * 2; pts.push([Math.cos(a) * ringR, Math.sin(a) * ringR]); }
    return { pts, wr };
  }

  // lay a set of round wires along the cable axis (Z) via one instanced draw call
  function addWires(pts, wr, len, zc, mm) {
    const geo = roundedCylGeo(wr, len, wr * 0.2, 22);
    const mat = new THREE.MeshStandardMaterial({ color: mm.c, metalness: mm.m, roughness: mm.r });
    const im = new THREE.InstancedMesh(geo, mat, pts.length);
    const d = new THREE.Object3D();
    pts.forEach((p, i) => { d.position.set(p[0], p[1], zc); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    im.instanceMatrix.needsUpdate = true;
    group.add(im);
  }

  function build(layers) {
    if (!group) return;
    while (group.children.length) { const c = group.children[0]; group.remove(c); if (c.geometry) c.geometry.dispose(); if (c.material) c.material.dispose(); }
    const n = layers.length, bodyLen = 4.0, strip = 0.62, maxR = 0.88;
    const lens = layers.map((_, i) => bodyLen + i * strip);
    const maxLen = lens[n - 1];
    layers.forEach((l, i) => {
      const kind = Array.isArray(l) ? l[0] : l;
      const r = maxR * (1 - i * 0.7 / n);
      const len = lens[i];
      const zc = -maxLen / 2 + len / 2;               // align back ends; inner layers protrude at front (+Z)
      const mm = MAT[kind] || MAT.pvc;
      if (kind === 'cu') {                             // stranded copper conductor — 61 round wires
        const w = wirePositions(r);
        addWires(w.pts, w.wr * 0.95, len, zc, mm);
        return;
      }
      if (kind === 'armour') {                         // steel-wire armour — one ring of round wires
        const rInner = maxR * (1 - (i + 1) * 0.7 / n); // surface of the layer it wraps
        const w = ringPositions(rInner, r);
        addWires(w.pts, w.wr, len, zc, mm);
        return;
      }
      const geo = roundedCylGeo(r, len, Math.min(0.03, r * 0.07), 64);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: mm.c, metalness: mm.m, roughness: mm.r }));
      mesh.rotation.x = Math.PI / 2;                   // cylinder axis -> Z
      mesh.position.z = zc;
      group.add(mesh);
    });
    group.rotation.y = -0.5;
    resize();
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    // smooth zoom easing
    zoom += (targetZoom - zoom) * 0.1;
    if (camera) { camera.position.z = zoom; camera.updateProjectionMatrix(); }
    if (renderer && scene && camera) renderer.render(scene, camera);
  }

  window.CableViz = {
    mount: mount,
    show: function (layers) { if (!supported) return false; build(layers); resize(); if (!raf) loop(); return true; },
    start: function () { if (supported && !raf) loop(); },
    stop: function () { if (raf) { cancelAnimationFrame(raf); raf = null; } },
    resize: resize,
    supported: function () { return supported; },
    snapshot: function () { if (renderer && scene && camera) renderer.render(scene, camera); return renderer ? renderer.domElement.toDataURL('image/png') : null; }
  };
})();
