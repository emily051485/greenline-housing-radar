import { matureProjects } from './mature-data.js';

const ratingRank={S:4,A:3,B:2,C:1,NR:0};
const ratingBase={S:95,A:85,B:75,C:65,NR:45};
const ratingBands={S:[90,99],A:[80,89],B:[70,79],C:[60,69],NR:[40,59]};
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const clamp=value=>Math.max(0,Math.min(100,Math.round(value)));
const companyName=value=>String(value||'').replace(/^備查起造人[：:]\s*/,'').trim();
const isDeveloper=name=>/(建設|開發|創新|建築|國泰|潤泰|華固|璞園|宏盛|遠雄|甲山林|愛山林)/.test(name)&&!/(建築經理|都市更新會|等\d*人)/.test(name);
const hasSize=project=>project.size&&!/尚無|待/.test(project.size);
const hasPrice=project=>project.price&&!/尚無|待定/.test(project.price);
const maturity=project=>/預售中|近期完工|已領建照/.test(project.status);
const locationScore=project=>project.locationStatus==='verified'?100:project.locationStatus==='estimated'?65:25;

function buildProfiles(){
  const groups=new Map();
  for(const project of matureProjects){
    const name=companyName(project.builder);
    if(!name||project.rating==='NR'||!isDeveloper(name))continue;
    const profile=groups.get(name)||{name,rating:project.rating,projects:[]};
    profile.projects.push(project);
    if(ratingRank[project.rating]>ratingRank[profile.rating])profile.rating=project.rating;
    groups.set(name,profile);
  }
  return [...groups.values()].map(profile=>{
    const count=profile.projects.length;
    const transparency=clamp(profile.projects.reduce((sum,item)=>sum+(hasSize(item)?45:0)+(hasPrice(item)?35:0)+(item.sourceUrl?20:0),0)/count);
    const volume=clamp(32+Math.log2(count+1)*19);
    const mature=clamp(profile.projects.filter(maturity).length/count*100);
    const location=clamp(profile.projects.reduce((sum,item)=>sum+locationScore(item),0)/count);
    const evidence=transparency*.35+volume*.25+mature*.15+location*.25;
    const [minimum,maximum]=ratingBands[profile.rating];
    const score=minimum+Math.round(evidence/100*(maximum-minimum));
    return {...profile,count,transparency,volume,mature,location,score};
  });
}

const profiles=buildProfiles();
const cards=document.querySelector('#developer-cards');
const countNode=document.querySelector('#developer-count');
const empty=document.querySelector('#developer-empty');
const dimensions=[['品牌基準','brand'],['資料透明','transparency'],['推案樣本','volume'],['案件成熟','mature'],['定位證據','location']];

function render(){
  const query=document.querySelector('#developer-search').value.trim().toLowerCase();
  const minimum=document.querySelector('#developer-rating').value;
  const sort=document.querySelector('#developer-sort').value;
  const result=profiles.filter(profile=>(minimum==='all'||ratingRank[profile.rating]>=ratingRank[minimum])&&(!query||profile.name.toLowerCase().includes(query)));
  result.sort((a,b)=>sort==='projects'?b.count-a.count:sort==='transparency'?b.transparency-a.transparency:sort==='name'?a.name.localeCompare(b.name,'zh-Hant'):b.score-a.score||b.count-a.count);
  countNode.textContent=result.length;
  empty.hidden=result.length>0;
  cards.innerHTML=result.map(profile=>{
    const values={brand:ratingBase[profile.rating],transparency:profile.transparency,volume:profile.volume,mature:profile.mature,location:profile.location};
    const projectNames=profile.projects.slice(0,5).map(item=>escapeHtml(item.name)).join('、');
    return `<article class="developer-card">
      <header><span class="grade grade-${profile.rating.toLowerCase()}">${profile.rating}</span><div><h2>${escapeHtml(profile.name)}</h2><small>本站收錄 ${profile.count} 案</small></div><strong>${profile.score}<small>/100</small></strong></header>
      <div class="score-bars">${dimensions.map(([label,key])=>`<div><span>${label}<b>${values[key]}</b></span><i><em style="width:${values[key]}%"></em></i></div>`).join('')}</div>
      <p><b>收錄建案</b>${projectNames}${profile.count>5?` 等 ${profile.count} 案`:''}</p>
      <a href="../greater-taipei/#projects">回建案頁篩選查看</a>
    </article>`;
  }).join('');
}

document.querySelector('#developer-search').addEventListener('input',render);
document.querySelector('#developer-rating').addEventListener('change',render);
document.querySelector('#developer-sort').addEventListener('change',render);
render();
