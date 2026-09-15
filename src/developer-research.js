export const developerRubric=[
  {key:'delivery',label:'履約與推案',weight:25},
  {key:'quality',label:'工程品質制度',weight:25},
  {key:'governance',label:'財務與治理',weight:20},
  {key:'service',label:'售後與保固',weight:20},
  {key:'risk',label:'風險管理',weight:10},
];

export const ratingFromScore=score=>score>=90?'S':score>=82?'A':score>=72?'B':score>=60?'C':'NR';
export const weightedScore=scores=>Math.round(developerRubric.reduce((sum,item)=>sum+(scores[item.key]??0)*item.weight,0)/100);

// 分數依公開證據逐項人工判讀，不由品牌名稱、本站案量或既有級別反推。
// 公司自行揭露的滿意度與制度均明標為「公司揭露」，不可視為獨立品質保證。
export const developerResearch=[
  {
    id:'runtai',name:'潤泰創新',aliases:['潤泰創新','潤泰建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:94,quality:96,governance:94,service:98,risk:90},
    summary:'公開資料同時涵蓋垂直整合品管、查驗流程、量化售服績效及長期保固，證據完整度為本批最高。',
    caveat:'售服滿意度與處理天數為公司自行統計，個案仍須查驗施工、交屋與社區實際紀錄。',
    sources:[
      {label:'2024 永續報告書',url:'https://esg.rt-develop.com.tw/storage/2025/08/2024-ESG300dpi.pdf',type:'公司報告'},
      {label:'客戶關係與售服績效',url:'https://esg.rt-develop.com.tw/p66/',type:'公司揭露'},
      {label:'永續治理專區',url:'https://esg.rt-develop.com.tw/',type:'公司揭露'},
    ],
  },
  {
    id:'cathay',name:'國泰建設',aliases:['國泰建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:95,quality:93,governance:95,service:96,risk:89},
    summary:'長期推案與售後制度成熟，年報連續揭露；銷售、客變、交屋及售後均有流程化滿意度追蹤。',
    caveat:'滿意度為公司自行調查；本評分不代表每個工地、承攬商或社區均有相同表現。',
    sources:[
      {label:'公司年報',url:'https://www.cathay-red.com.tw/tw/Investor/FinanceAnnual',type:'公開財報'},
      {label:'售後永續服務',url:'https://cathaycsr.cathay-red.com.tw/pro-65/%E5%94%AE%E5%BE%8C%E6%B0%B8%E7%BA%8C%E6%9C%8D%E5%8B%99',type:'公司揭露'},
      {label:'企業永續年報',url:'https://cathayred-csr.com/pro-86/%E5%B9%B4%E5%A0%B1',type:'公司報告'},
    ],
  },
  {
    id:'huaku',name:'華固建設',aliases:['華固建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:91,quality:93,governance:93,service:89,risk:86},
    summary:'上市公司揭露與永續報告完整，具供應商考核、標準施工及專責售服制度；量化售服成效較少。',
    caveat:'制度存在不等同所有個案零缺失；購屋時仍要核對該案營造廠、保固條款及驗屋紀錄。',
    sources:[
      {label:'永續報告書',url:'https://www.huaku.com.tw/csrInfo?id=S53wtl21ivWICLmO',type:'公司報告'},
      {label:'供應商管理',url:'https://www.huaku.com.tw/csrInfo?id=gjxXhcuEjnqw1ACT',type:'公司揭露'},
      {label:'年度營業與品管說明',url:'https://www.huaku.com.tw/files/uploads/investor_shareholder/2026_shareholder_C07.pdf',type:'公開文件'},
    ],
  },
  {
    id:'kindom',name:'冠德建設',aliases:['冠德建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:90,quality:92,governance:92,service:91,risk:84},
    summary:'具集團營造整合、分級品保、自主查驗、售服部門及持續治理揭露，制度證據相當完整。',
    caveat:'「永久售後」需依個案契約理解服務範圍，不能解讀為所有修繕永久免費。',
    sources:[
      {label:'2023 永續報告書',url:'https://kindom.com.tw/file/2024/08/%E5%86%A0%E5%BE%B7%E5%BB%BA%E8%A8%AD2023%E6%B0%B8%E7%BA%8C%E5%A0%B1%E5%91%8A%E6%9B%B8.pdf',type:'公司報告'},
      {label:'客戶服務',url:'https://www.kindom.com.tw/service-contact/',type:'公司揭露'},
      {label:'投資人與治理專區',url:'https://www.kindom.com.tw/investor/',type:'公開財報'},
    ],
  },
  {
    id:'farglory',name:'遠雄建設',aliases:['遠雄建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:92,quality:89,governance:90,service:88,risk:75},
    summary:'推案履歷、供應商評鑑、材料檢測與售服系統揭露充分；風險面採較保守評分。',
    caveat:'大型集團跨期、跨案差異可能較大，品牌分數不能取代個案營造與爭議查核。',
    sources:[
      {label:'歷年永續報告書',url:'https://www.farglory-land.com.tw/esg/sustainability-report-download/',type:'公司報告'},
      {label:'產品安全制度',url:'https://www.farglory-land.com.tw/esg/product-safety/',type:'公司揭露'},
      {label:'供應商管理',url:'https://www.farglory-land.com.tw/esg/supplier-management/',type:'公司揭露'},
    ],
  },
  {
    id:'kycc',name:'國揚建設',aliases:['國揚實業','國揚建築團隊','吉揚建設','威力國際開發'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:85,quality:84,governance:88,service:83,risk:79},
    summary:'具上市公司治理及永續報告，公開資料涵蓋履約保證、驗屋交屋與客服機制。',
    caveat:'本站部分案件為「國揚建築團隊」關係公司，實際起造、營造與保固主體必須逐案確認。',
    sources:[
      {label:'2024 永續報告書',url:'https://kycc.com.tw/download/eyJpdiI6IjE0ZzBvdlhkYjBoU0R3NzdUUDV3MWc9PSIsInZhbHVlIjoiWDN1MTE2MUdCSEx4ZHBtM3h3ZFhYQT09IiwibWFjIjoiZGQxZTQ4OGVmNGU5YzhmMDFmN2YwOTUyZTJmNmY2M2RmNTFkOTg1YjYwZTE5ZThmNjA5NGJjMTFjMmUwM2VkZSIsInRhZyI6IiJ9?open=1',type:'公司報告'},
      {label:'永續治理專區',url:'https://kycc.com.tw/tw/esg/management',type:'公司揭露'},
    ],
  },
  {
    id:'highwealth',name:'興富發建設',aliases:['興富發建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:91,quality:82,governance:87,service:80,risk:72},
    summary:'案量與公開揭露充足，具品質流程、第三方完工驗證及售後機制；因跨案規模與風險差異採保守級距。',
    caveat:'公司制度與品牌案量不能直接推論單一建案品質，尤其應逐案核對營造廠、工期及交屋紀錄。',
    sources:[
      {label:'產品與品質管理',url:'https://esg.highwealth.com.tw/building/compliance',type:'公司揭露'},
      {label:'顧客服務',url:'https://esg.highwealth.com.tw/building/service',type:'公司揭露'},
      {label:'公開治理文件',url:'https://www.highwealth.com.tw/stakeholder.php?data_type=governance&page_type=governance',type:'公開財報'},
    ],
  },
  {
    id:'dali',name:'達麗建設',aliases:['達麗建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:83,quality:80,governance:87,service:79,risk:78},
    summary:'持續發布永續報告並設客服、稽核及風險管理架構；可比較的工程與售服量化成果仍較有限。',
    caveat:'目前以公司制度與公開揭露為主，尚不足以代替逐案施工品質與住戶售服經驗查核。',
    sources:[
      {label:'永續年報',url:'https://www.da-li.com.tw/page/csr/',type:'公司報告'},
      {label:'公司治理',url:'https://www.da-li.com.tw/page/da-li-management/',type:'公開財報'},
      {label:'治理與營運',url:'https://www.da-li.com.tw/page/governance-and-operations/',type:'公司揭露'},
    ],
  },
].map(profile=>{
  const score=weightedScore(profile.scores);
  return {...profile,score,rating:ratingFromScore(score)};
});

export const findDeveloperResearch=value=>{
  const text=String(value||'');
  return developerResearch.find(profile=>profile.aliases.some(alias=>text.includes(alias)))||null;
};
