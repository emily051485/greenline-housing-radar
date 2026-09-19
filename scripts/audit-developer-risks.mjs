import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {developerResearch} from '../src/developer-research.js';

const scriptDir=dirname(fileURLToPath(import.meta.url));
const rootDir=resolve(scriptDir,'..');
const rawDir=resolve(rootDir,'data/raw/developer-risk-audit');
const outputFile=resolve(rootDir,'src/generated/developer-risk-audit.js');
const ftcUrl='https://www.ftc.gov.tw/internet/main/decision/decisionList.aspx?mid=11';
const environmentUrl='https://data.moenv.gov.tw/api/v2/ems_p_46';
const environmentApiKey='e75b1660-e564-4107-aad5-a8be1f905dd9';

const args=new Set(process.argv.slice(2));
const maxPagesArg=process.argv.find(value=>value.startsWith('--max-pages='));
const maxPages=maxPagesArg?Number(maxPagesArg.split('=')[1]):Infinity;
const refresh=args.has('--refresh');

const decodeHtml=value=>String(value||'')
  .replace(/<br\s*\/?\s*>/gi,' ')
  .replace(/<[^>]+>/g,' ')
  .replace(/&quot;/g,'"')
  .replace(/&#39;|&apos;/g,"'")
  .replace(/&amp;/g,'&')
  .replace(/&lt;/g,'<')
  .replace(/&gt;/g,'>')
  .replace(/&nbsp;/g,' ')
  .replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code)))
  .replace(/\s+/g,' ')
  .trim();

const parseAttributes=tag=>Object.fromEntries([...tag.matchAll(/([\w:$-]+)=(?:"([^"]*)"|'([^']*)')/g)]
  .map(match=>[match[1],decodeHtml(match[2]??match[3]??'')]));

const hiddenFields=html=>Object.fromEntries([...html.matchAll(/<input\b[^>]*type=(?:"hidden"|'hidden')[^>]*>/gi)]
  .map(match=>parseAttributes(match[0]))
  .filter(attributes=>attributes.name)
  .map(attributes=>[attributes.name,attributes.value||'']));

const parseDecisions=html=>[...html.matchAll(/<ul class="result-list">([\s\S]*?)<\/ul>/g)].map(match=>{
  const block=match[1];
  const fields=[...block.matchAll(/<li(?:\s+class="[^"]*")?>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<p>([\s\S]*?)<\/p>/g)];
  const values=Object.fromEntries(fields.map(field=>[decodeHtml(field[1]),decodeHtml(field[2])]));
  const link=block.match(/<a\s+href=(?:'([^']+)'|"([^"]+)")[^>]*title=(?:'([^']+)'|"([^"]+)")/);
  const title=decodeHtml((link?.[3]??link?.[4]??'').replace(/\.pdf$/i,''));
  return {
    date:values['發文日期']||'',
    category:values['類型']||'',
    law:values['相關法條']||'',
    title,
    url:link?.[1]??link?.[2]??'',
  };
}).filter(record=>record.title&&record.url);

const compactName=value=>String(value||'')
  .normalize('NFKC')
  .replace(/[\s·・‧,，.。()（）「」『』【】\[\]_-]/g,'')
  .trim();

const auditNames=developerResearch.map(profile=>{
  const aliases=[profile.name,...(profile.aliases||[])];
  const exactNames=[...new Set(aliases.flatMap(alias=>String(alias).split(/[／/]/)).map(compactName).filter(name=>name.length>=4))];
  return {id:profile.id,name:profile.name,aliases,exactNames};
});

const matchDecision=decision=>{
  const compactTitle=compactName(decision.title);
  return auditNames.flatMap(profile=>{
    const matchedAlias=profile.exactNames.find(alias=>compactTitle.includes(alias));
    return matchedAlias?[{id:profile.id,name:profile.name,matchedAlias}]:[];
  });
};

const matchOfficialName=text=>{
  const compactText=compactName(text);
  return auditNames.flatMap(profile=>{
    const matchedAlias=profile.exactNames.find(alias=>compactText.includes(alias));
    return matchedAlias?[{id:profile.id,name:profile.name,matchedAlias}]:[];
  });
};

async function fetchPage(baseHtml,page){
  if(page===1)return fetch(ftcUrl,{headers:{'user-agent':'greenline-housing-radar research audit/1.0'}}).then(assertResponse);
  const fields=hiddenFields(baseHtml);
  fields.__EVENTTARGET='ctl00$ContentPlaceHolder1$dl_toPage';
  fields.__EVENTARGUMENT='';
  fields['ctl00$ContentPlaceHolder1$PdfKeyWords']='';
  fields['ctl00$ContentPlaceHolder1$FormalDocDateStart']='';
  fields['ctl00$ContentPlaceHolder1$FormalDocDateEnd']='';
  fields['ctl00$ContentPlaceHolder1$CaseKindID']='';
  fields['ctl00$ContentPlaceHolder1$LawID']='';
  fields['ctl00$ContentPlaceHolder1$lawList']='';
  fields['ctl00$ContentPlaceHolder1$dl_toPage']=String(page);
  delete fields['ctl00$ContentPlaceHolder1$searchButton'];
  return fetch(ftcUrl,{
    method:'POST',
    headers:{
      'content-type':'application/x-www-form-urlencoded',
      'user-agent':'greenline-housing-radar research audit/1.0',
    },
    body:new URLSearchParams(fields),
  }).then(assertResponse);
}

async function assertResponse(response){
  if(!response.ok)throw new Error(`FTC request failed: ${response.status} ${response.statusText}`);
  return response.text();
}

async function crawlFtc(){
  await mkdir(rawDir,{recursive:true});
  const cacheFile=resolve(rawDir,'ftc-decisions.json');
  if(!refresh){
    try{return JSON.parse(await readFile(cacheFile,'utf8'));}catch{}
  }
  const firstHtml=await fetchPage('',1);
  const firstCurrent=firstHtml.match(/id="ContentPlaceHolder1_lb_currentPage"[^>]*>(\d+)\/(\d+)</);
  if(!firstCurrent)throw new Error('Unable to identify FTC page 1');
  const totalPages=Number(firstCurrent[2]);
  const pagesToScan=Math.min(totalPages,maxPages);
  const decisions=parseDecisions(firstHtml);
  process.stdout.write(`\rFTC 1/${pagesToScan}: ${decisions.length} decisions`);
  const concurrency=3;
  for(let start=2;start<=pagesToScan;start+=concurrency){
    const pageNumbers=Array.from({length:Math.min(concurrency,pagesToScan-start+1)},(_,index)=>start+index);
    const pages=await Promise.all(pageNumbers.map(async page=>{
      const html=await fetchPage(firstHtml,page);
      const current=html.match(/id="ContentPlaceHolder1_lb_currentPage"[^>]*>(\d+)\/(\d+)</);
      if(!current)throw new Error(`Unable to identify FTC page ${page}`);
      const actualPage=Number(current[1]);
      if(actualPage!==page)throw new Error(`Expected FTC page ${page}, received ${actualPage}`);
      return parseDecisions(html);
    }));
    decisions.push(...pages.flat());
    process.stdout.write(`\rFTC ${pageNumbers.at(-1)}/${pagesToScan}: ${decisions.length} decisions`);
    if(pageNumbers.at(-1)<pagesToScan)await new Promise(resolveWait=>setTimeout(resolveWait,150));
  }
  process.stdout.write('\n');
  const payload={source:ftcUrl,fetchedAt:new Date().toISOString(),pagesScanned:pagesToScan,totalPages,decisions};
  await writeFile(cacheFile,`${JSON.stringify(payload,null,2)}\n`,'utf8');
  return payload;
}

async function crawlEnvironment(){
  await mkdir(rawDir,{recursive:true});
  const cacheFile=resolve(rawDir,'environment-major-penalties.json');
  if(!refresh){
    try{return JSON.parse(await readFile(cacheFile,'utf8'));}catch{}
  }
  const records=[];
  const limit=1000;
  for(let offset=0;;offset+=limit){
    const url=new URL(environmentUrl);
    url.searchParams.set('api_key',environmentApiKey);
    url.searchParams.set('format','JSON');
    url.searchParams.set('limit',String(limit));
    url.searchParams.set('offset',String(offset));
    url.searchParams.set('filters','isimportant,EQ,是');
    const batch=JSON.parse(await fetch(url,{headers:{'user-agent':'greenline-housing-radar research audit/1.0'}}).then(assertResponse));
    records.push(...batch);
    process.stdout.write(`\rEnvironment: ${records.length} penalties`);
    if(batch.length<limit)break;
    await new Promise(resolveWait=>setTimeout(resolveWait,150));
  }
  process.stdout.write('\n');
  const payload={source:environmentUrl,fetchedAt:new Date().toISOString(),filter:'isimportant=是',records};
  await writeFile(cacheFile,`${JSON.stringify(payload,null,2)}\n`,'utf8');
  return payload;
}

const quote=value=>JSON.stringify(value,null,2);

async function main(){
  const ftc=await crawlFtc();
  const environment=await crawlEnvironment();
  const matches=[];
  for(const decision of ftc.decisions){
    for(const profile of matchDecision(decision))matches.push({...profile,...decision});
  }
  const environmentMatches=[];
  for(const record of environment.records){
    const identity=[record.fac_name,record.transgress_name].filter(Boolean).join('、');
    for(const profile of matchOfficialName(identity))environmentMatches.push({
      ...profile,
      date:record.penalty_date,
      documentNo:record.document_no,
      law:record.transgress_law,
      amount:Number(record.penalty_money)||0,
      important:record.isimportant==='是',
      facts:record.openinfor,
      subject:record.subject,
      improvement:record.is_improve,
      petitionResult:record.petition_results,
      businessName:record.transgress_name||record.fac_name,
      source:'環境部列管事業污染源裁處資料',
    });
  }
  const matchedIds=new Set(matches.map(match=>match.id));
  const environmentMatchedIds=new Set(environmentMatches.map(match=>match.id));
  const audit=developerResearch.map(profile=>({
    id:profile.id,
    name:profile.name,
    reviewed:profile.reviewed,
    ftc:{status:'checked',matches:matches.filter(match=>match.id===profile.id).length},
    environment:{status:'checked',matches:environmentMatches.filter(match=>match.id===profile.id).length},
    manualStatus:matchedIds.has(profile.id)||environmentMatchedIds.has(profile.id)?'candidate-review-required':'no-name-match',
  }));
  const generated=`// Generated by scripts/audit-developer-risks.mjs. Do not edit by hand.\n`+
    `export const developerRiskAuditMeta=${quote({
      generatedAt:new Date().toISOString(),
      developerCount:developerResearch.length,
      sources:{
        ftc:{url:ftc.source,pagesScanned:ftc.pagesScanned,totalPages:ftc.totalPages,decisionCount:ftc.decisions.length},
        environment:{url:environment.source,penaltyCount:environment.records.length},
      },
      caveat:'官方資料庫名稱比對只產生待人工確認候選；零命中不等於已證明無重大事件。',
    })};\n\n`+
    `export const developerRiskAudit=${quote(audit)};\n\n`+
    `export const developerRiskCandidates=${quote(matches)};\n\n`+
    `export const developerEnvironmentCandidates=${quote(environmentMatches)};\n`;
  await mkdir(dirname(outputFile),{recursive:true});
  await writeFile(outputFile,generated,'utf8');
  console.log(`Audited ${audit.length} developers against ${ftc.decisions.length} FTC decisions.`);
  console.log(`${matchedIds.size} developers have ${matches.length} name-match candidates requiring manual review.`);
  console.log(`${environmentMatchedIds.size} developers have ${environmentMatches.length} environmental penalty candidates.`);
}

main().catch(error=>{
  console.error(error);
  process.exitCode=1;
});
