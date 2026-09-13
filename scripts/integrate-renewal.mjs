import fs from 'node:fs';
import path from 'node:path';
import { applyOfficialLocations } from './official-locations.mjs';

const root=path.resolve(import.meta.dirname,'..');
const raw=JSON.parse(fs.readFileSync(path.join(root,'data/raw/taipei-renewal-cases.json'),'utf8'))[0];
const chunks=raw.replace(/^\{?/,'').replace(/\]?$/,'').split(/\},\{"ID"/).map((s,i)=>(i?'"ID"'+s:s));
const field=(s,key)=>{const m=s.match(new RegExp(`"${key}":(?:"([\\s\\S]*?)"|(null|-?\\d+(?:\\.\\d+)?))(?=,"[A-Za-z]|$)`));return m?.[1]??(m?.[2]==='null'?null:m?.[2]);};
const cases=chunks.map(s=>({ID:field(s,'ID'),Dist:field(s,'Dist'),Define:field(s,'Define'),Name:field(s,'Name'),Status:field(s,'Status'),Seat:field(s,'Seat'),Area:Number(field(s,'Area'))||null,ApprovedDate:field(s,'ApprovedDate')})).filter(x=>x.ID&&x.Name);

// 捷運站座標為 OSM 站點中心；關鍵道路只用來建立「待複核候選」，並非政府認證步行時間。
const stations=[
  {name:'松山',lat:25.0501,lng:121.5777,roads:['八德路四段','松山路','饒河街','塔悠路']},
  {name:'南京三民',lat:25.0514,lng:121.5650,roads:['南京東路五段','三民路','健康路','光復北路']},
  {name:'台北小巨蛋',lat:25.0518,lng:121.5518,roads:['南京東路四段','北寧路','敦化北路']},
  {name:'南京復興',lat:25.0520,lng:121.5440,roads:['南京東路三段','遼寧街','復興北路']},
  {name:'松江南京',lat:25.0521,lng:121.5331,roads:['南京東路二段','松江路','吉林路','伊通街']},
  {name:'中山',lat:25.0527,lng:121.5200,roads:['南京西路','中山北路一段','中山北路二段','赤峰街']},
  {name:'北門',lat:25.0517,lng:121.5134,roads:['塔城街','延平北路一段','市民大道一段']},
  {name:'西門',lat:25.0422,lng:121.5083,roads:['成都路','漢口街','峨眉街','中華路一段','衡陽路']},
  {name:'小南門',lat:25.0353,lng:121.5006,roads:['愛國西路','延平南路','廣州街']},
  {name:'中正紀念堂',lat:25.0353,lng:121.5190,roads:['羅斯福路一段','南海路','寧波東街','愛國東路']},
  {name:'古亭',lat:25.0264,lng:121.5229,roads:['羅斯福路二段','和平西路一段','和平東路一段','同安街']},
  {name:'台電大樓',lat:25.0205,lng:121.5285,roads:['羅斯福路三段','師大路','辛亥路一段']},
  {name:'公館',lat:25.0149,lng:121.5342,roads:['羅斯福路四段','汀州路三段','水源路']},
  {name:'萬隆',lat:25.0018,lng:121.5390,roads:['羅斯福路五段','萬隆街','景隆街']},
  {name:'景美',lat:24.9920,lng:121.5413,roads:['羅斯福路六段','景中街','景文街','景興路']}
];
const stationHit=text=>stations.map(st=>({st,score:st.roads.filter(r=>(text||'').includes(r)).length})).filter(x=>x.score).sort((a,b)=>b.score-a.score)[0];
const active=c=>c.Define==='自行劃定'&&Number(c.ID.slice(0,3))>=108&&!/撤回|失效|廢止|駁回/.test(c.Status||'')&&c.Seat;
const candidates=[];
for(const c of cases.filter(active)){
  const hit=stationHit(c.Seat);
  if(!hit) continue;
  const {st,score}=hit;
  const walk=score>=2?6:10;
  candidates.push({
    id:`tp-${c.ID}`,name:c.Name,city:'台北市',district:c.Dist,station:st.name,walk,
    address:(c.Seat||'').replace(/n$/,'').replace(/所圍街廓.*$/,'周邊'),builder:'申請／實施者待串接',rating:'NR',
    status:'整合／審議中',completion:'待公告',type:'都更／未開賣',size:c.Area?`基地約 ${c.Area} 公頃`:'待公告',price:'待公告',
    lat:st.lat+(Number.parseInt(c.ID.slice(-2),10)%5-2)*0.00035,lng:st.lng+(Number.parseInt(c.ID.slice(-3),10)%5-2)*0.00042,
    source:`臺北市都更 API · ${c.Status}`,sourceUrl:'https://gis.uro.taipei/UpdateAreaWebAPI/api/Case',verified:true,locationAccuracy:'未定位：目前為捷運站周邊候選點，並非基地座標',governmentId:c.ID,governmentStatus:c.Status
  });
}
const ntpc=JSON.parse(fs.readFileSync(path.join(root,'data/raw/newtaipei-renewal-approved.json'),'utf8'));
const ntpcStations=[
  {name:'大坪林',lat:24.9828,lng:121.5414,words:['寶強段','寶元段']},
  {name:'七張',lat:24.9750,lng:121.5428,words:['明德段','順安段']},
  {name:'新店區公所',lat:24.9676,lng:121.5415,words:['行政段','廣明段','光明段','文山段']},
  {name:'新店',lat:24.9579,lng:121.5376,words:['碧潭段','北宜段']}
];
for(const c of ntpc.filter(x=>x.area==='新店')){
  const years=[...(c.date||'').matchAll(/(?:^|\n)(\d{2,3})\./g)].map(m=>Number(m[1]));
  if(Math.max(0,...years)<108) continue;
  const st=ntpcStations.find(s=>s.words.some(w=>c.project.includes(w)));
  if(!st) continue;
  const n=Number(c['no.'])||0;
  candidates.push({id:`ntpc-${n}`,name:c.project,city:'新北市',district:'新店區',station:st.name,walk:10,address:c.project.match(/新店區[^土地案（(]*/)?.[0]||'新店區（地號位置待複核）',builder:'申請／實施者待串接',rating:'NR',status:'已核定／待推案',completion:'待公告',type:'都更／未開賣',size:'待公告',price:'待公告',lat:st.lat+(n%5-2)*0.00035,lng:st.lng+(n%7-3)*0.00032,source:'新北市都市更新核定成果',sourceUrl:'https://data.ntpc.gov.tw/api/datasets/60ecc055-2252-4370-bba4-ec64e37c05d5/json',verified:true,locationAccuracy:'未定位：目前為地段對應捷運站的候選點，並非基地座標',governmentId:String(n),governmentStatus:'已核定'});
}

const tag=(xml,name)=>(xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]||'').trim();
const permitXml=fs.readFileSync(path.join(root,'data/raw/taipei-building-permits-115.xml'),'utf8');
const permitRows=[...permitXml.matchAll(/<Data>([\s\S]*?)<\/Data>/g)].map(m=>m[1]);
for(const row of permitRows){
  if(!/集合住宅|住家用|住宅/.test(row)) continue;
  const address=tag(row,'地址'),hit=stationHit(address);
  if(!hit) continue;
  const no=tag(row,'執照號碼'),st=hit.st,builder=tag(row,'起造人')||'待公告';
  candidates.push({id:`permit-${no}`,name:`${no}住宅新建案`,city:'台北市',district:(address.match(/臺北市(.{2,3}區)/)?.[1]||'待確認'),station:st.name,walk:10,address,builder:`起造人：${builder}`,rating:'NR',status:'已領建照',completion:tag(row,'建築期限')||'待公告',type:'新建案／尚未備查',size:`${tag(row,'戶數')||'—'} 戶`,price:'待公告',lat:st.lat+(no.charCodeAt(no.length-2)%5-2)*0.00028,lng:st.lng+(no.length%5-2)*0.0003,source:'臺北市115年度建造執照摘要',sourceUrl:'https://data.gov.tw/dataset/128200',verified:true,locationAccuracy:'未定位：目前為道路對應捷運站的候選點，並非門牌座標',governmentId:no,governmentStatus:'已領建照'});
}

function parseCsv(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(ch===','&&!quoted){row.push(cell);cell='';}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=ch;}return rows;}
const csvRows=parseCsv(fs.readFileSync(path.join(root,'data/raw/taipei-realprice-weekly.csv'),'utf8').replace(/^\uFEFF/,''));
const headers=csvRows.shift();
const priceRows=csvRows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]||'']))).filter(r=>r.BUILD_NAME&&r.CASE_T==='預售屋');
const presales=new Map();
for(const row of priceRows){const hit=stationHit(row.LOCATION);if(!hit)continue;const key=`${row.DISTRICT}|${row.BUILD_NAME}`;const g=presales.get(key)||{rows:[],hit};g.rows.push(row);presales.set(key,g);}
for(const [key,g] of presales){const row=g.rows[0],st=g.hit.st,prices=g.rows.map(x=>Number(x.UPRICE)).filter(Boolean),areas=g.rows.map(x=>Number(x.FAREA)).filter(Boolean);const avg=prices.length?Math.round(prices.reduce((a,b)=>a+b,0)/prices.length*10)/10:null;const safe=key.replace(/[^\w\u4e00-\u9fff]/g,'-');candidates.push({id:`presale-${safe}`,name:row.BUILD_NAME,city:'台北市',district:row.DISTRICT,station:st.name,walk:10,address:row.LOCATION,builder:'建商待銷售備查資料串接',rating:'NR',status:'預售中',completion:'待公告',type:'預售屋',size:areas.length?`${Math.min(...areas)}–${Math.max(...areas)} 坪`:'待公告',price:avg?`近期均價 ${avg} 萬／坪`:'待公告',lat:st.lat+(safe.length%5-2)*0.00025,lng:st.lng+(g.rows.length%5-2)*0.00025,source:`臺北市實價周報 · ${g.rows.length} 筆近期交易`,sourceUrl:'https://data.taipei/dataset/detail?id=a9a97996-3a55-46c8-9076-e5ebdefad6dc',verified:true,locationAccuracy:'交易路段生活圈候選；座標待複核',governmentId:key,governmentStatus:'預售屋近期成交'});}

const xindianStations=[
  {name:'大坪林',lat:24.9828,lng:121.5414,roads:['民權路','北新路三段','寶橋路','文化路','建國路']},
  {name:'七張',lat:24.9750,lng:121.5428,roads:['北新路二段','明德路','民族路','中正路']},
  {name:'新店區公所',lat:24.9676,lng:121.5415,roads:['北新路一段','行政街','中興路一段','檳榔路']},
  {name:'新店',lat:24.9579,lng:121.5376,roads:['北宜路一段','新店路','光明街','文中路']}
];
const xindianRows=JSON.parse(fs.readFileSync(path.join(root,'data/raw/newtaipei-presale-xindian.json'),'utf8')).filter(r=>Number(String(r.rps07_yyymmddroc||'').slice(0,3))>=113&&r.rps28);
const xindianGroups=new Map();
for(const row of xindianRows){const hit=xindianStations.map(st=>({st,score:st.roads.filter(x=>(row.rps02||'').includes(x)).length})).find(x=>x.score);if(!hit)continue;const g=xindianGroups.get(row.rps28)||{rows:[],hit};g.rows.push(row);xindianGroups.set(row.rps28,g);}
for(const [name,g] of xindianGroups){const row=g.rows[0],st=g.hit.st,unitPrices=g.rows.map(x=>Number(x.rps22_amountsunitdollars)*3.3058/10000).filter(Boolean),areas=g.rows.map(x=>Number(x.rps15_area)/3.3058).filter(Boolean),avg=unitPrices.length?Math.round(unitPrices.reduce((a,b)=>a+b,0)/unitPrices.length*10)/10:null,safe=name.replace(/[^\w\u4e00-\u9fff]/g,'-');candidates.push({id:`ntpc-presale-${safe}`,name,city:'新北市',district:'新店區',station:st.name,walk:10,address:row.rps02,builder:'建商待銷售備查資料串接',rating:'NR',status:'預售中',completion:'待公告',type:'預售屋',size:areas.length?`${Math.floor(Math.min(...areas))}–${Math.ceil(Math.max(...areas))} 坪`:'待公告',price:avg?`近期均價 ${avg} 萬／坪`:'待公告',lat:st.lat+(safe.length%5-2)*0.00025,lng:st.lng+(g.rows.length%5-2)*0.00025,source:`新北市預售屋實價 · ${g.rows.length} 筆交易`,sourceUrl:'https://data.ntpc.gov.tw/datasets/FBAF31DB-BB76-45A5-B3EF-BC4262E196DC',verified:true,locationAccuracy:'交易路段生活圈候選；座標待複核',governmentId:name,governmentStatus:'近年預售交易'});}

// 可由公開事業計畫或公司公告交叉確認的人工覆核資料。
const nanjingCase=candidates.find(x=>x.governmentId==='113303');
if(!candidates.some(x=>x.governmentId==='103304')){
  candidates.push({id:'tp-103304',name:'潤泰南京西路案',city:'台北市',district:'大同區',station:'中山',walk:7,address:'南京西路南側，太原路、承德路一段及太原路133巷所圍街廓西側',builder:'潤泰創新（實施者／官網列案）',rating:'S',status:'整合／審議中',completion:'待公告',type:'都更／未開賣',size:'基地約 0.1117 公頃',price:'待公告',lat:25.05331,lng:121.51630,source:'臺北市都更 API＋潤泰創新官網＋北市都更審議資料',sourceUrl:'https://www.rt-develop.com.tw/tw/Case/%E9%83%BD%E5%B8%82%E6%9B%B4%E6%96%B0/default_urlOwC3Nt',verified:true,locationAccuracy:'已依官方四至街廓人工覆核；標記置於南京西路臨路側',governmentId:'103304',governmentStatus:'更新單元已核准；113 年仍有公聽會資料'});
}
if(nanjingCase){
  nanjingCase.name='南京西路市府段42地號都更案';
  nanjingCase.builder='合作金庫資產管理（實施者）／永陞建設（協議出資人）';
  nanjingCase.rating='B';
  nanjingCase.walk=6;
  nanjingCase.source='北市都更 API＋合庫／永陞公開事業計畫';
}
const putBuilder=(match,builder,rating,source,sourceUrl)=>{
  const item=candidates.find(match);
  if(!item)return;
  item.builder=builder;
  item.rating=rating;
  item.source=`${item.source}＋${source}`;
  if(sourceUrl)item.sourceUrl=sourceUrl;
};
// 都更公開資料中的「實施者」比案名反查可靠；以下只填入可逐案對上的紀錄。
putBuilder(x=>x.id==='tp-115810','有富國際實業股份有限公司（實施者）','NR','臺北市都市更新公聽會資料','https://uro.gov.taipei/');
putBuilder(x=>x.id==='tp-115617','欣聯建設開發股份有限公司（實施者）','NR','都市更新估價案例資料','https://jyapa.com/case/9');
putBuilder(x=>x.id==='tp-115514','盛隆開發建設／盛隆建設（開發團隊；實施者待公告確認）','NR','開發團隊公開專案頁','https://www.xn--yzyo98d.tw/case_detail101.htm');
putBuilder(x=>x.id==='tp-115511','青園建設股份有限公司（實施者）','NR','都市更新顧問案件資料','https://www.dtrc.com.tw/products_detail/tw/consultant/p11430/');
putBuilder(x=>x.id==='tp-115504','敦陽國際開發股份有限公司（實施者）','NR','實施者公開專案頁','https://baoqing6117.webnode.page/');
putBuilder(x=>x.id==='tp-115404'||x.id==='tp-112404','常殷建設股份有限公司（實施者）','NR','臺北市都市更新公開展覽公告','https://pwd.gov.taipei/News_Content.aspx?n=91EACE05D1CBBB6B&s=847F14E0439F4BAA&sms=572B9625A0886E9F');
putBuilder(x=>x.id==='tp-112404','常殷建設股份有限公司（實施者）','NR','臺北市都市更新公開展覽公告','https://pwd.gov.taipei/News_Content.aspx?n=91EACE05D1CBBB6B&s=847F14E0439F4BAA&sms=572B9625A0886E9F');
putBuilder(x=>x.id==='tp-115402','昇陵建設股份有限公司（實施者）','NR','臺北市更新審議辦理情形','https://uro.gov.taipei/cp.aspx?n=e06dce2a43af2b4f&s=C3AE00A5DEF20987');
putBuilder(x=>x.id==='tp-115102','玖宏建設股份有限公司（實施者）','NR','臺北市更新審議辦理情形','https://uro.gov.taipei/cp.aspx?n=e06dce2a43af2b4f&s=BA3EE8F2CE9E2977');
putBuilder(x=>x.id==='tp-114502','喆友建設股份有限公司（實施者）','NR','臺北市都市更新公開展覽公告','https://pwd.gov.taipei/News.aspx?PageSize=20&n=91EACE05D1CBBB6B&page=3&sms=572B9625A0886E9F');
putBuilder(x=>x.id==='tp-114106','玖宏建設股份有限公司（原實施者；案件已撤回）','NR','臺北市更新審議辦理情形','https://uro.gov.taipei/cp.aspx?n=e06dce2a43af2b4f&s=BA3EE8F2CE9E2977');
putBuilder(x=>x.id==='tp-114811','柏鴻土地開發建設股份有限公司（實施者）','NR','實施者公開專案頁','https://baihongdougengan.webnode.page/');
putBuilder(x=>x.id==='tp-114807','華南金資產管理股份有限公司（實施者）','NR','臺北市都市更新公開展覽公告','https://uro.gov.taipei/News.aspx?n=C881AFD2F755EAC7&sms=F7803FDCDEB8E254');
putBuilder(x=>x.id==='tp-108402','興富發建設股份有限公司（實施者）','A','臺北市都市更新核定案件資料','https://uro.gov.taipei/');
putBuilder(x=>x.governmentId==='114717','璞真建設（都市更新實施者）','A','北市都更公開展覽公告');
putBuilder(x=>x.name==='國揚光河','國揚建設／吉揚建設（投資興建）','A','國揚建設官網／建案官網');
const kuoyangRiver=candidates.find(x=>x.name==='國揚光河');
if(kuoyangRiver){
  Object.assign(kuoyangRiver,{
    station:'大坪林',
    walk:12,
    address:'新北市新店區寶橋路235巷167號旁（建築基地；非寶中路接待中心）',
    builder:'國揚建築團隊－吉揚建設（投資興建）',
    completion:'預計 2030 年',
    size:'22–47 坪',
    lat:24.9845897,
    lng:121.5511010,
    source:'新北市預售屋實價＋國揚建設官網＋國揚光河建案官網＋Google Maps 建築基地',
    sourceUrl:'https://www.kycc.com.tw/tw/projects/%E7%86%B1%E9%8A%B7%E5%BB%BA%E6%A1%88%28%E4%BD%8F%E5%AE%85%29/%E5%9C%8B%E6%8F%9A%E5%85%89%E6%B2%B3',
    locationAccuracy:'已交叉核對官方基地地址與 Google Maps「國揚光河建築基地」標記；接待中心在寶中路72號，未拿來當基地座標',
    governmentStatus:'預售中；113店建字第00233號',
  });
}
putBuilder(x=>x.name==='合環LANDMARK','合銘建設（合環建設機構）','B','合環建設機構官網');
putBuilder(x=>x.name==='佳元柒章','佳元建設（投資興建）','B','佳元建設官網');
putBuilder(x=>x.name==='國賓皇琚','國賓地產（投資興建）','B','臺北市建築師公會個案資料');
putBuilder(x=>x.name==='澤暘松江','澤暘建設（投資興建）','B','澤暘松江官方網站／建照資料');
putBuilder(x=>x.name==='上陽羅斯福','上陽建設（都市更新實施者）','B','北市都更公聽會資料／營造商作品資料');
putBuilder(x=>x.name.startsWith('睿泰'),'睿泰建設（投資興建）','B','睿泰絵官方網站／預售公開資料');
const ruitaiCase=candidates.find(x=>x.name.startsWith('睿泰'));
if(ruitaiCase){
  Object.assign(ruitaiCase,{
    name:'睿泰絵。',
    address:'臺北市中山區中山北路一段53巷32號旁',
    station:'中山',
    walk:10,
    lat:25.0486364,
    lng:121.5239821,
    completion:'預計 2031 年第 1 季',
    size:'16–30 坪',
    locationAccuracy:'已依建案官網門牌、Google Maps 及 OSM 施工基地（way 1536807726）人工覆核',
    governmentId:'112建字第0275號',
  });
}
putBuilder(x=>x.name==='全球新創科技中心','威力國際開發（國揚建築團隊）','A','國揚建設官網');
putBuilder(x=>x.name.startsWith('崧'),'弘新建設／燾鼎建設（投資興建）','B','利晉・崧喆官方網站／預售公開資料');
const songzheCase=candidates.find(x=>x.name.startsWith('崧'));
if(songzheCase)songzheCase.name='利晉・崧喆';
putBuilder(x=>x.name==='松捷樂','花漾有限公司（投資興建）','C','臺北市預售契約資料／建案公開資料');
putBuilder(x=>x.name==='南海敘','左耳開發建設（投資興建）','C','左耳開發建設官網／建照資料');
putBuilder(x=>x.name==='友座明明德','喆友建設（友座建築團隊，投資興建）','B','新店地政預售契約／備查清冊');
putBuilder(x=>x.name==='大坪林ONE','長榮久盟開發建設（投資興建）','B','建案公開資料／建造執照');

// 正式案名／完整門牌的座標覆核。這裡只存建築基地或門牌位置，不能以接待中心代替。
const setVerifiedLocation=(match,patch)=>{
  const item=candidates.find(match);
  if(!item)return;
  Object.assign(item,patch,{verified:true,locationStatus:patch.locationStatus||'verified'});
};
setVerifiedLocation(x=>x.name==='國賓皇琚',{
  station:'雙連',walk:6,address:'臺北市中山區中山北路二段63號（原台北國賓大飯店基地）',
  builder:'國賓大飯店（起造／開發）',rating:'B',lat:25.0564607,lng:121.5233065,
  size:'95–124 坪',completion:'預計 2028 年',
  source:'臺北市預售實價＋中山北路二段63號門牌＋國賓大飯店改建公開資料',
  sourceUrl:'https://www.plex.com.tw/projects/view/id/4215',
  locationAccuracy:'已依實價登錄門牌、原台北國賓大飯店基地及 Google Maps 門牌座標交叉覆核',
});
setVerifiedLocation(x=>x.name==='利晉・崧喆',{
  station:'松山',walk:6,lat:25.0500062,lng:121.5716945,
  address:'臺北市松山區八德路四段499號一帶（銷售會館／基地公開位置）',
  sourceUrl:'https://newlandmark.com.tw/',
  locationAccuracy:'已依建案官網 Google Maps 導航點覆核；基地出入口完工後仍須重算步行時間',
});
setVerifiedLocation(x=>x.name==='上陽羅斯福',{
  station:'景美',walk:4,lat:24.9930606,lng:121.5405316,
  locationAccuracy:'已依羅斯福路六段228號旁及 Google Maps「上陽羅斯福建築基地」標記覆核',
});
setVerifiedLocation(x=>x.name==='澤暘松江',{
  station:'松江南京',walk:8,lat:25.0469021,lng:121.5331482,
  completion:'預計 2029 年下半年',size:'13–27 坪',
  sourceUrl:'https://newhouse.591.com.tw/138889/detail',
  locationAccuracy:'已依松江路23-5號基地門牌與 Google Maps 相鄰門牌座標覆核',
});
setVerifiedLocation(x=>x.name==='松捷樂',{
  station:'松山',walk:5,lat:25.0501608,lng:121.5742946,
  locationAccuracy:'已依八德路四段599號完整門牌及 Google Maps 門牌座標覆核',
});
setVerifiedLocation(x=>x.name==='南海敘',{
  station:'小南門',walk:11,lat:25.0287316,lng:121.5079611,
  locationAccuracy:'已依南海路93巷10弄10號完整門牌及 Google Maps 門牌座標覆核',
});
setVerifiedLocation(x=>x.name==='合環LANDMARK',{
  station:'七張',walk:5,lat:24.9754446,lng:121.5458099,
  completion:'2025 年第 4 季完工',size:'29–76 坪',
  sourceUrl:'https://www.hehuangroup.com/hot_case.aspx?id=62',
  locationAccuracy:'已依合環官網、新店家樂福旁基地描述、寶橋路77號及 Google Maps 門牌座標覆核',
});
setVerifiedLocation(x=>x.name==='佳元柒章',{
  station:'七張',walk:3,lat:24.9748528,lng:121.5441282,
  locationAccuracy:'已依正式案名與 Google Maps 建案標記覆核',
});
setVerifiedLocation(x=>x.name==='全球新創科技中心',{
  station:'大坪林',walk:12,lat:24.9845897,lng:121.5511010,
  completion:'預計 2030 年',size:'85–550 坪',
  sourceUrl:'https://www.kycc.com.tw/tw/projects/%E7%86%B1%E9%8A%B7%E5%BB%BA%E6%A1%88%28%E5%BB%A0%E8%BE%A6%29/%E5%85%A8%E7%90%83%E6%96%B0%E5%89%B5%E7%A7%91%E6%8A%80%E4%B8%AD%E5%BF%83',
  locationStatus:'block',
  locationAccuracy:'已定位至官方所載寶橋路235巷167號旁之單元5共同基地；住宅／廠辦棟別界線待地籍套繪',
});
setVerifiedLocation(x=>x.name==='友座明明德',{
  station:'七張',walk:2,lat:24.9759268,lng:121.5426991,
  locationAccuracy:'已依正式案名與 Google Maps 建案標記覆核',
});
setVerifiedLocation(x=>x.name==='大坪林ONE',{
  station:'大坪林',walk:5,lat:24.9795870,lng:121.5412090,
  locationAccuracy:'已依正式案名與 Google Maps 建案標記覆核',
});

setVerifiedLocation(x=>x.governmentId==='115建字第0005號',{
  lat:25.0472696,lng:121.5091465,station:'北門',walk:8,
  locationAccuracy:'已依中華路一段18巷2號完整門牌及 Google Maps 門牌座標覆核',
});
setVerifiedLocation(x=>x.governmentId==='115建字第0062號',{
  lat:25.0303985,lng:121.5203043,station:'古亭',walk:6,
  locationAccuracy:'已依羅斯福路一段123號完整門牌及 Google Maps 門牌座標覆核',
});
setVerifiedLocation(x=>x.governmentId==='115建字第0068號',{
  lat:25.0270888,lng:121.5215059,station:'古亭',walk:2,
  locationAccuracy:'已依和平西路一段11號完整門牌及 Google Maps 門牌座標覆核',
});
setVerifiedLocation(x=>x.governmentId==='115建字第0073號',{
  lat:25.0264786,lng:121.5336888,station:'台電大樓',walk:9,
  locationAccuracy:'已依和平東路一段189號完整門牌及 Google Maps 門牌座標覆核',
});
setVerifiedLocation(x=>x.governmentId==='115建字第0099號',{
  lat:25.0479866,lng:121.5319162,station:'松江南京',walk:7,
  locationAccuracy:'已依松江路46巷15號完整門牌及 Google Maps 門牌座標覆核',
});

// 115 年建照的開放資料會遮蔽起造人；僅在執照號、地址／地號、戶數及
// 建築師能與建案官網或都更核定資料交叉吻合時，才補上品牌建商。
putBuilder(x=>x.governmentId==='115建字第0062號','敦年建設（投資興建）','B','敦年臻榀官網／建案公開資料');
const duenNien=candidates.find(x=>x.governmentId==='115建字第0062號');
if(duenNien)duenNien.name='敦年臻榀';
putBuilder(x=>x.governmentId==='115建字第0086號','福隆建設（都市更新實施者）','B','臺北市都更核定案／審議會紀錄');

// 新北市已核定案件：以核定公告、審議紀錄中的「實施者」為準。
putBuilder(x=>x.id==='ntpc-35','住都建設開發（都市更新實施者）','B','新北市都市更新實錄');
putBuilder(x=>x.id==='ntpc-53','湯泉國際開發（都市更新實施者）','B','新北市都更自辦公聽會／核定公告');
putBuilder(x=>x.id==='ntpc-73','福隆建設（都市更新實施者）','B','新北市都更核定公告／完工案件清冊');
putBuilder(x=>x.id==='ntpc-81','冠德建設（公辦都更實施者）','A','新北市新店行政生活園區官方專頁');
putBuilder(x=>x.id==='ntpc-96','合銘建設（都市更新實施者）','B','新北市政府核定公告');
putBuilder(x=>x.id==='ntpc-157','大將開發（都市更新實施者）','B','新北市政府核定公告');
putBuilder(x=>x.id==='ntpc-179','總行營造興業（都市更新實施者）','B','新北市政府核定公告');
putBuilder(x=>x.id==='ntpc-214','新店區行政段236地號等2筆土地都市更新會（實施者）','NR','新北市政府核定公告');
putBuilder(x=>x.id==='ntpc-224','東基開發建設（都市更新實施者）','B','新北市都更審議會紀錄');
putBuilder(x=>x.id==='ntpc-227','喆友建設（都市更新實施者）','B','新北市都更案件資訊查詢');
putBuilder(x=>x.id==='ntpc-241','玖恩建設（都市更新實施者）','B','新北市都更審議會紀錄');
putBuilder(x=>x.id==='ntpc-242','旭泰開發（都市更新實施者）','B','新北市市有土地參與都更進度表');

const completedApproved=new Map([
  ['ntpc-73',{status:'已完工',completion:'2022 年完工',governmentStatus:'已完工（政府清冊）'}],
  ['ntpc-81',{name:'新店行政生活園區',status:'已完工',completion:'2020-11-18 落成',governmentStatus:'已完工／已落成'}],
]);
for(const item of candidates){if(completedApproved.has(item.id))Object.assign(item,completedApproved.get(item.id));}
candidates.push({id:'ntpc-ronggong-unit2',name:'新店榮工廠更新單元二',city:'新北市',district:'新店區',station:'大坪林',walk:11,address:'寶中路95號正大尼龍廠區；裕隆城北側、未來Y5公園預定地旁',builder:'華固建設（都市更新實施者）',rating:'S',status:'整合／審議中',completion:'待公告',type:'都更／住宅＋產業複合',size:'更新單元約 6.46 公頃',price:'待公告',lat:24.98155,lng:121.54855,source:'新北市都更／都市計畫資料＋南環段 Y5 官方站址＋事業計畫',sourceUrl:'https://www.dorts.ntpc.gov.tw/about/routeInfo/bQw92Vzy2jOk',verified:true,locationAccuracy:'已依寶元段210地號等54筆、寶中路95號廠區及官方配置圖人工覆核；至大坪林站步行約11分鐘，仍須依實際出入口複核',governmentId:'榮工廠更新單元2',governmentStatus:'第二次公開展覽／審議中'});

// 上市建商官網／法說會先行揭露，但尚未進入預售備查資料的未來案。
// 此層可補政府案名尚未帶出品牌建商的缺口，且仍須與政府地號及街廓交叉確認。
if(!candidates.some(x=>x.governmentId==='寶元段392地號等24筆')){
  candidates.push({
    id:'builder-ruentex-baozhong',name:'潤泰新店寶中路案',city:'新北市',district:'新店區',station:'大坪林',walk:12,
    address:'寶中路以北、寶中路93巷以西、寶元路二段以東街廓',builder:'潤泰創新（都市更新實施者）',rating:'S',
    status:'整合／審議中',completion:'待公告',type:'都更／未開賣',size:'基地約 1,226.94 坪；規劃約 27–65 坪',price:'待公告',
    lat:24.9810,lng:121.5466,
    source:'潤泰創新官網＋新北市都更審議資料＋公開資訊觀測站重大訊息',
    sourceUrl:'https://www.rt-develop.com.tw/tw/Case/%E9%83%BD%E5%B8%82%E6%9B%B4%E6%96%B0/default_urlFTo4n9',verified:true,
    locationAccuracy:'已依政府審議案地號與官方街廓四至人工覆核；標記置於更新街廓中心，非未來建物入口',
    governmentId:'寶元段392地號等24筆',governmentStatus:'事業計畫第6次專案小組審議（2025-08）',corporateDisclosure:true,
  });
}
// S-grade builder audit: builder, parcel/block and process must all have sources.
const disclosedSProjects=[
  {
    id:'builder-ruentex-sanyuan',name:'潤泰三元街案',city:'台北市',district:'中正區',station:'小南門',walk:15,
    address:'三元街、和平西路二段70巷所圍街廓',builder:'潤泰創新（都市更新實施者）',rating:'S',
    status:'整合／審議中',completion:'待公告',type:'都更／未開賣',size:'永昌段四小段46-4地號等116筆；產品待公告',price:'待公告',
    lat:25.02785,lng:121.51085,source:'潤泰創新官網＋都市更新事業計畫公聽會資料',
    sourceUrl:'https://www.rt-develop.com.tw/tw/Case/%E9%83%BD%E5%B8%82%E6%9B%B4%E6%96%B0/default_url9mCpXF',verified:true,
    locationAccuracy:'已依官方地號與三元街、和平西路二段70巷街廓覆核；步行時間為基地中心至小南門站保守估計，入口確定後需重算',
    governmentId:'永昌段四小段46-4地號等116筆',governmentStatus:'事業計畫暨權利變換計畫公聽會（2025-11）',corporateDisclosure:true,
  },
  {
    id:'builder-ruentex-bade4',name:'潤泰八德路四段案',city:'台北市',district:'松山區',station:'松山',walk:8,
    address:'塔悠路、八德路四段、八德路四段453巷所圍街廓',builder:'潤泰創新（都市更新實施者）',rating:'S',
    status:'整合／審議中',completion:'待公告',type:'都更／未開賣',size:'寶清五小段179地號等12筆；產品待公告',price:'待公告',
    lat:25.04935,lng:121.56945,source:'潤泰創新官網＋臺北市現有巷道廢止／都更資料',
    sourceUrl:'https://www.rt-develop.com.tw/tw/Case/%E9%83%BD%E5%B8%82%E6%9B%B4%E6%96%B0/default_urlPz5Xy6',verified:true,
    locationAccuracy:'已依官方地號及塔悠路、八德路四段453巷街廓覆核；標記置於街廓中心，未代表未來出入口',
    governmentId:'寶清五小段179地號等12筆',governmentStatus:'都市更新事業計畫推進中',corporateDisclosure:true,
  },
  {
    id:'builder-jut-nanjing109',name:'忠泰南京東路三段案',city:'台北市',district:'中山區',station:'南京復興',walk:7,
    address:'南京東路三段與南京東路三段109巷交叉口街廓',builder:'忠泰建設（都市更新實施者）',rating:'A',
    status:'整合／審議中',completion:'待公告',type:'都更／未開賣',size:'長春段二小段849地號等27筆；產品待公告',price:'待公告',
    lat:25.05215,lng:121.53965,source:'臺北市政府第二次公開展覽公告＋都市更新規劃資料',
    sourceUrl:'https://www.gov.taipei/News_Content.aspx?n=34D693182716CD30&s=5EE3845AA05BE94E&sms=572B9625A0886E9F',verified:true,
    locationAccuracy:'已依官方地號及南京東路三段、109巷街廓覆核；標記置於街廓中心，未代表未來出入口',
    governmentId:'長春段二小段849地號等27筆',governmentStatus:'第二次公開展覽／公聽會（2026-08）',corporateDisclosure:true,
  },
  {
    id:'builder-chonghong-international-garden',name:'長虹國際名園都更案',city:'台北市',district:'松山區',station:'南京復興',walk:8,
    address:'慶城街61–73號國際名園基地',builder:'長虹建設（合建／都市更新）',rating:'A',
    status:'整合／審議中',completion:'待公告',type:'都更／未開賣',size:'基地約1,702坪；敦化段一小段23地號',price:'待公告',
    lat:25.05575,lng:121.54480,source:'長虹建設都更專區＋2025公開說明書',
    sourceUrl:'https://chonghong.com.tw/case/%E3%80%90%E9%83%BD%E6%9B%B4%E6%A1%88%E4%BB%B6%E3%80%91%E5%8F%B0%E5%8C%97%E5%B8%82%E6%9D%BE%E5%B1%B1%E5%8D%80%E6%95%A6%E5%8C%96%E6%AE%B5%E4%B8%80%E5%B0%8F%E6%AE%B523%E5%9C%B0%E8%99%9F1%E7%AD%86',verified:true,
    locationAccuracy:'已依地號及既有國際名園門牌覆核；標記置於既有社區基地中心，未代表未來出入口',
    governmentId:'敦化段一小段23地號',governmentStatus:'規劃中；2025-10仍有都更會議文件',corporateDisclosure:true,
  },
];
for(const project of disclosedSProjects){
  if(!candidates.some(x=>x.governmentId===project.governmentId))candidates.push(project);
}

// 批次串接都市更新處的行政區審議表。用「地段＋小段＋主地號」比對，
// 不使用模糊案名，以免把鄰近但不同基地的實施者套錯。
const reviewPages={
  songshan:['taipei-review-songshan.html','6CD91553578D1CE8'],
  xinyi:['taipei-review-xinyi.html','C1FEB2DEC57919C7'],
  wenshan:['taipei-review-wenshan.html','BA69AA1A2C1EE034'],
  datong:['taipei-review-datong.html','B8C5DB6074AAFE30'],
  daan:['taipei-review-daan.html','C21E0D057C081F16'],
  zhongshan:['taipei-review-zhongshan.html','C3AE00A5DEF20987'],
  zhongzheng:['taipei-review-zhongzheng.html','8433D11627F87AA5'],
  wanhua:['taipei-review-wanhua.html','BA3EE8F2CE9E2977'],
};
const plainHtml=value=>value.replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const parcelSignature=value=>{
  const match=(value||'').match(/(?:市|區)([\u4e00-\u9fff]{2,4}段[一二三四五六七八九十]*小段)(\d+(?:-\d+)?)地號/);
  return match?`${match[1]}|${match[2]}`:null;
};
const officialImplementers=new Map();
for(const [file,sectionId] of Object.values(reviewPages)){
  const filePath=path.join(root,'data/raw',file);
  if(!fs.existsSync(filePath)||!fs.statSync(filePath).size)continue;
  const html=fs.readFileSync(filePath,'utf8');
  for(const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)){
    const cells=[...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(match=>plainHtml(match[1]));
    if(cells.length<6||!cells[4])continue;
    const signature=parcelSignature(cells[2]);
    if(signature&&!officialImplementers.has(signature))officialImplementers.set(signature,{builder:cells[4],status:cells[5],sectionId});
  }
}
let officialBuilderMatches=0;
for(const item of candidates){
  if(item.builder!=='申請／實施者待串接')continue;
  const official=officialImplementers.get(parcelSignature(item.name));
  if(!official)continue;
  item.builder=`${official.builder}（實施者）`;
  item.source=`${item.source}＋臺北市更新審議辦理情形`;
  item.sourceUrl=`https://uro.gov.taipei/cp.aspx?n=E06DCE2A43AF2B4F&s=${official.sectionId}`;
  item.governmentStatus=official.status;
  item.builderVerified=true;
  officialBuilderMatches++;
}

// 公司級評等：同一品牌跨案件採同一評等。C 是「已確認開發主體、但公開
// 完工履歷／財務透明度較有限」的暫評，不代表工程品質不良。
const companyRatings=[
  ['S',/潤泰|華固/,'大型品牌建商，具長期公開推案與財務／集團資料'],
  ['A',/璞真|璞園|瓏山林|達欣工程|國美建設|新美齊|興富發|冠德|國揚|忠泰|長虹/,'大型或具代表性品牌，公開實績充分'],
  ['B',/欣聯|青園|常殷|喆友|富品|全坤|大方建設|四方開發|新潤|友座|立信|廣宇|久揚|聖得福/,'已確認多案實績或既有品牌推案紀錄'],
  ['C',/有富國際|敦陽國際|昇陵|玖宏|柏鴻|森原|熙鼎|親嘉|筑鴻合|承閎|駿富|聯泰|維陽|智城|雄域|東大成|立詠|筑丰|桓茂/,'已確認實施者；公開可核對的完工履歷或財務資訊較有限'],
];
const nonBuilder=/待公告確認|都市更新會|資產管理|建築經理|都市更新股份有限公司|大魯閣實業|秝新股份|臺北市政府|住宅及都市更新中心/;
for(const item of candidates){
  if(item.rating!=='NR'||nonBuilder.test(item.builder))continue;
  const matched=companyRatings.find(([,pattern])=>pattern.test(item.builder));
  if(matched){
    item.rating=matched[0];
    item.ratingBasis=matched[2];
    continue;
  }
  if(/建設|開發|營造|工程|興業/.test(item.builder)&&!/待串接|待查|○/.test(item.builder)){
    item.rating='C';
    item.ratingBasis='暫評：已確認實施者，但尚缺足夠公開實績可升評 B；不代表品質不良';
  }
}

// 未評等不是最低等級；保留可稽核的原因，避免把非建商角色硬塞進 C 級。
for(const item of candidates){
  if(item.rating!=='NR'||item.ratingBasis)continue;
  if(item.builder==='申請／實施者待串接'){
    item.ratingBasis='待查：目前官方審議表尚未公布或尚無法以地段主地號精確連結實施者';
  }else if(/^起造人：.*○/.test(item.builder)){
    item.ratingBasis='待查：建照開放資料遮罩起造人名稱，須等公會推案表、備查資料或現場工程告示牌交叉確認';
  }else if(/都市更新會/.test(item.builder)){
    item.ratingBasis='不評等：目前實施者為地主自組都市更新會，不等同品牌建商';
  }else if(/建築經理|資產管理|都市更新股份有限公司/.test(item.builder)){
    item.ratingBasis='不評等：目前查得的是建經、資產管理或都更執行角色，尚不能視為實際品牌建商';
  }else{
    item.ratingBasis='待查：已取得案件角色名稱，但尚無足夠證據確認實際品牌建商及其公司級評等';
  }
}

// 禁止把公式產生的捷運站附近偏移點誤標為基地。只有人工／門牌／街廓覆核者可上地圖。
const officialLocations=applyOfficialLocations(candidates,root);
for(const item of candidates){
  const located=/^已/.test(item.locationAccuracy||'');
  item.locationStatus=item.locationStatus||(located?'verified':'unlocated');
  item.verified=item.locationStatus!=='unlocated';
}

const output=`// 由 scripts/integrate-renewal.mjs 產生；請勿手動編輯。\nexport const integratedProjects = ${JSON.stringify(candidates,null,2)};\n`;
fs.mkdirSync(path.join(root,'src/generated'),{recursive:true});
fs.writeFileSync(path.join(root,'src/generated/integrated-projects.js'),output);
const counts=Object.fromEntries([...new Set(candidates.map(x=>x.status))].map(s=>[s,candidates.filter(x=>x.status===s).length]));
console.log(`政府都更原始案件 ${cases.length} 筆；整合後綠線候選 ${candidates.length} 筆。`,counts);
console.log(`官方主地號定位套用 ${officialLocations.applied} 筆（可用宗地 ${officialLocations.available} 筆）。`);
console.log(`官方審議表補得實施者 ${officialBuilderMatches} 筆；可比對審議列 ${officialImplementers.size} 筆。`);
