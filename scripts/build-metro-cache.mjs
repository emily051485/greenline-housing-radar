import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sourcePath = path.join(root, 'data/raw/taipei-metro-routes.json');
const airportSourcePath = path.join(root, 'data/raw/taoyuan-airport-metro.geojson');
const newTaipeiSourcePath = path.join(root, 'data/raw/newtaipei-metro-routes.json');
const bananExtensionPath = path.join(root, 'data/raw/banan-extension.json');
const outputPath = path.join(root, 'src/generated/metro-routes.js');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const airportSource = fs.existsSync(airportSourcePath)
  ? JSON.parse(fs.readFileSync(airportSourcePath, 'utf8'))
  : {features:[]};
const newTaipeiSource = fs.existsSync(newTaipeiSourcePath)
  ? JSON.parse(fs.readFileSync(newTaipeiSourcePath, 'utf8'))
  : {elements:[]};
const bananExtensionSource = fs.existsSync(bananExtensionPath)
  ? JSON.parse(fs.readFileSync(bananExtensionPath, 'utf8').replace(/^\uFEFF/,''))
  : {elements:[]};

// EPSG:3826 (TWD97 / TM2 zone 121) inverse Transverse Mercator.
function twd97ToWgs84([east, north]) {
  const a = 6378137;
  const b = 6356752.314245;
  const long0 = 121 * Math.PI / 180;
  const k0 = 0.9999;
  const dx = 250000;
  const e2 = 1 - (b * b) / (a * a);
  const e = Math.sqrt(e2);
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  const x = east - dx;
  const m = north / k0;
  const mu = m / (a * (1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256));
  const fp = mu
    + (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu)
    + (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu)
    + (151 * e1 ** 3 / 96) * Math.sin(6 * mu)
    + (1097 * e1 ** 4 / 512) * Math.sin(8 * mu);
  const ep2 = e2 / (1 - e2);
  const c1 = ep2 * Math.cos(fp) ** 2;
  const t1 = Math.tan(fp) ** 2;
  const r1 = a * (1 - e2) / (1 - e2 * Math.sin(fp) ** 2) ** 1.5;
  const n1 = a / Math.sqrt(1 - e2 * Math.sin(fp) ** 2);
  const d = x / (n1 * k0);
  const lat = fp - (n1 * Math.tan(fp) / r1) * (
    d ** 2 / 2
    - (5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * ep2) * d ** 4 / 24
    + (61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * ep2 - 3 * c1 ** 2) * d ** 6 / 720
  );
  const lng = long0 + (
    d
    - (1 + 2 * t1 + c1) * d ** 3 / 6
    + (5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * ep2 + 24 * t1 ** 2) * d ** 5 / 120
  ) / Math.cos(fp);
  return [lng * 180 / Math.PI, lat * 180 / Math.PI];
}

const routeStyle = (name) => {
  if (/淡水|信義/.test(name)) return {ref:'R',color:'#e3002c'};
  if (/蘆洲|新莊|中和/.test(name)) return {ref:'O',color:'#f8b61c'};
  if (/板橋|南港/.test(name)) return {ref:'BL',color:'#0070bd'};
  if (/新店|松山|小南門|碧潭/.test(name)) return {ref:'G',color:'#008659'};
  if (/木柵|內湖/.test(name)) return {ref:'BR',color:'#c48c31'};
  if (/環狀/.test(name)) return {ref:'Y',color:'#ffdb00'};
  return {ref:'',color:'#67756f'};
};

const features = source.features.map((feature) => {
  const name = feature.properties.RouteName;
  return {
    type:'Feature',
    properties:{name,...routeStyle(name),status:'operational',official:true},
    geometry:{
      type:feature.geometry.type,
      coordinates:feature.geometry.type === 'LineString'
        ? feature.geometry.coordinates.map(twd97ToWgs84)
        : feature.geometry.coordinates.map(line=>line.map(twd97ToWgs84)),
    },
  };
});
for (const feature of airportSource.features) {
  if (feature.properties?.railname !== '機場線') continue;
  features.push({
    type:'Feature',
    properties:{name:'桃園機場捷運',ref:'A',color:'#8246af',status:'operational',official:true},
    geometry:feature.geometry,
  });
}
const bananMembers=bananExtensionSource.elements?.[0]?.members?.filter(member=>member.type==='way'&&member.geometry?.length)||[];
const bananExtensionIndex=bananMembers.findIndex(member=>{
  const longitudes=member.geometry.map(point=>point.lon);
  return Math.min(...longitudes)<121.42&&Math.max(...longitudes)<121.436;
});
if(bananExtensionIndex>=0){
  const extensionGeometry=[...bananMembers[bananExtensionIndex].geometry,...(bananMembers[bananExtensionIndex+1]?.geometry?.slice(1,2)||[])];
  features.push({
    type:'Feature',properties:{name:'板南線頂埔延伸段',ref:'BL',color:'#0070bd',status:'operational',official:false},
    geometry:{type:'LineString',coordinates:extensionGeometry.map(point=>[point.lon,point.lat])},
  });
}
const newTaipeiStyles={
  V:{name:'淡海輕軌',color:'#78c7d2',status:'operational'},
  K:{name:'安坑輕軌',color:'#7bbf43',status:'operational'},
  LB:{name:'三鶯線',color:'#78c7d2',status:'building'},
  LG:{name:'萬大中和樹林線',color:'#9ac43c',status:'building'},
};
const seenNewTaipeiWays=new Set();
const seenNewTaipeiBranches=new Set();
for(const relation of newTaipeiSource.elements||[]){
  const ref=String(relation.tags?.ref||'').toUpperCase(),style=newTaipeiStyles[ref];
  if(!style)continue;
  const endpoints=[relation.tags?.from||'',relation.tags?.to||''].sort((a,b)=>a.localeCompare(b,'zh-Hant')).join('|');
  const branchKey=`${ref}|${endpoints}`;
  if(seenNewTaipeiBranches.has(branchKey))continue;
  seenNewTaipeiBranches.add(branchKey);
  for(const member of relation.members||[]){
    if(member.type!=='way'||!member.geometry?.length||seenNewTaipeiWays.has(member.ref))continue;
    seenNewTaipeiWays.add(member.ref);
    features.push({
      type:'Feature',properties:{name:style.name,ref,color:style.color,status:style.status,official:false},
      geometry:{type:'LineString',coordinates:member.geometry.map(point=>[point.lon,point.lat])},
    });
  }
}
const collection = {type:'FeatureCollection',features};
fs.writeFileSync(outputPath, `// 臺北市捷運工程局官方 GIS 路網快取；由 scripts/build-metro-cache.mjs 產生。\nexport const cachedMetroRoutes = ${JSON.stringify(collection)};\n`);
console.log(`捷運路網快取：${features.length} 條線形（新北捷運 ${seenNewTaipeiWays.size} 段）`);
