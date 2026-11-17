// Hero illustration: Koh Samet on the left, Wat Arun and the Bangkok skyline on the right.
// The whole scene is computed from one number — the hour of day in Bangkok — so the sun and moon
// travel across the sky and every colour is interpolated. Pure SVG + CSS variables, no image files.
(() => {
  'use strict';
  // Small deterministic random so the stars and windows look the same on every visit.
  let seed = 20261211;
  const rand = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

  const HORIZON = 640;
  const towers = [[962, 30, 58], [996, 26, 112], [1026, 40, 84], [1072, 22, 176], [1098, 46, 104], [1150, 30, 146], [1184, 54, 80], [1244, 28, 204], [1276, 44, 122], [1326, 36, 92], [1368, 46, 152], [1418, 30, 70]];
  const prang = 'M-46,0V-14H-38V-30H-30V-48L-22,-52L-18,-78L-12,-84L-9,-112L-5,-118L-3,-140L0,-158L3,-140L5,-118L9,-112L12,-84L18,-78L22,-52L30,-48V-30H38V-14H46V0Z';
  const palm = '<path d="M0,0C4,-40 -6,-80 10,-120" fill="none" stroke-width="6" stroke-linecap="round" class="sc-stroke"/>' +
    '<path d="M10,-120Q-30,-150 -62,-118Q-30,-134 10,-120ZM10,-120Q50,-150 82,-116Q48,-134 10,-120ZM10,-120Q-10,-165 -44,-160Q-14,-150 10,-120ZM10,-120Q34,-168 66,-158Q36,-150 10,-120ZM10,-120Q-36,-120 -50,-86Q-30,-112 10,-120ZM10,-120Q56,-118 70,-84Q50,-112 10,-120Z"/>';

  function wave(y, amp, len) {
    let d = 'M-' + len + ',' + y + 'q' + len / 4 + ',-' + amp + ' ' + len / 2 + ',0';
    for (let x = -len / 2; x < 2880 + len; x += len / 2) d += 't' + len / 2 + ',0';
    return d + 'V900H-' + len + 'Z';
  }

  function build() {
    let stars = '', windows = '', glints = '', lanterns = '';
    for (let i = 0; i < 110; i++) stars += '<circle cx="' + Math.round(rand() * 1440) + '" cy="' + Math.round(rand() * 560 - 40) + '" r="' + (0.6 + rand() * 1.5).toFixed(1) + '" style="animation-delay:-' + (rand() * 6).toFixed(1) + 's"/>';
    for (const [x, w, h] of towers) for (let i = 0; i < Math.round(h * w / 260); i++) windows += '<rect x="' + (x + 3 + Math.round(rand() * (w - 8))) + '" y="' + (HORIZON - h + 6 + Math.round(rand() * (h - 14))) + '" width="3" height="4"/>';
    for (let i = 0; i < 12; i++) { const w = 26 + rand() * 90 + i * 9; glints += '<rect x="' + (720 - w / 2).toFixed(0) + '" y="' + (HORIZON + 10 + i * 19) + '" width="' + w.toFixed(0) + '" height="' + (2 + i * 0.5).toFixed(1) + '" rx="2" style="animation-delay:-' + (rand() * 4).toFixed(1) + 's"/>'; }
    for (let i = 0; i < 16; i++) { const s = (0.55 + rand() * 0.9).toFixed(2); lanterns += '<g transform="translate(' + Math.round(470 + rand() * 700) + ',' + (HORIZON - 20) + ') scale(' + s + ')"><g style="animation-duration:' + (26 + rand() * 26).toFixed(0) + 's;animation-delay:-' + (rand() * 50).toFixed(1) + 's"><circle r="13" fill="url(#sc-lamp)"/><path d="M-4,-6Q0,-9 4,-6L3.2,5H-3.2Z"/></g></g>'; }
    const city = towers.map(([x, w, h]) => '<rect x="' + x + '" y="' + (HORIZON - h) + '" width="' + w + '" height="' + (h + 2) + '"/>').join('') +
      '<path d="M1258,' + (HORIZON - 204) + 'v-34M1083,' + (HORIZON - 176) + 'v-22" class="sc-stroke" stroke-width="2"/>';
    const temple = '<g transform="translate(880,' + (HORIZON + 2) + ') scale(.86)"><path d="' + prang + '"/><path d="' + prang + '" transform="translate(-74,0) scale(.42)"/><path d="' + prang + '" transform="translate(74,0) scale(.42)"/><path d="' + prang + '" transform="translate(-112,0) scale(.3)"/><path d="' + prang + '" transform="translate(112,0) scale(.3)"/><rect x="-140" y="-8" width="280" height="12"/></g>';
    const island = '<path d="M-90,' + (HORIZON + 6) + 'V574H0C110,532 250,540 372,574C458,598 540,622 632,' + (HORIZON + 6) + 'Z"/>' +
      '<g transform="translate(520,612) scale(1.05)">' + palm + '</g><g transform="translate(560,624) scale(.72) rotate(6)">' + palm + '</g><g transform="translate(404,588) scale(.9) rotate(-5)">' + palm + '</g><g transform="translate(250,560) scale(.78) rotate(4)">' + palm + '</g><g transform="translate(120,566) scale(1) rotate(-3)">' + palm + '</g>';
    return '<svg class="scene" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sc-sky1"/><stop offset=".42" class="sc-sky2"/><stop offset=".8" class="sc-sky3"/><stop offset="1" class="sc-sky4"/></linearGradient>' +
      '<radialGradient id="sc-glow"><stop offset="0" style="stop-color:var(--sun);stop-opacity:.85"/><stop offset=".35" style="stop-color:var(--sun);stop-opacity:.32"/><stop offset="1" style="stop-color:var(--sun);stop-opacity:0"/></radialGradient>' +
      '<radialGradient id="sc-moonglow"><stop offset="0" stop-color="#bcd4ff" stop-opacity=".55"/><stop offset=".4" stop-color="#9fbfff" stop-opacity=".16"/><stop offset="1" stop-color="#9fbfff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="sc-lamp"><stop offset="0" stop-color="#ffd27a" stop-opacity=".95"/><stop offset=".3" stop-color="#ff9a3c" stop-opacity=".5"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="sc-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sea1)"/><stop offset="1" style="stop-color:var(--sea2)"/></linearGradient>' +
      '<linearGradient id="sc-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="sc-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".75" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<mask id="sc-reflectmask" maskUnits="userSpaceOnUse" x="0" y="' + HORIZON + '" width="1440" height="260"><rect x="0" y="' + HORIZON + '" width="1440" height="260" fill="url(#sc-fade)"/></mask>' +
      '<mask id="sc-crescent" maskUnits="userSpaceOnUse" x="600" y="520" width="240" height="240"><rect x="600" y="520" width="240" height="240" fill="#fff"/><circle cx="742" cy="626" r="40"/></mask>' +
      '<filter id="sc-ripple" filterUnits="userSpaceOnUse" x="0" y="' + (HORIZON - 10) + '" width="1440" height="280"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.11" numOctaves="2" seed="7" result="n"><animate attributeName="baseFrequency" dur="16s" values="0.006 0.11;0.009 0.15;0.006 0.11" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter></defs>' +
      '<rect x="0" y="-400" width="1440" height="' + (HORIZON + 402) + '" fill="url(#sc-sky)"/>' +
      '<g class="sc-stars">' + stars + '</g>' +
      '<g class="sc-meteor"><path d="M0,0l120,-46" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>' +
      '<g class="sc-sunwrap"><g class="sc-moon"><circle cx="720" cy="' + HORIZON + '" r="210" fill="url(#sc-moonglow)"/><circle cx="720" cy="' + HORIZON + '" r="46" fill="#f6f2e2" mask="url(#sc-crescent)"/></g>' +
      '<g class="sc-sun"><circle cx="720" cy="' + HORIZON + '" r="330" fill="url(#sc-glow)"/><circle cx="720" cy="' + HORIZON + '" r="62" class="sc-disc"/></g></g>' +
      '<g class="sc-clouds"><ellipse cx="300" cy="300" rx="190" ry="16"/><ellipse cx="420" cy="322" rx="130" ry="11"/><ellipse cx="1090" cy="250" rx="220" ry="15"/><ellipse cx="980" cy="272" rx="120" ry="10"/><ellipse cx="700" cy="420" rx="260" ry="12"/></g>' +
      '<g class="sc-plane"><rect x="62" y="-3" width="230" height="2.4" fill="url(#sc-trail)"/><path d="M0 0c8-3 30-4 44-3l10-9h4l-5 10 8 1 4-4h3l-2 6c-1 2-3 3-6 3H6C2 4-2 2 0 0z"/><path d="M22 2l-8 10h4l12-9z"/></g>' +
      '<g class="sc-far"><path class="sc-hills" d="M-50,' + HORIZON + 'V612H0C90,596 170,604 260,590C360,574 430,600 520,606C640,614 700,628 760,632C900,624 1010,604 1120,598C1250,592 1340,606 1440,600H1490V' + HORIZON + 'Z"/>' +
      '<g class="sc-city">' + city + '</g><g class="sc-windows">' + windows + '</g></g>' +
      '<g class="sc-lanterns">' + lanterns + '</g>' +
      '<g class="sc-mid">' + temple + '</g>' +
      '<rect x="0" y="' + HORIZON + '" width="1440" height="260" fill="url(#sc-sea)"/>' +
      // Mirror image of the land in the water, wobbled by a turbulence filter.
      '<g mask="url(#sc-reflectmask)"><g class="sc-reflect" filter="url(#sc-ripple)"><g transform="translate(0,' + (HORIZON * 2 + 2) + ') scale(1,-1)"><g class="sc-r-far">' + city + '</g><g class="sc-r-win">' + windows + '</g><g class="sc-r-mid">' + temple + '</g><g class="sc-r-near">' + island + '</g></g></g></g>' +
      '<g class="sc-glints">' + glints + '</g>' +
      '<g class="sc-near">' + island + '</g>' +
      '<path class="sc-wave w1" d="' + wave(HORIZON + 40, 7, 240) + '"/><path class="sc-wave w2" d="' + wave(HORIZON + 100, 10, 360) + '"/><path class="sc-wave w3" d="' + wave(HORIZON + 170, 14, 480) + '"/>' +
      '</svg>';
  }

  // ---- sky model: keyframes through the day, interpolated ----
  const NIGHT = {sky1: '#030817', sky2: '#0a1838', sky3: '#16305c', sky4: '#2a547c', sun: '#ff9a6a', disc: '#fff1cc', glint: '#cfe0ff', sil: '#060e20', near: '#040a17', sea1: '#1a3f63', sea2: '#040a1b', wave: '#030816', cloud: '#7d9ccb', far: .8, stars: 1, lights: 1, cloudO: .16, lanterns: 1, glow: .9};
  const DAY = {sky1: '#0a5a9c', sky2: '#2f98d2', sky3: '#8cd2ea', sky4: '#e6f7f1', sun: '#fff4c8', disc: '#fffbe8', glint: '#ffffff', sil: '#0c5560', near: '#0a4f45', sea1: '#3fbccb', sea2: '#07598a', wave: '#064a78', cloud: '#ffffff', far: .42, stars: 0, lights: 0, cloudO: .85, lanterns: 0, glow: .6};
  const KEYS = [
    [0, {...NIGHT, lanterns: .5}], [4.7, {...NIGHT, lanterns: 0}],
    [5.6, {sky1: '#0e1640', sky2: '#3a2f6e', sky3: '#a2607f', sky4: '#f0a27c', sun: '#ffb48a', disc: '#fff1cc', glint: '#ffc9a8', sil: '#16153a', near: '#0f0f2b', sea1: '#8a5a7a', sea2: '#101a44', wave: '#0c1436', cloud: '#d98a9a', far: .6, stars: .5, lights: .7, cloudO: .4, lanterns: 0, glow: .9}],
    [6.4, {sky1: '#1c2752', sky2: '#6b5b95', sky3: '#f29d8e', sky4: '#ffe0a8', sun: '#ffe0a2', disc: '#fff6dd', glint: '#ffe0a2', sil: '#251e46', near: '#1b1637', sea1: '#dc978c', sea2: '#232b5d', wave: '#1d2452', cloud: '#ffc6ae', far: .55, stars: .1, lights: .3, cloudO: .6, lanterns: 0, glow: 1}],
    [8.2, DAY], [15.6, DAY],
    [16.9, {sky1: '#2a4a8c', sky2: '#7d7fb8', sky3: '#f0a878', sky4: '#ffd690', sun: '#ffe0a0', disc: '#fff6d8', glint: '#ffe0a0', sil: '#1c2a4a', near: '#15203a', sea1: '#d99a7a', sea2: '#1c3566', wave: '#142a55', cloud: '#ffd0a8', far: .55, stars: 0, lights: .3, cloudO: .7, lanterns: 0, glow: 1}],
    [17.8, {sky1: '#121a45', sky2: '#4b2c73', sky3: '#d5586a', sky4: '#ffba68', sun: '#ffc978', disc: '#fff1cc', glint: '#ffc978', sil: '#1a1236', near: '#130d2b', sea1: '#b95a5a', sea2: '#16173d', wave: '#141542', cloud: '#ff9d7c', far: .62, stars: .3, lights: .85, cloudO: .5, lanterns: .2, glow: 1}],
    [18.6, {sky1: '#080f2c', sky2: '#1d1f55', sky3: '#5a3a78', sky4: '#b85a70', sun: '#ff9a6a', disc: '#fff1cc', glint: '#e0b8d8', sil: '#0c0c24', near: '#080818', sea1: '#5a3f6e', sea2: '#080c24', wave: '#070a20', cloud: '#9a6a9a', far: .7, stars: .7, lights: 1, cloudO: .3, lanterns: .8, glow: .9}],
    [19.6, NIGHT], [24, {...NIGHT, lanterns: .5}]
  ];
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  for (const [, key] of KEYS) for (const name of Object.keys(key)) if (typeof key[name] === 'string') key['$' + name] = rgb(key[name]);
  const SUNRISE = 6.15, SUNSET = 18.05, MOONRISE = 18.5, MOONSET = 5.8;

  function apply(node, hour) {
    const h = ((hour % 24) + 24) % 24;
    let i = 0; while (i < KEYS.length - 2 && KEYS[i + 1][0] <= h) i++;
    const [h0, a] = KEYS[i], [h1, b] = KEYS[i + 1], t = Math.min(1, Math.max(0, (h - h0) / (h1 - h0))), style = node.style;
    for (const name of Object.keys(a)) {
      if (name[0] === '$') continue;
      if (typeof a[name] === 'number') style.setProperty('--' + name, (a[name] + (b[name] - a[name]) * t).toFixed(3));
      else { const x = a['$' + name], y = b['$' + name]; style.setProperty('--' + name, 'rgb(' + x.map((v, k) => Math.round(v + (y[k] - v) * t)).join(',') + ')'); }
    }
    // Sun: rises behind the island, sets behind Wat Arun.
    const s = (h - SUNRISE) / (SUNSET - SUNRISE), sunUp = s > -.06 && s < 1.06, arc = Math.sin(Math.PI * Math.min(1, Math.max(0, s)));
    const sx = -220 + 400 * s, sy = sunUp ? -Math.pow(arc, .7) * 520 + (s < 0 || s > 1 ? 90 : 14) : 260;
    style.setProperty('--sun-x', sx.toFixed(1) + 'px'); style.setProperty('--sun-y', sy.toFixed(1) + 'px'); style.setProperty('--sun-s', (1 - .45 * arc).toFixed(3));
    const m = ((h - MOONRISE + 24) % 24) / ((MOONSET - MOONRISE + 24) % 24), moonUp = m <= 1, marc = moonUp ? Math.sin(Math.PI * m) : 0;
    const mx = -250 + 500 * m, moonO = Math.min(1, marc * 5);
    style.setProperty('--moon-x', mx.toFixed(1) + 'px'); style.setProperty('--moon-y', (-Math.pow(marc, .7) * 470 + 40).toFixed(1) + 'px'); style.setProperty('--moon-o', moonO.toFixed(3));
    const day = s >= 0 && s <= 1;
    style.setProperty('--glint-x', (day ? sx : mx).toFixed(1) + 'px');
    style.setProperty('--glint-o', (day ? .3 + .6 * (1 - arc) : .45 * moonO).toFixed(3));
    node.dataset.sky = h < 5 || h >= 18.7 ? 'night' : h < 7 ? 'dawn' : h < 16.4 ? 'day' : 'sunset';
  }

  window.TripScene = {
    html: build, apply,
    presets: {night: 21.5, dawn: 6.3, day: 11, sunset: 17.7},
    label: {night: '夜晚', dawn: '清晨', day: '白天', sunset: '黃昏'}
  };
})();
