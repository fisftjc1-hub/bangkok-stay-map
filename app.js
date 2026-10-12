(() => {
  'use strict';
  const data = window.STAY_DATA;
  const list = document.getElementById('stay-list');
  const map = document.getElementById('stay-map');
  const mapLabel = document.getElementById('map-label');
  const itinerary = window.ITINERARY_DATA;
  const dayTabs = document.getElementById('day-tabs');
  const routeDetails = document.getElementById('route-details');
  const locationAnalysis = document.getElementById('location-analysis');
  let selectedHome = null;
  let activeDay = 'all';
  let mapMode = 'routes';
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const routeMap = L.map('route-map',{center:[13.74,100.56],zoom:12,scrollWheelZoom:false,minZoom:9,maxZoom:19,zoomSnap:.5,zoomControl:false});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(routeMap);
  L.control.zoom({position:'bottomright'}).addTo(routeMap);
  L.control.scale({imperial:false,position:'bottomleft'}).addTo(routeMap);
  routeMap.createPane('activityAreas'); routeMap.getPane('activityAreas').style.zIndex=250;
  routeMap.createPane('movementLines'); routeMap.getPane('movementLines').style.zIndex=350;
  const homeLayers=L.layerGroup().addTo(routeMap), movementLayers=L.layerGroup().addTo(routeMap);
  const fmt = new Intl.NumberFormat('zh-TW');
  const money = n => 'NT$' + fmt.format(n);
  const viewer = new URL('https://www.google.com/maps/d/viewer');
  viewer.searchParams.set('mid', data.myMapsId);
  document.getElementById('open-google').href = viewer.href;

  function distance(a, b) {
    const radians = Math.PI / 180;
    const dLat = (b.lat - a.lat) * radians;
    const dLng = (b.lng - a.lng) * radians;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * radians) * Math.cos(b.lat * radians) * Math.sin(dLng / 2) ** 2;
    return 6371.0088 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }
  const visibleDays = () => itinerary.days.filter(day => activeDay === 'all' || day.id === activeDay);
  function drawMovement() {
    homeLayers.clearLayers(); movementLayers.clearLayers();
    for (const home of data.homes) {
      const selected=selectedHome?.id===home.id;
      const badge=el('span','home-pin'+(selected?' selected':''),home.letter);
      const marker=L.marker([home.lat,home.lng],{icon:L.divIcon({className:'home-icon',html:badge,iconSize:selected?[36,36]:[28,28],iconAnchor:selected?[18,18]:[14,14]}),title:home.letter+' '+home.short,zIndexOffset:selected?1100:900});
      marker.on('click',()=>focusHome(home));
      marker.bindTooltip(home.short,{permanent:selected,direction:'top',offset:[0,-14],className:'home-tooltip'});
      marker.addTo(homeLayers);
    }
    const drawnPlaces=new Set();
    const labeledAreas=[];
    for (const day of visibleDays()) {
      for (const area of day.areas) {
        const polygon=L.polygon(area.coordinates.map(([lng,lat])=>[lat,lng]),{pane:'activityAreas',color:day.color,weight:1.5,fillColor:day.color,fillOpacity:.12,className:'activity-area'});
        const center=polygon.getBounds().getCenter();
        const label=!labeledAreas.some(p=>distance(p,center)<.5);
        if(label) labeledAreas.push(center);
        polygon.bindTooltip(area.name,{permanent:label,direction:'center',className:'area-tooltip'}).addTo(movementLayers);
      }
      const route=day.stops.map(id=>itinerary.places[id]);
      L.polyline(route.map(p=>[p.lat,p.lng]),{pane:'movementLines',color:day.color,weight:4,opacity:activeDay==='all'?.75:1,className:activeDay==='all'?'route-line':'route-line route-active'}).addTo(movementLayers);
      for (const [index,place] of route.entries()) {
        if (drawnPlaces.has(place.id)) continue;
        drawnPlaces.add(place.id);
        const badge=el('span','place-pin',activeDay==='all'?'':String(index+1)); badge.style.background=day.color;
        const marker=L.marker([place.lat,place.lng],{icon:L.divIcon({className:'place-icon',html:badge,iconSize:[23,23],iconAnchor:[11.5,11.5]}),title:place.name,zIndexOffset:400});
        const popup=el('div','place-popup'); popup.append(el('strong','',place.name),link('Google 地圖 ↗',place.google));
        if(selectedHome) popup.append(link('從 '+selectedHome.short+' 出發 ↗',directions(place)));
        marker.bindPopup(popup).bindTooltip(place.name,{permanent:false,direction:'top',offset:[0,-11]}).addTo(movementLayers);
      }
    }
  }
  function camera(points) {
    const project = p => ({x: (p.lng + 180) / 360, y: (1 - Math.log(Math.tan(Math.PI / 4 + p.lat * Math.PI / 360)) / Math.PI) / 2});
    const projected = points.map(project);
    const xs = projected.map(p => p.x), ys = projected.map(p => p.y);
    const west = Math.min(...xs), east = Math.max(...xs), north = Math.min(...ys), south = Math.max(...ys);
    const rect = map.getBoundingClientRect();
    const width = Math.max(220, rect.width - 110), height = Math.max(220, rect.height - 150);
    const zoom = Math.min(15, Math.floor(Math.min(Math.log2(width / (256 * Math.max(east - west, .000001))), Math.log2(height / (256 * Math.max(south - north, .000001))))) - 1);
    const lat = Math.atan(Math.sinh(Math.PI * (1 - north - south))) * 180 / Math.PI;
    return {lat, lng: (west + east) * 180 - 180, zoom: Math.max(9, zoom)};
  }
  function updateMap(closeup = false, place = null) {
    const points = selectedHome ? [selectedHome] : [...data.homes];
    for (const day of visibleDays()) {
      points.push(...day.stops.map(id => itinerary.places[id]));
      for (const area of day.areas) points.push(...area.coordinates.map(([lng,lat]) => ({lat,lng})));
    }
    const view = place ? {lat:place.lat,lng:place.lng,zoom:16} : closeup && selectedHome ? {...selectedHome,zoom:15} : camera(points);
    const mapId = itinerary.maps[activeDay] || itinerary.maps.all;
    const url = new URL('https://www.google.com/maps/d/embed');
    url.searchParams.set('mid', mapId);
    url.searchParams.set('hl', 'zh-TW');
    url.searchParams.set('ll', view.lat + ',' + view.lng);
    url.searchParams.set('z', String(view.zoom));
    if (mapMode === 'google') {
      if (map.getAttribute('src') !== url.href) map.src = url.href;
    } else {
      drawMovement(); routeMap.invalidateSize();
      if (place || closeup && selectedHome) routeMap.flyTo([view.lat,view.lng],view.zoom,{animate:!reducedMotion,duration:.6});
      else routeMap.flyToBounds(L.latLngBounds(points.map(p=>[p.lat,p.lng])),{padding:[35,35],maxZoom:14,animate:!reducedMotion,duration:.65});
    }
    viewer.searchParams.set('mid',mapId);
    document.getElementById('open-google').href = viewer.href;
  }
  function directions(place) {
    const url = new URL('https://www.google.com/maps/dir/');
    url.searchParams.set('api','1');
    url.searchParams.set('origin',selectedHome.lat+','+selectedHome.lng);
    url.searchParams.set('destination',place.id === 'airport' ? 'Suvarnabhumi Airport Departures' : new URL(place.google).searchParams.get('query') || place.name+', Bangkok');
    url.searchParams.set('travelmode','driving');
    return url.href;
  }
  function selectDay(id) {
    activeDay = id;
    document.querySelector('.map-key').style.setProperty('--route-color',id==='all'?'#2878b8':visibleDays()[0].color);
    for (const button of dayTabs.querySelectorAll('button')) button.setAttribute('aria-pressed',String(button.dataset.day === id));
    renderRoute(); renderAnalysis(); updateMap();
  }
  function renderRoute() {
    routeDetails.replaceChildren();
    if (activeDay === 'all') {
      const grid = el('div','route-overview');
      for (const day of itinerary.days) {
        const button = el('button','route-day'); button.type='button'; button.style.setProperty('--day-color',day.color);
        button.append(el('span','route-date',day.date),el('strong','',day.label),el('span','route-count',day.stops.length+' 個活動點'));
        button.addEventListener('click',()=>selectDay(day.id)); grid.append(button);
      }
      routeDetails.append(grid);
      return;
    }
    const day = visibleDays()[0];
    const heading = el('div','route-heading'); heading.style.setProperty('--day-color',day.color);
    heading.append(el('h2','',day.date+' '+day.label),el('span','route-order','建議順序'));
    routeDetails.append(heading);
    const stops = el('ol','route-stops');
    for (const [index,id] of day.stops.entries()) {
      const place = itinerary.places[id], item=el('li');
      const button=el('button','stop-button'); button.type='button';
      button.append(el('span','stop-number',String(index+1)),el('span','',place.name));
      button.addEventListener('click',()=>updateMap(false,place));
      item.append(button); stops.append(item);
    }
    routeDetails.append(stops,el('p','day-analysis',day.analysis),el('p','day-note',day.note));
    if (day.pending.length) routeDetails.append(el('p','day-pending',day.pending.join(' · ')));
  }
  function renderAnalysis() {
    locationAnalysis.replaceChildren(); locationAnalysis.hidden = !selectedHome || mapMode==='google';
    if (!selectedHome) return;
    const heading=el('div','analysis-heading');
    heading.append(el('h2','','房源至活動點'),el('span','',selectedHome.locationType==='approximate'?'直線距離・住宿約略位置':'直線距離'));
    const hubIds = activeDay === 'all' ? itinerary.analysisHubs : visibleDays()[0].stops.filter(id=>!['emerald','watpho','watarun','erawan','central','bigc'].includes(id));
    const grid=el('div','distance-grid');
    for (const id of hubIds) {
      const place=itinerary.places[id], km=distance(selectedHome,place);
      const tile=link('',directions(place),'distance-tile');
      tile.append(el('span','distance-label',place.name),el('strong','distance-value',km.toFixed(1)+' km'),el('span','distance-nav','Google 路線 ↗'));
      grid.append(tile);
    }
    locationAnalysis.append(heading,grid);
  }
  function showMap(home) {
    selectedHome = home || null;
    mapLabel.textContent = selectedHome ? home.letter + ' · ' + home.short : '全部 8 間住宿';
    document.getElementById('home-closeup').hidden = !selectedHome;
    for (const card of list.querySelectorAll('.stay-card')) {
      const selected = card.id === 'stay-' + selectedHome?.id;
      card.classList.toggle('is-selected', selected);
      const summary = card.querySelector('summary');
      if (selected) summary.setAttribute('aria-current', 'true');
      else summary.removeAttribute('aria-current');
    }
    renderRoute(); renderAnalysis(); updateMap();
  }
  function focusHome(home) {
    showMap(home);
    if (matchMedia('(max-width:760px)').matches) {
      requestAnimationFrame(() => document.querySelector('.map-panel').scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      }));
    } else document.querySelector('.map-panel').scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
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
  for (const day of [{id:'all',date:'全部',label:'活動區',color:'#657570'},...itinerary.days]) {
    const button=el('button','day-tab'); button.type='button'; button.dataset.day=day.id;
    button.style.setProperty('--day-color',day.color); button.setAttribute('aria-pressed',String(day.id===activeDay));
    button.append(el('span','day-dot'),el('strong','',day.date),el('span','day-tab-label',day.label));
    button.addEventListener('click',()=>selectDay(day.id)); dayTabs.append(button);
  }
  for (const home of data.homes) {
    const card = el('details','stay-card');
    card.id = 'stay-' + home.id;
    const summary = el('summary');
    summary.addEventListener('click', () => focusHome(home));
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
    focus.addEventListener('click', () => focusHome(home));
    actions.append(focus,link('查看房源 ↗',home.url,'listing-link'));detail.append(actions);
    detail.append(link(home.locationType==='approximate'?'Airbnb 公開約略位置 ↗':'Google 商家位置 ↗',home.mapSource,'location-source'));
    if(home.extraSource)detail.append(document.createElement('br'),link('整棟房型資料來源 ↗',home.extraSource,'location-source'));
    card.append(summary,detail);list.append(card);
  }
  document.getElementById('show-all').addEventListener('click',()=>showMap());
  document.getElementById('home-closeup').addEventListener('click',()=>updateMap(true));
  document.getElementById('fit-route').addEventListener('click',()=>updateMap());
  function setMapMode(mode) {
    mapMode=mode;
    document.getElementById('mode-routes').setAttribute('aria-pressed',String(mode==='routes'));
    document.getElementById('mode-google').setAttribute('aria-pressed',String(mode==='google'));
    document.getElementById('route-map').hidden=mode==='google'; map.hidden=mode==='routes';
    dayTabs.hidden=mode==='google'; routeDetails.hidden=mode==='google';
    document.querySelector('.map-key').hidden=mode==='google';
    renderAnalysis(); updateMap(mode==='google' && Boolean(selectedHome));
  }
  document.getElementById('mode-routes').addEventListener('click',()=>setMapMode('routes'));
  document.getElementById('mode-google').addEventListener('click',()=>setMapMode('google'));
  let resizeTimer;
  window.addEventListener('resize',()=>{ clearTimeout(resizeTimer); resizeTimer=setTimeout(()=>updateMap(),180); });
  showMap();
})();
