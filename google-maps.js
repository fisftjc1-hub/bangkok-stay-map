(() => {
  'use strict';
  let sdkPromise;
  function loadSdk(config) {
    if(window.google?.maps?.importLibrary) return Promise.resolve();
    if(sdkPromise) return sdkPromise;
    sdkPromise=new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Google 地圖載入逾時')),15000);
      window.tripGoogleReady=()=>{clearTimeout(timer);delete window.tripGoogleReady;resolve();};
      window.gm_authFailure=()=>{clearTimeout(timer);sdkPromise=null;reject(new Error('Google 地圖授權失敗'));window.dispatchEvent(new Event('trip-google-auth-failure'));};
      const script=document.createElement('script');
      const url=new URL('https://maps.googleapis.com/maps/api/js');
      url.searchParams.set('key',config.googleApiKey);url.searchParams.set('v','weekly');
      url.searchParams.set('loading','async');url.searchParams.set('language','zh-TW');url.searchParams.set('region','TH');
      url.searchParams.set('auth_referrer_policy','origin');
      url.searchParams.set('callback','tripGoogleReady');script.src=url.href;script.async=true;
      script.onerror=()=>{clearTimeout(timer);sdkPromise=null;reject(new Error('Google 地圖載入失敗'));};
      document.head.append(script);
    });
    return sdkPromise;
  }
  const position=point=>({lat:typeof point.lat==='function'?point.lat():point.lat,lng:typeof point.lng==='function'?point.lng():point.lng});
  class GoogleTripMap {
    constructor(container,config,callbacks) {
      this.container=container;this.config=config;this.callbacks=callbacks;
      this.markers=[];this.areas=[];this.areaLabels=[];this.paths=new Map();
      this.routes=new Map();this.centerKey='';this.generation=0;this.queue=Promise.resolve();
    }
    async ready() {
      if(this.readyPromise) return this.readyPromise;
      this.readyPromise=(async()=>{
        await loadSdk(this.config);
        const [maps,marker,routes,core]=await Promise.all(['maps','marker','routes','core'].map(name=>window.google.maps.importLibrary(name)));
        this.maps=maps;this.AdvancedMarkerElement=marker.AdvancedMarkerElement;this.Route=routes.Route;this.LatLngBounds=core.LatLngBounds;
        this.map=new maps.Map(this.container,{center:{lat:13.74,lng:100.56},zoom:12,mapId:this.config.mapId,gestureHandling:'greedy',scrollwheel:true,scaleControl:true,mapTypeControl:false,streetViewControl:false,fullscreenControl:true});
      })().catch(error=>{this.readyPromise=null;throw error;});
      return this.readyPromise;
    }
    clearPaths() {for(const lines of this.paths.values()) for(const line of lines) line.setMap(null);this.paths.clear();}
    cancel() {this.generation++;}
    async compute(center,pairs,onResult) {
      const generation=++this.generation;
      const key=center?center.type+':'+center.point.id:'';
      if(key!==this.centerKey) {this.centerKey=key;this.routes.clear();this.clearPaths();}
      if(!center) return;
      await this.ready();
      if(generation!==this.generation) return;
      // Requests share a queue across selections. New selections abandon queued
      // work; already-issued requests finish before the next origin starts.
      const jobs=pairs.filter(pair=>!pair.requiresBoat&&!this.routes.has(pair.id));
      for(const pair of pairs) if(this.routes.has(pair.id)) onResult(pair,this.routes.get(pair.id));
      let index=0;
      const worker=async()=>{
        while(index<jobs.length&&generation===this.generation) {
          const pair=jobs[index++];let result;
          try {
            const response=await this.Route.computeRoutes({origin:position(pair.origin),destination:position(pair.destination),travelMode:'DRIVING',routingPreference:this.config.trafficAware?'TRAFFIC_AWARE':'TRAFFIC_UNAWARE',region:'th',fields:['path','distanceMeters','durationMillis','warnings']});
            const route=response.routes?.[0];
            result=route?.path?.length&&Number.isFinite(route.distanceMeters)&&Number.isFinite(route.durationMillis)?{status:'ready',distanceMeters:route.distanceMeters,durationSeconds:route.durationMillis/1000,path:route.path.map(point=>{const p=position(point);return [p.lat,p.lng];}),warnings:route.warnings||[],googleRoute:route}:{status:'unavailable'};
          } catch(error) {console.warn('Google Routes: '+(error?.message||'route request failed'));result={status:'unavailable'};}
          if(generation!==this.generation) return;
          if(result.status==='ready') this.routes.set(pair.id,result);onResult(pair,result);
        }
      };
      const pending=this.queue.catch(()=>{}).then(async()=>{if(generation===this.generation)await Promise.all([worker(),worker()]);});
      this.queue=pending;await pending;
    }
    async render({homes,places,areas,center,pairs,resultFor,showRoutes,activeRoad,fitPoints,closeup}) {
      await this.ready();
      for(const marker of this.markers) marker.map=null;
      for(const label of this.areaLabels) label.map=null;
      for(const polygon of this.areas) polygon.setMap(null);
      this.markers=[];this.areaLabels=[];this.areas=[];
      for(const area of areas) {
        const polygon=new this.maps.Polygon({map:this.map,paths:area.coordinates.map(([lng,lat])=>({lat,lng})),strokeColor:area.color,strokeWeight:area.selected?3:1.5,fillColor:area.color,fillOpacity:area.selected?.22:.1,zIndex:1});
        polygon.addListener('click',()=>this.callbacks.onArea(area));this.areas.push(polygon);
        const bounds=new this.LatLngBounds();area.coordinates.forEach(([lng,lat])=>bounds.extend({lat,lng}));
        const content=document.createElement('span');content.className='google-area-label';content.textContent=area.name;
        const label=new this.AdvancedMarkerElement({map:this.map,position:bounds.getCenter(),content,collisionBehavior:window.google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,zIndex:area.selected?8:2});
        this.areaLabels.push(label);
      }
      for(const home of homes) this.marker(home,'home',center);
      for(const place of places) this.marker(place,'place',center);
      this.drawPaths(pairs,resultFor,showRoutes,activeRoad);
      if(closeup) {this.map.panTo(position(closeup));this.map.setZoom(15);}
      else if(fitPoints) this.fit(fitPoints);
    }
    marker(point,type,center) {
      const selected=center?.type===type&&center.point.id===point.id;
      const badge=document.createElement('span');badge.className=type==='home'?'home-pin'+(selected?' selected':''):'place-pin'+(selected?' selected-place':'');
      badge.textContent=type==='home'?point.letter:'';if(type==='place') badge.style.background=point.color||'#2878b8';
      const content=document.createElement('div');content.className='google-marker';content.append(badge);
      const label=document.createElement('span');label.className='google-marker-label';label.textContent=type==='home'?point.short:point.name;content.append(label);
      const marker=new this.AdvancedMarkerElement({map:this.map,position:position(point),content,title:label.textContent,gmpClickable:true,zIndex:selected?1000:type==='home'?100:50,collisionBehavior:selected||type==='home'?window.google.maps.CollisionBehavior.REQUIRED:window.google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY});
      marker.addEventListener('gmp-click',()=>type==='home'?this.callbacks.onHome(point):this.callbacks.onPlace(point));
      this.markers.push(marker);
    }
    drawPaths(pairs,resultFor,showRoutes,activeRoad) {
      this.clearPaths();if(!showRoutes) return;
      for(const pair of pairs) {
        const result=resultFor(pair);if(result.status!=='ready'||!result.googleRoute)continue;
        const selected=activeRoad===pair.id,dim=activeRoad&&!selected;
        const lines=result.googleRoute.createPolylines({polylineOptions:{strokeColor:pair.color,strokeOpacity:dim?.18:.85,strokeWeight:selected?6:4,zIndex:selected?20:5}});
        for(const line of lines){line.setMap(this.map);line.addListener('click',()=>this.callbacks.onRoad(pair.id));}
        this.paths.set(pair.id,lines);
      }
    }
    fit(points) {if(!points?.length)return;const bounds=new this.LatLngBounds();points.forEach(p=>bounds.extend(Array.isArray(p)?{lat:p[0],lng:p[1]}:position(p)));this.map.fitBounds(bounds,40);}
  }
  window.GoogleTripMap=GoogleTripMap;
})();
