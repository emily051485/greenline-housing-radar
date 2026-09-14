import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const sourcePath=path.join(root,'data/raw/osm-metro-stations.json');
const outputPath=path.join(root,'src/generated/metro-stations.js');
const source=JSON.parse(fs.readFileSync(sourcePath,'utf8').replace(/^\uFEFF/,''));
const allowedNetworks=/^(臺北捷運|新北捷運|桃園機場捷運)$/;
const colors={BR:'#c48c31',R:'#e3002c',G:'#008659',O:'#f8b61c',BL:'#0070bd',Y:'#ffdb00',A:'#8246af',K:'#7bbf43',V:'#78c7d2',LB:'#78c7d2',LG:'#9ac43c'};
const refPrefix=ref=>String(ref||'').split(';')[0].match(/^[A-Z]+/)?.[0]||'';

const stations=[];
for(const element of source.elements||[]){
  const tags=element.tags||{},name=tags['name:zh-Hant']||tags['name:zh']||tags.name;
  if(!name||!allowedNetworks.test(tags.network||''))continue;
  const lng=Number(element.lon??element.center?.lon),lat=Number(element.lat??element.center?.lat);
  if(!Number.isFinite(lat)||!Number.isFinite(lng))continue;
  const ref=String(tags.ref||''),line=refPrefix(ref);
  stations.push({name:name.replace(/站$/,''),ref,line,network:tags.network,lng,lat,color:colors[line]||'#5f6b66'});
}

const unique=[...new Map(stations.map(station=>[`${station.network}|${station.name}`,station])).values()]
  .sort((a,b)=>a.network.localeCompare(b.network,'zh-Hant')||a.ref.localeCompare(b.ref,undefined,{numeric:true}));
const collection={type:'FeatureCollection',features:unique.map(station=>({type:'Feature',properties:{name:station.name,ref:station.ref,line:station.line,network:station.network,color:station.color},geometry:{type:'Point',coordinates:[station.lng,station.lat]}}))};
fs.writeFileSync(outputPath,`// OpenStreetMap 捷運站點靜態快取；由 scripts/build-metro-stations.mjs 產生。\nexport const cachedMetroStations = ${JSON.stringify(collection,null,2)};\n`);
console.log(`捷運站點快取：${unique.length} 個實體車站`);
