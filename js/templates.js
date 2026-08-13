/* ============================================================
   templates.js — all slide layout templates (window.T)
   Each template takes a plain-data object and returns HTML.
   Stage is a fixed 1280x720 canvas, so px values are stable.
   ============================================================ */
(function () {
  const IMG = 'assets/img/';
  const LOGO = IMG + 'image2.png';

  const img = (src) => IMG + src;
  const bleed = (src, cls) => `<div class="bleed ${cls || ''}"><div class="bleed__img kenburns" data-src="${img(src)}"></div></div>`;
  const scrim = (cls) => `<div class="scrim ${cls || ''}"></div>`;
  const an = (type, d) => `data-anim="${type}" style="--d:${d}s"`;

  /* ---- inline icon set (stroke) ---- */
  const ICONS = {
    pin:    '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    shield: '<path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    leaf:   '<path d="M5 19c0-8 6-13 14-13 0 8-5 14-13 14"/><path d="M5 19c2-4 5-6 9-7"/>',
    bolt:   '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    fire:   '<path d="M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.5 1.5 2 2 2 0-3-1-5 1-7z"/>',
    gauge:  '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-5"/>',
    wrench: '<path d="M14 7a4 4 0 0 0-5 5l-6 6 3 3 6-6a4 4 0 0 0 5-5l-2 2-2-2 2-2z"/>',
    globe:  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    cog:    '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    cube:   '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v18M4 7.5l8 4.5 8-4.5"/>',
    factory:'<path d="M3 21V10l6 4V10l6 4V6l6 3v12z"/>',
    award:  '<circle cx="12" cy="9" r="5"/><path d="M9 13l-2 8 5-3 5 3-2-8"/>',
    ruler:  '<path d="M3 7h18v10H3z"/><path d="M7 7v3M11 7v4M15 7v3M19 7v4"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" class="ico">${ICONS[name] || ICONS.bolt}</svg>`;

  window.IMG = IMG; window.LOGO = LOGO; // expose for slides.js if needed

  const T = {};

  /* ---------- TITLE (dark) ---------- */
  T.title = (o) => `
    ${bleed(o.bg, 'bleed--title')}${scrim('scrim--title')}
    <div class="slide__pad t-title">
      <header class="t-title__bar">
        <img class="logo logo--white" data-src="${LOGO}" alt="Tonn Cable" ${an('fade', .1)}>
        <span class="pill pill--ghost" ${an('fade', .55)}>${o.tag}</span>
      </header>
      <div class="t-title__main">
        <h1 class="display">
          <span ${an('rise', .15)}>get</span>
          <span class="display__hl" ${an('rise', .28)}>wired</span>
          <span ${an('rise', .41)}>with industry</span>
        </h1>
        <p class="lead lead--light" ${an('rise', .7)}>${o.sub}</p>
      </div>
      <footer class="t-title__foot" ${an('fade', 1)}><span class="dot"></span>${o.foot}</footer>
    </div>`;

  /* ---------- DIVIDER / section intro (dark, full-bleed) ---------- */
  T.divider = (o) => `
    ${o.bg ? bleed(o.bg, 'bleed--div') : ''}${o.bg ? scrim('scrim--div') : scrim('scrim--solid')}
    <div class="slide__pad t-div">
      ${o.eyebrow ? `<span class="t-div__eye" ${an('rise', .1)}><span class="dot"></span>${o.eyebrow}</span>` : ''}
      <h2 class="display display--md" ${an('rise', .2)}>${o.title}</h2>
      ${o.sub ? `<p class="lead lead--light" ${an('rise', .4)}>${o.sub}</p>` : ''}
    </div>`;

  /* ---------- STATEMENT (dark, two lines) ---------- */
  T.statement = (o) => `
    ${o.bg ? bleed(o.bg, 'bleed--stmt') : ''}${o.bg ? scrim('scrim--stmt') : scrim('scrim--solid')}
    <div class="slide__pad stmt">
      <p class="stmt__line" ${an('rise', .1)}>${o.l1}</p>
      <p class="stmt__line stmt__line--big" ${an('rise', .35)}>${o.l2}</p>
    </div>`;

  /* ---------- BIG TEXT / definition ---------- */
  T.bigText = (o) => `
    ${o.bg ? bleed(o.bg, 'bleed--stmt') : ''}${o.bg ? scrim('scrim--stmt') : ''}
    <div class="slide__pad bigtext">
      ${o.kicker ? `<span class="kicker" ${an('rise', .05)}>${o.kicker}</span>` : ''}
      <p class="bigtext__t" ${an('rise', .18)}>${o.text}</p>
    </div>`;

  /* ---------- PHOTO SPLIT (light) ---------- */
  T.photoSplit = (o) => {
    const media = `<div class="split__media">
        <div class="bleed__img kenburns" data-src="${img(o.img)}"></div>
        ${o.badge ? `<span class="split__badge" ${an('scale', .5)}>${o.badge}</span>` : ''}
      </div>`;
    const body = `<div class="split__body slide__pad">
        <span class="kicker" ${an('rise', .05)}>${o.kicker}</span>
        <h2 class="h2" ${an('rise', .15)}>${o.title}</h2>
        ${o.body ? `<p class="body" ${an('rise', .28)}>${o.body}</p>` : ''}
        ${o.points ? `<ul class="ticks">${o.points.map((p, i) => `<li ${an('rise', .4 + i * .1)}><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>${p}</li>`).join('')}</ul>` : ''}
      </div>`;
    return `<div class="split ${o.side === 'right' ? 'split--right' : ''}">${o.side === 'right' ? body + media : media + body}</div>`;
  };

  /* ---------- STATS (light hero) ---------- */
  T.stats = (o) => `
    <div class="slide__pad stats">
      <header class="block-head" ${an('rise', 0)}>
        <span class="kicker">${o.kicker}</span>
        <h2 class="h2">${o.title}</h2>
      </header>
      <div class="stats__grid">
        ${o.stats.map((s, i) => `
          <div class="stat" ${an('rise', .2 + i * .12)}>
            <div class="stat__num"><span data-count="${s.count}">0</span>${s.plus ? '<i>+</i>' : ''}${s.unit ? `<span class="stat__unit">${s.unit}</span>` : ''}</div>
            <div class="stat__label">${s.label}</div>
          </div>`).join('')}
      </div>
      ${o.note ? `<p class="stats__note" ${an('fade', .8)}>${o.note}</p>` : ''}
    </div>`;

  /* ---------- NUMBERED CARD GRID ---------- */
  T.grid = (o) => `
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="cardgrid cardgrid--${o.cols || 3}">
        ${o.items.map((it, i) => `
          <div class="pcard" ${an('rise', .15 + i * .06)}>
            <span class="pcard__no">${String(i + 1).padStart(2, '0')}</span>
            <span class="pcard__name">${it}</span>
            <span class="pcard__arrow">→</span>
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- ICON ROWS (light) ---------- */
  T.iconRows = (o) => `
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="irows">
        ${o.rows.map((r, i) => `
          <div class="irow" ${an('rise', .2 + i * .12)}>
            <span class="irow__ic">${icon(r.icon)}</span>
            <div class="irow__tx"><h3 class="irow__h">${r.head}</h3><p class="irow__d">${r.desc}</p></div>
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- TIMELINE (light) ---------- */
  T.timeline = (o) => `
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="tl">
        <div class="tl__line" ${an('clip', .25)}></div>
        ${o.events.map((e, i) => `
          <div class="tl__item" ${an('rise', .35 + i * .12)}>
            <span class="tl__dot"></span>
            <span class="tl__year">${e.year}</span>
            <p class="tl__text">${e.text}</p>
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- TWO BIG (vision/mission) ---------- */
  T.twoBig = (o) => `
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="twobig">
        ${o.items.map((it, i) => `
          <div class="bigcard" ${an('rise', .2 + i * .15)}>
            <span class="bigcard__label">${it.label}</span>
            <p class="bigcard__text">${it.text}</p>
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- QUOTE / sustainability (light) ---------- */
  T.quote = (o) => `
    <div class="split">
      <div class="split__body slide__pad" style="width:54%;left:0;right:auto">
        <span class="kicker" ${an('rise', .05)}>${o.kicker}</span>
        <h2 class="h2" ${an('rise', .15)}>${o.title}</h2>
        <p class="body" ${an('rise', .28)}>${o.body}</p>
      </div>
      <div class="quote__side" ${an('right', .35)}>
        ${o.img ? `<div class="bleed__img kenburns" data-src="${img(o.img)}"></div>` : ''}
        <blockquote class="quote__q">${o.quote}</blockquote>
      </div>
    </div>`;

  /* ---------- LOCATIONS ---------- */
  T.locations = (o) => `
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="locs">
        ${o.places.map((p, i) => `
          <div class="loc" ${an('rise', .2 + i * .12)}>
            <span class="loc__ic">${icon('pin')}</span>
            <span class="loc__tag">${p.tag}</span>
            <h3 class="loc__name">${p.name}</h3>
            <p class="loc__addr">${p.address}</p>
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- PHOTO CARDS (image + caption grid) ---------- */
  T.photoCards = (o) => `
    ${o.theme === 'dark' && o.bg ? bleed(o.bg, 'bleed--soft') + scrim('scrim--soft') : ''}
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="pcards pcards--${o.cols || 3}">
        ${o.cards.map((c, i) => `
          <figure class="pc" ${an('rise', .18 + i * .08)}>
            <div class="pc__img"><div class="bleed__img" data-src="${img(c.img)}"></div></div>
            <figcaption class="pc__cap"><span class="pc__h">${c.head}</span>${c.desc ? `<span class="pc__d">${c.desc}</span>` : ''}</figcaption>
          </figure>`).join('')}
      </div>
    </div>`;

  /* ---------- LOGOS / certifications ---------- */
  T.logos = (o) => `
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="logos logos--${o.cols || 5}">
        ${o.items.map((it, i) => `
          <div class="lcard" ${an('scale', .15 + i * .07)}>
            <div class="lcard__img"><div class="bleed__img" data-src="${img(it.img)}"></div></div>
            ${it.name ? `<span class="lcard__name">${it.name}</span>` : ''}
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- VOLTAGE SCALE ---------- */
  T.voltage = (o) => `
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="volt">
        ${o.tiers.map((t, i) => `
          <div class="vtier vtier--${i}" ${an('left', .2 + i * .1)}>
            <div class="vtier__head"><span class="vtier__abbr">${t.abbr}</span><span class="vtier__name">${t.name}</span></div>
            <div class="vtier__range">${t.range}</div>
            <div class="vtier__note">${t.note}</div>
            <div class="vtier__eg">${t.examples}</div>
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- CROSS-SECTION (cable construction / distribution) ---------- */
  T.crossSection = (o) => `
    <div class="xsec">
      <div class="xsec__media" ${an('scale', .25)}>
        <div class="bleed__img xsec__img" data-src="${img(o.img)}"></div>
      </div>
      <div class="xsec__body slide__pad">
        <span class="kicker" ${an('rise', .05)}>${o.kicker}</span>
        <h2 class="h2" ${an('rise', .15)}>${o.title}</h2>
        ${o.code ? `<span class="xsec__code" ${an('rise', .25)}>${o.code}</span>` : ''}
        <ol class="layers">
          ${o.layers.map((l, i) => `<li ${an('left', .35 + i * .08)}><span class="layers__name">${l.name}</span><span class="layers__mat">${l.material}</span></li>`).join('')}
        </ol>
      </div>
    </div>`;

  /* ---------- PROCESS STEPS ---------- */
  T.processSteps = (o) => `
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="steps steps--${o.steps.length}">
        ${o.steps.map((s, i) => `
          <div class="step" ${an('rise', .2 + i * .1)}>
            <div class="step__img"><div class="bleed__img" data-src="${img(s.img)}"></div><span class="step__no">${i + 1}</span></div>
            <h3 class="step__name">${s.name}</h3>
            <p class="step__desc">${s.desc}</p>
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- COMPARISON (A vs B) ---------- */
  T.comparison = (o) => `
    <div class="slide__pad cmp-pad">
      <header class="block-head cmp-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="cmp">
        ${[o.a, o.b].map((c, i) => `
          <div class="cmp__col" ${an(i ? 'right' : 'left', .25)}>
            ${c.img ? `<div class="cmp__img"><div class="bleed__img" data-src="${img(c.img)}"></div></div>` : ''}
            <h3 class="cmp__head">${c.head}</h3>
            ${c.sub ? `<span class="cmp__sub">${c.sub}</span>` : ''}
            <ul class="cmp__points">${c.points.map(p => `<li>${p}</li>`).join('')}</ul>
          </div>`).join('<span class="cmp__vs" ' + an('scale', .5) + '>VS</span>')}
      </div>
    </div>`;

  /* ---------- POINTS (headed bullets, 1-2 cols) ---------- */
  T.points = (o) => `
    ${o.theme === 'dark' && o.bg ? bleed(o.bg, 'bleed--soft') + scrim('scrim--soft') : ''}
    <div class="slide__pad">
      <header class="block-head"><span class="kicker" ${an('rise', 0)}>${o.kicker}</span><h2 class="h2" ${an('rise', .1)}>${o.title}</h2></header>
      <div class="points points--${o.cols || 2}">
        ${o.items.map((it, i) => `
          <div class="point" ${an('rise', .2 + i * .1)}>
            ${it.no ? `<span class="point__no">${it.no}</span>` : ''}
            <h3 class="point__h">${it.head}</h3>
            ${Array.isArray(it.desc) ? `<ul class="point__list">${it.desc.map(d => `<li>${d}</li>`).join('')}</ul>` : `<p class="point__d">${it.desc}</p>`}
          </div>`).join('')}
      </div>
    </div>`;

  /* ---------- CLOSING (dark) ---------- */
  T.closing = (o) => `
    ${scrim('scrim--solid')}
    <div class="slide__pad closing">
      <div class="closing__top">
        <img class="logo logo--white" data-src="${LOGO}" alt="Tonn Cable" ${an('rise', 0)}>
        <h2 class="display display--sm" ${an('rise', .15)}>Thank&nbsp;you.</h2>
        <p class="lead lead--light" ${an('rise', .3)}>${o.tagline}</p>
      </div>
      <div class="closing__contacts">
        ${o.contacts.map((c, i) => `<a class="contact" ${c.href ? `href="${c.href}"` : ''} ${an('rise', .45 + i * .1)}><span class="contact__k">${c.k}</span><span class="contact__v">${c.v}</span></a>`).join('')}
      </div>
    </div>`;

  /* ---------- 3D INTERACTIVE CABLE CROSS-SECTION ---------- */
  T.cable3d = (o) => {
    const L = o.layers; // outer -> inner
    let core = `<div class="ring ring--${L[L.length-1].kind}" data-layer="${L.length-1}"><span class="cab-core"></span></div>`;
    for (let i = L.length - 2; i >= 0; i--) core = `<div class="ring ring--${L[i].kind}" data-layer="${i}">${core}</div>`;
    return `
      <div class="xsec xsec--3d">
        <div class="cable3d__stage">
          <div class="cable3d__float">
            <div class="cable3d" data-tilt>
              <div class="cable3d__shadow"></div>
              ${core}
            </div>
          </div>
          <span class="cable3d__hint" ${an('fade', .9)}>Move your mouse · hover a layer</span>
        </div>
        <div class="xsec__body slide__pad">
          <span class="kicker" ${an('rise', .05)}>${o.kicker}</span>
          <h2 class="h2" ${an('rise', .15)}>${o.title}</h2>
          <ol class="layers layers--int">
            ${L.map((l, i) => `<li data-layer="${i}" ${an('left', .3 + i * .08)}><span class="layers__sw sw--${l.kind}"></span><span class="layers__txt"><span class="layers__name">${l.name}</span><span class="layers__mat">${l.material}</span></span></li>`).join('')}
          </ol>
        </div>
      </div>`;
  };

  window.T = T;
})();
