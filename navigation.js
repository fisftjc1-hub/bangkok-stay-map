(() => {
  'use strict';
  const colors=['#2878b8','#bc6d20','#238c78','#8259a9','#b64e76','#527fa6','#75843c','#8b6550'];
  const islandIds=new Set(['saikaew','aophai','nadan']);
  const drivingIds=new Set(['airport','banphe']);
  const travelMode=(origin,destination)=>drivingIds.has(origin.id)||drivingIds.has(destination.id)||islandIds.has(origin.id)||islandIds.has(destination.id)?'DRIVING':'TRANSIT';
  function uniquePlaces(days,places) {
    const result=new Map();
    for(const day of days) for(const id of day.stops) if(!result.has(id)) result.set(id,{...places[id],color:day.color});
    return [...result.values()];
  }
  function plan(center,homes,places) {
    if(!center) return [];
    const destinations=center.type==='home'?places:homes;
    return destinations.filter(p=>p.id!==center.point.id).map((destination,index)=>({
      id:center.type+':'+center.point.id+'>'+destination.id,
      origin:center.point,destination,
      name:center.type==='home'?destination.name:destination.letter+' · '+destination.short,
      color:center.type==='home'?destination.color || '#2878b8':colors[index%colors.length],
      travelMode:travelMode(center.point,destination),
      requiresBoat:islandIds.has(center.point.id)||islandIds.has(destination.id)
    }));
  }
  function directions(origin,destination,mode=travelMode(origin,destination)) {
    const url=new URL('https://www.google.com/maps/dir/');
    url.searchParams.set('api','1');
    url.searchParams.set('origin',origin.lat+','+origin.lng);
    url.searchParams.set('destination',destination.lat+','+destination.lng);
    url.searchParams.set('travelmode',mode.toLowerCase());
    return url.href;
  }
  function decodePolyline(encoded,precision=6) {
    const path=[];let index=0,lat=0,lng=0;
    function delta() {
      let shift=0,result=0,byte;
      do { if(index>=encoded.length) throw Error('Invalid route geometry');byte=encoded.charCodeAt(index++)-63;result|=(byte&31)<<shift;shift+=5; } while(byte>=32);
      return result&1?~(result>>1):result>>1;
    }
    while(index<encoded.length) {lat+=delta();lng+=delta();path.push([lat/10**precision,lng/10**precision]);}
    return path;
  }
  const files=new Map();
  function loadRoutes(center) {
    if(islandIds.has(center.point.id)) return Promise.resolve({routes:{}});
    const name=center.type+'-'+center.point.id;
    if(!files.has(name)) files.set(name,fetch('roads/'+name+'.json?v=20261012').then(response=>{
      if(!response.ok) throw Error('Routes unavailable');return response.json();
    }).catch(error=>{files.delete(name);throw error;}));
    return files.get(name);
  }
  window.TripNavigation={uniquePlaces,plan,directions,travelMode,decodePolyline,loadRoutes};
})();
