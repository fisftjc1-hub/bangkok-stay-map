// Hero illustration: Koh Samet on the left, Wat Arun and the Bangkok skyline on the right,
// under a sky that follows the local time in Bangkok. Pure SVG, no image files.
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
    let stars = '', windows = '', glints = '';
    for (let i = 0; i < 90; i++) stars += '<circle cx="' + Math.round(rand() * 1440) + '" cy="' + Math.round(rand() * 540) + '" r="' + (0.6 + rand() * 1.5).toFixed(1) + '" style="animation-delay:-' + (rand() * 6).toFixed(1) + 's"/>';
    for (const [x, w, h] of towers) for (let i = 0; i < Math.round(h * w / 260); i++) windows += '<rect x="' + (x + 3 + Math.round(rand() * (w - 8))) + '" y="' + (HORIZON - h + 6 + Math.round(rand() * (h - 14))) + '" width="3" height="4"/>';
    for (let i = 0; i < 12; i++) { const w = 26 + rand() * 90 + i * 9; glints += '<rect x="' + (720 - w / 2).toFixed(0) + '" y="' + (HORIZON + 10 + i * 19) + '" width="' + w.toFixed(0) + '" height="' + (2 + i * 0.5).toFixed(1) + '" rx="2" style="animation-delay:-' + (rand() * 4).toFixed(1) + 's"/>'; }
    const skyline = towers.map(([x, w, h]) => '<rect x="' + x + '" y="' + (HORIZON - h) + '" width="' + w + '" height="' + (h + 2) + '"/>').join('') +
      '<path d="M1258,' + (HORIZON - 204) + 'v-34M1083,' + (HORIZON - 176) + 'v-22" class="sc-stroke" stroke-width="2"/>';
    return '<svg class="scene" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sc-sky1"/><stop offset=".42" class="sc-sky2"/><stop offset=".8" class="sc-sky3"/><stop offset="1" class="sc-sky4"/></linearGradient><radialGradient id="sc-glow"><stop offset="0" style="stop-color:var(--sun);stop-opacity:.85"/><stop offset=".35" style="stop-color:var(--sun);stop-opacity:.32"/><stop offset="1" style="stop-color:var(--sun);stop-opacity:0"/></radialGradient>' +
      '<linearGradient id="sc-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sea1)"/><stop offset="1" style="stop-color:var(--sea2)"/></linearGradient>' +
      '<linearGradient id="sc-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<rect x="0" y="-400" width="1440" height="' + (HORIZON + 402) + '" fill="url(#sc-sky)"/>' +
      '<g class="sc-stars">' + stars + '</g>' +
      '<g class="sc-sunwrap"><g class="sc-sun"><circle cx="720" cy="' + HORIZON + '" r="330" fill="url(#sc-glow)"/><circle cx="720" cy="' + HORIZON + '" r="62" class="sc-disc"/></g></g>' +
      '<g class="sc-clouds"><ellipse cx="300" cy="300" rx="190" ry="16"/><ellipse cx="420" cy="322" rx="130" ry="11"/><ellipse cx="1090" cy="250" rx="220" ry="15"/><ellipse cx="980" cy="272" rx="120" ry="10"/><ellipse cx="700" cy="420" rx="260" ry="12"/></g>' +
      '<g class="sc-plane"><rect x="62" y="-3" width="230" height="2.4" fill="url(#sc-trail)"/><path d="M0 0c8-3 30-4 44-3l10-9h4l-5 10 8 1 4-4h3l-2 6c-1 2-3 3-6 3H6C2 4-2 2 0 0z"/><path d="M22 2l-8 10h4l12-9z"/></g>' +
      '<g class="sc-far"><path class="sc-hills" d="M0,' + HORIZON + 'V612C90,596 170,604 260,590C360,574 430,600 520,606C640,614 700,628 760,632C900,624 1010,604 1120,598C1250,592 1340,606 1440,600V' + HORIZON + 'Z"/>' +
      '<g class="sc-city">' + skyline + '</g><g class="sc-windows">' + windows + '</g></g>' +
      '<g class="sc-mid"><g class="sc-temple" transform="translate(880,' + (HORIZON + 2) + ') scale(.86)"><path d="' + prang + '"/><path d="' + prang + '" transform="translate(-74,0) scale(.42)"/><path d="' + prang + '" transform="translate(74,0) scale(.42)"/><path d="' + prang + '" transform="translate(-112,0) scale(.3)"/><path d="' + prang + '" transform="translate(112,0) scale(.3)"/><rect x="-140" y="-8" width="280" height="12"/></g></g>' +
      '<rect x="0" y="' + HORIZON + '" width="1440" height="260" fill="url(#sc-sea)"/>' +
      '<g class="sc-glints">' + glints + '</g>' +
      '<g class="sc-near"><path d="M0,' + (HORIZON + 6) + 'V574C110,532 250,540 372,574C458,598 540,622 632,' + (HORIZON + 6) + 'Z"/>' +
      '<g transform="translate(520,612) scale(1.05)">' + palm + '</g><g transform="translate(560,624) scale(.72) rotate(6)">' + palm + '</g><g transform="translate(404,588) scale(.9) rotate(-5)">' + palm + '</g><g transform="translate(250,560) scale(.78) rotate(4)">' + palm + '</g><g transform="translate(120,566) scale(1) rotate(-3)">' + palm + '</g></g>' +
      '<path class="sc-wave w1" d="' + wave(HORIZON + 40, 7, 240) + '"/><path class="sc-wave w2" d="' + wave(HORIZON + 100, 10, 360) + '"/><path class="sc-wave w3" d="' + wave(HORIZON + 170, 14, 480) + '"/>' +
      '</svg>';
  }

  // hour: decimal hour in Bangkok (e.g. 17.5). Returns the sky name used by the CSS themes.
  window.TripScene = {
    sky(hour) { return hour < 5 ? 'night' : hour < 7 ? 'dawn' : hour < 16.4 ? 'day' : hour < 18.7 ? 'sunset' : 'night'; },
    label: {night: '曼谷現在是夜晚', dawn: '曼谷現在是清晨', day: '曼谷現在是白天', sunset: '曼谷現在是黃昏'},
    html: build
  };
})();
