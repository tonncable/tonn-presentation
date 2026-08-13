/* ============================================================
   products3d.js — interactive WebGL 3D for every Tonn cable type
   One viewer, spec-driven: ProductCable3D.show(type) builds the
   scene that matches each product's diagram.
   Types: lv · mv · abc · fr · frt · solar · data · bare · tape
   Separate engine from cable3d.js (the hero singleton).
   window.ProductCable3D = { mount, show, start, stop, resize, supported }
   ============================================================ */
(function () {
  'use strict';
  let renderer, scene, camera, root, raf = null, mounted = false, supported = true;
  let dragging = false, lastX = 0, lastY = 0, container = null, built = false, currentType = 'lv';
  let zoom = 10.8, targetZoom = 10.8;

  /* materials */
  const COPPER = { c: 0xF2922C, m: 0.92, r: 0.15 };   // polished copper
  const SILVER = { c: 0xDBE2EC, m: 0.88, r: 0.18 };   // tinned copper / aluminium
  const STEEL  = { c: 0xD6DCE6, m: 0.9,  r: 0.2 };
  const GREY   = { c: 0x9aa1ab, m: 0.34, r: 0.5 };    // grey coat / separator over the conductor
  const TIN    = { c: 0xD0D5DB, m: 0.55, r: 0.34 };   // tin plating on each strand
  const BLACK  = { c: 0x09090d, m: 0.24, r: 0.42 };
  const RED    = { c: 0xF12721, m: 0.12, r: 0.42 };   // vivid red
  const ORANGE = { c: 0xFF6E12, m: 0.12, r: 0.42 };   // vivid orange
  const BLUE   = { c: 0x1E84FF, m: 0.12, r: 0.42 };   // vivid blue
  const GREEN  = { c: 0x22CB46, m: 0.12, r: 0.42 };   // vivid green (undersize demo)
  const WHITE  = { c: 0xF2F2F6, m: 0.08, r: 0.6 };
  const BED    = { c: 0x2a2a31, m: 0.2,  r: 0.7 };
  const XLPE   = { c: 0x17171e, m: 0.12, r: 0.55 };
  const SCREEN = { c: 0xF0A24E, m: 0.88, r: 0.2 };
  const MICA   = { c: 0xFFFFFF, m: 0.22, r: 0.45, o: 0.8 };   // mica glass tape — woven texture set at mount, 20% translucent
  const cRED = { c: 0xF13228, m: 0.12, r: 0.42 }, cYEL = { c: 0xFADC36, m: 0.12, r: 0.42 },
        cBLU = { c: 0x2A8CFF, m: 0.12, r: 0.42 }, cBLK = { c: 0x1f1f26, m: 0.18, r: 0.55 },
        cGRN = { c: 0x32C257, m: 0.12, r: 0.42 }, cBRN = { c: 0xB06A1E, m: 0.16, r: 0.48 };
  const dGRN = { c: 0x33c95e, m: 0.18, r: 0.44 }, dORG = { c: 0xff8a1f, m: 0.18, r: 0.44 },
        dBLU = { c: 0x2f93f0, m: 0.18, r: 0.44 }, dBRN = { c: 0xa06a36, m: 0.18, r: 0.44 };

  /* geometry helpers — cables run along +Y, stripped at the top */
  function mat(s) { var m = new THREE.MeshStandardMaterial({ color: s.c, metalness: s.m, roughness: s.r }); if (s.map) m.map = s.map; if (s.o != null && s.o < 1) { m.transparent = true; m.opacity = s.o; m.depthWrite = false; } return m; }

  // procedural mica-glass tape texture: dark grey-gold base + woven net grid
  function makeMicaTexture() {
    var c = document.createElement('canvas'); c.width = 128; c.height = 128;
    var x = c.getContext('2d');
    x.fillStyle = '#7e7250'; x.fillRect(0, 0, 128, 128);
    for (var i = 0; i < 600; i++) { var v = 90 + (Math.random() * 70 | 0); x.fillStyle = 'rgba(' + (v + 25) + ',' + (v + 12) + ',' + (v - 18) + ',0.18)'; x.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 2, 1 + Math.random() * 2); }
    var step = 9;
    x.strokeStyle = 'rgba(46,40,24,0.55)'; x.lineWidth = 1.4;
    for (var g = 0; g <= 128; g += step) { x.beginPath(); x.moveTo(g, 0); x.lineTo(g, 128); x.stroke(); x.beginPath(); x.moveTo(0, g); x.lineTo(128, g); x.stroke(); }
    x.strokeStyle = 'rgba(214,205,162,0.30)'; x.lineWidth = 1;
    for (var g2 = step / 2; g2 <= 128; g2 += step) { x.beginPath(); x.moveTo(g2, 0); x.lineTo(g2, 128); x.stroke(); x.beginPath(); x.moveTo(0, g2); x.lineTo(128, g2); x.stroke(); }
    var tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(5, 16);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function hexPositions(rings, wr) {
    const pts = [];
    rings.forEach(function (cnt, k) {
      if (k === 0) { pts.push([0, 0]); return; }
      const rad = k * 2 * wr;
      for (var i = 0; i < cnt; i++) { var a = (i / cnt) * Math.PI * 2 + (k % 2 ? 0.26 : 0); pts.push([Math.cos(a) * rad, Math.sin(a) * rad]); }
    });
    return pts;
  }
  function ringPositions(ringR, n) { const pts = []; for (var i = 0; i < n; i++) { var a = (i / n) * Math.PI * 2; pts.push([Math.cos(a) * ringR, Math.sin(a) * ringR]); } return pts; }

  // cylinder with softly rounded (filleted) edges
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
  function addRods(parent, pts, wr, len, cy, mspec) {
    const geo = roundedCylGeo(wr, len, wr * 0.2, 22);
    const im = new THREE.InstancedMesh(geo, mat(mspec), pts.length);
    const d = new THREE.Object3D();
    pts.forEach(function (p, i) { d.position.set(p[0], cy, p[1]); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    im.instanceMatrix.needsUpdate = true; parent.add(im); return im;
  }
  function cyl(parent, r, len, cy, ox, oz, mspec) {
    const mesh = new THREE.Mesh(roundedCylGeo(r, len, Math.min(0.03, r * 0.07), 56), mat(mspec));
    mesh.position.set(ox || 0, cy, oz || 0); parent.add(mesh); return mesh;
  }
  // gradient reflection map so metals shine
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
  function strands(parent, rings, wr, len, base, ox, oz, mspec, tinned) {
    var pts = hexPositions(rings, wr).map(function (p) { return [p[0] + (ox || 0), p[1] + (oz || 0)]; });
    if (tinned) {
      addRods(parent, pts, wr * 0.97, len, base + len / 2, TIN);                            // tin plating
      addRods(parent, pts, wr * 0.78, len + 0.04, base + (len + 0.04) / 2, mspec || COPPER); // copper core, tip proud → copper face + tin ring
    } else {
      addRods(parent, pts, wr * 0.94, len, base + len / 2, mspec || COPPER);
    }
  }
  function core(parent, ox, oz, insMat, insR, insLen, rings, wr, condLen, base, condMat, micaR, micaLen) {
    if (insMat) cyl(parent, insR, insLen, base + insLen / 2, ox, oz, insMat);
    if (micaR) cyl(parent, micaR, micaLen, base + micaLen / 2, ox, oz, MICA);   // mica tape on the conductor
    strands(parent, rings, wr, condLen, base, ox, oz, condMat || COPPER);
  }

  /* cable builders */
  function singleCable(s) {
    var g = new THREE.Group(), base = -s.sheathLen / 2;
    cyl(g, s.sheathR, s.sheathLen, 0, 0, 0, s.sheathMat);
    if (s.screenMat) cyl(g, s.screenR, s.screenLen, base + s.screenLen / 2, 0, 0, s.screenMat);
    if (s.insMat) cyl(g, s.insR, s.insLen, base + s.insLen / 2, 0, 0, s.insMat);
    if (s.coatMat) cyl(g, s.coatR, s.coatLen, base + s.coatLen / 2, 0, 0, s.coatMat);   // grey coat / separator over the conductor
    if (s.micaR) cyl(g, s.micaR, s.micaLen, base + s.micaLen / 2, 0, 0, MICA);   // mica tape on the conductor
    if (s.condSolid) cyl(g, s.condR, s.condLen, base + s.condLen / 2, 0, 0, s.condMat || SILVER);
    else strands(g, s.rings, s.wr, s.condLen, base, 0, 0, s.condMat || COPPER, s.condTin);
    return g;
  }
  function mvMultiCable(s) {            // 3-core MV — each core: copper screen / grey XLPE / conductor screen / stranded conductor, + centre filler
    var g = new THREE.Group(), base = -s.sheathLen / 2;
    var GREY = { c: 0x9a9ba3, m: 0.08, r: 0.62 }, SEMI = { c: 0x1e1e26, m: 0.2, r: 0.5 };
    cyl(g, s.R, s.sheathLen, 0, 0, 0, BLACK);                                  // outer sheath
    cyl(g, s.bedR, s.bedLen, base + s.bedLen / 2, 0, 0, SEMI);                 // bedding / filler body
    strands(g, [1], s.fillerWR || 0.06, s.fillerLen || (s.sheathLen + 0.9), base, 0, 0, SILVER);  // single centre filler wire
    for (var i = 0; i < 3; i++) {
      var a = Math.PI / 2 + i * 2 * Math.PI / 3, ox = Math.cos(a) * s.coreOffset, oz = Math.sin(a) * s.coreOffset;
      cyl(g, s.coreScreenR, s.coreScreenLen, base + s.coreScreenLen / 2, ox, oz, COPPER);   // copper wire screen
      cyl(g, s.coreInsR, s.coreInsLen, base + s.coreInsLen / 2, ox, oz, GREY);              // XLPE insulation
      cyl(g, s.coreCoatR, s.coreCoatLen, base + s.coreCoatLen / 2, ox, oz, SEMI);           // conductor screen
      strands(g, s.coreRings, s.coreWR, s.coreCondLen, base, ox, oz, SILVER);               // stranded conductor
    }
    return g;
  }
  function multiCable(s) {
    var g = new THREE.Group(), base = -s.sheathLen / 2;
    cyl(g, s.R, s.sheathLen, 0, 0, 0, s.sheathMat);
    if (s.armour) { var n = Math.max(28, Math.round(Math.PI * s.armR / s.armWR)); addRods(g, ringPositions(s.armR, n), s.armWR, s.armLen, base + s.armLen / 2, STEEL); }
    if (s.bedMat) cyl(g, s.bedR, s.bedLen, base + s.bedLen / 2, 0, 0, s.bedMat);
    var nc = s.cores.length;
    for (var i = 0; i < nc; i++) {
      var ox = 0, oz = 0;
      if (nc > 1) { var a = (nc === 3 ? (Math.PI / 2 + i * 2 * Math.PI / 3) : (Math.PI / 4 + i * 2 * Math.PI / nc)); ox = Math.cos(a) * s.coreOffset; oz = Math.sin(a) * s.coreOffset; }
      core(g, ox, oz, s.cores[i].insMat, s.coreR, s.coreInsLen, s.coreRings, s.coreWR, s.coreCondLen, base, s.coreCondMat || COPPER, s.coreMicaR, s.coreMicaLen);
    }
    return g;
  }
  function bundle(s) {            // ABC — twisted bundle, no sheath
    var g = new THREE.Group(), base = -s.insLen / 2;
    for (var i = 0; i < s.n; i++) { var a = Math.PI / 4 + i * 2 * Math.PI / s.n; var ox = Math.cos(a) * s.offset, oz = Math.sin(a) * s.offset;
      cyl(g, s.coreR, s.insLen, base + s.insLen / 2, ox, oz, BLACK);
      strands(g, s.rings, s.wr, s.condLen, base, ox, oz, s.condMat || SILVER);
    }
    return g;
  }
  function dataCable(s) {         // Cat-style: blue sheath + cross spline + 4 twisted pairs
    var g = new THREE.Group(), base = -s.sheathLen / 2;
    cyl(g, s.R, s.sheathLen, 0, 0, 0, BLUE);
    var splLen = s.condLen;
    var b1 = new THREE.Mesh(new THREE.BoxGeometry(s.R * 1.5, splLen, 0.06), mat(WHITE)); b1.position.y = base + splLen / 2; g.add(b1);
    var b2 = b1.clone(); b2.rotation.y = Math.PI / 2; g.add(b2);
    var cols = [dGRN, dORG, dBLU, dBRN];
    for (var i = 0; i < 4; i++) {
      var a = Math.PI / 4 + i * Math.PI / 2, px = Math.cos(a) * s.pairOffset, pz = Math.sin(a) * s.pairOffset, tt = a + Math.PI / 2, dx = Math.cos(tt) * s.gap, dz = Math.sin(tt) * s.gap;
      strands(g, [1], s.wr, s.condLen, base, px + dx, pz + dz, cols[i]);
      strands(g, [1], s.wr, s.condLen, base, px - dx, pz - dz, WHITE);
    }
    return g;
  }
  function bareCond(s) { var g = new THREE.Group(), base = -s.len / 2; strands(g, s.rings, s.wr, s.len, base, 0, 0, s.condMat || SILVER); return g; }
  function tape() {
    var g = new THREE.Group();
    var a = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.2, 0.05), mat(COPPER)); a.position.x = -0.7; a.rotation.y = 0.35; g.add(a);
    var b = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.2, 0.05), mat(SILVER)); b.position.x = 0.7; b.rotation.y = -0.35; g.add(b);
    return g;
  }

  function disposeTree(o) { o.traverse && o.traverse(function (n) { if (n.geometry) n.geometry.dispose(); if (n.material) n.material.dispose(); }); }

  function build(type) {
    if (!root) return;
    while (root.children.length) { var c = root.children[0]; root.remove(c); disposeTree(c); }
    var items = [], scale = 1;

    if (type === 'mv') {
      items = [
        { g: singleCable({ sheathMat: BLACK, sheathR: 0.52, sheathLen: 3.35, screenMat: COPPER, screenR: 0.47, screenLen: 3.62, insMat: { c: 0x9a9ba3, m: 0.08, r: 0.62 }, insR: 0.42, insLen: 3.95, coatMat: { c: 0x1e1e26, m: 0.2, r: 0.5 }, coatR: 0.33, coatLen: 4.2, rings: [1, 6, 12], wr: 0.058, condR: 0.30, condLen: 4.5, condMat: SILVER }), x: -2.5, rz: 0.12 },
        { g: mvMultiCable({ R: 0.66, sheathLen: 3.4, bedR: 0.56, bedLen: 3.7, coreOffset: 0.27, coreScreenR: 0.25, coreScreenLen: 3.95, coreInsR: 0.225, coreInsLen: 4.15, coreCoatR: 0.16, coreCoatLen: 4.35, coreRings: [1, 6, 12], coreWR: 0.042, coreCondLen: 4.55 }), x: 2.5, rz: -0.1 }
      ]; scale = 1.15;
    } else if (type === 'abc') {
      items = [{ g: bundle({ n: 4, offset: 0.42, coreR: 0.38, insLen: 3.8, rings: [1, 6], wr: 0.095, condLen: 4.5, condMat: SILVER }), x: 0 }]; scale = 1.45;
    } else if (type === 'solar') {
      var solarSpec = function (sheath) { return { sheathMat: sheath, sheathR: 0.38, sheathLen: 3.3, insMat: BLACK, insR: 0.29, insLen: 3.9, rings: [1, 6, 12, 18, 24, 30], wr: 0.017, condLen: 4.5, condMat: COPPER, condTin: true }; };
      items = [
        { g: singleCable(solarSpec(RED)), x: -1.5, rz: 0.08 },
        { g: singleCable(solarSpec(BLACK)), x: 1.5, rz: -0.06 }
      ]; scale = 1.25;
    } else if (type === 'data') {
      items = [{ g: dataCable({ R: 0.6, sheathLen: 3.4, condLen: 4.6, pairOffset: 0.3, gap: 0.11, wr: 0.07 }), x: 0 }]; scale = 1.5;
    } else if (type === 'bare') {
      items = [{ g: bareCond({ rings: [1, 6, 12, 18], wr: 0.085, len: 4.6, condMat: SILVER }), x: 0 }]; scale = 1.5;
    } else if (type === 'tape') {
      items = [{ g: tape(), x: 0 }]; scale = 1.4;
    } else if (type === 'undersize') {                 // same OD, different copper inside
      items = [
        { g: singleCable({ sheathMat: GREEN, sheathR: 0.5, sheathLen: 3.5, rings: [1, 6], wr: 0.066, condLen: 4.5, condMat: COPPER }), x: -1.6, rz: 0.06 },
        { g: singleCable({ sheathMat: GREEN, sheathR: 0.5, sheathLen: 3.5, rings: [1, 6], wr: 0.12, condLen: 4.5, condMat: COPPER }), x: 1.6, rz: -0.05 }
      ]; scale = 1.3;
    } else if (type === 'fr' || type === 'frt') {
      var mica = type === 'fr';   // fire-resistant cables carry a mica tape on each conductor; FRT does not
      items = [
        { g: singleCable({ sheathMat: ORANGE, sheathR: 0.42, sheathLen: 3.6, rings: [1, 6], wr: 0.1, condLen: 4.7, micaR: mica ? 0.34 : 0, micaLen: 4.25 }), x: -2.7, rz: 0.14 },
        { g: multiCable({ sheathMat: ORANGE, R: 0.6, sheathLen: 3.5, bedMat: WHITE, bedR: 0.44, bedLen: 3.85, cores: [{ insMat: cRED }, { insMat: cYEL }, { insMat: cBLU }, { insMat: cBLK }], coreOffset: 0.23, coreR: 0.18, coreInsLen: 4.3, coreRings: [1, 6, 12], coreWR: 0.028, coreCondLen: 4.8, coreMicaR: mica ? 0.158 : 0, coreMicaLen: 4.56 }), x: 0, rz: 0.02 },
        { g: multiCable({ sheathMat: ORANGE, R: 0.66, sheathLen: 3.5, armour: true, armR: 0.55, armWR: 0.05, armLen: 3.95, bedMat: BED, bedR: 0.49, bedLen: 4.0, cores: [{ insMat: cRED }, { insMat: cGRN }, { insMat: cBLK }, { insMat: cBLU }], coreOffset: 0.25, coreR: 0.2, coreInsLen: 4.45, coreRings: [1, 6, 12], coreWR: 0.03, coreCondLen: 4.95, coreMicaR: mica ? 0.172 : 0, coreMicaLen: 4.72 }), x: 2.8, rz: -0.12 }
      ]; scale = 1.0;
    } else {  // 'lv' (default) — single-core, insulated single-core, multi-core armoured
      items = [
        { g: singleCable({ sheathMat: RED, sheathR: 0.42, sheathLen: 3.6, rings: [1, 6], wr: 0.11, condLen: 4.7 }), x: -2.7, rz: 0.14 },
        { g: singleCable({ sheathMat: BLACK, sheathR: 0.44, sheathLen: 3.6, insMat: RED, insR: 0.33, insLen: 4.0, rings: [1, 6], wr: 0.085, condLen: 4.7 }), x: 0, rz: 0.02 },
        { g: multiCable({ sheathMat: BLACK, R: 0.66, sheathLen: 3.6, armour: true, armR: 0.55, armWR: 0.05, armLen: 4.0, bedMat: BED, bedR: 0.49, bedLen: 4.05, cores: [{ insMat: cRED }, { insMat: cYEL }, { insMat: cBLU }, { insMat: cBLK }], coreOffset: 0.25, coreR: 0.2, coreInsLen: 4.45, coreRings: [1, 6, 12], coreWR: 0.03, coreCondLen: 4.95 }), x: 2.7, rz: -0.12 }
      ]; scale = 1.0;
    }

    items.forEach(function (it) { it.g.position.set(it.x || 0, it.y || 0, it.z || 0); if (it.rz) it.g.rotation.z = it.rz; root.add(it.g); });
    root.scale.setScalar(scale);
    root.rotation.set(-0.42, 0, 0);
    currentType = type; built = true;
  }

  function mount(el) {
    if (mounted) return supported;
    container = el;
    if (typeof THREE === 'undefined') { supported = false; return false; }
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); if (!renderer.getContext()) throw new Error('no ctx'); }
    catch (e) { supported = false; return false; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    var dom = renderer.domElement;
    dom.style.width = '100%'; dom.style.height = '100%'; dom.style.display = 'block'; dom.style.cursor = 'grab'; dom.style.touchAction = 'none';
    el.appendChild(dom);

    scene = new THREE.Scene(); scene.environment = makeEnv(renderer);
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.7, 10.8); camera.lookAt(0, 0.5, 0);

    scene.add(new THREE.AmbientLight(0x4c4c55, 0.34));
    scene.add(new THREE.HemisphereLight(0xc9cedb, 0x221d28, 0.42));
    var key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(5, 8, 7); scene.add(key);
    var fill = new THREE.DirectionalLight(0xeaf0ff, 0.4); fill.position.set(-4, 2, 4); scene.add(fill);
    var rim = new THREE.PointLight(0xED1B9C, 0.28, 70); rim.position.set(-6, 3, -7); scene.add(rim);
    var rim2 = new THREE.DirectionalLight(0xbfd0e6, 0.35); rim2.position.set(-5, -2, -6); scene.add(rim2);

    if (!MICA.map) MICA.map = makeMicaTexture();
    root = new THREE.Group(); scene.add(root);
    build(currentType);

    dom.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; lastY = e.clientY; dom.style.cursor = 'grabbing'; try { dom.setPointerCapture(e.pointerId); } catch (x) {} });
    dom.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      root.rotation.y += (e.clientX - lastX) * 0.01;   // free horizontal spin (360°)
      root.rotation.x += (e.clientY - lastY) * 0.006;  // free vertical tilt
      lastX = e.clientX; lastY = e.clientY;
    });
    var up = function () { dragging = false; dom.style.cursor = 'grab'; };
    dom.addEventListener('pointerup', up); dom.addEventListener('pointerleave', up);

    // scroll / wheel to zoom
    dom.addEventListener('wheel', function (e) {
      e.preventDefault();
      targetZoom = Math.max(4, Math.min(20, targetZoom + e.deltaY * 0.015));
    }, { passive: false });

    // pinch-to-zoom on touch
    var lastPinch = null;
    dom.addEventListener('touchstart', function (e) { if (e.touches.length === 2) lastPinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
    dom.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2) { var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); if (lastPinch) targetZoom = Math.max(4, Math.min(20, targetZoom - (d - lastPinch) * 0.05)); lastPinch = d; }
    }, { passive: true });
    dom.addEventListener('touchend', function () { lastPinch = null; }, { passive: true });

    window.addEventListener('resize', resize);
    mounted = true; resize();
    return true;
  }

  function resize() {
    if (!renderer || !container) return;
    var w = container.clientWidth || 600, h = container.clientHeight || 400;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    // smooth zoom
    zoom += (targetZoom - zoom) * 0.1;
    if (camera) { camera.position.z = zoom; camera.updateProjectionMatrix(); }
    if (renderer && scene && camera) renderer.render(scene, camera);
  }

  function remount(el) {
    if (!mounted || !supported || !renderer) return false;
    container = el;
    el.appendChild(renderer.domElement);
    resize();
    return true;
  }

  window.ProductCable3D = {
    mount: mount,
    remount: remount,
    setZoom: function (z) { targetZoom = zoom = Math.max(4, Math.min(20, z)); },
    show: function (type) { if (!supported) return false; build(type || 'lv'); resize(); return true; },
    start: function () { if (supported && !raf) loop(); },
    stop: function () { if (raf) { cancelAnimationFrame(raf); raf = null; } },
    resize: resize,
    supported: function () { return supported; }
  };
})();
