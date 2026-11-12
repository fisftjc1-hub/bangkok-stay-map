// Trip guide pages: overview, daily plan, stays, transport and practical info.
// Content lives in guide-data.js; coordinates come from itinerary.js and data.js.
(() => {
  'use strict';
  const guide=window.GUIDE, itinerary=window.ITINERARY_DATA, stayData=window.STAY_DATA;
  const views=[
    {id:'home',label:'總覽',icon:'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10'},
    {id:'plan',label:'行程',icon:'M7 3v3M17 3v3M4 9h16M5 5.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1z'},
    {id:'stay',label:'住宿',icon:'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M7 9V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2M3 18v2M21 18v2'},
    {id:'move',label:'交通',icon:'M6 16V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10M6 12h12M5 16h14v2H5zM8 18v2M16 18v2M9 15h.01M15 15h.01'},
    {id:'map',label:'地圖',icon:'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'},
    {id:'info',label:'實用',icon:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01'}
  ];
  const $=id=>document.getElementById(id);
  function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined&&text!==null)node.textContent=text;return node;}
  function link(text,href,cls){const a=el('a',cls,text);a.href=href;if(!/^(tel:|#)/.test(href)){a.target='_blank';a.rel='noopener noreferrer';}return a;}
  const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;

  // ---- places, stays and Google Maps links ----
  const homes=Object.fromEntries(stayData.homes.map(home=>[home.id,home]));
  function point(id){
    const place=itinerary.places[id], extra=guide.places[id]||{};
    return place?{...place,...extra,id}:null;
  }
  const stayById=id=>guide.stays.find(stay=>stay.id===id);
  const mainStay=guide.stays.find(stay=>stay.main);
  function target(p){return p.query||p.lat+','+p.lng;}
  function mapUrl(p){
    const url=new URL('https://www.google.com/maps/search/');url.searchParams.set('api','1');url.searchParams.set('query',target(p));
    if(p.placeId)url.searchParams.set('query_place_id',p.placeId);return url.href;
  }
  function dirUrl(destination,origin,mode){
    const url=new URL('https://www.google.com/maps/dir/');url.searchParams.set('api','1');
    if(origin){url.searchParams.set('origin',target(origin));if(origin.placeId)url.searchParams.set('origin_place_id',origin.placeId);}
    url.searchParams.set('destination',target(destination));if(destination.placeId)url.searchParams.set('destination_place_id',destination.placeId);
    if(mode)url.searchParams.set('travelmode',mode);return url.href;
  }

  // ---- dates ----
  // ?now=2026-12-12T09:00 (Bangkok time) previews how the site looks on a given day.
  const nowParam=new URLSearchParams(location.search).get('now');
  const clock=()=>/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(nowParam||'')?new Date(nowParam+':00+07:00'):new Date();
  const bangkokToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok'}).format(clock());
  const dayNumber=iso=>Math.round(Date.parse(iso+'T00:00:00Z')/86400000);
  const weekday=iso=>'日一二三四五六'[new Date(iso+'T00:00:00Z').getUTCDay()];
  const shortDate=iso=>Number(iso.slice(5,7))+'/'+Number(iso.slice(8,10));
  const today=bangkokToday();
  const todayDay=guide.days.find(day=>day.date===today);
  const dayColor=day=>itinerary.days.find(d=>d.id===day.id)?.color||'#125c53';

  // ---- search index ----
  const index=[];
  function register(entry){index.push({...entry,haystack:(entry.title+' '+entry.text).toLowerCase()});}
  const flatten=card=>[card.sub,card.brief,...(card.paras||[]),...(card.list||[]),...(card.tips||[]),...(card.facts||[]).map(f=>f.join(' ')),...(card.table?card.table.rows.map(r=>r.join(' ')):[]),card.warn,card.thai,card.address,card.addressTh,card.phone].filter(Boolean).join(' ');

  // ---- generic blocks ----
  function facts(rows){
    const dl=el('dl','facts');
    for(const [key,value] of rows){
      const dd=el('dd');
      if(/^\d{3,4}$/.test(value)||/^\+?[\d\s-]{6,}$/.test(value)&&/電話|專線|手機/.test(key))dd.append(link(value,'tel:'+value.replace(/[^\d+]/g,''),'tel'));
      else dd.textContent=value;
      dl.append(el('dt','',key),dd);
    }
    return dl;
  }
  function table(data){
    const wrap=el('div','table-wrap'),t=el('table','plain'),head=el('tr');
    for(const cell of data.head)head.append(el('th','',cell));
    const thead=el('thead');thead.append(head);const body=el('tbody');
    for(const row of data.rows){const tr=el('tr');for(const cell of row)tr.append(el('td','',cell));body.append(tr);}
    t.append(thead,body);wrap.append(t);return wrap;
  }
  function body(card,into){
    for(const text of card.paras||[])into.append(el('p','',text));
    if(card.facts)into.append(facts(card.facts));
    if(card.list||card.tips){const ul=el('ul');for(const text of [...(card.list||[]),...(card.tips||[])])ul.append(el('li','',text));into.append(ul);}
    if(card.table)into.append(table(card.table));
    if(card.warn)into.append(el('p','note',card.warn));
    if(card.links?.length){const row=el('div','actions');for(const [text,href] of card.links)row.append(link(text+(href.startsWith('#')||href.startsWith('tel:')?'':' ↗'),href,'btn'));into.append(row);}
  }
  function card(data,view){
    const box=el('article','card');if(data.id)box.id=view+'-'+data.id;
    if(data.kicker)box.append(el('p','kicker',data.kicker));
    box.append(el('h3','',data.title));
    if(data.sub)box.append(el('p','sub',data.sub));
    if(data.badges){const row=el('p');for(const badge of data.badges)row.append(el('span','badge',badge));box.append(row);}
    body(data,box);
    if(data.id){box.append(shareButton(view+'/'+data.id,data.title,'card-share'));register({title:data.title,text:flatten(data),where:views.find(v=>v.id===view).label,hash:view+'/'+data.id});}
    return box;
  }
  function title(text,sub){const head=el('div','view-title');head.append(el('h2','',text));if(sub)head.append(el('p','',sub));return head;}
  function toc(view,items){const nav=el('nav','toc');nav.setAttribute('aria-label','本頁目錄');for(const item of items)nav.append(link(item.title,'#'+view+'/'+item.id));return nav;}
  function mapButton(text,action){const button=el('button','btn',text);button.type='button';button.addEventListener('click',()=>{history.pushState(null,'','#map');route();action(window.TripMap);});return button;}

  // ---- checklists (saved on this device only) ----
  let checks={};
  try{checks=JSON.parse(localStorage.getItem('tripnote-checks')||'{}')||{};}catch(error){checks={};}
  function checklist(items){
    const ul=el('ul','checklist');
    for(const item of items){
      const li=el('li'),label=el('label'),input=el('input');input.type='checkbox';input.checked=Boolean(checks[item.id]);
      input.addEventListener('change',()=>{checks[item.id]=input.checked;try{localStorage.setItem('tripnote-checks',JSON.stringify(checks));}catch(error){}});
      label.append(input,el('span','',item.text));li.append(label);ul.append(li);
    }
    return ul;
  }

  // ---- stays ----
  function stayCard(stay,compact){
    const box=el('article','card');box.id='stay-'+stay.id;
    box.append(el('p','kicker',stay.when+' · '+stay.who),el('h3','',stay.name));
    if(stay.zh)box.append(el('p','sub',stay.zh));
    const rows=[];
    if(stay.address)rows.push(['地址',stay.address]);
    if(stay.phone)rows.push(['電話',stay.phone]);
    if(!compact)rows.push(...(stay.facts||[]));
    else rows.push(...(stay.facts||[]).filter(f=>/入住|退房/.test(f[0])));
    if(rows.length)box.append(facts(rows));
    if(stay.addressTh){const thai=el('div','thai');thai.lang='th';thai.append(el('small','','給司機看（泰文）'),document.createTextNode(stay.addressTh));box.append(thai);}
    if(!compact&&stay.notes?.length){const ul=el('ul');for(const note of stay.notes)ul.append(el('li','',note));box.append(ul);}
    if(!compact&&stay.warn)box.append(el('p','note',stay.warn));
    const row=el('div','actions');
    row.append(link('導航到這裡 ↗',dirUrl(stay),'btn primary'));
    if(stay.addressTh)row.append(driverButton(stayTarget(stay)));
    row.append(link('Google 地圖 ↗',mapUrl(stay),'btn'));
    if(compact)row.append(link('住宿詳情','#stay/'+stay.id,'btn'));
    else{
      row.append(shareButton('stay/'+stay.id,stay.name));
      if(stay.mapHome)row.append(mapButton('在地圖上看',map=>map.home(stay.mapHome)));
      else if(stay.mapPlace)row.append(mapButton('在地圖上看',map=>map.place(stay.mapPlace)));
      for(const [text,href] of stay.links||[])row.append(link(text+' ↗',href,'btn'));
    }
    box.append(row);
    if(!compact)register({title:stay.name+(stay.zh?' '+stay.zh:''),text:flatten(stay)+' '+(stay.notes||[]).join(' ')+' 住宿 飯店 地址',where:'住宿',hash:'stay/'+stay.id});
    return box;
  }

  // ---- overview ----
  function renderHome(){
    const view=$('view-home');view.replaceChildren();
    const hero=el('div','hero');
    hero.append(el('p','hero-kicker','TRIP NOTE'),el('h2','',guide.trip.name));
    const meta=el('div','hero-meta');
    meta.append(el('span','',guide.trip.start.replaceAll('-','.')+' — '+shortDate(guide.trip.end).replace('/','.')),el('span','',guide.trip.people+' 人 · '+(guide.days.length-1)+' 晚'),el('span','',guide.trip.route));
    hero.append(meta);
    if(guide.trip.flights){const flights=el('div','hero-flights');for(const flight of guide.trip.flights){const row=el('p');row.append(el('strong','',flight.label+' '+flight.code),document.createTextNode(flight.date+'　'+flight.text));flights.append(row);}hero.append(flights);}
    const diff=dayNumber(guide.trip.start)-dayNumber(today),count=el('div','hero-count');
    if(diff>0)count.append(el('span','','距離出發'),el('strong','',String(diff)),el('span','','天'));
    else if(todayDay)count.append(el('span','','今天是'),el('strong','','Day '+(guide.days.indexOf(todayDay)+1)),el('span','',todayDay.title));
    else if(diff===0)count.append(el('span','','今晚出發'),el('strong','','22:30'),el('span','','桃園第一航廈'));
    else count.append(el('span','','旅程已結束，辛苦了'));
    hero.append(count);view.append(hero);

    const nowBox=el('article','card now');nowBox.id='home-now';view.append(nowBox);renderNow(nowBox);

    view.append(el('h3','section-title','每日行程'));
    const days=el('div','grid five');
    for(const day of guide.days){
      const button=el('button','card day-card'+(day===todayDay?' is-today':''));button.type='button';button.style.setProperty('--day',dayColor(day));
      button.append(el('span','date',shortDate(day.date)+'（'+weekday(day.date)+'）'),el('strong','',day.title),el('span','',day.brief));
      button.addEventListener('click',()=>go('plan',day.id));days.append(button);
    }
    view.append(days);

    view.append(el('h3','section-title','住宿'));
    const stays=el('div','grid two');
    for(const stay of guide.stays)stays.append(stayCard(stay,true));
    view.append(stays);

    view.append(el('h3','section-title','快速查詢'));
    const quick=el('div','quick');
    for(const item of guide.quick){
      let node;
      if(item.action){node=el('button');node.type='button';node.addEventListener('click',()=>item.action==='sos'?openSos():openTools(item.action));}
      else node=link('',item.href);
      node.append(el('strong','',item.title),el('span','',item.text));quick.append(node);
    }
    view.append(quick);

    if(guide.todo?.length){
      view.append(el('h3','section-title','出發前待確認'));
      const box=el('article','card');box.id='home-todo';
      box.append(el('p','sub','勾選狀態只存在這支裝置，不會同步給其他人。'),checklist(guide.todo));
      view.append(box);
      register({title:'出發前待確認',text:guide.todo.map(t=>t.text).join(' '),where:'總覽',hash:'home/todo'});
    }
  }

  // ---- daily plan ----
  let activeDay=(todayDay||guide.days[0]).id;
  function placeStep(day,id,number){
    const p=point(id);if(!p)return null;
    const li=el('li'),no=el('span','step-no',String(number)),box=el('details','step');box.id='plan-'+day.id+'-'+id;
    const summary=el('summary'),head=el('span');
    head.append(el('span','step-title',p.name));if(p.brief)head.append(el('span','step-brief',p.brief));
    summary.append(head,el('span','chev','⌄'));
    const inner=el('div','step-body');body(p,inner);
    const row=el('div','actions');
    row.append(link('導航 ↗',dirUrl(p),'btn primary'));
    const base=stayById(day.from||day.sleep)||mainStay;
    if(base&&!p.noTransit)row.append(link('從住宿出發 ↗',dirUrl(p,base,p.driveOnly?'driving':'transit'),'btn'));
    row.append(mapButton('在地圖上看',map=>map.place(id)));
    if(p.thai)row.append(driverButton(placeTarget(p)));
    row.append(shareButton('plan/'+day.id+'/'+id,p.name));
    inner.append(row);box.append(summary,inner);li.append(no,box);
    register({title:p.name,text:flatten(p)+' '+(p.keywords||''),where:shortDate(day.date)+' 行程',hash:'plan/'+day.id+'/'+id});
    return li;
  }
  function renderPlan(){
    const view=$('view-plan');view.replaceChildren();
    view.append(title('每日行程','點景點可展開開放時間、門票與注意事項'));
    const chips=el('div','day-chips');
    for(const day of guide.days){
      const chip=el('button','day-chip');chip.type='button';chip.dataset.day=day.id;chip.style.setProperty('--day',dayColor(day));
      chip.append(el('strong','',shortDate(day.date)+'（'+weekday(day.date)+'）'),el('span','',day.title));
      if(day===todayDay)chip.append(el('span','today-dot','今天'));
      chip.addEventListener('click',()=>go('plan',day.id));chips.append(chip);
    }
    view.append(chips);
    for(const day of guide.days){
      const section=el('div','day');section.id='plan-'+day.id;section.dataset.day=day.id;section.style.setProperty('--day',dayColor(day));
      const head=el('div','day-head');head.append(el('h3','','Day '+(guide.days.indexOf(day)+1)+'｜'+day.title),el('p','',day.summary));if(day.sun)head.append(el('p','sun',day.sun));
      section.append(head);
      const list=el('ol','timeline');let number=0;
      for(const step of day.steps){
        if(step.place){const li=placeStep(day,step.place,++number);if(li)list.append(li);continue;}
        const li=el('li'),no=el('span','step-no move',step.icon||'→'),box=el('div','step plain');
        const heading=el('p','step-title');if(step.time)heading.append(el('span','step-time',step.time));heading.append(document.createTextNode(step.title));
        box.append(heading);for(const text of step.paras||[])box.append(el('p','',text));
        if(step.links?.length){const row=el('div','actions');for(const [text,href] of step.links)row.append(link(text+(href.startsWith('#')?'':' ↗'),href,'btn'));box.append(row);}
        li.append(no,box);list.append(li);
      }
      section.append(list);
      if(day.tips?.length){const tips=el('article','card');tips.append(el('h4','','當天提醒'));const ul=el('ul');for(const tip of day.tips)ul.append(el('li','',tip));tips.append(ul);tips.style.marginTop='14px';section.append(tips);}
      if(day.pending?.length){const note=el('p','note');note.append(el('strong','','尚未確定：'),document.createTextNode(day.pending.join('、')));section.append(note);}
      const sleep=stayById(day.sleep),row=el('div','actions');
      if(sleep)row.append(link('今晚住：'+sleep.short,'#stay/'+sleep.id,'btn'),link('導航回住宿 ↗',dirUrl(sleep),'btn'));
      row.append(mapButton('當天地圖',map=>map.day(day.id)),shareButton('plan/'+day.id,shortDate(day.date)+' '+day.title));section.append(row);
      register({title:shortDate(day.date)+' '+day.title,text:day.summary+' '+day.steps.map(s=>s.title||'').join(' ')+' '+(day.tips||[]).join(' '),where:'行程',hash:'plan/'+day.id});
      view.append(section);
    }
    showDay(activeDay);
  }
  function showDay(id){
    activeDay=id;
    for(const section of document.querySelectorAll('#view-plan .day'))section.hidden=section.dataset.day!==id;
    for(const chip of document.querySelectorAll('.day-chip')){chip.setAttribute('aria-pressed',String(chip.dataset.day===id));if(chip.dataset.day===id)chip.scrollIntoView({block:'nearest',inline:'center'});}
  }

  // ---- stays / transport / info ----
  function renderStay(){
    const view=$('view-stay');view.replaceChildren();
    view.append(title('住宿','地址、入住時間與回程導航'));
    const grid=el('div','grid');for(const stay of guide.stays)grid.append(stayCard(stay,false));view.append(grid);
    if(guide.stayNotes?.length){view.append(el('h3','section-title','住宿周邊'));const more=el('div','grid two');for(const item of guide.stayNotes)more.append(card(item,'stay'));view.append(more);}
  }
  function renderCards(viewId,heading,sub,groups){
    const view=$('view-'+viewId);view.replaceChildren();
    view.append(title(heading,sub),toc(viewId,groups));
    for(const group of groups){
      const head=el('h3','section-title',group.title);head.id=viewId+'-'+group.id;view.append(head);
      if(group.checklist){const box=el('article','card');box.append(el('p','sub','勾選狀態只存在這支裝置。'),checklist(group.checklist));view.append(box);register({title:group.title,text:group.checklist.map(c=>c.text).join(' '),where:heading,hash:viewId+'/'+group.id});continue;}
      const grid=el('div','grid'+(group.wide?'':' two'));
      for(const item of group.cards)grid.append(card(item,viewId));
      view.append(grid);
    }
  }

  // ---- sheet: full-screen helper used by the driver card, tools and emergency ----
  const sheet=$('sheet');
  function openSheet(heading,content){$('sheet-title').textContent=heading;$('sheet-body').replaceChildren(content);if(!sheet.open)sheet.showModal();$('sheet-body').scrollTop=0;}
  $('sheet-close').addEventListener('click',()=>sheet.close());
  sheet.addEventListener('click',event=>{if(event.target===sheet||event.target.closest('a[href^="#"]'))sheet.close();});
  let toastTimer;
  function toast(text){const box=$('toast');box.textContent=text;box.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{box.hidden=true;},2200);}
  const telHref=number=>'tel:'+number.replace(/[^\d+]/g,'');

  // ---- share a deep link ----
  function share(hash,text){
    const url=location.origin+location.pathname+'#'+hash;
    if(navigator.share)navigator.share({title:text+'｜Bangkok Trip Note',url}).catch(()=>{});
    else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>toast('已複製連結，可以貼到 LINE'),()=>toast('無法複製，請長按網址列複製'));
    else toast('無法複製，請長按網址列複製');
  }
  function shareButton(hash,text,cls){const button=el('button',cls||'btn','分享');button.type='button';button.setAttribute('aria-label','分享「'+text+'」的連結');button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();share(hash,text);});return button;}

  // ---- show to driver ----
  function showBig(heading,thai,lines,buttons){
    const box=el('div','driver'),big=el('p','driver-thai',thai);big.lang='th';
    box.append(big);for(const [cls,text] of lines)if(text)box.append(el('p',cls,text));
    if(buttons?.length){const row=el('div','actions');row.append(...buttons);box.append(row);}
    openSheet(heading,box);
  }
  function showDriver(t){
    const buttons=[];
    if(t.phone)buttons.push(link('撥電話 '+t.phone,telHref(t.phone),'btn'));
    if(t.nav)buttons.push(link('導航 ↗',dirUrl(t.nav),'btn primary'));
    showBig('給司機看',t.thai,[['driver-ask','ไปที่นี่（請載我到這裡）'],['driver-name',t.name],['driver-address',t.address]],buttons);
  }
  function driverButton(t){const button=el('button','btn','給司機看');button.type='button';button.addEventListener('click',()=>showDriver(t));return button;}
  const stayTarget=stay=>({name:stay.name,thai:stay.addressTh,phone:stay.phone,address:stay.address,nav:stay});
  const placeTarget=p=>({name:p.name,thai:p.thai,nav:p});
  function driverTargets(){
    const list=guide.stays.filter(stay=>stay.addressTh).map(stayTarget);
    for(const id of Object.keys(guide.places)){const p=point(id);if(p?.thai)list.push(placeTarget(p));}
    return list;
  }
  const phrases=()=>guide.info.find(group=>group.id==='thai')?.cards[0].table.rows||[];
  const showPhrase=row=>showBig(row[0],row[1],[['driver-name',row[0]],['driver-address','唸法：'+row[2]]]);

  // ---- currency converter ----
  function converter(){
    const box=el('div','convert');let rate=guide.trip.rate;
    try{const saved=Number(localStorage.getItem('tripnote-rate'));if(saved>0)rate=saved;}catch(error){}
    const field=(label,value)=>{const wrap=el('label','field'),input=el('input');input.type='number';input.inputMode='decimal';input.min='0';input.step='any';if(value!==undefined)input.value=value;wrap.append(el('span','',label),input);return [wrap,input];};
    const [thbWrap,thb]=field('泰銖 THB'),[twdWrap,twd]=field('新台幣 TWD'),[peopleWrap,people]=field('幾個人分',1),[rateWrap,rateInput]=field('1 泰銖＝幾台幣',rate);
    const out=el('p','convert-out');out.setAttribute('aria-live','polite');
    const fmt=n=>n.toLocaleString('zh-TW',{maximumFractionDigits:n<100?1:0});
    const round=n=>String(Math.round(n*10)/10);
    function split(){const total=Number(thb.value),n=Math.max(1,Math.floor(Number(people.value)||1));out.textContent=total>0&&n>1?'每人 '+fmt(total/n)+' 泰銖（約 '+fmt(total/n*rate)+' 台幣）':'';}
    function fromThb(){twd.value=thb.value===''?'':round(Number(thb.value)*rate);split();}
    thb.addEventListener('input',fromThb);
    twd.addEventListener('input',()=>{thb.value=twd.value===''?'':round(Number(twd.value)/rate);split();});
    rateInput.addEventListener('input',()=>{const value=Number(rateInput.value);if(value>0){rate=value;try{localStorage.setItem('tripnote-rate',String(value));}catch(error){}fromThb();}});
    people.addEventListener('input',split);
    const chips=el('div','chips');
    for(const n of [20,100,300,500,1000,5000]){const chip=el('button','chip',String(n));chip.type='button';chip.addEventListener('click',()=>{thb.value=String(n);fromThb();});chips.append(chip);}
    const top=el('div','convert-grid'),bottom=el('div','convert-grid');top.append(thbWrap,twdWrap);bottom.append(peopleWrap,rateWrap);
    box.append(top,chips,bottom,out,el('p','sub','預設匯率是 2026 年 11 月初的中價，實際以換匯或刷卡當下為準。改過的匯率只存在這支裝置。'));
    return box;
  }

  // ---- tools sheet ----
  function openTools(focus){
    const box=el('div','tools');
    const section=(id,heading)=>{const head=el('h3','section-title',heading);head.id='tool-'+id;box.append(head);};
    const item=(strong,sub,thai,action)=>{const button=el('button','tool-item');button.type='button';const second=el('span','',sub);if(thai)second.lang='th';button.append(el('strong','',strong),second);button.addEventListener('click',action);return button;};
    section('money','匯率換算');box.append(converter());
    section('driver','給司機看');
    const places=el('div','tool-list');for(const t of driverTargets())places.append(item(t.name,t.thai,true,()=>showDriver(t)));box.append(places);
    section('thai','泰語放大');
    const list=el('div','tool-list');for(const row of phrases())list.append(item(row[0],row[1],true,()=>showPhrase(row)));box.append(list);
    section('offline','離線與主畫面');
    const tips=el('ul','tool-tips');
    for(const text of ['這個網站開過一次之後，沒有網路也能看行程、住宿、交通與實用資訊。','地圖底圖、導航與外部連結仍需要網路；出發前請在 Google 地圖下載曼谷與沙美島的離線地圖。','iPhone：用 Safari 開啟，點「分享」→「加入主畫面」。','Android：用 Chrome 開啟，點右上選單 →「加到主畫面」或「安裝應用程式」。','勾選的清單、進度與匯率只存在這支裝置。'])tips.append(el('li','',text));
    box.append(tips);
    openSheet('隨身工具',box);
    if(focus)$('tool-'+focus)?.scrollIntoView({block:'start'});
  }
  function openSos(){
    const box=el('div','sos');
    for(const [label,number] of guide.sos){const a=link('',telHref(number),'sos-call');a.append(el('span','',label),el('strong','',number));box.append(a);}
    const stay=stayById(todayDay?.sleep)||mainStay;
    box.append(el('h3','section-title',todayDay?.sleep?'今晚的住宿':'曼谷住宿'));
    const card=el('article','card');card.append(el('h3','',stay.name));
    const rows=[['地址',stay.address]];if(stay.phone)rows.push(['電話',stay.phone]);card.append(facts(rows));
    const row=el('div','actions');row.append(driverButton(stayTarget(stay)),link('導航回住宿 ↗',dirUrl(stay),'btn'));card.append(row);box.append(card);
    box.append(el('h3','section-title','指給對方看'));
    const list=el('div','tool-list');for(const row of phrases().filter(r=>/幫幫我|醫院/.test(r[0]))){const button=el('button','tool-item');button.type='button';const thai=el('span','',row[1]);thai.lang='th';button.append(el('strong','',row[0]),thai);button.addEventListener('click',()=>showPhrase(row));list.append(button);}
    box.append(list,el('p','note','遇到糾紛或被敲竹槓先打 1155。護照遺失：先到警局報案，再聯絡辦事處。'));
    const more=el('div','actions');more.append(link('完整緊急聯絡資訊','#info/emergency','btn'));box.append(more);
    openSheet('緊急聯絡',box);
  }
  $('sos-button').addEventListener('click',openSos);
  $('fab').addEventListener('click',()=>openTools());

  // ---- "now" card on the overview: what to do next, based on the date and tapped progress ----
  function saveChecks(){try{localStorage.setItem('tripnote-checks',JSON.stringify(checks));}catch(error){}}
  function stepsOf(day){
    return day.steps.map((step,i)=>{
      const p=step.place?point(step.place):null;
      return {key:'done-'+day.id+'-'+i,title:p?p.name:step.title,brief:p?p.brief:(step.paras||[])[0],time:step.time,place:p,links:step.links,hash:p?'plan/'+day.id+'/'+p.id:'plan/'+day.id};
    }).filter(step=>step.title);
  }
  function renderNow(box){
    box.replaceChildren();
    const diff=dayNumber(guide.trip.start)-dayNumber(today),actions=el('div','actions');
    if(todayDay){
      const steps=stepsOf(todayDay),found=steps.findIndex(step=>!checks[step.key]),at=found<0?steps.length:found,step=steps[at];
      box.style.setProperty('--day',dayColor(todayDay));
      box.append(el('p','kicker','現在・'+shortDate(todayDay.date)+'（'+weekday(todayDay.date)+'）Day '+(guide.days.indexOf(todayDay)+1)+'｜'+todayDay.title));
      if(step){
        box.append(el('p','now-label',(at?'下一站':'第一站')+'　'+(at+1)+'／'+steps.length));
        const heading=el('h3','now-title');if(step.time)heading.append(el('span','step-time',step.time));heading.append(document.createTextNode(step.title));box.append(heading);
        if(step.brief)box.append(el('p','',step.brief));
        if(step.place?.facts)box.append(facts(step.place.facts.slice(0,2)));
        if(steps[at+1])box.append(el('p','sub','之後：'+steps[at+1].title));
        if(step.place){actions.append(link('導航 ↗',dirUrl(step.place),'btn primary'));if(step.place.thai)actions.append(driverButton(placeTarget(step.place)));}
        for(const [text,href] of step.links||[])actions.append(link(text,href,'btn'));
        actions.append(link('詳情','#'+step.hash,'btn'));
        const done=el('button','btn',steps[at+1]?'完成，看下一站':'完成');done.type='button';done.addEventListener('click',()=>{checks[step.key]=true;saveChecks();renderNow(box);});actions.append(done);
      } else box.append(el('h3','now-title','今天的行程走完了'),el('p','','辛苦了，回住宿休息吧。'));
      if(todayDay.sun)box.append(el('p','sub',todayDay.sun));
      const sleep=stayById(todayDay.sleep);
      if(sleep){actions.append(link('導航回住宿 ↗',dirUrl(sleep),'btn'));if(!step&&sleep.addressTh)actions.append(driverButton(stayTarget(sleep)));}
      if(at>0){const back=el('button','btn','回上一站');back.type='button';back.addEventListener('click',()=>{checks[steps[at-1].key]=false;saveChecks();renderNow(box);});actions.append(back);}
      actions.append(link('今天全部行程','#plan/'+todayDay.id,'btn'));
    } else if(diff===0){
      box.append(el('p','kicker','今天・出發日'),el('h3','now-title','今晚出發'));
      box.append(facts([['班機','CI837　22:30 桃園第一航廈起飛'],['到機場','建議 19:30–20:00 前到；集合時間與地點以主辦通知為準'],['抵達','12/12 01:35 曼谷（當地時間，比台灣慢 1 小時）']]));
      actions.append(link('班機動態 ↗','https://www.flightaware.com/live/flight/CAL837','btn primary'),link('行李清單','#info/packing','btn'),link('落地流程','#info/arrive','btn'));
    } else if(diff>0){
      const left=guide.todo.filter(item=>!checks[item.id]).length,wait=dayNumber(guide.trip.tdacOpen)-dayNumber(today);
      box.append(el('p','kicker','出發前'),el('h3','now-title','出發前準備'));
      box.append(facts([['班機','12/11（五）22:30 CI837，桃園第一航廈'],['TDAC',wait>0?'12/9 起才能填（還有 '+wait+' 天）':'現在可以填了，填完把確認信截圖存起來'],['待確認',left?'還有 '+left+' 項沒勾':'全部勾完了']]));
      if(wait<=0)actions.append(link('填 TDAC ↗','https://tdac.immigration.go.th/arrival-card/#/home','btn primary'));
      actions.append(link('待確認清單','#home/todo','btn'),link('行李清單','#info/packing','btn'),link('落地流程','#info/arrive','btn'));
    } else {box.hidden=true;return;}
    box.append(actions);
  }

  // ---- offline ----
  function connection(){$('offline').hidden=navigator.onLine;}
  addEventListener('online',connection);addEventListener('offline',connection);connection();
  if('serviceWorker' in navigator)addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});

  // ---- routing ----
  const tabs=$('tabs');
  for(const view of views){
    const button=el('button','tab');button.type='button';button.dataset.view=view.id;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',view.icon);svg.append(path);
    button.append(svg,el('span','',view.label));button.addEventListener('click',()=>go(view.id));tabs.append(button);
  }
  function go(view,...rest){const hash='#'+[view,...rest].join('/');if(location.hash===hash)route();else location.hash=hash;}
  function flash(node){
    if(!node)return;
    if(node.tagName==='DETAILS')node.open=true;
    requestAnimationFrame(()=>{node.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});const box=node.classList.contains('card')?node:node.closest('.card')||node;box.classList.remove('flash');void box.offsetWidth;box.classList.add('flash');});
  }
  let currentView='';
  function route(){
    const parts=decodeURIComponent(location.hash.slice(1)).split('/').filter(Boolean);
    const view=views.some(v=>v.id===parts[0])?parts[0]:'home';
    for(const section of document.querySelectorAll('.view'))section.hidden=section.dataset.view!==view;
    for(const tab of tabs.children){if(tab.dataset.view===view)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current');}
    $('site-footer').hidden=view==='map';$('fab').hidden=view==='map';
    if(view==='map'){if(window.TripMap)window.TripMap.refresh();else window.TripMapInit();}
    if(view==='plan'){
      const day=guide.days.find(d=>d.id===parts[1]);
      if(day)showDay(day.id);
      if(day&&parts[2])flash($('plan-'+day.id+'-'+parts[2]));
      else if(currentView!==view||day)scrollTo({top:0,behavior:'auto'});
    } else if(parts[1]&&view!=='map')flash($(view+'-'+parts[1]));
    else if(currentView!==view)scrollTo({top:0,behavior:'auto'});
    currentView=view;
  }

  // ---- search ----
  const input=$('search-input'),results=$('search-results');
  function highlight(text,terms){
    const span=el('span');let rest=text;
    while(rest){
      let at=-1,len=0;const lower=rest.toLowerCase();
      for(const term of terms){const i=lower.indexOf(term);if(i>=0&&(at<0||i<at)){at=i;len=term.length;}}
      if(at<0){span.append(rest);break;}
      span.append(rest.slice(0,at),el('mark','',rest.slice(at,at+len)));rest=rest.slice(at+len);
    }
    return span;
  }
  function search(){
    const terms=input.value.toLowerCase().split(/\s+/).filter(Boolean);
    results.replaceChildren();
    if(!terms.length){results.hidden=true;return;}
    const hits=index.filter(entry=>terms.every(term=>entry.haystack.includes(term)))
      .map(entry=>({entry,score:terms.filter(term=>entry.title.toLowerCase().includes(term)).length}))
      .sort((a,b)=>b.score-a.score).slice(0,14);
    if(!hits.length)results.append(el('p','search-empty','找不到「'+input.value+'」。試試景點名稱、站名或關鍵字（例如：門票、退稅、船）。'));
    for(const {entry} of hits){
      const button=el('button','search-hit');button.type='button';
      const lower=entry.text.toLowerCase();let at=-1;for(const term of terms){const i=lower.indexOf(term);if(i>=0&&(at<0||i<at))at=i;}
      const start=Math.max(0,at-18),snippet=(start>0?'…':'')+entry.text.slice(start,start+86)+(entry.text.length>start+86?'…':'');
      const heading=el('strong');heading.append(highlight(entry.title,terms));
      button.append(el('span','hit-where',entry.where),heading);if(entry.text)button.append(highlight(snippet,terms));
      button.addEventListener('click',()=>{results.hidden=true;input.blur();go(...entry.hash.split('/'));});
      results.append(button);
    }
    results.hidden=false;
  }
  input.addEventListener('input',search);
  input.addEventListener('focus',search);
  input.addEventListener('keydown',event=>{if(event.key==='Escape'){results.hidden=true;input.blur();}if(event.key==='Enter'){results.querySelector('.search-hit')?.click();}});
  document.addEventListener('click',event=>{if(!event.target.closest('.search'))results.hidden=true;});

  // ---- footer ----
  const footer=$('site-footer');
  footer.append(el('p','',guide.disclaimer),el('p','','資料整理：'+guide.updated.replaceAll('-','/')));
  const policies=el('p');policies.append(link('使用條款','terms.html'),link('隱私權','privacy.html'));footer.append(policies);

  renderHome();renderPlan();renderStay();
  renderCards('move','交通','機場、捷運、包車與沙美島船班',guide.move);
  renderCards('info','實用資訊','入境、金錢、禮儀、緊急聯絡與行李',guide.info);
  window.addEventListener('hashchange',route);
  route();
})();
