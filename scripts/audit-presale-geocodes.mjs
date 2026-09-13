import {integratedProjects} from '../src/generated/integrated-projects.js';

const rows=integratedProjects.filter(x=>x.status==='預售中');
for(const row of rows){
  const query=encodeURIComponent(row.address.replace(/正得里|[\u3400-\u9fff]{1,4}里/g,''));
  const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=tw&q=${query}`;
  const response=await fetch(url,{headers:{'User-Agent':'greenline-housing-radar/0.1 (address verification)'}});
  const [hit]=await response.json();
  console.log(JSON.stringify({name:row.name,address:row.address,lat:hit?.lat,lng:hit?.lon,label:hit?.display_name}));
  await new Promise(resolve=>setTimeout(resolve,1100));
}
