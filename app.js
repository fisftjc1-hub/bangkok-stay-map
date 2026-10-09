(() => {
  'use strict';
  const data = window.STAY_DATA;
  const list = document.getElementById('stay-list');
  const map = document.getElementById('stay-map');
  const mapLabel = document.getElementById('map-label');
  const fmt = new Intl.NumberFormat('zh-TW');
  const money = n => 'NT$' + fmt.format(n);
  const viewer = new URL('https://www.google.com/maps/d/viewer');
  viewer.searchParams.set('mid', data.myMapsId);
  document.getElementById('open-google').href = viewer.href;

  function showMap(home) {
    const url = new URL('https://www.google.com/maps/d/embed');
    url.searchParams.set('mid', data.myMapsId);
    url.searchParams.set('hl', 'zh-TW');
    if (home) {
      url.searchParams.set('ll', home.lat + ',' + home.lng);
      url.searchParams.set('z', '15');
      mapLabel.textContent = home.letter + ' · ' + home.short;
    } else {
      url.searchParams.set('ll', '13.7598,100.6015');
      url.searchParams.set('z', '12');
      mapLabel.textContent = '全部 8 間住宿';
    }
    map.src = url.href;
  }
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function link(text, href, cls) {
    const a = el('a', cls, text); a.href = href;
    a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
  }
  for (const home of data.homes) {
    const card = el('details','stay-card');
    card.id = 'stay-' + home.id;
    const summary = el('summary');
    summary.append(el('span','letter',home.letter));
    const heading = el('span');
    heading.append(el('span','card-name',home.short),el('span','card-area',home.area));
    summary.append(heading,el('span','chevron','⌄'));
    const detail = el('div','card-detail');
    detail.append(el('p','full-name',home.name),el('p','room-count',home.rooms),el('p','bed-note',home.beds));
    const tags=el('div','tags');home.features.forEach(f=>tags.append(el('span','tag',f)));detail.append(tags);
    const price=el('div','price');price.append(el('span','price-label','15 人 · 3 晚參考總價'));
    if(home.price!==null) {
      price.append(el('div','price-value',money(home.price)),el('p','price-per','約 '+money(Math.round(home.price/(data.adults*data.nights)))+'／人／晚'));
    } else price.append(el('div','price-pending','指定日期報價待確認'));
    if(home.rating)price.append(el('p','review','Airbnb '+home.rating+' · '+home.reviews+' 則評價'));
    detail.append(price,el('p','note-label','配合這次行程'),el('p','fact-note',home.itinerary),el('p','note-label','訂房前確認'),el('p','fact-note',home.note));
    const actions=el('div','card-actions');
    const focus=el('button','focus-button','在地圖聚焦');focus.type='button';focus.setAttribute('aria-label','在地圖聚焦 '+home.name);
    focus.addEventListener('click',()=>{showMap(home);if(matchMedia('(max-width:760px)').matches)document.querySelector('.map-panel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});});
    actions.append(focus,link('查看房源 ↗',home.url,'listing-link'));detail.append(actions);
    detail.append(link(home.locationType==='approximate'?'Airbnb 公開約略位置 ↗':'Google 商家位置 ↗',home.mapSource,'location-source'));
    if(home.extraSource)detail.append(document.createElement('br'),link('整棟房型資料來源 ↗',home.extraSource,'location-source'));
    card.append(summary,detail);list.append(card);
  }
  document.getElementById('show-all').addEventListener('click',()=>showMap());
  showMap();
})();
