import { projects } from './data.js';
import { cachedMetroRoutes } from './generated/metro-routes.js';

const $=selector=>document.querySelector(selector);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const isMapped=project=>project.locationStatus!=='unlocated'&&Number.isFinite(project.lat)&&Number.isFinite(project.lng);
const hasCoordinates=project=>Number.isFinite(project.lat)&&Number.isFinite(project.lng);
const mapsUrl=project=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(isMapped(project)?`${project.lat},${project.lng}`:`${project.name} ${project.address}`)}`;
const ratingRank={NR:0,C:1,B:2,A:3,S:4};
const metroColors={BR:'#c48c31',R:'#e3002c',G:'#008659',O:'#f8b61c',BL:'#0070bd',Y:'#ffdb00',A:'#8246af',K:'#7bbf43',LB:'#78c7d2',V:'#78c7d2',LG:'#9ac43c'};
const state={projects:[...projects],markers:new Map()};
const floodScenarios={
  '6h150':{label:'6 小時降雨 150 mm',layers:[40,2,22,12]},
  '6h250':{label:'6 小時降雨 250 mm',layers:[41,3,23,13]},
  '6h350':{label:'6 小時降雨 350 mm',layers:[39,4,24,14]},
  '12h200':{label:'12 小時降雨 200 mm',layers:[38,5,25,15]},
  '12h300':{label:'12 小時降雨 300 mm',layers:[37,6,26,16]},
  '12h400':{label:'12 小時降雨 400 mm',layers:[36,7,27,17]},
  '24h200':{label:'24 小時降雨 200 mm',layers:[35,8,28,18]},
  '24h350':{label:'24 小時降雨 350 mm',layers:[34,9,29,19]},
  '24h500':{label:'24 小時降雨 500 mm',layers:[33,10,30,20]},
  '24h650':{label:'24 小時降雨 650 mm',layers:[32,11,31,21]},
};
const floodSourceId='ncdr-flood-source';
const floodLayerId='ncdr-flood-layer';
let floodRequestId=0;
const floodBounds={west:121.46,south:24.91,east:121.62,north:25.11};

const map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/liberty',center:[121.49,25.025],zoom:10.2,attributionControl:false});
map.addControl(new maplibregl.NavigationControl({showCompass:false}),'bottom-right');
map.addControl(new maplibregl.AttributionControl({compact:true,customAttribution:'© OpenFreeMap · © OpenStreetMap contributors'}));
{
  const attribution=document.querySelector('.maplibregl-ctrl-attrib');
  if(attribution){
    attribution.classList.add('maplibregl-compact','attribution-force-compact');
    attribution.classList.remove('attribution-open');
    attribution.removeAttribute('open');
    attribution.querySelector('.maplibregl-ctrl-attrib-button')?.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      attribution.classList.toggle('attribution-open');
    },{capture:true});
  }
}

function markerElement(project){
  const el=document.createElement('button');
  el.className=`map-project-marker marker-${project.rating.toLowerCase()}${isMapped(project)?'':' marker-pending'}`;
  el.type='button';el.textContent=project.rating==='NR'?'·':project.rating;el.title=`${isMapped(project)?'已定位':'待定位候選點'}｜${project.name}`;
  return el;
}
function popupHtml(project){
  const warning=isMapped(project)?'':'<strong class="popup-location-warning">待定位候選點：此處是捷運生活圈推估，不是基地座標</strong>';
  return `<div class="popup">${warning}<small>${escapeHtml(project.district)} · ${escapeHtml(project.station)}站約 ${project.walk} 分</small><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.status)}<br>${escapeHtml(project.builder)}（${escapeHtml(project.rating==='NR'?'未評等':project.rating+'級')}）</p><a href="${mapsUrl(project)}" target="_blank" rel="noopener">${isMapped(project)?'在 Google Maps 開啟座標':'以案名與地址搜尋 Google Maps'} ↗</a></div>`;
}
function addProjectMarkers(){
  projects.filter(hasCoordinates).forEach(project=>{
    const popup=new maplibregl.Popup({offset:22,maxWidth:'320px'}).setHTML(popupHtml(project));
    const marker=new maplibregl.Marker({element:markerElement(project),anchor:'bottom'}).setLngLat([project.lng,project.lat]).setPopup(popup).addTo(map);
    state.markers.set(String(project.id),marker);
  });
}
function projectAreaData(items=projects){
  return {
    type:'FeatureCollection',
    features:items.filter(project=>project.siteGeometry).map(project=>({
      type:'Feature',
      properties:{id:String(project.id),name:project.name,rating:project.rating},
      geometry:project.siteGeometry,
    })),
  };
}
function addProjectAreas(){
  map.addSource('project-areas',{type:'geojson',data:projectAreaData()});
  map.addLayer({
    id:'project-areas-fill',type:'fill',source:'project-areas',
    paint:{
      'fill-color':['match',['get','rating'],'S','#6d4ea2','A','#3f6f91','B','#628477','C','#89918e','#9ba5a1'],
      'fill-opacity':.2,
    },
  });
  map.addLayer({
    id:'project-areas-outline',type:'line',source:'project-areas',
    paint:{'line-color':'#415b53','line-width':1.5,'line-opacity':.72},
  });
  map.on('click','project-areas-fill',event=>{
    const id=event.features?.[0]?.properties?.id;
    const project=projects.find(item=>String(item.id)===id);
    if(project)state.markers.get(id)?.togglePopup();
  });
  map.on('mouseenter','project-areas-fill',()=>map.getCanvas().style.cursor='pointer');
  map.on('mouseleave','project-areas-fill',()=>map.getCanvas().style.cursor='');
}
function routeColor(tags={}){
  const context=`${tags.name||''} ${tags.network||''}`;
  if(/機場|AIRPORT|TAOYUAN/i.test(context))return metroColors.A;
  return tags.colour||metroColors[String(tags.ref||'').toUpperCase()]||'#67756f';
}
function showMetroLines(collection){
  const existing=map.getSource('metro-routes');
  if(existing){existing.setData(collection);return;}
  map.addSource('metro-routes',{type:'geojson',data:collection});
  map.addLayer({id:'metro-casing',type:'line',source:'metro-routes',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#fff','line-opacity':.9,'line-width':['interpolate',['linear'],['zoom'],9,4,14,7]}});
  map.addLayer({id:'metro-routes',type:'line',source:'metro-routes',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':['get','color'],'line-opacity':.92,'line-width':['interpolate',['linear'],['zoom'],9,2,14,4]}});
  map.on('mouseenter','metro-routes',()=>map.getCanvas().style.cursor='pointer');
  map.on('mouseleave','metro-routes',()=>map.getCanvas().style.cursor='');
  map.on('click','metro-routes',event=>new maplibregl.Popup().setLngLat(event.lngLat).setHTML(`<b>${escapeHtml(event.features?.[0]?.properties?.name||'捷運路線')}</b>`).addTo(map));
}
function addFloodControl(){
  const control=document.createElement('section');
  control.className='flood-control';
  control.setAttribute('aria-label','降雨淹水模擬控制');
  control.innerHTML=`<div class="flood-control-heading"><strong>降雨淹水模擬</strong><label class="switch"><input id="flood-toggle" type="checkbox"><span></span></label></div><label>降雨情境<select id="flood-scenario"><option value="6h150">6 小時／150 mm</option><option value="6h250">6 小時／250 mm</option><option value="6h350">6 小時／350 mm</option><option value="12h200">12 小時／200 mm</option><option value="12h300">12 小時／300 mm</option><option value="12h400">12 小時／400 mm</option><option value="24h200">24 小時／200 mm</option><option value="24h350">24 小時／350 mm</option><option value="24h500" selected>24 小時／500 mm</option><option value="24h650">24 小時／650 mm</option></select></label><div class="flood-depth" aria-label="模擬淹水深度圖例"><span><i class="depth-1"></i>0.5–1 m</span><span><i class="depth-2"></i>1–2 m</span><span><i class="depth-3"></i>2–3 m</span><span><i class="depth-4"></i>&gt;3 m</span></div><small id="flood-status">圖層目前關閉</small><a href="https://dmap.ncdr.nat.gov.tw/1109/map/?group-layer=%E6%B7%B9%E6%B0%B4%E6%BD%9B%E5%8B%A2" target="_blank" rel="noopener">NCDR 原始圖台 ↗</a>`;
  $('.map-frame').append(control);
  $('#flood-toggle').addEventListener('change',updateFloodLayer);
  $('#flood-scenario').addEventListener('change',()=>{if($('#flood-toggle').checked)updateFloodLayer();});
}
function setupResponsiveMapPanels(){
  const panels=[
    {element:document.querySelector('.map-legend'),label:'圖例',id:'map-legend-panel'},
    {element:document.querySelector('.flood-control'),label:'淹水模擬',id:'flood-control-panel'},
  ];
  panels.forEach(({element,label,id})=>{
    if(!element||element.classList.contains('map-panel'))return;
    const body=document.createElement('div');
    body.className='map-panel-body';
    body.id=id;
    while(element.firstChild)body.append(element.firstChild);
    const toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='map-panel-toggle';
    toggle.setAttribute('aria-controls',id);
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML=`${label}<span aria-hidden="true">＋</span>`;
    toggle.addEventListener('click',()=>{
      const willOpen=!element.classList.contains('panel-open');
      document.querySelectorAll('.map-panel').forEach(panel=>{
        panel.classList.remove('panel-open');
        panel.querySelector('.map-panel-toggle')?.setAttribute('aria-expanded','false');
        const icon=panel.querySelector('.map-panel-toggle span');
        if(icon)icon.textContent='＋';
      });
      if(willOpen){
        element.classList.add('panel-open');
        toggle.setAttribute('aria-expanded','true');
        toggle.querySelector('span').textContent='−';
      }
    });
    element.classList.add('map-panel');
    element.append(toggle,body);
  });
}
function removeFloodLayer(){
  if(map.getLayer(floodLayerId))map.removeLayer(floodLayerId);
  if(map.getSource(floodSourceId))map.removeSource(floodSourceId);
}
async function updateFloodLayer(){
  const enabled=$('#flood-toggle').checked;
  const status=$('#flood-status');
  const scenario=floodScenarios[$('#flood-scenario').value];
  const requestId=++floodRequestId;
  removeFloodLayer();
  if(!enabled){status.textContent='圖層目前關閉';return;}
  status.textContent='正在載入本站淹水圖層…';
  try{
    if(requestId!==floodRequestId||!$('#flood-toggle').checked)return;
    const scenarioKey=$('#flood-scenario').value;
    const imageUrl=`${import.meta.env.BASE_URL}data/flood/${scenarioKey}.png`;
    map.addSource(floodSourceId,{type:'image',url:imageUrl,coordinates:[
      [floodBounds.west,floodBounds.north],[floodBounds.east,floodBounds.north],
      [floodBounds.east,floodBounds.south],[floodBounds.west,floodBounds.south],
    ]});
    map.addLayer({id:floodLayerId,type:'raster',source:floodSourceId,paint:{'raster-opacity':.58,'raster-fade-duration':0}},map.getLayer('project-areas-fill')?'project-areas-fill':undefined);
    status.textContent=`顯示：${scenario.label}（本站快取）`;
  }catch(error){
    removeFloodLayer();
    status.textContent='本站淹水圖層無法載入';
    console.error('淹水快取圖層載入失敗',error);
  }
}
async function loadMetroLines(){
  const query='[out:json][timeout:40];(rel[route="subway"](24.75,121.20,25.30,121.70);rel[route="light_rail"](24.75,121.20,25.30,121.70);rel[route="train"][network~"Taoyuan|桃園"](24.75,121.20,25.30,121.70););out geom;';
  try{
    const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(query)});
    if(!response.ok)throw new Error(`Overpass ${response.status}`);
    const data=await response.json(),seenWays=new Set(),features=[];
    for(const route of data.elements){
      const context=`${route.tags?.network||''} ${route.tags?.operator||''} ${route.tags?.name||''}`;
      const ref=String(route.tags?.ref||'').toUpperCase();
      // Some valid OSM relations, notably BL, omit network and operator tags.
      // Keep official metro line refs before applying the regional text filter.
      // Main Taipei lines and Airport MRT come from local government-data caches.
      // Live OSM only supplements New Taipei light rail and planned extensions.
      const knownLine=/^(K|LB|V|LG)$/.test(ref);
      const regionalRoute=/Taipei|New Taipei|Taoyuan|臺北|台北|新北|桃園|捷運|Metro/i.test(context);
      if(!knownLine||!regionalRoute)continue;
      for(const member of route.members||[]){
        if(member.type!=='way'||!member.geometry?.length||seenWays.has(member.ref))continue;
        seenWays.add(member.ref);
        features.push({type:'Feature',properties:{name:route.tags?.name||route.tags?.ref||'捷運',ref,color:routeColor(route.tags)},geometry:{type:'LineString',coordinates:member.geometry.map(point=>[point.lon,point.lat])}});
      }
    }
    showMetroLines({type:'FeatureCollection',features:[...cachedMetroRoutes.features,...features]});
  }catch(error){console.warn('捷運路線暫時無法載入；底圖仍保留 OSM 軌道資料。',error);}
}
function render(){
  const city=$('#city-filter').value,status=$('#status-filter').value,rating=$('#rating-filter').value,maxWalk=Number($('#walk-filter').value),query=$('#search-filter').value.trim().toLowerCase();
  const ratingMatches=project=>rating==='all'||(rating==='NR'?project.rating==='NR':ratingRank[project.rating]>=ratingRank[rating]);
  state.projects=projects.filter(project=>(city==='all'||project.city===city)&&(status==='all'||project.status===status)&&ratingMatches(project)&&project.walk<=maxWalk&&(!query||[project.name,project.district,project.builder,project.station].join(' ').toLowerCase().includes(query)));
  $('#project-rows').innerHTML=state.projects.map(project=>`<tr data-id="${escapeHtml(project.id)}" class="${isMapped(project)?'':'unlocated-row'}"><td><strong>${escapeHtml(project.name)}</strong><small><b class="location-tag ${isMapped(project)?'located':'pending'}">${isMapped(project)?'已定位':'待定位'}</b>${escapeHtml(project.source)}${project.locationAccuracy?` · ${escapeHtml(project.locationAccuracy)}`:''}</small></td><td>${escapeHtml(project.district)}</td><td><span class="walk">${escapeHtml(project.station)} <b>${project.walk} 分</b></span></td><td>${escapeHtml(project.address)}</td><td><span class="grade grade-${project.rating.toLowerCase()}" title="${escapeHtml(project.ratingBasis||'建商研究評等')}">${project.rating}</span>${escapeHtml(project.builder)}</td><td><span class="status status-${project.status.includes('審議')||project.status.includes('核定')?'early':project.status.includes('建照')?'permit':'sale'}">${escapeHtml(project.status)}</span></td><td>${escapeHtml(project.completion)}</td><td>${escapeHtml(project.type)}</td><td>${escapeHtml(project.size)}</td><td>${escapeHtml(project.price)}</td><td><a class="map-link" href="${mapsUrl(project)}" target="_blank" rel="noopener" title="${isMapped(project)?'開啟已覆核座標':'以案名與地址搜尋 Google Maps'}">↗</a></td></tr>`).join('');
  $('#result-count').textContent=state.projects.length;$('#empty-state').hidden=state.projects.length>0;
  const visible=new Set(state.projects.map(project=>String(project.id)));
  state.markers.forEach((marker,id)=>marker.getElement().style.display=visible.has(id)?'grid':'none');
  map.getSource('project-areas')?.setData(projectAreaData(state.projects));
  document.querySelectorAll('tr[data-id]').forEach(row=>row.addEventListener('click',event=>{
    if(event.target.closest('a'))return;const project=projects.find(item=>String(item.id)===row.dataset.id);if(!project||!hasCoordinates(project))return;
    map.flyTo({center:[project.lng,project.lat],zoom:16,essential:true});state.markers.get(String(project.id))?.togglePopup();$('#map-section').scrollIntoView({behavior:'smooth'});
  }));
}

const hazardKinds={fuel:'加油站',substation:'變電所',cemetery:'公墓／墓園',waste:'廢棄物設施',wastewater:'污水處理設施'};
function classify(tags={}){if(tags.amenity==='fuel')return 'fuel';if(tags.power==='substation')return 'substation';if(tags.landuse==='cemetery'||tags.amenity==='grave_yard')return 'cemetery';if(tags.man_made==='wastewater_plant')return 'wastewater';return 'waste';}
async function loadHazards(){
  const button=$('#refresh-hazards'),status=$('#hazard-status');button.disabled=true;status.textContent='正在查詢 OSM…';
  const centers=[...new Map(projects.filter(isMapped).map(project=>[`${project.lat},${project.lng}`,project])).values()];
  const around=centers.map(project=>`nwr(around:500,${project.lat},${project.lng})[amenity=fuel];nwr(around:500,${project.lat},${project.lng})[power=substation];nwr(around:500,${project.lat},${project.lng})[landuse=cemetery];nwr(around:500,${project.lat},${project.lng})[amenity=grave_yard];nwr(around:500,${project.lat},${project.lng})[man_made=wastewater_plant];nwr(around:500,${project.lat},${project.lng})[amenity=waste_transfer_station];`).join('');
  try{
    const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(`[out:json][timeout:35];(${around});out center;`)});if(!response.ok)throw new Error(`Overpass ${response.status}`);
    const data=await response.json(),seen=new Set(),features=[];
    for(const element of data.elements){const lat=element.lat??element.center?.lat,lng=element.lon??element.center?.lon,key=`${lat},${lng}`;if(!lat||!lng||seen.has(key))continue;seen.add(key);const kind=classify(element.tags);features.push({type:'Feature',properties:{label:hazardKinds[kind],name:element.tags?.name||'OSM 未命名設施'},geometry:{type:'Point',coordinates:[lng,lat]}});}
    const collection={type:'FeatureCollection',features};
    if(map.getSource('hazards'))map.getSource('hazards').setData(collection);else{
      map.addSource('hazards',{type:'geojson',data:collection});map.addLayer({id:'hazards',type:'circle',source:'hazards',paint:{'circle-radius':6,'circle-color':'#fff2eb','circle-stroke-color':'#b74838','circle-stroke-width':2}});
      map.on('click','hazards',event=>{const feature=event.features?.[0];if(feature)new maplibregl.Popup().setLngLat(event.lngLat).setHTML(`<b>${escapeHtml(feature.properties.label)}</b><br>${escapeHtml(feature.properties.name)}`).addTo(map);});
    }
    status.textContent=`已載入 ${features.length} 個 OSM 設施`;
  }catch(error){status.textContent='查詢失敗，稍後可再試';console.error(error);}finally{button.disabled=false;}
}

const hazardCacheKey='greenline-hazards-v3';
const overpassEndpoints=['https://maps.mail.ru/osm/tools/overpass/api/interpreter','https://overpass.private.coffee/api/interpreter','https://lz4.overpass-api.de/api/interpreter','https://overpass-api.de/api/interpreter'];
const expandedHazardKinds={
  fuel:{label:'加油站',group:'重大環境設施',radius:500},substation:{label:'變電所',group:'重大環境設施',radius:500},powerTower:{label:'高壓電塔',group:'重大環境設施',radius:500},
  cemetery:{label:'公墓／墓園',group:'重大環境設施',radius:500},funeral:{label:'殯儀／殯葬設施',group:'重大環境設施',radius:500},crematorium:{label:'火葬場',group:'重大環境設施',radius:1000},
  waste:{label:'廢棄物／轉運設施',group:'重大環境設施',radius:1000},wastewater:{label:'污水處理設施',group:'重大環境設施',radius:1000},industrial:{label:'工業區／工廠',group:'重大環境設施',radius:1000},
  storage:{label:'油氣／大型儲槽',group:'重大環境設施',radius:500},slaughterhouse:{label:'屠宰／化工／瀝青設施',group:'重大環境設施',radius:1000},brownfield:{label:'棕地／疑似廢棄工業地',group:'重大環境設施',radius:1000},
  highway:{label:'快速道路／高架匝道',group:'生活影響設施',radius:300},rail:{label:'鐵路／調車設施',group:'生活影響設施',radius:300},transitDepot:{label:'軌道／公車機廠',group:'生活影響設施',radius:500},airport:{label:'機場影響範圍',group:'生活影響設施',radius:3000},
  emergency:{label:'醫院／急診',group:'生活影響設施',radius:500},fireStation:{label:'消防隊',group:'生活影響設施',radius:300},worship:{label:'宗教活動設施',group:'生活影響設施',radius:300},nightlife:{label:'夜間娛樂場所',group:'生活影響設施',radius:300},
  market:{label:'市場／夜市',group:'生活影響設施',radius:300},school:{label:'學校／幼兒園',group:'生活影響設施',radius:300},communications:{label:'通訊塔／基地台',group:'生活影響設施',radius:300},prison:{label:'監獄／看守所',group:'生活影響設施',radius:500},military:{label:'軍事設施',group:'生活影響設施',radius:500},
};
function classifyExpandedHazard(tags={}){
  if(tags.amenity==='fuel')return 'fuel';
  if(tags.power==='substation')return 'substation';
  if(tags.power==='tower')return 'powerTower';
  if(tags.landuse==='cemetery'||tags.amenity==='grave_yard')return 'cemetery';
  if(tags.amenity==='crematorium')return 'crematorium';
  if(tags.amenity==='funeral_hall'||tags.shop==='funeral_directors')return 'funeral';
  if(tags.man_made==='wastewater_plant')return 'wastewater';
  if(tags.amenity==='waste_transfer_station'||tags.landuse==='landfill')return 'waste';
  if(tags.landuse==='brownfield')return 'brownfield';
  if(tags.industrial&&/slaughterhouse|chemical|asphalt|concrete/.test(tags.industrial))return 'slaughterhouse';
  if(tags.man_made==='storage_tank')return 'storage';
  if(tags.landuse==='industrial')return 'industrial';
  if(tags.railway==='yard'||tags.railway==='depot'||tags.landuse==='railway'||tags.amenity==='bus_station')return 'transitDepot';
  if(tags.railway==='rail')return 'rail';
  if(tags.highway&&/^(motorway|motorway_link|trunk|trunk_link)$/.test(tags.highway))return 'highway';
  if(tags.aeroway==='aerodrome')return 'airport';
  if(tags.amenity==='hospital')return 'emergency';
  if(tags.amenity==='fire_station')return 'fireStation';
  if(tags.amenity==='place_of_worship')return 'worship';
  if(tags.amenity&&/^(bar|pub|nightclub|karaoke_box)$/.test(tags.amenity))return 'nightlife';
  if(tags.amenity==='marketplace')return 'market';
  if(tags.amenity&&/^(school|kindergarten|college|university)$/.test(tags.amenity))return 'school';
  if((tags.man_made==='mast'||tags.man_made==='tower')&&/communication|mobile_phone/.test(`${tags['tower:type']||''} ${tags.communication||''}`))return 'communications';
  if(tags.amenity==='prison')return 'prison';
  if(tags.landuse==='military'||tags.military)return 'military';
  return null;
}
function distanceMeters(aLat,aLng,bLat,bLng){
  const radians=value=>value*Math.PI/180;
  const dLat=radians(bLat-aLat),dLng=radians(bLng-aLng);
  const value=Math.sin(dLat/2)**2+Math.cos(radians(aLat))*Math.cos(radians(bLat))*Math.sin(dLng/2)**2;
  return 12742000*Math.asin(Math.sqrt(value));
}
function setHazardData(collection){
  if(map.getSource('hazards')){
    map.getSource('hazards').setData(collection);
    return;
  }
  map.addSource('hazards',{type:'geojson',data:collection});
  map.addLayer({id:'hazards',type:'circle',source:'hazards',paint:{'circle-radius':['interpolate',['linear'],['zoom'],10,3,14,6],'circle-color':['match',['get','group'],'重大環境設施','#fff2eb','#fff3cf'],'circle-stroke-color':['match',['get','group'],'重大環境設施','#b74838','#d38a18'],'circle-stroke-width':['interpolate',['linear'],['zoom'],10,1,14,2],'circle-opacity':.86}});
  map.on('click','hazards',event=>{
    const feature=event.features?.[0];
    if(feature)new maplibregl.Popup().setLngLat(event.lngLat).setHTML(`<b>${escapeHtml(feature.properties.label)}</b><br>${escapeHtml(feature.properties.name)}<br><small>${escapeHtml(feature.properties.group)} · 檢查 ${escapeHtml(feature.properties.radius)} 公尺</small>`).addTo(map);
  });
}
async function requestHazards(query){
  let lastError;
  for(const endpoint of overpassEndpoints){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),25000);
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(query),signal:controller.signal});
      if(!response.ok)throw new Error(`${new URL(endpoint).host} HTTP ${response.status}`);
      return await response.json();
    }catch(error){
      lastError=error;
    }finally{
      clearTimeout(timer);
    }
  }
  throw lastError||new Error('Overpass unavailable');
}
async function loadHazardsReliable(force=false){
  const button=$('#refresh-hazards'),status=$('#hazard-status');
  const centers=projects.filter(isMapped);
  let cached;
  try{cached=JSON.parse(localStorage.getItem(hazardCacheKey)||'null');}catch{cached=null;}
  if(cached?.collection){
    setHazardData(cached.collection);
    const ageHours=Math.floor((Date.now()-cached.updatedAt)/3600000);
    status.textContent=`已載入 ${cached.collection.features.length} 個設施（快取 ${ageHours} 小時）`;
    if(!force&&Date.now()-cached.updatedAt<12*3600000)return;
  }
  if(!centers.length){status.textContent='目前沒有已定位基地';return;}
  button.disabled=true;
  status.textContent='正在更新 OSM 嫌惡設施…';
  const padding=.035;
  const south=Math.min(...centers.map(item=>item.lat))-padding;
  const west=Math.min(...centers.map(item=>item.lng))-padding;
  const north=Math.max(...centers.map(item=>item.lat))+padding;
  const east=Math.max(...centers.map(item=>item.lng))+padding;
  const bbox=`(${south},${west},${north},${east})`;
  const queries=[
    `[out:json][timeout:30];(nwr[amenity~"fuel|crematorium|funeral_hall|waste_transfer_station"]${bbox};nwr[shop=funeral_directors]${bbox};nwr[power~"substation|tower"]${bbox};nwr[landuse~"cemetery|landfill|industrial|brownfield"]${bbox};nwr[man_made~"wastewater_plant|storage_tank"]${bbox};nwr[industrial~"slaughterhouse|chemical|asphalt|concrete"]${bbox};);out center tags;`,
    `[out:json][timeout:30];(nwr[amenity=bus_station]${bbox};nwr[landuse=railway]${bbox};nwr[railway~"yard|depot|rail"]${bbox};nwr[highway~"motorway|motorway_link|trunk|trunk_link"]${bbox};nwr[aeroway=aerodrome]${bbox};);out center tags;`,
    `[out:json][timeout:30];(nwr[amenity~"fire_station|hospital|school|kindergarten|college|university|place_of_worship|bar|pub|nightclub|karaoke_box|marketplace|prison"]${bbox};nwr[man_made~"mast|tower"]${bbox};nwr[landuse=military]${bbox};nwr[military]${bbox};);out center tags;`,
  ];
  try{
    const elements=[];
    let failedBatches=0;
    for(let index=0;index<queries.length;index++){
      status.textContent=`正在更新環境設施（${index+1}/${queries.length}）…`;
      try{
        const data=await requestHazards(queries[index]);
        elements.push(...(data.elements||[]));
      }catch(error){
        failedBatches++;
        console.warn(`環境設施第 ${index+1} 批查詢失敗`,error);
      }
    }
    if(!elements.length)throw new Error('所有環境設施查詢皆失敗');
    const seen=new Set(),features=[];
    for(const element of elements){
      const lat=element.lat??element.center?.lat,lng=element.lon??element.center?.lon;
      if(!Number.isFinite(lat)||!Number.isFinite(lng))continue;
      const kind=classifyExpandedHazard(element.tags);
      const definition=expandedHazardKinds[kind];
      if(!definition||!centers.some(project=>distanceMeters(lat,lng,project.lat,project.lng)<=definition.radius))continue;
      const key=`${element.type}/${element.id}`;
      if(seen.has(key))continue;
      seen.add(key);
      features.push({type:'Feature',properties:{label:definition.label,group:definition.group,radius:definition.radius,name:element.tags?.name||'OSM 未命名設施'},geometry:{type:'Point',coordinates:[lng,lat]}});
    }
    const collection={type:'FeatureCollection',features};
    setHazardData(collection);
    localStorage.setItem(hazardCacheKey,JSON.stringify({updatedAt:Date.now(),collection}));
    const critical=features.filter(feature=>feature.properties.group==='重大環境設施').length;
    status.textContent=`已更新 ${features.length} 個設施（重大 ${critical}）${failedBatches?`；${failedBatches} 批暫時無法更新`:''}`;
  }catch(error){
    status.textContent=cached?.collection?'更新失敗，保留上次資料':'查詢失敗，請稍後再試';
    console.error('嫌惡設施更新失敗',error);
  }finally{
    button.disabled=false;
  }
}

addFloodControl();
setupResponsiveMapPanels();
map.on('load',()=>{addProjectAreas();showMetroLines(cachedMetroRoutes);addProjectMarkers();render();loadMetroLines();setTimeout(()=>loadHazardsReliable(false),600);});
['city-filter','status-filter','rating-filter','walk-filter'].forEach(id=>$('#'+id).addEventListener('change',render));
$('#search-filter').addEventListener('input',render);
document.querySelectorAll('[data-scroll]').forEach(button=>button.addEventListener('click',()=>$('#'+button.dataset.scroll).scrollIntoView({behavior:'smooth'})));
$('#refresh-hazards').addEventListener('click',()=>loadHazardsReliable(true));
$('#total-count').textContent=projects.length;$('#district-count').textContent=new Set(projects.map(project=>project.district)).size;$('#walk-average').textContent=(projects.reduce((sum,project)=>sum+project.walk,0)/projects.length).toFixed(1);
render();
