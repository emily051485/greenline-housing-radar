import fs from 'node:fs';
import path from 'node:path';
import { cachedMetroStations } from '../src/generated/metro-stations.js';

const root=path.resolve(import.meta.dirname,'..');
const raw=name=>path.join(root,'data/raw',name);
const output=path.join(root,'src/generated/mature-registry-projects.js');

const ringCentroid=ring=>{
  const [originX,originY]=ring[0];let twiceArea=0,x=0,y=0;
  for(let index=0;index<ring.length-1;index++){const x1=ring[index][0]-originX,y1=ring[index][1]-originY,x2=ring[index+1][0]-originX,y2=ring[index+1][1]-originY,cross=x1*y2-x2*y1;twiceArea+=cross;x+=(x1+x2)*cross;y+=(y1+y2)*cross;}
  if(!twiceArea){const points=ring.slice(0,-1);return {area:0,lng:points.reduce((sum,point)=>sum+point[0],0)/points.length,lat:points.reduce((sum,point)=>sum+point[1],0)/points.length};}
  return {area:Math.abs(twiceArea/2),lng:originX+x/(3*twiceArea),lat:originY+y/(3*twiceArea)};
};
const geometryCentroid=geometry=>(geometry.type==='MultiPolygon'?geometry.coordinates:[geometry.coordinates]).map(polygon=>ringCentroid(polygon[0])).sort((a,b)=>b.area-a.area)[0];
const officialParcelsByProject=new Map();
const officialParcelPath=raw('taipei-project-parcels.geojson');
if(fs.existsSync(officialParcelPath)){
  const collection=JSON.parse(fs.readFileSync(officialParcelPath,'utf8'));
  for(const feature of collection.features||[]){const center=geometryCentroid(feature.geometry);for(const projectId of feature.properties?.projectIds||[])officialParcelsByProject.set(projectId,{...center,siteGeometry:feature.geometry,parcel:feature.properties?.['區段號']||feature.properties?.AA49});}
}

function parseCsv(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let index=0;index<text.length;index++){
    const char=text[index];
    if(char==='"'){if(quoted&&text[index+1]==='"'){cell+='"';index++;}else quoted=!quoted;}
    else if(char===','&&!quoted){row.push(cell);cell='';}
    else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&text[index+1]==='\n')index++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}
    else cell+=char;
  }
  if(cell||row.length){row.push(cell);rows.push(row);}return rows;
}
function records(file,encoding='utf8'){
  const bytes=fs.readFileSync(file),text=encoding==='big5'?new TextDecoder('big5').decode(bytes):bytes.toString('utf8').replace(/^\uFEFF/,'');
  const rows=parseCsv(text),headers=rows.shift();if(rows[0]?.[0]==='TOWN')rows.shift();
  return rows.map(row=>Object.fromEntries(headers.map((header,index)=>[header,row[index]||''])));
}

const registry=[
  ...records(raw('taipei-presale-registry.csv')).map(row=>({...row,city:'台北市'})),
  ...records(raw('newtaipei-presale-registry.csv')).map(row=>({...row,city:'新北市'})),
].filter(row=>{
  const year=Number(String(row['申報備查日期']).slice(0,3)),residential=/住宅|住家|住商/.test(row['主要用途']);
  const completed=Number(String(row['第1次登記日期']).slice(0,3))||0;
  // 納入自預售屋全面備查制度上路後的案件；較早申報但尚未完成第一次登記者也保留。
  return (year>=110||(!year&&row['建造執照']&&row['銷售期間']))&&residential&&(!completed||completed>=113)&&row['建案名稱']&&row['坐落街道'];
});
const stationKey=value=>String(value||'').replace(/臺/g,'台').replace(/站$/,'');
const metroStations=cachedMetroStations.features.map(feature=>{
  const ref=String(feature.properties.ref||''),lines=[...new Set(ref.split(';').map(value=>value.match(/^[A-Z]+/)?.[0]).filter(Boolean))];
  return {station:feature.properties.name,lng:feature.geometry.coordinates[0],lat:feature.geometry.coordinates[1],lines};
});
const stationLinesByName=new Map(metroStations.map(station=>[stationKey(station.station),station.lines]));
const exits=records(raw('taipei-metro-exits.csv'),'big5').map(row=>{const station=row['出入口名稱'].replace(/站?出(?:入)?口.*$/,'');return {station,lng:Number(row['經度']),lat:Number(row['緯度']),lines:stationLinesByName.get(stationKey(station))||[]};}).filter(exit=>Number.isFinite(exit.lat)&&Number.isFinite(exit.lng));
const transitPoints=[...exits,...metroStations];

// EPSG:3826 (TWD97 / TM2 zone 121) inverse Transverse Mercator.
function twd97ToWgs84(east,north){
  const a=6378137,b=6356752.314245,long0=121*Math.PI/180,k0=.9999,dx=250000,e2=1-(b*b)/(a*a),e1=(1-Math.sqrt(1-e2))/(1+Math.sqrt(1-e2));
  const x=east-dx,m=north/k0,mu=m/(a*(1-e2/4-3*e2**2/64-5*e2**3/256));
  const fp=mu+(3*e1/2-27*e1**3/32)*Math.sin(2*mu)+(21*e1**2/16-55*e1**4/32)*Math.sin(4*mu)+(151*e1**3/96)*Math.sin(6*mu)+(1097*e1**4/512)*Math.sin(8*mu);
  const ep2=e2/(1-e2),c1=ep2*Math.cos(fp)**2,t1=Math.tan(fp)**2,r1=a*(1-e2)/(1-e2*Math.sin(fp)**2)**1.5,n1=a/Math.sqrt(1-e2*Math.sin(fp)**2),d=x/(n1*k0);
  const lat=fp-(n1*Math.tan(fp)/r1)*(d**2/2-(5+3*t1+10*c1-4*c1**2-9*ep2)*d**4/24+(61+90*t1+298*c1+45*t1**2-252*ep2-3*c1**2)*d**6/720);
  const lng=long0+(d-(1+2*t1+c1)*d**3/6+(5-2*c1+28*t1-3*c1**2+8*ep2+24*t1**2)*d**5/120)/Math.cos(fp);
  return {lng:lng*180/Math.PI,lat:lat*180/Math.PI};
}

const areaCodes={
  '63000010':'松山區','63000020':'信義區','63000030':'大安區','63000040':'中山區','63000050':'中正區','63000060':'大同區','63000070':'萬華區','63000080':'文山區','63000090':'南港區','63000100':'內湖區','63000110':'士林區','63000120':'北投區',
  '65000010':'板橋區','65000020':'三重區','65000030':'中和區','65000040':'永和區','65000050':'新莊區','65000060':'新店區','65000070':'樹林區','65000080':'鶯歌區','65000090':'三峽區','65000100':'淡水區','65000110':'汐止區','65000120':'瑞芳區','65000130':'土城區','65000140':'蘆洲區','65000150':'五股區','65000160':'泰山區','65000170':'林口區','65000180':'深坑區','65000190':'石碇區','65000200':'坪林區','65000210':'三芝區','65000220':'石門區','65000230':'八里區','65000240':'平溪區','65000250':'雙溪區','65000260':'貢寮區','65000270':'金山區','65000280':'萬里區','65000290':'烏來區',
};
const halfWidth=value=>String(value).replace(/[０-９]/g,char=>String.fromCharCode(char.charCodeAt(0)-65248));
const normalize=value=>halfWidth(value).replace(/臺/g,'台').replace(/[\s,，。．、]/g,'').replace(/之(?=\d)/g,'-').replace(/(?:基地|旁邊|旁|對面).*$/,'');
const canonicalName=value=>normalize(value).replace(/[?？・.．_\-—]/g,'').toUpperCase();
const baseNumber=value=>[...normalize(value).matchAll(/\d+(?:-\d+)?號/g)].at(-1)?.[0]||'';
const locationOverrides={
  [canonicalName('敦年臻?')]:{displayName:'敦年臻榀'},
  [canonicalName('泉泓沐風')]:{query:'央北一路46號',display:'新北市新店區央北一路46號'},
  [canonicalName('宏盛心中央')]:{query:'央北二路108號',display:'新北市新店區央北二路108～136號'},
  [canonicalName('鳳翔')]:{query:'斯馨路80號',display:'新北市新店區斯馨路80～88號'},
  [canonicalName('江陵天碩中央特區')]:{query:'文記街10號',display:'新北市新店區文記街6～10號',displayName:'江陵天碩中央特區'},
  [canonicalName('江陵天?')]:{query:'文記街10號',display:'新北市新店區文記街6～10號',displayName:'江陵天碩中央特區'},
  [canonicalName('宏普GRAND PARK')]:{query:'央北二路、啟文路口',display:'新北市新店區央北二路、啟文路口'},
  [canonicalName('央北?禾園')]:{query:'斯馨路、順德街口',display:'新北市新店區斯馨路、順德街口',displayName:'央北瀞禾園'},
  [canonicalName('寶鈺')]:{query:'十四張路、啟文路口',display:'新北市新店區十四張路、啟文路口',lat:24.9804041,lng:121.5298946,mode:'建案官網 Google Maps 基地標記',googleMapsListing:true},
};
function loadAddressPoints(file,city){
  const result=[];
  for(const row of records(file)){
    const district=areaCodes[row['鄉鎮市區代碼']||row.areacode];if(!district)continue;
    const street=row['街路段']||row['street、road、section']||'',area=row['地區']||row.area||'',lane=row['巷']||row.lane||'',alley=row['弄']||row.alley||'',number=row['號']||row.number||'';
    if(!/^[-之０-９0-9]+號$/.test(number))continue;
    const x=Number(row['橫座標']||row.x_3826),y=Number(row['縱座標']||row.y_3826);if(!Number.isFinite(x)||!Number.isFinite(y))continue;
    result.push({city,district,street:normalize(street),address:normalize(street+area+lane+alley+number),number:baseNumber(number),...twd97ToWgs84(x,y)});
  }return result;
}
const requiredDistricts=new Set(registry.map(row=>`${row.city}${row['鄉鎮市區']}`));
const addressPoints=[...loadAddressPoints(raw('taipei-address-points.csv'),'台北市'),...loadAddressPoints(raw('newtaipei-address-points.csv'),'新北市')].filter(point=>requiredDistricts.has(`${point.city}${point.district}`));
const pointsByDistrict=new Map();
for(const point of addressPoints){const key=`${point.city}${point.district}`,group=pointsByDistrict.get(key)||[];group.push(point);pointsByDistrict.set(key,group);}
const streetsByDistrict=new Map();
for(const [district,points] of pointsByDistrict){
  const streets=new Map();
  for(const point of points){if(!point.street)continue;const group=streets.get(point.street)||[];group.push(point);streets.set(point.street,group);}
  streetsByDistrict.set(district,streets);
}
let transactionGroups=new Map();
const transactionAliases=new Map([[canonicalName('江陵天碩中央特區'),canonicalName('江陵天?')]]);
function transactionRows(name){
  const key=canonicalName(name),alias=transactionAliases.get(key);
  return transactionGroups.get(key)||transactionGroups.get(alias)||[];
}
function locate(row){
  const projectName=row['建案名稱'],override=locationOverrides[canonicalName(projectName)],target=normalize(override?.query||row['坐落街道']),districtKey=`${row.city}${row['鄉鎮市區']}`,projectId=`registry-${row.city}-${row['鄉鎮市區']}-${projectName}`;
  if(Number.isFinite(override?.lat)&&Number.isFinite(override?.lng))return {...override,displayAddress:override.display};
  const officialParcel=officialParcelsByProject.get(projectId);
  if(officialParcel)return {...officialParcel,mode:`臺北市地政局官方主地號宗地中心（${row['坐落基地']}）`,estimated:true,displayAddress:override?.display,displayName:override?.displayName};
  const matchDoorplate=(address,mode)=>{
    const normalized=normalize(address),number=baseNumber(normalized);if(!number)return null;
    const candidates=(pointsByDistrict.get(districtKey)||[]).filter(point=>point.number===number);
    const exact=candidates.find(point=>normalized===point.address||normalized.includes(point.address)||point.address.includes(normalized));if(exact)return {...exact,mode,displayAddress:override?.display,displayName:override?.displayName};
    const street=candidates.find(point=>point.street&&normalized.includes(point.street));if(street)return {...street,mode,displayAddress:override?.display,displayName:override?.displayName};
    return null;
  };
  const matchLaneRange=(address,mode)=>{
    const normalized=normalize(address).replace(/(?:對面|旁邊?|附近|口)$/,'');
    if(!/[巷弄]/.test(normalized)||baseNumber(normalized))return null;
    const street=[...(streetsByDistrict.get(districtKey)?.keys()||[])].filter(name=>normalized.includes(name)).sort((a,b)=>b.length-a.length)[0];
    const localAddress=street?normalized.slice(normalized.indexOf(street)):normalized;
    const matches=(pointsByDistrict.get(districtKey)||[]).filter(point=>point.address.includes(localAddress));
    if(!matches.length)return null;
    return {lat:matches.reduce((sum,point)=>sum+point.lat,0)/matches.length,lng:matches.reduce((sum,point)=>sum+point.lng,0)/matches.length,mode:`${mode}（${matches.length} 個官方門牌範圍）`,estimated:true,displayAddress:override?.display,displayName:override?.displayName};
  };
  const registryMatch=matchDoorplate(target,override?'後續正式門牌配對':'政府備查門牌配對');if(registryMatch)return registryMatch;
  const transactionAddresses=[...new Set(transactionRows(projectName).map(item=>item.rps02).filter(Boolean))];
  const transactionMatches=transactionAddresses.map(address=>matchDoorplate(address,'實價登錄後續門牌配對')).filter(Boolean);
  if(transactionMatches.length){
    const lat=transactionMatches.reduce((sum,point)=>sum+point.lat,0)/transactionMatches.length,lng=transactionMatches.reduce((sum,point)=>sum+point.lng,0)/transactionMatches.length;
    return {...transactionMatches[0],lat,lng,mode:`實價登錄後續門牌配對（${transactionMatches.length} 個門牌）`,displayAddress:override?.display,displayName:override?.displayName};
  }
  const laneMatch=matchLaneRange(target,'政府備查巷弄範圍定位')||transactionAddresses.map(address=>matchLaneRange(address,'實價登錄巷弄範圍定位')).find(Boolean);
  if(laneMatch)return laneMatch;
  const streetGroups=streetsByDistrict.get(districtKey);if(!streetGroups)return null;
  const names=[...streetGroups.keys()].filter(street=>street.length>=2&&target.includes(street)).sort((a,b)=>b.length-a.length);
  const first=names[0],second=names.find(name=>name!==first&&!first.includes(name)&&!name.includes(first));
  if(!first||!second)return null;
  let closest=null;
  const firstPoints=streetGroups.get(first),secondPoints=streetGroups.get(second);
  for(let a=0;a<firstPoints.length;a+=Math.max(1,Math.floor(firstPoints.length/120))){
    for(let b=0;b<secondPoints.length;b+=Math.max(1,Math.floor(secondPoints.length/120))){
      const distance=distanceMeters(firstPoints[a],secondPoints[b]);if(!closest||distance<closest.distance)closest={a:firstPoints[a],b:secondPoints[b],distance};
    }
  }
  if(!closest||closest.distance>160)return null;
  return {lat:(closest.a.lat+closest.b.lat)/2,lng:(closest.a.lng+closest.b.lng)/2,mode:`${first}／${second}路口定位`,displayAddress:override?.display,displayName:override?.displayName};
}

const radians=value=>value*Math.PI/180;
function distanceMeters(a,b){const dLat=radians(b.lat-a.lat),dLng=radians(b.lng-a.lng),value=Math.sin(dLat/2)**2+Math.cos(radians(a.lat))*Math.cos(radians(b.lat))*Math.sin(dLng/2)**2;return 6371000*2*Math.atan2(Math.sqrt(value),Math.sqrt(1-value));}
function nearestExit(point){let nearest=null;for(const exit of transitPoints){const distance=distanceMeters(point,exit);if(!nearest||distance<nearest.distance)nearest={...exit,distance};}return nearest;}
function builderInfo(value=''){
  const clean=value.replace(/股份有限公司.*/,'股份有限公司').replace(/有限公司.*/,'有限公司').trim();
  const rules=[['S',/華固|潤泰/],['A',/國揚|國泰建設|大陸建設|富邦建設|忠泰|長虹|宏盛|冠德|皇翔|遠雄|璞園|亞昕|昇陽|宏普/],['B',/興富發|達麗|茂德|甲山林|愛山林|漢皇|將捷|麗寶|寶佳|合環|敦年|馥華|新碩/]];
  const knownRating=rules.find(([,pattern])=>pattern.test(clean))?.[0];
  const developerCompany=(/(建設|建築|開發|興業|營造|地產).*(?:股份)?有限公司|(?:股份)?有限公司.*(建設|開發|興業|營造|地產)/.test(clean)||/誼盛國際|得育企業/.test(clean))&&!/建築經理|商業銀行|信託/.test(clean);
  const rating=knownRating||(developerCompany?'C':'NR');
  const ratingBasis=knownRating?'依已確認建商品牌套用本站評級':rating==='C'?'官方備查起造人可辨識為建設／開發公司；暫列 C，待更多履歷資料再調整':'官方備查有起造人，但可能是建經公司、金融機構或自然人，尚未可靠對應建商品牌';
  return {builder:`備查起造人：${clean||'尚待查證'}`,rating,ratingBasis};
}
const newTaipeiTransactions=JSON.parse(fs.readFileSync(raw('newtaipei-presale.json'),'utf8'));transactionGroups=new Map();
for(const row of newTaipeiTransactions){if(row.rps28){const key=canonicalName(row.rps28),group=transactionGroups.get(key)||[];group.push(row);transactionGroups.set(key,group);}}
function priceInfo(name){
  const rows=transactionRows(name),prices=rows.map(row=>Number(row.rps22_amountsunitdollars)*3.305785/10000).filter(value=>value>0),areas=rows.map(row=>Number(row.rps15_area)/3.305785).filter(value=>value>0);
  const average=prices.length?Math.round(prices.reduce((sum,value)=>sum+value,0)/prices.length*10)/10:null;
  return {price:average?`實登均價 ${average} 萬/坪`:'尚無可靠實登',size:areas.length?`${Math.floor(Math.min(...areas))}–${Math.ceil(Math.max(...areas))} 坪`:'尚無可靠坪數',transactionCount:rows.length};
}

const projects=[];
for(const row of registry){
  const point=locate(row),nearest=point?nearestExit(point):null;
  const walk=nearest?Math.max(1,Math.ceil(nearest.distance/65)):null,builder=builderInfo(row['起造人']),price=priceInfo(row['建案名稱']),completed=row['第1次登記日期'];
  const mapped=Boolean(point&&nearest),laterAddresses=[...new Set(transactionRows(row['建案名稱']).map(item=>item.rps02).filter(Boolean))];
  projects.push({
    id:`registry-${row.city}-${row['鄉鎮市區']}-${row['建案名稱']}`,name:point?.displayName||row['建案名稱'],city:row.city,district:row['鄉鎮市區'],station:mapped?nearest.station:'待定位',walk,address:point?.displayAddress||laterAddresses[0]||`${row.city}${row['鄉鎮市區']}${row['坐落街道']}`,...builder,
    status:completed?'近期完工':price.transactionCount?'預售中':'預售備查',completion:completed?`第一次登記 ${completed}`:'依官方備查時程',type:'預售屋',size:price.size,price:price.price,lat:mapped?point.lat:null,lng:mapped?point.lng:null,
    source:`內政部預售屋備查${mapped?`＋${point.googleMapsListing?'建案官網基地導航':'官方門牌座標'}`:''}${price.transactionCount?`＋實價登錄 ${price.transactionCount} 筆`:''}`,sourceUrl:point?.googleMapsListing?'https://www.townic.com.tw/baoyu/location':'https://data.gov.tw/dataset/176351',verified:mapped&&!point?.estimated,locationStatus:mapped?(point.estimated?'estimated':'verified'):'unlocated',googleMapsListing:point?.googleMapsListing===true,
    locationAccuracy:mapped?`${point.mode}；官方門牌座標至 ${nearest.station} 最近出口直線約 ${Math.round(nearest.distance)} 公尺，步行時間為保守估算`:'尚無可可靠配對的正式門牌或路口；案件保留於表格，暫不顯示地圖標記',governmentId:row['建造執照']||row['編號'],governmentStatus:`申報備查 ${row['申報備查日期']}`,
    permit:row['建造執照'],households:row['層棟戶數'],buildingLand:row['坐落基地'],siteGeometry:point?.siteGeometry,lines:nearest?.lines||[],
  });
}
const unique=[...new Map(projects.map(project=>[`${project.city}|${canonicalName(project.name)}|${normalize(project.address)}`,project])).values()];
unique.sort((a,b)=>a.city.localeCompare(b.city,'zh-Hant')||a.district.localeCompare(b.district,'zh-Hant')||a.name.localeCompare(b.name,'zh-Hant'));
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,`// 由 scripts/build-mature-projects.mjs 產生；請勿直接編輯。\nexport const matureRegistryProjects = ${JSON.stringify(unique,null,2)};\n`);
console.log(`Registry candidates: ${registry.length}; official address points: ${addressPoints.length}; published: ${unique.length}; mapped: ${unique.filter(project=>project.locationStatus!=='unlocated').length}; awaiting location: ${unique.filter(project=>project.locationStatus==='unlocated').length}`);
