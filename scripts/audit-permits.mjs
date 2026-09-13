import fs from 'node:fs';

const xml=fs.readFileSync('data/raw/taipei-building-permits-115.xml','utf8');
const wanted=new Set(['0005','0008','0036','0062','0068','0073','0086','0096','0099']);
const tag=(row,name)=>row.match(new RegExp(`<${name}>(.*?)</${name}>`,'s'))?.[1]||'';
for(const match of xml.matchAll(/<Data>([\s\S]*?)<\/Data>/g)){
  const row=match[1];
  const no=tag(row,'執照號碼');
  if(![...wanted].some(id=>no.includes(id)))continue;
  console.log(JSON.stringify({
    no,
    address:tag(row,'地址'),
    parcel:tag(row,'地段號'),
    owner:tag(row,'起造人'),
    designer:tag(row,'設計人'),
    households:tag(row,'戶數'),
  }));
}
