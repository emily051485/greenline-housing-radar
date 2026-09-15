import { matureProjects } from './mature-data.js';
import { developerResearch,developerRubric } from './developer-research.js';

const ratingRank={S:4,A:3,B:2,C:1,NR:0};
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const projectCount=profile=>matureProjects.filter(project=>profile.aliases.some(alias=>String(project.builder).includes(alias))).length;
const profiles=developerResearch.map(profile=>({...profile,count:projectCount(profile)}));
const dimensions=developerRubric.map(item=>[item.label,item.key]);
const cards=document.querySelector('#developer-cards');
const countNode=document.querySelector('#developer-count');
const empty=document.querySelector('#developer-empty');

function render(){
  const query=document.querySelector('#developer-search').value.trim().toLowerCase();
  const minimum=document.querySelector('#developer-rating').value;
  const sort=document.querySelector('#developer-sort').value;
  const result=profiles.filter(profile=>(minimum==='all'||ratingRank[profile.rating]>=ratingRank[minimum])&&(!query||profile.name.toLowerCase().includes(query)));
  result.sort((a,b)=>sort==='projects'?b.count-a.count:sort==='confidence'?b.sources.length-a.sources.length:sort==='name'?a.name.localeCompare(b.name,'zh-Hant'):b.score-a.score||b.count-a.count);
  countNode.textContent=result.length;
  empty.hidden=result.length>0;
  cards.innerHTML=result.map(profile=>`<article class="developer-card">
    <header><span class="grade grade-${profile.rating.toLowerCase()}">${profile.rating}</span><div><h2>${escapeHtml(profile.name)}</h2><small>研究信心 ${profile.confidence} · 本站 ${profile.count} 案</small></div><strong>${profile.score}<small>/100</small></strong></header>
    <div class="score-bars">${dimensions.map(([label,key])=>`<div><span>${label}<b>${profile.scores[key]}</b></span><i><em style="width:${profile.scores[key]}%"></em></i></div>`).join('')}</div>
    <p class="research-summary">${escapeHtml(profile.summary)}</p>
    <p class="research-caveat"><b>判讀限制</b>${escapeHtml(profile.caveat)}</p>
    <div class="research-meta"><span>覆核 ${profile.reviewed}</span>${profile.sources.map(source=>`<a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.label)}<small>${escapeHtml(source.type)}</small></a>`).join('')}</div>
  </article>`).join('');
}

document.querySelector('#developer-search').addEventListener('input',render);
document.querySelector('#developer-rating').addEventListener('change',render);
document.querySelector('#developer-sort').addEventListener('change',render);
render();
