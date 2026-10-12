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
  const navigationPanel = document.getElementById('navigation-panel');
  const routeSettings=document.getElementById('route-settings');
  const departureInput=document.getElementById('departure-time');
  let departureLocal='2026-12-13T10:00';
  departureInput.value=departureLocal;
  const departureTime=()=>new Date(departureLocal+':00+07:00');
  const navigation = window.TripNavigation;
  const mapsConfig=window.TRIP_MAPS_CONFIG||{};
  const useGoogle=Boolean(mapsConfig.googleApiKey&&mapsConfig.mapId);
  const googleMap=useGoogle?new window.GoogleTripMap(document.getElementById('gmp-map'),mapsConfig,{onHome:focusHome,onPlace:focusPlace,onArea:focusArea,onRoad:selectRoad}):null;
  let selectedHome = null;
  let selectedPlace = null;
  let activeRoad = null;
  let roadData = null;
  let roadError = false;
  let roadGeneration = 0;
  let activeDay = 'all';
  let selectedArea = null;
  let showRoutes = true;
  let mapMode = 'routes';
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const routeMap = L.map('route-map',{center:[13.74,100.56],zoom:12,scrollWheelZoom:true,minZoom:6,maxZoom:19,zoomSnap:.5,zoomControl:false});
  if(!useGoogle) L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(routeMap);
  L.control.zoom({position:'bottomright'}).addTo(routeMap);
  L.control.scale({imperial:false,position:'bottomleft'}).addTo(routeMap);
  routeMap.createPane('activityAreas'); routeMap.getPane('activityAreas').style.zIndex=250;
  routeMap.createPane('movementLines'); routeMap.getPane('movementLines').style.zIndex=350;
  const homeLayers=L.layerGroup().addTo(routeMap), movementLayers=L.layerGroup().addTo(routeMap);
  const roadLayers=L.layerGroup().addTo(routeMap);
  let areaPolygons=[];
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
  const isOverview = () => ['all','journey'].includes(activeDay);
  const visibleDays = () => itinerary.days.filter(day => activeDay === 'journey' || activeDay === 'all' && day.scope !== 'samet' || day.id === activeDay);
  const visiblePlaces = () => navigation.uniquePlaces(visibleDays(),itinerary.places);
  const roadCenter = () => selectedPlace ? {type:'place',point:selectedPlace} : selectedHome ? {type:'home',point:selectedHome} : null;
  const roadPairs = () => navigation.plan(roadCenter(),data.homes,visiblePlaces());
  const roadPath = result => result.path || navigation.decodePolyline(result.geometry);
  function roadResult(pair) {return pair.requiresBoat?{status:'boat'}:!useGoogle&&pair.travelMode==='TRANSIT'?{status:'unavailable'}:roadData?.routes[pair.destination.id] || {status:roadError?'unavailable':'loading'};}
  function drawRoads() {
    roadLayers.clearLayers();
    if(useGoogle) {if(googleMap.map) googleMap.drawPaths(roadPairs(),roadResult,showRoutes,activeRoad);return;}
    if(!showRoutes) return;
    for(const pair of roadPairs()) {
      const result=roadResult(pair);if(result.status!=='ready') continue;
      const path=roadPath(result);
      const selected=activeRoad===pair.id,dim=activeRoad && !selected;
      L.polyline(path,{pane:'movementLines',color:'#fff',weight:selected?8:6,opacity:dim?.25:.7,interactive:false}).addTo(roadLayers);
      const line=L.polyline(path,{pane:'movementLines',color:pair.color,weight:selected?5:3.5,opacity:dim?.2:.8,className:'road-route'+(selected?' active-road':'')});
      const tooltip=el('div','road-tooltip');tooltip.append(el('strong','',pair.origin.short || pair.origin.name),el('span','',' → '+pair.name+' · '+(result.distanceMeters/1000).toFixed(1)+' km'));
      line.bindTooltip(tooltip,{sticky:true}).on('click',()=>selectRoad(pair.id)).addTo(roadLayers);
      if(selected) line.bringToFront();
    }
  }
  function selectRoad(id) {
    activeRoad=id;renderNavigation();drawRoads();
    const pair=roadPairs().find(p=>p.id===id),result=pair && roadResult(pair);
    if(result?.status==='ready') {
      if(useGoogle) googleMap.fit(roadPath(result));
      else routeMap.flyToBounds(L.latLngBounds(roadPath(result)),{padding:[40,40],maxZoom:15,animate:!reducedMotion,duration:.6});
    }
    scrollToMap();
  }
  function renderNavigation() {
    navigationPanel.replaceChildren();
    const center=roadCenter();navigationPanel.hidden=!center || mapMode==='google';
    const pairs=roadPairs();
    routeSettings.hidden=navigationPanel.hidden||!useGoogle||!pairs.some(pair=>!pair.requiresBoat&&pair.travelMode==='TRANSIT');
    if(!center) return;
    const heading=el('div','navigation-heading');
    const modes=new Set(pairs.filter(pair=>!pair.requiresBoat).map(pair=>pair.travelMode));
    const modeLabel=modes.size>1?'大眾交通／開車':modes.has('TRANSIT')?'大眾交通':modes.has('DRIVING')?'開車':'船班接駁';
    heading.append(el('h2','',center.type==='home'?center.point.short+' → 景點':center.point.name+' → 房源'),el('span','',modeLabel));
    const meta=el('p','navigation-meta',(useGoogle?'Google Maps':'OSRM / OpenStreetMap・2026/10/12')+(center.type==='home'&&center.point.locationType==='approximate'?'・房源約略位置':center.type==='place'?'・部分房源為約略位置':''));
    const grid=el('div','road-grid');
    for(const pair of pairs) {
      const result=roadResult(pair),tile=el('div','road-tile');tile.style.setProperty('--road-color',pair.color);
      tile.dataset.mode=pair.travelMode;
      tile.classList.toggle('selected-road',activeRoad===pair.id);
      const target=el('button','road-target',pair.name);target.type='button';target.setAttribute('aria-label','以 '+pair.name+' 為起點');
      target.addEventListener('click',()=>center.type==='home'?focusPlace(pair.destination):focusHome(pair.destination));
      const button=el('button','road-focus');button.type='button';button.dataset.road=pair.id;button.disabled=result.status!=='ready';button.setAttribute('aria-pressed',String(activeRoad===pair.id));
      button.setAttribute('aria-label','聚焦至 '+pair.name+' 的路線');
      if(result.status==='ready') {
        button.append(el('span','road-mode',pair.travelMode==='TRANSIT'?(result.transit?.lines.length?'大眾交通':'步行'):(mapsConfig.trafficAware?'開車・目前路況':'開車・不含即時路況')));
        const metrics=el('div','road-metrics');
        const km=el('span','road-km',(result.distanceMeters/1000).toFixed(1)+' km'),time=el('span','road-time','約 '+Math.max(1,Math.round(result.durationSeconds/60))+' 分');
        metrics.append(...(pair.travelMode==='TRANSIT'?[time,km]:[km,time]));
        button.append(metrics);
        if(result.transit) {
          if(result.transit.lines.length)button.append(el('span','transit-lines',result.transit.lines.join(' → ')));
          if(result.transit.lines.length)button.append(el('span','transit-meta','步行 '+(result.transit.walkingMeters/1000).toFixed(1)+' km · '+result.transit.transfers+' 次轉乘'));
        }
      } else button.append(el('span','road-status',result.status==='boat'?'需船班接駁':result.status==='loading'?'載入中':pair.travelMode==='TRANSIT'?'大眾交通路線未取得':'開車路線未取得'));
      button.addEventListener('click',()=>selectRoad(pair.id));
      const google=link(pair.requiresBoat?'Google 地圖 ↗':'Google 導航 ↗',pair.requiresBoat?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(pair.destination.lat+','+pair.destination.lng):navigation.directions(pair.origin,pair.destination,pair.travelMode),'road-google');
      tile.append(target,button,google);grid.append(tile);
      if(result.transit?.steps.length) {
        const details=el('details','transit-details'),summary=el('summary','',result.transit.lines.length?'搭乘路線':'步行路線'),steps=el('ol','transit-steps');
        for(const step of result.transit.steps) {
          if(step.mode==='WALKING')steps.append(el('li','','步行 '+Math.round(step.distanceMeters)+' m'+(step.durationSeconds?' · 約 '+Math.max(1,Math.round(step.durationSeconds/60))+' 分':'')));
          else {const item=el('li','',''+(step.line||'大眾交通')+' · '+step.from+' → '+step.to);for(const agency of step.agencies)if(agency.name&&agency.url)item.append(link(agency.name,agency.url,'transit-agency'));steps.append(item);}
        }
        details.append(summary,steps);tile.append(details);
      }
      if(result.warnings?.length) tile.append(el('p','route-warning',result.warnings.join(' ')));
    }
    navigationPanel.append(heading,meta,grid);
  }
  async function updateNavigation() {
    const center=roadCenter(),generation=++roadGeneration;
    activeRoad=null;roadData=null;roadError=false;renderNavigation();drawRoads();
    if(!center) {googleMap?.cancel();return;}
    if(useGoogle) {
      roadData={routes:{}};
      try {
        await googleMap.compute(center,roadPairs(),(pair,result)=>{
          if(generation!==roadGeneration)return;
          roadData.routes[pair.destination.id]=result;renderNavigation();drawRoads();
        },{departureTime:departureTime()});
      } catch(error) {if(generation!==roadGeneration)return;roadError=true;renderNavigation();}
      if(generation===roadGeneration && mapMode==='routes') updateMap();
      return;
    }
    try {
      const result=await navigation.loadRoutes(center);
      if(generation!==roadGeneration) return;
      roadData=result;
    } catch(error) {if(generation!==roadGeneration)return;roadError=true;}
    renderNavigation();drawRoads();
    if(mapMode==='routes') updateMap();
  }
  function focusPlace(place) {
    selectedPlace=place;selectedHome=null;selectedArea=null;
    mapLabel.textContent=place.name+' → 8 間房源';
    document.getElementById('home-closeup').hidden=true;
    for(const card of list.querySelectorAll('.stay-card')) {card.classList.remove('is-selected');card.querySelector('summary').removeAttribute('aria-current');}
    renderRoute();renderAnalysis();updateNavigation();updateMap();scrollToMap();
  }
  function visibleAreas() {
    const areas = new Map();
    for (const day of visibleDays()) for (const area of day.areas) {
      if (areas.has(area.id)) {
        const item=areas.get(area.id);
        item.dates.push(day.date);
        item.members=[...new Set([...item.members,...area.members])];
      } else areas.set(area.id,{...area,color:day.color,scope:day.scope || 'bangkok',dates:[day.date]});
    }
    return [...areas.values()];
  }
  // Point-in-polygon and nearest boundary in a local kilometre projection.
  function areaDistance(point, area) {
    const toXY=([lng,lat])=>[(lng-point.lng)*111.32*Math.cos(point.lat*Math.PI/180),(lat-point.lat)*111.32];
    const ring=area.coordinates.map(toXY);
    let inside=false, nearest=Infinity;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
      const [x,y]=ring[i], [px,py]=ring[j];
      if ((y>0)!==(py>0) && 0<(px-x)*(-y)/(py-y)+x) inside=!inside;
      const dx=px-x, dy=py-y, length=dx*dx+dy*dy;
      const t=length ? Math.max(0,Math.min(1,-(x*dx+y*dy)/length)) : 0;
      nearest=Math.min(nearest,Math.hypot(x+t*dx,y+t*dy));
    }
    return inside || nearest<.000001 ? 0 : nearest;
  }
  function focusArea(area) {
    selectedArea=area.id;
    renderRoute(); updateMap(false,null,area);
    scrollToMap();
  }
  function updateAreaLabels() {
    const occupied=[];
    const size=routeMap.getSize();
    for(const {area,polygon} of [...areaPolygons].sort((a,b)=>Number(b.area.id===selectedArea)-Number(a.area.id===selectedArea))) {
      const p=routeMap.latLngToContainerPoint(polygon.getBounds().getCenter());
      const width=[...area.name].reduce((sum,c)=>sum+(c.charCodeAt(0)>255?10:6),14);
      const label=p.x>0 && p.x<size.x && p.y>0 && p.y<size.y && !occupied.some(o=>Math.abs(p.x-o.x)<(width+o.width)/2+8 && Math.abs(p.y-o.y)<24);
      if(label) occupied.push({x:p.x,y:p.y,width});
      polygon.unbindTooltip().bindTooltip(area.name,{permanent:label,direction:'center',className:'area-tooltip'});
    }
  }
  routeMap.on('moveend zoomend',updateAreaLabels);
  function drawMovement() {
    homeLayers.clearLayers(); movementLayers.clearLayers(); areaPolygons=[];
    for (const home of data.homes) {
      const selected=selectedHome?.id===home.id;
      const badge=el('span','home-pin'+(selected?' selected':''),home.letter);
      const marker=L.marker([home.lat,home.lng],{icon:L.divIcon({className:'home-icon',html:badge,iconSize:selected?[36,36]:[28,28],iconAnchor:selected?[18,18]:[14,14]}),title:home.letter+' '+home.short,zIndexOffset:selected?1100:900});
      marker.on('click',()=>focusHome(home));
      marker.bindTooltip(home.short,{permanent:selected,direction:'top',offset:[0,-14],className:'home-tooltip'});
      marker.addTo(homeLayers);
    }
    const drawnPlaces=new Set();
    for (const area of visibleAreas()) {
      const selected=selectedArea===area.id;
      const polygon=L.polygon(area.coordinates.map(([lng,lat])=>[lat,lng]),{pane:'activityAreas',color:area.color,weight:selected?3:1.5,fillColor:area.color,fillOpacity:selected?.24:.12,className:'activity-area'});
      polygon.on('click',()=>focusArea(area)).addTo(movementLayers);
      areaPolygons.push({area,polygon});
    }
    for (const day of visibleDays()) {
      const route=day.stops.map(id=>itinerary.places[id]);
      for (const [index,place] of route.entries()) {
        if (drawnPlaces.has(place.id)) continue;
        drawnPlaces.add(place.id);
        const chosen=selectedPlace?.id===place.id;
        const badge=el('span','place-pin'+(chosen?' selected-place':''),isOverview()?'':String(index+1)); badge.style.background=day.color;
        const marker=L.marker([place.lat,place.lng],{icon:L.divIcon({className:'place-icon',html:badge,iconSize:[23,23],iconAnchor:[11.5,11.5]}),title:place.name,zIndexOffset:400});
        marker.on('click',()=>focusPlace(place));
        marker.bindTooltip(place.name,{permanent:chosen,interactive:true,direction:'top',offset:[0,-11]}).addTo(movementLayers);
        marker.getTooltip().on('click',()=>focusPlace(place));
      }
    }
    drawRoads();
    updateAreaLabels();
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
    return {lat, lng: (west + east) * 180 - 180, zoom: Math.max(6, zoom)};
  }
  function updateMap(closeup = false, place = null, area = null) {
    const localSamet=(activeDay==='d12' || area?.scope==='samet') && !selectedPlace;
    const points = localSamet && mapMode==='routes' ? [] : selectedHome ? [selectedHome] : [...data.homes];
    if(selectedPlace) points.push(selectedPlace);
    for (const day of area || selectedPlace ? [] : visibleDays()) {
      points.push(...day.stops.map(id => itinerary.places[id]));
      for (const area of day.areas) points.push(...area.coordinates.map(([lng,lat]) => ({lat,lng})));
    }
    if(area) points.push(...area.coordinates.map(([lng,lat])=>({lat,lng})));
    if(!area && showRoutes) for(const pair of roadPairs()) {
      const result=roadResult(pair);
      if(result.status==='ready') points.push(...roadPath(result).map(([lat,lng])=>({lat,lng})));
    }
    if (mapMode==='google') { points.length=0; points.push(...(selectedHome?[selectedHome]:data.homes)); }
    const view = place ? {lat:place.lat,lng:place.lng,zoom:16} : closeup && selectedHome ? {...selectedHome,zoom:15} : camera(points);
    const mapId = itinerary.maps[activeDay] || itinerary.maps.all;
    const url = new URL('https://www.google.com/maps/d/embed');
    url.searchParams.set('mid', mapId);
    url.searchParams.set('hl', 'zh-TW');
    url.searchParams.set('ll', view.lat + ',' + view.lng);
    url.searchParams.set('z', String(view.zoom));
    if (mapMode === 'google') {
      if (map.getAttribute('src') !== url.href) map.src = url.href;
    } else if(useGoogle) {
      const errorPanel=document.getElementById('map-error');errorPanel.hidden=true;
      googleMap.render({homes:data.homes,places:visiblePlaces(),areas:visibleAreas().map(a=>({...a,selected:a.id===selectedArea})),center:roadCenter(),pairs:roadPairs(),resultFor:roadResult,showRoutes,activeRoad,fitPoints:points,closeup:place || closeup&&selectedHome}).catch(error=>{errorPanel.textContent='Google 地圖暫時無法載入';errorPanel.hidden=false;});
    } else {
      drawMovement(); routeMap.invalidateSize();
      if (place || closeup && selectedHome) routeMap.flyTo([view.lat,view.lng],view.zoom,{animate:!reducedMotion,duration:.6});
      else routeMap.flyToBounds(L.latLngBounds(points.map(p=>[p.lat,p.lng])),{padding:[35,35],maxZoom:14,animate:!reducedMotion,duration:.65});
    }
    viewer.searchParams.set('mid',mapId);
    document.getElementById('open-google').href = viewer.href;
  }
  function selectDay(id) {
    activeDay = id;
    if(/^d1[2-6]$/.test(id)) {departureLocal='2026-12-'+id.slice(1)+departureLocal.slice(10);departureInput.value=departureLocal;}
    selectedArea=null;
    activeRoad=null;
    if(selectedPlace && !visiblePlaces().some(p=>p.id===selectedPlace.id)) {selectedPlace=null;mapLabel.textContent='全部 8 間住宿';}
    document.querySelector('.map-key').style.setProperty('--route-color',isOverview()?'#2878b8':visibleDays()[0].color);
    for (const button of dayTabs.querySelectorAll('button')) button.setAttribute('aria-pressed',String(button.dataset.day === id));
    renderRoute(); renderAnalysis(); renderNavigation();
    if(useGoogle) updateNavigation();updateMap();
  }
  function renderRoute() {
    routeDetails.replaceChildren();
    if (isOverview()) {
      const grid = el('div','route-overview');
      for (const day of visibleDays()) {
        const button = el('button','route-day'); button.type='button'; button.style.setProperty('--day-color',day.color);
        button.append(el('span','route-date',day.date),el('strong','',day.label),el('span','route-count',day.stops.length+' 個活動點'));
        button.addEventListener('click',()=>selectDay(day.id)); grid.append(button);
      }
      routeDetails.append(grid);
      const places=el('div','overview-places');
      places.append(el('h3','','景點'));
      const buttons=el('div','place-buttons');
      for(const place of visiblePlaces()) {
        const button=el('button','stop-button',place.name);button.type='button';button.dataset.place=place.id;
        button.setAttribute('aria-pressed',String(selectedPlace?.id===place.id));button.addEventListener('click',()=>focusPlace(place));buttons.append(button);
      }
      places.append(buttons);routeDetails.append(places);
      if(activeDay==='journey') {
        const transfer=el('div','transfer-summary');
        transfer.append(el('strong','','12/13 返曼谷'),el('span','','沙美島 → Ban Phe → '+(selectedHome?selectedHome.short:'Asok／Phrom Phong')));
        transfer.append(el('span','transfer-note','島上過夜時'));
        routeDetails.append(transfer);
      }
    } else {
    const day = visibleDays()[0];
    const heading = el('div','route-heading'); heading.style.setProperty('--day-color',day.color);
    heading.append(el('h2','',day.date+' '+day.label),el('span','route-order',day.scope==='samet'?'接駁與活動':'建議順序'));
    routeDetails.append(heading);
    const stops = el('ol','route-stops');
    for (const [index,id] of day.stops.entries()) {
      const place = itinerary.places[id], item=el('li');
      const button=el('button','stop-button'); button.type='button';
      button.append(el('span','stop-number',String(index+1)),el('span','',place.name));
      button.addEventListener('click',()=>focusPlace(place));
      item.append(button); stops.append(item);
    }
    routeDetails.append(stops,el('p','day-analysis',day.analysis),el('p','day-note',day.note));
    if (day.pending.length) routeDetails.append(el('p','day-pending',day.pending.join(' · ')));
    }
    const heading=el('div','areas-heading');
    heading.append(el('h3','','活動範圍'),el('span','',selectedHome && activeDay!=='d12'?'概略・距範圍為直線距離':'概略'));
    const grid=el('div','area-grid');
    for(const area of visibleAreas()) {
      const button=el('button','area-card'); button.type='button'; button.style.setProperty('--area-color',area.color);
      button.setAttribute('aria-pressed',String(area.id===selectedArea)); button.dataset.area=area.id;
      button.append(el('strong','',area.name));
      const memberNames=area.members.map(id=>itinerary.places[id].name).join(' · ');
      if(memberNames!==area.name) button.append(el('span','area-members',memberNames));
      const meta=el('div','area-meta');
      meta.append(el('span','',area.dates.join('、')));
      if(selectedHome && area.scope!=='samet') {
        const km=areaDistance(selectedHome,area);
        meta.append(el('span','area-distance',km===0?'範圍內':km<.1?'距範圍 <0.1 km':'距範圍 '+km.toFixed(1)+' km'));
      }
      button.append(meta); button.addEventListener('click',()=>focusArea(area)); grid.append(button);
    }
    routeDetails.append(heading,grid);
  }
  function renderAnalysis() {
    locationAnalysis.replaceChildren();locationAnalysis.hidden=true;
  }
  function showMap(home) {
    selectedHome = home || null;
    selectedPlace=null;
    selectedArea=null;
    mapLabel.textContent = selectedHome ? home.letter + ' · ' + home.short : '全部 8 間住宿';
    document.getElementById('home-closeup').hidden = !selectedHome;
    for (const card of list.querySelectorAll('.stay-card')) {
      const selected = card.id === 'stay-' + selectedHome?.id;
      card.classList.toggle('is-selected', selected);
      const summary = card.querySelector('summary');
      if (selected) summary.setAttribute('aria-current', 'true');
      else summary.removeAttribute('aria-current');
    }
    renderRoute(); renderAnalysis(); updateNavigation();updateMap();
  }
  function focusHome(home) {
    if(activeDay==='d12') selectDay('all');
    showMap(home);
    scrollToMap();
  }
  function scrollToMap() {
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
  for (const day of [{id:'all',date:'曼谷',label:'總覽',color:'#657570'},{id:'journey',date:'全旅程',label:'',color:'#657570'},...itinerary.days]) {
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
  document.getElementById('update-departure').addEventListener('click',()=>{
    const error=document.getElementById('departure-error');
    const next=departureInput.value.slice(0,16),date=new Date(next+':00+07:00'),now=Date.now();
    if(!departureInput.reportValidity()||!Number.isFinite(date.getTime())||date.getTime()<now-7*86400000||date.getTime()>now+100*86400000) {error.textContent='出發時間需在前 7 天至後 100 天內';error.hidden=false;return;}
    error.hidden=true;departureLocal=next;updateNavigation();
  });
  document.getElementById('home-closeup').addEventListener('click',()=>updateMap(true));
  document.getElementById('fit-route').addEventListener('click',()=>{selectedArea=null;activeRoad=null;renderRoute();renderNavigation();updateMap();});
  document.getElementById('toggle-routes').addEventListener('click',event=>{showRoutes=!showRoutes;event.currentTarget.setAttribute('aria-pressed',String(showRoutes));drawRoads();});
  function setMapMode(mode) {
    mapMode=mode;
    document.getElementById('mode-routes').setAttribute('aria-pressed',String(mode==='routes'));
    document.getElementById('mode-google').setAttribute('aria-pressed',String(mode==='google'));
    document.getElementById('route-map').hidden=mode==='google'||useGoogle;
    document.getElementById('gmp-map').hidden=mode==='google'||!useGoogle;map.hidden=mode==='routes';
    document.getElementById('map-error').hidden=true;
    dayTabs.hidden=mode==='google'; routeDetails.hidden=mode==='google';
    document.querySelector('.map-key').hidden=mode==='google';
    renderAnalysis();renderNavigation(); updateMap(mode==='google' && Boolean(selectedHome));
  }
  document.getElementById('mode-routes').addEventListener('click',()=>setMapMode('routes'));
  document.getElementById('mode-google').addEventListener('click',()=>setMapMode('google'));
  if(useGoogle) {
    document.getElementById('mode-routes').textContent='Google Maps';document.getElementById('mode-google').textContent='住宿圖';
    document.getElementById('route-map').hidden=true;document.getElementById('gmp-map').hidden=false;
    document.getElementById('map-policies').hidden=false;
    window.addEventListener('trip-google-auth-failure',()=>{googleMap.cancel();const errorPanel=document.getElementById('map-error');errorPanel.textContent='Google 地圖授權失敗';errorPanel.hidden=false;});
  }
  let resizeTimer;
  window.addEventListener('resize',()=>{ clearTimeout(resizeTimer); resizeTimer=setTimeout(()=>updateMap(),180); });
  showMap();
})();
