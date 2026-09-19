const majorRiskRecordsByName={
  '基泰建設':[
    {
      title:'大直工地鄰房下陷事件',
      detail:'臺北市政府已就基泰大直施工造成鄰房下陷案公布調查與處置資料。標籤只表示存在需查核的重大工程事件，不代表旗下每一個案都有相同問題。',
      sourceLabels:['北市府調查報告說明','施工損鄰鑑定說明'],
    },
  ],
  '嘉源建設':[
    {
      title:'停業與停工案履約風險',
      detail:'臺北市政府曾公告公司有開始營業後自行停止營業六個月以上、通知限期申復情事；消基會亦就兩案停工及價金信託保障提出警示。',
      sourceLabels:['臺北市無營業公司限期申復公告','嘉源兩案履約保障分析'],
    },
  ],
  '御翔開發建設':[
    {
      title:'個案無法依約完工',
      detail:'受託銀行公告接獲建商通知，「大安信藝館」無法依約定完工，並依信託契約處理剩餘財產分配。',
      sourceLabels:['大安信藝館無法依約完工公告'],
    },
  ],
  '豐邑建設':[
    {
      title:'豐采520周邊道路塌陷',
      detail:'新竹縣政府專案會議紀錄記載，豐采520施工造成莊敬六街道路嚴重塌陷並形成公安事件；後續責任與改善狀態仍應以主管機關最新文件為準。',
      sources:[
        {label:'新竹縣政府專案會議紀錄',url:'https://ws.hsinchu.gov.tw/Download.ashx?n=MTEyMDUxMOWwiOahiOWwj%2Be1hOacg%2BitsOiomOmMhC5wZGY%3D&u=LzAwMS9VcGxvYWQvNy9SZWxGaWxlLzEwMTk4LzI3ODg2NS8xMTIwNTEw5bCI5qGI5bCP57WE5pyD6K2w6KiY6YyELnBkZg%3D%3D',type:'新竹縣政府'},
        {label:'監察院豐采520調查報告',url:'https://www.cy.gov.tw/CyBsBoxContent2.aspx?n=718&s=49227',type:'監察院'},
      ],
    },
    {
      title:'晴空匯火災調查',
      detail:'監察院調查資料涉及電力短路及多項防火避難設施失效，本站因此將此案列為需優先閱讀的重大事件紀錄。',
      sourceLabels:['監察院晴空匯火災調查'],
    },
  ],
  '永琦國際開發':[
    {
      title:'受託銀行認定特定事由',
      detail:'受託銀行認定個案達到客觀上無法依約完工交屋的契約「特定事由」，並召開買方受益權人會議。',
      sourceLabels:['永琦見璞受益權人會議公告'],
    },
  ],
  '永豐隆建設':[
    {
      title:'信用貶落與退票紀錄',
      detail:'受託銀行曾正式公告公司發生退票等信用貶落情事；即使個案後續完工，購屋前仍應重新查核公司與履約保障現況。',
      sourceLabels:['永豐隆信用貶落信託公告'],
    },
  ],
  '莘聖建設':[
    {
      title:'六張街工地損鄰事件',
      detail:'新北市政府資料確認開挖施工期間發生鄰房受損、傾斜與住戶撤離；最終肇因及責任仍以鑑定、裁判或主管機關文件為準。',
      sourceLabels:['六張街工地損鄰處置','公安事件後開挖審查紀錄'],
    },
  ],
  '睿暘建設':[
    {
      title:'結束營業與延遲履約紀錄',
      detail:'公司已結束營業，個案曾發生延遲、起造人及契約承擔移轉；法院判決內容支持購屋人遲延利息請求。',
      sourceLabels:['睿暘建設公司登記','新北地院 115 年度重簡字第 496 號判決'],
    },
  ],
};

const limitedEvidencePattern=/資料不足|公開資料不足|揭露不足|缺少.*資料|樣本.*不足|有限.*資料|資料有限|缺乏.*資料|未見.*資料|不足以/;
const substantiveNegativePattern=/重大|無法依約|退票|停工|停業|事故|法院|裁罰|處分|判決|結束營業|信用貶落|協商不到|不實|違反|缺件|異常公告|撤銷|受損|傾斜/;

function resolveRecordSources(record,profile){
  if(record.sources)return record.sources;
  return (record.sourceLabels||[]).map(label=>profile.sources.find(source=>source.label===label)).filter(Boolean);
}

export function getDeveloperFlags(profile){
  const records=(majorRiskRecordsByName[profile.name]||[]).map(record=>({...record,sources:resolveRecordSources(record,profile)}));
  const caveat=profile.caveat||'';
  const limited=['B','C'].includes(profile.rating)&&limitedEvidencePattern.test(caveat)&&!substantiveNegativePattern.test(caveat)&&records.length===0;
  return {major:records.length>0,limited,records};
}

export const developerFlagDefinitions={
  major:{label:'重大事件／高風險紀錄',description:'有官方、司法、受託銀行或消保資料支持的重大公安、履約、營運或信用事件；不等同法院已判定責任，也不代表旗下每一個案都有相同問題。'},
  limited:{label:'資料有限，保守評分',description:'目前缺少足夠的跨案交付、品管、財務治理或售後證據，因此先採較保守分數；不是負面事件標籤。'},
};
