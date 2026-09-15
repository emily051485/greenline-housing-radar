export const developerRubric=[
  {key:'delivery',label:'履約與推案',weight:25},
  {key:'quality',label:'工程品質制度',weight:25},
  {key:'governance',label:'財務與治理',weight:20},
  {key:'service',label:'售後與保固',weight:20},
  {key:'risk',label:'風險管理',weight:10},
];

export const ratingFromScore=score=>score>=90?'S':score>=82?'A':score>=72?'B':'C';
export const weightedScore=scores=>Math.round(developerRubric.reduce((sum,item)=>sum+(scores[item.key]??0)*item.weight,0)/100);

// 預售備查的「起造人」可能是建經、銀行、政府、更新會或自然人；
// 這些角色不是住宅品牌，不應混入尚待研究的建商統計。
export const isNonBuilderRole=value=>/建築經理|商業銀行|銀行股份|信託|都市更新會|更新單元.*會|臺北市政府|新北市政府|待選定實施者|自然人|等\s*\d*\s*人/.test(String(value||''));

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
  {
    id:'isanlin',name:'甲山林／愛山林',aliases:['甲山林','愛山林'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:87,quality:82,governance:91,service:81,risk:78},
    summary:'愛山林為上市公司，具年報、審計委員會與連續永續報告；甲山林集團另具大型開發、代銷及物業整合能力。',
    caveat:'「甲山林」可能是廣告代銷、集團品牌或投資興建角色，必須按個案確認真正起造人、營造廠及保固責任主體。',
    sources:[
      {label:'愛山林公司治理',url:'https://www.isanlin.com/file',type:'公開財報'},
      {label:'2024 永續報告書',url:'https://www.isanlin.com/files/21.%E6%84%9B%E5%B1%B1%E6%9E%972024%E6%B0%B8%E7%BA%8C%E5%A0%B1%E5%91%8A%E6%9B%B8.pdf?v=3',type:'公司報告'},
      {label:'甲山林集團概況',url:'https://www.jsl.com.tw/company/overview',type:'公司揭露'},
    ],
  },
  {
    id:'fabulous',name:'將捷建設',aliases:['將捷股份','將捷建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:86,quality:89,governance:87,service:88,risk:82},
    summary:'建設、營造與資產管理垂直整合，連續發布永續報告；品管、BIM、社區報修及結構保固均有明確揭露。',
    caveat:'十五年結構保固與其他保固範圍仍應以各案契約為準；集團永續資料不等同單一住宅案的驗屋結果。',
    sources:[
      {label:'2024 永續報告書',url:'https://esg.fabulousgroup.com.tw/storage/PDF/FG_2024_ESG_v2.pdf',type:'公司報告'},
      {label:'歷年報告書',url:'https://esg.fabulousgroup.com.tw/tw/report',type:'公司報告'},
      {label:'建設團隊與保固',url:'https://www.fabulousgroup.com.tw/team/%E5%B0%87%E6%8D%B7%E5%BB%BA%E8%A8%AD',type:'公司揭露'},
    ],
  },
  {
    id:'mawder',name:'茂德建設',aliases:['茂德建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:86,quality:78,governance:57,service:76,risk:66},
    summary:'北台灣推案履歷與大型基地經驗可查，部分個案揭露結構、防水保固；公司級治理與量化售服資料較有限。',
    caveat:'官網大量內容屬品牌或建案行銷，不能與經查證的永續報告等量齊觀，因此治理與風險分數保守。',
    sources:[
      {label:'公司與歷年作品',url:'https://www.mawder.com.tw/aboutus',type:'公司揭露'},
      {label:'建案保固揭露',url:'https://www.mawder.com.tw/news/media/536',type:'公司揭露'},
      {label:'歷年建案資料',url:'https://www.mawder.com.tw/',type:'公司揭露'},
    ],
  },
  {
    id:'hanhuang',name:'漢皇集團',aliases:['漢皇開發','漢皇建設','漢吉建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:79,quality:76,governance:51,service:72,risk:63},
    summary:'長期深耕雙和並具開發、營造與售服整合履歷；目前可取得資料以公司品牌與作品介紹為主。',
    caveat:'缺少可比的財務治理文件、量化售服成效與明確通用保固條款，C 級主要反映證據不足，不代表已證實品質差。',
    sources:[
      {label:'公司沿革與作品',url:'https://www.hanhuang.com.tw/about',type:'公司揭露'},
      {label:'都更與服務流程',url:'https://hanhuang.com.tw/renovations',type:'公司揭露'},
      {label:'企業責任',url:'https://hanhuang.com.tw/responsibilities',type:'公司揭露'},
    ],
  },
  {
    id:'duennien',name:'敦年建設',aliases:['敦年建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:79,quality:82,governance:50,service:71,risk:64},
    summary:'具長期作品履歷並由關係企業久年營造配合，官網列有多筆規劃與施工品質獎項。',
    caveat:'工程與售後敘述欠缺量化成果，亦缺少上市公司等級的持續財務與風險揭露，因此整體採保守評分。',
    sources:[
      {label:'公司理念與獲獎履歷',url:'https://www.duennien.com.tw/about_us',type:'公司揭露'},
      {label:'久年營造關係企業',url:'https://www.joyear.com/?at=company&cl=company&id=2&md=index',type:'公司揭露'},
    ],
  },
  {
    id:'yuanshuo',name:'新碩建設',aliases:['新碩建設','遠碩建築團隊'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:77,quality:84,governance:57,service:81,risk:68},
    summary:'團隊涵蓋建設、甲級營造與機電，公開施作檢驗、工程進度客服、交屋駐點及後續修繕流程。',
    caveat:'品質與售服資訊主要來自公司官網，尚缺獨立驗證及連續公司級報告，財務治理資訊亦較有限。',
    sources:[
      {label:'公司與服務團隊',url:'https://www.yuanshuo.com.tw/about/',type:'公司揭露'},
      {label:'售後與保固指南',url:'https://www.yuanshuo.com.tw/',type:'公司揭露'},
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/27350351',type:'政府資料'},
    ],
  },
  {
    id:'forworld',name:'馥華集團',aliases:['馥華集團','馥華開發','馥麗建設','馥達建設'],reviewed:'2026-09-14',confidence:'低',
    scores:{delivery:83,quality:73,governance:46,service:62,risk:57},
    summary:'1981 年起累積板橋、土城等地作品，但集團旗下多家投資興建公司，公開公司級制度與量化售服資料不足。',
    caveat:'C 級反映目前公開證據薄弱及責任主體分散，不是對所有馥華個案品質的單一結論；應逐案確認起造與保固公司。',
    sources:[
      {label:'集團新聞與開發案',url:'https://www.forworld.com.tw/news/press',type:'公司揭露'},
      {label:'集團作品年表',url:'https://resource.iyp.tw/static.iyp.tw/40125/files/0c267f7b-8183-466c-9d01-67b90cb7f644.pdf',type:'公司簡介'},
      {label:'綠建築個案紀錄',url:'https://www.taiwangbc.org.tw/tw/uploads/news/1000/2/3ddc8e5107ad1db5.pdf',type:'第三方紀錄'},
    ],
  },
  {
    id:'paujar',name:'寶佳機構',aliases:['寶佳機構','寶佳建設'],reviewed:'2026-09-14',confidence:'不足',rating:'NR',
    scores:null,
    summary:'已確認為涵蓋大量不同建設公司的機構品牌，但無法取得足以代表所有關係公司的統一品管、售服與財務證據。',
    caveat:'不做集團總分。寶佳相關建案必須依實際起造公司分開研究；把數十家公司合成 B 或 C 都會造成誤導。',
    sources:[
      {label:'立法院公聽會資料',url:'https://lis.ly.gov.tw/pubhearc/ttsbooki?N139396%3A0079-0090%3A_self=',type:'政府紀錄'},
      {label:'寶佳建設公司概況',url:'https://www.104.com.tw/company/12zcu5eg',type:'公司徵才頁'},
    ],
  },
  {
    id:'continental',name:'大陸建設',aliases:['大陸建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:94,quality:95,governance:95,service:92,risk:90},
    summary:'欣陸投控旗下開發品牌，與大陸工程形成專業整合；年報、永續報告、BIM、綠建築及交屋後服務均有持續揭露。',
    caveat:'集團制度完整仍不能替代個案查核；物業與管家服務並非所有建案都提供，應依契約確認。',
    sources:[
      {label:'欣陸投控企業年報',url:'https://www.continental-holdings.com/zh/investor-relations/financial-information/annual-reports/',type:'公開財報'},
      {label:'2023 永續報告書',url:'https://www.continental-holdings.com/app/uploads/2024/06/2023%E5%B9%B4%E6%AC%A3%E9%99%B8%E6%8A%95%E6%8E%A7%E6%B0%B8%E7%BA%8C%E5%A0%B1%E5%91%8A%E6%9B%B8.pdf',type:'公司報告'},
      {label:'大陸建設售後服務',url:'https://www.continental-propertydevelopment.com/zh/service/after-sales-service/',type:'公司揭露'},
    ],
  },
  {
    id:'pujen',name:'璞真建設',aliases:['璞真建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:90,quality:94,governance:89,service:92,risk:88},
    summary:'勤美集團旗下品牌，具自有營造、第三方結構驗證、BIM、地震監測、專責客服與交屋後定期建物健檢。',
    caveat:'公司公開制度完整，但滿意度與修繕時效缺少一致量化資料；年度健檢為部分社區，不能推及全部作品。',
    sources:[
      {label:'建築與售服制度',url:'https://www.pj.com.tw/tw/about',type:'公司揭露'},
      {label:'永續報告與建物健檢',url:'https://www.pj.com.tw/tw/esg',type:'公司報告'},
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/80293577',type:'政府資料'},
    ],
  },
  {
    id:'sunty',name:'昇陽建設',aliases:['昇陽建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:91,quality:92,governance:91,service:94,risk:86},
    summary:'上市櫃公司持續發布永續報告，設獨立售服部門，並揭露自主驗屋、客戶複驗、派工、回訪與缺失回饋機制。',
    caveat:'售服制度成熟，但公司揭露仍需搭配各案住戶紀錄與契約保固年限交叉驗證。',
    sources:[
      {label:'歷年永續報告書',url:'https://www.sunty.com.tw/suntyESG/report.html',type:'公司報告'},
      {label:'2024 永續報告書',url:'https://www.sunty.com.tw/suntyESG/report/2024ESG-report.pdf',type:'公司報告'},
      {label:'獨立售後服務部門',url:'https://www.sunty.com.tw/service.html',type:'公司揭露'},
    ],
  },
  {
    id:'greattown',name:'全坤建設',aliases:['全坤建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:87,quality:86,governance:91,service:88,risk:84},
    summary:'上市公司治理與連續永續報告可查，揭露一對一客服、交屋文件、公設點交及依項目提供五至十年修繕服務。',
    caveat:'各類結構、設備與防水的實際保固長度不同，不能將最高十年概括套用所有項目。',
    sources:[
      {label:'永續發展專區',url:'https://www.gtg.com.tw/page/investment/doc.aspx?da=n8&kind=5',type:'公司報告'},
      {label:'2023 永續報告書',url:'https://www.gtg.com.tw/upload/doc/202408131030010.pdf',type:'公司報告'},
      {label:'2022 年報',url:'https://www.gtg.com.tw/upload/shareholders/202405221453424.pdf',type:'公開財報'},
    ],
  },
  {
    id:'yeashin',name:'亞昕國際',aliases:['亞昕國際'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:89,quality:82,governance:90,service:78,risk:76},
    summary:'1995 年成立且長期公開發行，財務與公司治理資料可追溯；工程與售後的公司級量化揭露相對不足。',
    caveat:'目前高分主要來自長期履約與治理透明，不能直接解讀為個案施工或售服同樣達到高分。',
    sources:[
      {label:'TDCC 投資人關係',url:'https://irplatform.tdcc.com.tw/ir/zh/contact/detail/23379679-2C27-4D84-8617-42640C32DE88',type:'公開平台'},
      {label:'公開財務報告',url:'https://shop.nstock.tw/api/v2/stock-financial-report/report?type=0&url=https%3A%2F%2Fmopsov.twse.com.tw%2Fnas%2FSTR%2F521320250909M001.pdf',type:'公開財報'},
    ],
  },
  {
    id:'huanghsiang',name:'皇翔建設',aliases:['皇翔建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:88,quality:80,governance:90,service:76,risk:74},
    summary:'上市公司且連續發布永續報告，長期推案及財務治理資料可查；工程品管與售服量化資料仍較少。',
    caveat:'評級較多反映長期履約與公開治理；永續報告未見第三方確信資訊，個案品質需另外驗證。',
    sources:[
      {label:'歷年永續報告',url:'https://www.hhe.com.tw/tw/ESG',type:'公司報告'},
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/86379024',type:'政府資料'},
    ],
  },
  {
    id:'pinjia',name:'品嘉建設',aliases:['品嘉建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:79,quality:78,governance:57,service:80,risk:67},
    summary:'具台北危老與都更履歷、自有營造及終身客服主張；公司級財務治理與量化服務資料較不足。',
    caveat:'「終身客服」不等於終身免費保固；目前多數證據來自公司網站，應逐案查契約與實際起造、營造主體。',
    sources:[
      {label:'公司、建案與服務',url:'https://en-rich.com.tw/',type:'公司揭露'},
      {label:'都更服務說明',url:'https://en-rich.com.tw/renewal-service',type:'公司揭露'},
    ],
  },
  {
    id:'shinruenn',name:'新潤建設機構',aliases:['新潤建設','新潤興業'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:80,quality:81,governance:58,service:78,risk:68},
    summary:'2007 年起累積作品，旗下建設、營造與客服整合，公開電話客服與到府維修制度。',
    caveat:'公司資料以官網自述為主，缺少連續財報、永續報告與量化售服結果，因此無法給予更高證據分。',
    sources:[
      {label:'公司沿革與服務體系',url:'https://www.shinruenn.com.tw/about_us',type:'公司揭露'},
      {label:'集團公司與建案',url:'https://www.shinruenn.com.tw/projects/',type:'公司揭露'},
    ],
  },
  {
    id:'lihshinn',name:'立信建設',aliases:['立信建設'],reviewed:'2026-09-14',confidence:'低',
    scores:{delivery:77,quality:70,governance:48,service:67,risk:59},
    summary:'2001 年成立並有江翠北側等開發履歷，也設有售服窗口；可比的公司級品管、治理及保固資料有限。',
    caveat:'C 級主要反映公開證據不足，而非已確認品質不良。購屋時應特別核對營造廠、保固與既有社區紀錄。',
    sources:[
      {label:'公司與售服窗口',url:'https://www.lihshinn.com/',type:'公司揭露'},
    ],
  },
  {
    id:'sunfon',name:'三豐建設',aliases:['三豐建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:88,quality:82,governance:86,service:78,risk:75},
    summary:'1988 年成立的上櫃建商，公開資料可核對逾 35 年、2,546 戶以上履歷；政府都更核定文件亦確認其實施者及完整工程預算。',
    caveat:'長期交付及公開治理優於區域型建商，但售後與品質量化揭露仍不如 S 級標竿，綜合評為 A 級。',
    sources:[
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/22817225',type:'政府資料'},
      {label:'三豐 AIT 與公司履歷',url:'https://www.fuyugroup.com.tw/?at=builddetails&cl=build&id=77&md=index',type:'公司公開資料'},
      {label:'市府段都更核定計畫',url:'https://sunfon.com.tw/wp-content/uploads/2023/05/10901%E6%89%BF%E5%BE%B7%E4%B8%80%E6%A1%88%E6%AC%8A%E5%88%A9%E8%AE%8A%E6%8F%9B%E8%A8%88%E7%95%AB%E6%A1%88%E6%A0%B8%E5%AE%9A%E7%89%88%E7%B6%B2%E8%B7%AF%E5%85%AC%E9%96%8B%E7%89%88.pdf',type:'政府案卷'},
      {label:'公開資訊觀測站',url:'https://mops.twse.com.tw/',type:'公開市場資料'},
    ],
  },
  {
    id:'heyang',name:'和暘建設',aliases:['和暘建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:82,quality:74,governance:64,service:70,risk:62},
    summary:'1994 年設立並持續登記，臺北市預售備查可核對和暘夏灣、和暘 AI 等案，公平會舊案資料亦確認其歷史投資興建與賣方身分。',
    caveat:'長期存續及多案紀錄明確，但資本規模、治理、售後和品質制度揭露有限，評為 B 級下緣。',
    sources:[
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/84789001',type:'政府資料'},
      {label:'臺北市預售備查',url:'https://land.gov.taipei/News_Content.aspx?n=E8D96FA6BB2B310E&s=B9FB950496A8E523&sms=06A4332DF37FE327',type:'政府資料'},
      {label:'和暘 AI 契約核備',url:'https://www-ws.gov.taipei/001/Upload/305/relfile/11498/7640523/b539e9d8-5693-48a2-870f-2d853df0681b.pdf',type:'政府資料'},
      {label:'公平交易委員會案件資料',url:'https://www.ftc.gov.tw/uploadDecision/238e5c6e-2d2a-471b-a82b-38c6333699ee.pdf',type:'政府資料'},
    ],
  },
  {
    id:'goodman',name:'國美建設',aliases:['國美建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:82,quality:79,governance:58,service:77,risk:66},
    summary:'官網可核對品牌沿革、安全、設計與售後承諾，也有可辨識的歷年作品；但缺少公司級財務、治理與量化售服揭露。',
    caveat:'工程與售服內容主要為公司自述，尚無足夠公開報告交叉驗證，因此治理與風險項保守給分。',
    sources:[
      {label:'關於國美',url:'https://goodmangroup.tw/about-us/',type:'公司揭露'},
      {label:'國美機構官網',url:'https://goodmangroup.tw/',type:'公司揭露'},
    ],
  },
  {
    id:'jimei',name:'吉美建設',aliases:['吉美建設事業','吉美建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:86,quality:83,governance:61,service:81,risk:70},
    summary:'1995 年成立，官網列出多個已完工、在建與都更作品，並說明現場管理、工法研發及售後服務，履歷可追溯性較完整。',
    caveat:'品質與售後成效仍以公司敘述為主，未取得上市櫃公司等級的連續財務與治理揭露，故不評為 A。',
    sources:[
      {label:'認識吉美',url:'https://www.jimei.com.tw/about/',type:'公司揭露'},
      {label:'工程與售後服務',url:'https://www.jimei.com.tw/service/',type:'公司揭露'},
      {label:'歷年作品',url:'https://www.jimei.com.tw/works/',type:'公司揭露'},
    ],
  },
  {
    id:'leyoung',name:'樂揚建設',aliases:['樂揚建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:82,quality:78,governance:62,service:84,risk:69},
    summary:'官網明確揭露一站式售後服務、跨領域諮詢與永續經營原則，服務制度優於僅有作品型錄的私人建商。',
    caveat:'缺少量化維修績效、第三方工程驗證及完整公司級財務資料，現階段維持 B 級。',
    sources:[
      {label:'售後服務',url:'https://www.leyoung.com.tw/business/customer/afterSales.html',type:'公司揭露'},
      {label:'永續經營',url:'https://leyoung.com.tw/duty/sustainable.html',type:'公司揭露'},
    ],
  },
  {
    id:'hongpu',name:'宏普建設',aliases:['宏普建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:87,quality:82,governance:90,service:78,risk:78},
    summary:'上市公司且連續發布永續報告，可查財務治理與公司級永續制度；長期推案履歷明確。',
    caveat:'公開治理資料完整，但個案工程與售後量化成果相對有限，因此落在 A 級門檻而非 S。',
    sources:[
      {label:'永續報告書',url:'https://www.hong-pu.com.tw/tw/esg/report',type:'公司報告'},
      {label:'證交所個股資料',url:'https://wwwc.twse.com.tw/pdf/ch/2536_ch.pdf',type:'公開市場資料'},
    ],
  },
  {
    id:'fubonland',name:'富邦建設',aliases:['富邦建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:90,quality:87,governance:88,service:91,risk:83},
    summary:'具有長期推案與集團治理基礎，官網明列數位報修、結構、設備與公共防水等保固維修項目。',
    caveat:'富邦集團治理能力不能直接等同每一住宅個案品質；仍須核對個案營造廠與買賣契約保固年限。',
    sources:[
      {label:'客服與保固維修',url:'https://www.fubonland.com.tw/customer',type:'公司揭露'},
      {label:'富邦建設官網',url:'https://www.fubonland.com.tw/',type:'公司揭露'},
    ],
  },
  {
    id:'hungsheng',name:'宏盛建設',aliases:['宏盛建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:87,quality:79,governance:88,service:76,risk:70},
    summary:'上市公司、成立與推案時間長，官網可查公司沿革及定期財務報告，履約與治理證據優於一般私人建商。',
    caveat:'工程品質與售後服務的公開量化指標不足，故現階段保守維持 B 級。',
    sources:[
      {label:'關於宏盛',url:'https://www.hsc.com.tw/about.php',type:'公司揭露'},
      {label:'公開財務報告',url:'https://www.hsc.com.tw/area_edm.php?id=339',type:'公開財報'},
    ],
  },
  {
    id:'jut',name:'忠泰建設',aliases:['忠泰建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:89,quality:90,governance:75,service:86,risk:78},
    summary:'1987 年起經營，從開發、規劃、營造到售後形成完整體系，並揭露日系施工顧問、標準工法與教育訓練沿革。',
    caveat:'私人公司財務與風險揭露不如上市建商完整，品牌設計聲量亦不能代替個案施工查驗。',
    sources:[
      {label:'忠泰建設介紹',url:'https://www.jut.com.tw/about/',type:'公司揭露'},
      {label:'忠泰集團事業體',url:'https://jutgroup.jut.com.tw/',type:'公司揭露'},
    ],
  },
  {
    id:'itai',name:'義泰建設',aliases:['義泰建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:75,quality:82,governance:68,service:79,risk:67},
    summary:'2021 年成立的忠泰集團建築品牌，可部分承接集團營造、設計與售服體系，但自身完工履歷仍短。',
    caveat:'不可直接複製忠泰建設的完整履歷與分數；待義泰自身交屋及售後紀錄增加後再覆核。',
    sources:[
      {label:'義泰建設官網',url:'https://www.itaigroup.com.tw/',type:'公司揭露'},
      {label:'忠泰集團事業體',url:'https://jutgroup.jut.com.tw/',type:'公司揭露'},
    ],
  },
  {
    id:'sendfuel',name:'聖得福建設',aliases:['聖得福建設開發','聖得福建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:84,quality:83,governance:63,service:80,risk:70},
    summary:'具可追溯的都更與完工案履歷，並以關係營造公司的連續壁專業及一條龍開發、完工、保固制度作為工程基礎。',
    caveat:'工程專利、案量與服務敘述主要來自公司官網；缺少連續財報與量化售服成效，因此維持 B 級。',
    sources:[
      {label:'品牌、工程與建案實績',url:'https://sendfuel.com/',type:'公司揭露'},
      {label:'都更實施者公開文件',url:'https://www.ur.org.tw/upload/plan/P09902-10-01-01.pdf',type:'政府公開文件'},
    ],
  },
  {
    id:'yungsheng',name:'永陞建設',aliases:['永陞建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:82,quality:81,governance:60,service:74,risk:68},
    summary:'2000 年成立，官網可查多個已推及熱銷個案，公司登記與都市更新公開文件可確認責任主體。',
    caveat:'作品與理念資料多，但售後、品管及風險管理的制度化和量化揭露不足，故保守評為 B。',
    sources:[
      {label:'公司與建案作品',url:'https://www.ysred.com.tw/',type:'公司揭露'},
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/70480170',type:'政府資料'},
      {label:'都更公開文件',url:'https://www.ysred.com.tw/wp-content/uploads/2025/03/ysred_1742892268_955.pdf',type:'公開文件'},
    ],
  },
  {
    id:'sunglory',name:'森鉅建設',aliases:['森鉅建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:74,quality:72,governance:55,service:65,risk:61},
    summary:'官網及新北市預售契約可確認公司、在售／完銷作品與賣方責任主體，並非無法辨識的專案公司。',
    caveat:'目前公開資料以個案介紹與契約為主，缺少公司級品管、售後績效、財務治理與風險報告，暫列 C。',
    sources:[
      {label:'建案實績',url:'https://sun-glory.tw/constrction.php',type:'公司揭露'},
      {label:'新北市預售契約',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?icon=..pdf&n=5qOu6YmFTSDpgLjlooMucGRm&u=LzAwMS9VcGxvYWQvMS9yZWxmaWxlLzk2NzkvNzMyODg3L2NlMzY0ODZhLTlkN2EtNGJkMC04MDZjLTE4ZDI5MGRiOTZmOC5wZGY%3D',type:'政府公開文件'},
    ],
  },
  {
    id:'hanshiang',name:'漢翔開發',aliases:['漢翔開發'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:74,quality:70,governance:55,service:64,risk:62},
    summary:'新北市備查清冊可核對多個預售案，個案官網也可確認投資興建、建照與專業團隊，具重複推案履歷。',
    caveat:'未找到完整公司官網、財務治理、品管及量化售後制度；現有證據只足以確認責任主體與推案，暫列 C。',
    sources:[
      {label:'新北預售備查清冊',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?n=MTEw5bm06IezMTE05bm05bey5YKZ5p%2Bl5bu65qGI5riF5YaKLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMzk5L3JlbGZpbGUvODk5My85NDY5L2NkZTQ4OTJkLTQzMzAtNDY3Zi1hYmExLTI3YzJiYjI0MjYxNi5wZGY%3D',type:'政府資料'},
      {label:'國王大道建案資料',url:'https://king.debang.tw/',type:'個案官方網站'},
    ],
  },
  {
    id:'tiehkuan',name:'鐵冠建設',aliases:['鐵冠建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:67,quality:63,governance:58,service:59,risk:60},
    summary:'經濟部登記、新北市預售契約與都更資料可確認公司存續、賣方責任及至少兩個開發案件。',
    caveat:'缺少品牌官網、歷年完整作品、工程品管與售後制度資料；C 僅代表已確認開發主體，不代表品質背書。',
    sources:[
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/24759876',type:'政府資料'},
      {label:'新北市預售契約',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?icon=..pdf&n=5ryr5rS75pmC5LujMi5wZGY%3D&u=LzAwMS9VcGxvYWQvMS9yZWxmaWxlLzk2NzkvNjM5NzY2LzQ3NjBkMmVjLTI3ZjYtNDUzNC05YWYxLTViNzQ0NDBkMjhjNy5wZGY%3D',type:'政府公開文件'},
      {label:'新北都更公開資料',url:'https://www.uro.ntpc.gov.tw/Announce/Detail/82b66fd6-4e3e-4c15-a055-c36b631de2a3',type:'政府資料'},
    ],
  },
  {
    id:'yuetai',name:'岳泰建設',aliases:['岳泰建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:76,quality:78,governance:57,service:68,risk:64},
    summary:'官方網站列出興建中住宅、危老與都更案件，並說明規劃分析與專業顧問服務，具可辨識的持續推案能力。',
    caveat:'公司級財務、工程查驗、保固流程與售後績效揭露有限，故現階段保守評為 C。',
    sources:[
      {label:'公司、建案與都更資料',url:'https://www.yuetai-const.com.tw/',type:'公司揭露'},
    ],
  },
  {
    id:'joyearland',name:'久年置地',aliases:['久年置地'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:85,quality:87,governance:68,service:86,risk:76},
    summary:'具自有營造體系、BIM 與可追溯作品，並公開建築生產履歷、施工監看、驗交屋、20 年主結構及防水保固等具體承諾。',
    caveat:'保固與施工制度為公司及個案自行揭露，未取得完整公開財報或第三方長期售服統計，故維持 B 級。',
    sources:[
      {label:'久年置地官網',url:'https://www.joyearland.com/',type:'公司揭露'},
      {label:'十大品質與保固承諾',url:'https://joyearprivilege.joyearland.com.tw/',type:'個案官方網站'},
    ],
  },
  {
    id:'shinlan',name:'欣聯建設',aliases:['欣聯建設開發','欣聯建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:81,quality:80,governance:60,service:78,risk:68},
    summary:'公司與合聯營造形成規劃至施工的一條龍體系，官網可查熱銷、經典及都更個案，也提供明確客戶聯絡管道。',
    caveat:'獎項與品質敘述主要由公司自行發布，缺少連續財務、第三方工程驗證與量化售服資料，暫列 B。',
    sources:[
      {label:'公司、營造與建案資料',url:'https://www.shin-lan.com/',type:'公司揭露'},
    ],
  },
  {
    id:'shengwang',name:'勝旺建設',aliases:['勝旺建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:85,quality:76,governance:59,service:72,risk:67},
    summary:'2005 年起持續推案，官網列出二十餘個跨年度作品，公司登記資料亦可確認資本與存續狀態。',
    caveat:'作品履歷清楚，但工程品質制度、保固流程、財務治理與客訴績效公開不足，故保守評為 B。',
    sources:[
      {label:'歷年建案作品',url:'https://www.shengwang.tw/classic_case.aspx',type:'公司揭露'},
      {label:'品牌介紹',url:'https://shengwang.tw/about.html',type:'公司揭露'},
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/27603172',type:'政府資料'},
    ],
  },
  {
    id:'heqian',name:'合謙建設',aliases:['合謙建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:72,quality:70,governance:60,service:64,risk:62},
    summary:'2012 年成立且資本與公司存續可由商工登記核對，至少有淡水及土城兩個具建照、團隊與產品資料的官方個案網站。',
    caveat:'未找到完整品牌官網、售後保固績效及公司級品管／財務報告；C 表示主體已確認，不是品質保證。',
    sources:[
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/54025990',type:'政府資料'},
      {label:'合謙飛時代',url:'https://fs.fuyu-group.tw/',type:'個案官方網站'},
      {label:'合謙上謙城',url:'https://www.scc.8sms.tw/',type:'個案官方網站'},
    ],
  },
  {
    id:'nuhaus',name:'新濠建設',aliases:['新濠建設事業','新濠建設'],reviewed:'2026-09-14',confidence:'低',
    scores:{delivery:70,quality:64,governance:61,service:60,risk:61},
    summary:'公司自 1990 年設立、現有實收資本與責任主體可由公司登記核對，並非名稱不明的起造角色。',
    caveat:'現有公司網站無法穩定取得，亦缺少可核對的工程制度、完整作品與售後資料；因此只列 C 級下緣並標低信心。',
    sources:[
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/23639425',type:'政府資料'},
    ],
  },
  {
    id:'ycgroup',name:'炎洲',aliases:['炎洲股份'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:84,quality:77,governance:91,service:74,risk:76},
    summary:'上市公司年報可追溯財務、治理與房地產事業進度，最新年報亦揭露雙北住宅交屋及後續土地開發規劃。',
    caveat:'集團治理揭露完整，但住宅工程品管與售後績效的個別揭露較少，不能以本業上市規模直接推定住宅品質。',
    sources:[
      {label:'投資人與年報',url:'https://www.ycgroup.tw/investors01.php',type:'公開財報'},
      {label:'114 年度年報',url:'https://www.ycgroup.tw/act.php?act=2&index_id=215',type:'公司年報'},
    ],
  },
  {
    id:'uccland',name:'環泥建設',aliases:['環泥建設開發','環泥建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:83,quality:79,governance:80,service:73,risk:75},
    summary:'1992 年成立，為環球水泥關係企業；公司官網可查長期作品，商工登記可確認環球水泥法人持股及資本。',
    caveat:'母公司年報提升治理可追溯性，但建設子公司的售後、保固與工程品質量化資料仍有限，因此評為 B。',
    sources:[
      {label:'環泥建設官網',url:'https://www.ucctpe.com.tw/',type:'公司揭露'},
      {label:'歷年作品',url:'https://www.ucctpe.com.tw/classic',type:'公司揭露'},
      {label:'公司登記與法人股東',url:'https://findbiz.nat.gov.tw/fts/company/86691030',type:'政府資料'},
      {label:'環球水泥年報',url:'https://www.ucctw.com/m/412-1518-20120.php?Lang=zh-tw',type:'公開財報'},
    ],
  },
  {
    id:'keetai',name:'基泰建設',aliases:['基泰建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:78,quality:35,governance:85,service:50,risk:15},
    summary:'上市公司財報與治理資料可查，但基泰大直案經臺北市政府調查認定施工風控失效、造成鄰房損壞，必須在工程與風險維度大幅扣分。',
    caveat:'C 級是公司級風險警示，不代表每一既有社區均有結構問題；購買任何個案仍應核對營造廠、監造、鑑定與後續改善。',
    sources:[
      {label:'公司年報',url:'https://www.keetai.com.tw/17',type:'公開財報'},
      {label:'北市府調查報告說明',url:'https://doge.gov.taipei/News_Content.aspx?n=F73B3E27C31EA9E3&s=F3E62EEC45817BEC',type:'政府調查'},
      {label:'施工損鄰鑑定說明',url:'https://www.gov.taipei/News_Content.aspx?n=F0DDAF49B89E9413&s=FB7E86F6633E3D35&sms=72544237BBE4C5F6',type:'政府資料'},
    ],
  },
  {
    id:'baopu',name:'寶舖建設',aliases:['寶舖建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:84,quality:92,governance:70,service:86,risk:82},
    summary:'深耕大安區並有完整作品地圖，公開 WELL、SGS 工程查驗及 ISO 19650 BIM／設施維養驗證，工程制度證據具辨識度。',
    caveat:'多數成果仍由公司官網揭露，私人公司財務治理透明度低於上市建商；認證範圍也須逐案核對。',
    sources:[
      {label:'八大安全與國際驗證',url:'https://www.baopu.com.tw/',type:'公司揭露'},
      {label:'品牌、作品與查驗制度',url:'https://www.baopu.com.tw/about',type:'公司揭露'},
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/27559268',type:'政府資料'},
    ],
  },
  {
    id:'shinegroup',name:'日健建設',aliases:['日健建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:82,quality:80,governance:62,service:76,risk:68},
    summary:'1991 年成立，官網列出多個開發與都更案，並說明自建自造、機電整合及客服的垂直體系。',
    caveat:'治理、施工查驗與售後成效仍以公司敘述為主，缺乏量化和第三方報告，暫列 B。',
    sources:[
      {label:'日健機構與開發案',url:'https://www.shinegroup.com.tw/',type:'公司揭露'},
      {label:'都更公開文件',url:'https://www-ws.gov.taipei/Download.ashx?icon=.pdf&n=5a%2BGKOmBrinmk6zoqILoh7rljJfluILlo6vmnpfljYDoip3lsbHmrrXkuIDlsI%2FmrrUxMy0x5Zyw6JmfMeethuWcn%2BWcsOmDveW4guabtOaWsOS6i%2BalreioiOeVq%2BahiF%2Flhazogb3mnIPnmbzoqIDopoHpu54ucGRm&u=LzAwMS9VcGxvYWQvNDU5L2NrZmlsZS9lOGE2ZDc4Yi1iYjJjLTQ0MDctYjk0Yi0xZTliOTIxOTI4MGEucGRm',type:'政府公開文件'},
    ],
  },
  {
    id:'richone',name:'富總建設',aliases:['富總建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:76,quality:73,governance:55,service:68,risk:64},
    summary:'官方網站可核對熱銷案與十餘個完銷作品，具持續推案履歷及公司聯絡主體。',
    caveat:'品質內容偏品牌宣示，未見公司級財務、工程查驗、保固與售後績效資料，故暫列 C。',
    sources:[{label:'公司與歷年建案',url:'https://richone.com.tw/',type:'公司揭露'}],
  },
  {
    id:'jiaruen',name:'嘉潤建設',aliases:['嘉潤建設開發','嘉潤建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:72,quality:71,governance:54,service:67,risk:63},
    summary:'官方網站可確認公司、推案與自主驗屋活動，已有重複建案而非單一無法識別的起造人。',
    caveat:'完整作品年表、財務治理、正式品管標準與量化售服資料不足，暫列 C。',
    sources:[
      {label:'關於嘉潤',url:'https://jia-ruen.com/index.php/about',type:'公司揭露'},
      {label:'公司與驗屋資訊',url:'https://jia-ruen.com/index.php',type:'公司揭露'},
    ],
  },
  {
    id:'heyao',name:'和耀建設',aliases:['和耀建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:72,quality:68,governance:61,service:64,risk:63},
    summary:'2011 年成立且資本與公司存續可由商工登記核對；政府建照審議及預售契約可確認土城等案的申請人與賣方責任。',
    caveat:'未找到完整官方品牌、工程查驗、售後保固與量化績效資料，現階段列 C。',
    sources:[
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/53461712',type:'政府資料'},
      {label:'新北市預售契約',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?icon=..pdf&n=5ZKM6ICA576O5a62IOmbheWxhS5wZGY%3D&u=LzAwMS9VcGxvYWQvMS9yZWxmaWxlLzk2NzkvNzM4NjkwLzJiNzE2N2IzLTMyMDMtNDdlZS1hY2VlLTUyNTYzZTAzMjE5ZS5wZGY%3D',type:'政府公開文件'},
      {label:'都市設計審議資料',url:'https://www.planning.ntpc.gov.tw/uploaddowndoc?file=downloaddata%2F202404181131251.pdf&filedisplay=0412%E4%B8%8B%E5%8D%88-%E8%98%87-%28%E4%B8%80%29%E5%92%8C%E8%80%80%E5%9C%9F%E5%9F%8E%E6%B0%B8%E7%A6%8F%E6%AE%B533%28%E4%BA%8C%29%E8%87%BA%E5%84%84%E5%9C%9F%E5%9F%8E%E5%93%A1%E5%92%8C%E6%AE%B5123%282%E8%AE%8A%29.pdf&flag=doc',type:'政府資料'},
    ],
  },
  {
    id:'hejia',name:'合嘉建設',aliases:['合嘉建設'],reviewed:'2026-09-14',confidence:'低',
    scores:{delivery:70,quality:66,governance:61,service:62,risk:62},
    summary:'2006 年成立，公司登記與智慧財產資料可確認資本、存續及多個建案商標，外部個案資料亦可交叉確認持續推案。',
    caveat:'未找到公司官網、正式品管與售後制度，個案資料多來自行銷頁面；C 僅表示責任主體已識別。',
    sources:[
      {label:'公司登記與商標資料',url:'https://findbiz.nat.gov.tw/fts/company/28548085',type:'政府資料'},
      {label:'新北預售備查清冊',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?n=MTEw5bm06IezMTE05bm05bey5YKZ5p%2Bl5bu65qGI5riF5YaKLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMzk5L3JlbGZpbGUvODk5My85NDY5L2NkZTQ4OTJkLTQzMzAtNDY3Zi1hYmExLTI3YzJiYjI0MjYxNi5wZGY%3D',type:'政府資料'},
    ],
  },
  {
    id:'junfeng',name:'鈞豐建設',aliases:['鈞豐建設'],reviewed:'2026-09-14',confidence:'低',
    scores:{delivery:69,quality:66,governance:58,service:64,risk:61},
    summary:'2011 年成立，公司登記、新北市預售清冊及內政部建築資料可確認責任主體與多個住宅案。',
    caveat:'公司規模及公開制度資料有限，未找到可驗證的品管、保固、售後績效或完整財務治理報告，暫列 C。',
    sources:[
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/53210482',type:'政府資料'},
      {label:'新北預售備查清冊',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?n=MTEw5bm06IezMTE05bm05bey5YKZ5p%2Bl5bu65qGI5riF5YaKLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMzk5L3JlbGZpbGUvODk5My85NDY5L2NkZTQ4OTJkLTQzMzAtNDY3Zi1hYmExLTI3YzJiYjI0MjYxNi5wZGY%3D',type:'政府資料'},
    ],
  },
  {
    id:'zhongde',name:'中德建設',aliases:['中德建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:77,quality:64,governance:58,service:64,risk:55},
    summary:'政府預售與查核資料、跨年度個案可確認中德在雙北及外縣市持續推案，責任主體明確。',
    caveat:'未找到完整官方網站與公司級品質、售後及治理報告；另有工地逕流廢水未依核准計畫執行紀錄，風險項保守扣分。',
    sources:[
      {label:'新北預售備查清冊',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?n=MTEw5bm06IezMTE05bm05bey5YKZ5p%2Bl5bu65qGI5riF5YaKLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMzk5L3JlbGZpbGUvODk5My85NDY5L2NkZTQ4OTJkLTQzMzAtNDY3Zi1hYmExLTI3YzJiYjI0MjYxNi5wZGY%3D',type:'政府資料'},
      {label:'臺南預售查核結果',url:'https://w3fs.tainan.gov.tw/Download.ashx?n=5aWR57SE6L2J6K6T5p%2Bl5qC46KGoLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMjA3L3JlbGZpbGUvMjI0ODYvODc2NjE1Ny8xM2QwY2ZlMC1kZTc5LTRiODYtYTMyZC1kZjU4NWJkOTBhODQucGRm',type:'政府資料'},
      {label:'環境裁處公開彙整',url:'https://thaubing.gcaa.org.tw/corp/27627527',type:'政府資料彙整'},
    ],
  },
  {
    id:'hengho',name:'恆合建設',aliases:['恆合建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:76,quality:67,governance:59,service:64,risk:58},
    summary:'公司登記、北市都更核定及預售備查可確認長期開發與實施者角色，並有多個可追溯案件。',
    caveat:'未取得穩定可讀的公司級品管、售後與財務報告；不採未經官方確認的媒體指控計分，現階段列 C。',
    sources:[
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/27729361',type:'政府資料'},
      {label:'北市都更核定公告',url:'https://uro.gov.taipei/News_Content.aspx?n=84B16ECE22E9FD00&s=A46636EDABD11397&sms=CC49E1BF66CBBEB8',type:'政府資料'},
      {label:'北市預售備查',url:'https://land.gov.taipei/News.aspx?n=8A62273E3E42E818&sms=C26A9E324E37B468',type:'政府資料'},
    ],
  },
  {
    id:'shuohua',name:'碩樺建設',aliases:['碩樺建設'],reviewed:'2026-09-14',confidence:'低',
    scores:{delivery:68,quality:64,governance:55,service:61,risk:60},
    summary:'臺北市政府公開文件可確認公司參與住宅開發，資料庫亦有多筆起造紀錄，責任主體可識別。',
    caveat:'未找到公司官網、完整作品、工程制度、財務治理與售後績效資料，僅能保守列 C。',
    sources:[{label:'北市公開案件文件',url:'https://www-ws.gov.taipei/001/Upload/459/relfile/22615/3491578/165400b8-32a5-446e-9e23-160eac4b64fc.pdf',type:'政府公開文件'}],
  },
  {
    id:'grandearcade',name:'廣宇建設',aliases:['廣宇建設實業','廣宇建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:75,quality:72,governance:65,service:67,risk:66},
    summary:'2005 年成立，商工登記可查較高實收資本與持續增資，官方網站及個案頁可確認住宅開發主體。',
    caveat:'資本規模不等於工程品質；仍缺少正式品管標準、保固條款、售後績效和連續公開報告，暫列 C。',
    sources:[
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/27755212',type:'政府資料'},
      {label:'官方公司網站',url:'https://ga2023.squarespace.com/',type:'公司揭露'},
      {label:'廣宇大涵個案',url:'https://gadh.jaysmg.com/',type:'個案官方網站'},
    ],
  },
  {
    id:'huayi',name:'華誼建設',aliases:['華誼建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:72,quality:69,governance:57,service:66,risk:63},
    summary:'2012 年成立，官方網站可確認組織包含財務、工務、業務與開發部門，並持續發布個案工程進度。',
    caveat:'品質與客戶滿意內容主要為公司自述，缺少量化查驗、保固、財務與風險資料，故列 C。',
    sources:[
      {label:'公司介紹',url:'https://www.huayibuild.com.tw/',type:'公司揭露'},
      {label:'工程與建案消息',url:'https://www.huayibuild.com.tw/news',type:'公司揭露'},
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/53759988',type:'政府資料'},
    ],
  },
  {
    id:'huahui',name:'樺輝建設',aliases:['樺輝建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:82,quality:80,governance:60,service:73,risk:68},
    summary:'品牌源流可追溯至 1992 年，官網列出雙北作品、選材與防水等工程說明，政府備查資料亦可核對預售責任。',
    caveat:'工程內容與品牌歷史主要為公司自述，缺少連續財務、第三方品質與量化售後資料，故列 B。',
    sources:[
      {label:'品牌故事與歷年履歷',url:'https://huahui.com.tw/brand_story.php',type:'公司揭露'},
      {label:'工程選材說明',url:'https://huahui.com.tw/brand_material.php',type:'公司揭露'},
      {label:'新北預售備查清冊',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?n=MTEw5bm06IezMTE05LiK5Y2K5bm05bey5YKZ5p%2Bl5bu65qGI5riF5YaKLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMzk5L3JlbGZpbGUvODk5My85NDY5L2UwZjQwYjRjLTkyMjEtNDliZS1hMzA5LTE0MWExNmQ1MzVlNS5wZGY%3D',type:'政府資料'},
    ],
  },
  {
    id:'yungsiung',name:'永雄建設',aliases:['永雄建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:79,quality:75,governance:61,service:70,risk:67},
    summary:'2003 年成立且持續增資，官方網站可核對多個板橋、林口、新莊與八里作品及個案營造資訊。',
    caveat:'具有持續履歷，但缺少公司級工程查驗、保固年限、售後績效及公開治理報告，暫列 C。',
    sources:[
      {label:'公司與建案作品',url:'https://www.yyt.com.tw/',type:'公司揭露'},
      {label:'公司登記資料',url:'https://findbiz.nat.gov.tw/fts/company/80600218',type:'政府資料'},
    ],
  },
  {
    id:'foxbeauty',name:'福美國際建設',aliases:['福美國際建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:68,quality:68,governance:54,service:68,risk:62},
    summary:'2020 年成立，官網揭露從建築設計、營造到銷售與客服的一體化服務；目前可核實的公司年資與完工履歷仍短。',
    caveat:'公開治理、財務與跨景氣循環交付證據有限，依現有證據保守評為 C 級，不以品牌文案替代實績。',
    sources:[
      {label:'福美國際建設官網',url:'https://www.foxbeauty.com.tw/index.html',type:'建商官網'},
    ],
  },
  {
    id:'hokan',name:'合康建設',aliases:['合康建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:80,quality:75,governance:63,service:70,risk:68},
    summary:'2002 年設立、實收資本額 2.6 億元；官網可核對多案作品，個案官網亦明列投資興建者，已有可辨識的雙北交付履歷。',
    caveat:'具二十年以上存續及作品證據，但公開財務、售後量化與品質驗證仍少，故列 B 級下緣。',
    sources:[
      {label:'經濟部商工登記',url:'https://findbiz.nat.gov.tw/fts/company/13117658',type:'政府資料'},
      {label:'合康建設作品',url:'https://www.hokan-archi.com.tw/projects.php',type:'建商官網'},
      {label:'合康個案官網',url:'https://www.hokanfm.com.tw/',type:'建案官網'},
    ],
  },
  {
    id:'dongying',name:'東瑩建設',aliases:['東瑩建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:84,quality:76,governance:60,service:71,risk:68},
    summary:'官網揭露逾二十年沿革與跨年度作品，政府都更公聽會資料亦可核對其實施者身分及過往實績。',
    caveat:'長期交付紀錄可辨識，但非公開發行公司，治理、售後及工程品質量化資料較有限，評為 B 級。',
    sources:[
      {label:'東瑩建設官網',url:'https://www.dongyinggroup.com/',type:'建商官網'},
      {label:'東瑩集團沿革',url:'https://dongyinggroup.com/01.html',type:'建商官網'},
      {label:'永和民治段都更公聽會資料',url:'https://dongyinggroup.com/upload/%E6%B0%B8%E5%92%8C%E5%8D%80%E6%B0%91%E6%B2%BB%E6%AE%B5%E5%85%AC%E8%81%BD%E6%9C%83%E7%B0%A1%E5%A0%B1.pdf',type:'政府案卷'},
    ],
  },
  {
    id:'junmei',name:'鈞美建設',aliases:['鈞美建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:70,quality:70,governance:56,service:66,risk:62},
    summary:'官網可核對危老、都市更新方向、作品與公聽會進度，確認其確為開發建設角色。',
    caveat:'已有個案與程序資料，但長期完工、公開財務、售後及第三方品質證據不足，依現有證據列 C 級。',
    sources:[
      {label:'鈞美建設官網',url:'https://jun-mei.com.tw/',type:'建商官網'},
    ],
  },
  {
    id:'apricity',name:'立陽開發',aliases:['立陽開發'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:80,quality:78,governance:64,service:72,risk:68},
    summary:'2014 年設立，實收資本額逾 7 億元；公司官網揭露土地重劃背景與林口、龜山布局，新北市備查清冊可核對仟壹、仟極、山侘一生等案。',
    caveat:'具規模、持續推案與官方備查紀錄，但公開財務、售後績效及第三方品質數據仍有限，評為 B 級。',
    sources:[
      {label:'經濟部商工登記',url:'https://findbiz.nat.gov.tw/fts/company/54735465',type:'政府資料'},
      {label:'立陽開發品牌與沿革',url:'https://www.apricitydevtw.com/about',type:'建商官網'},
      {label:'新北市預售屋備查清冊',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?n=MTEw5bm06IezMTE05bm05bey5YKZ5p%2Bl5bu65qGI5riF5YaKLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMzk5L3JlbGZpbGUvODk5My85NDY5L2NkZTQ4OTJkLTQzMzAtNDY3Zi1hYmExLTI3YzJiYjI0MjYxNi5wZGY%3D',type:'政府資料'},
    ],
  },
  {
    id:'homeplanter',name:'宏樸建設',aliases:['宏樸建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:70,quality:72,governance:55,service:66,risk:62},
    summary:'官網可確認公司身分、林口在地定位與目前作品，另有個案官網可交叉核對實際推案。',
    caveat:'目前能核對的長期交付、財務治理、售後及第三方品質證據仍少，依現有證據保守列 C 級。',
    sources:[
      {label:'宏樸建築官網',url:'https://www.homeplanter.co/',type:'建商官網'},
      {label:'宏樸如嶼個案官網',url:'https://beautyofthemoment.com.tw/index.html',type:'建案官網'},
    ],
  },
  {
    id:'shengde',name:'盛德建設',aliases:['盛德建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:78,quality:74,governance:61,service:69,risk:65},
    summary:'2012 年設立、實收資本額 1.553 億元；同體系營造官網揭露逾三十年大台北工程經驗，可確認建設與施工能力背景。',
    caveat:'公司存續及營造背景明確，但建設品牌的完工清單、財務治理與售後量化資料較少，依現有證據列 C 級。',
    sources:[
      {label:'經濟部商工登記',url:'https://findbiz.nat.gov.tw/fts/company/53725329',type:'政府資料'},
      {label:'盛德營造官網',url:'https://www.shendeconstruction.com/home',type:'關係企業官網'},
    ],
  },
  {
    id:'zhuhe',name:'築禾建設',aliases:['築禾建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:82,quality:78,governance:66,service:72,risk:70},
    summary:'2012 年設立，最新商工登記實收資本額 21 億元；新北市公開的預售契約可核對築禾琢立、忠孝苑等案及其賣方身分。',
    caveat:'資本與多案推案證據較完整，但並非公開發行公司，公開售後與第三方品質資料仍有限，評為 B 級。',
    sources:[
      {label:'經濟部商工登記',url:'https://findbiz.nat.gov.tw/fts/company/53684538',type:'政府資料'},
      {label:'築禾琢立預售契約',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?icon=..pdf&n=56%2BJ56a%2B55Ci56uLLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMS9yZWxmaWxlLzk2NzkvNzMwODE3LzRlMThlNGZhLTVjYzAtNDgyYy04OTdiLTEyNjIyZDljZWNmMC5wZGY%3D',type:'政府資料'},
      {label:'築禾忠孝苑預售契約',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?icon=..pdf&n=56%2BJ56a%2B5b%2Bg5a2d6IuRLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMS9yZWxmaWxlLzk2NzkvNzI5OTI2L2JiNWFjZDlmLTA4YzItNDQxNi1iMWE0LTdkOGE4ZDNkNDE4MS5wZGY%3D',type:'政府資料'},
    ],
  },
  {
    id:'fuyu',name:'馥羽開發建設',aliases:['馥羽開發建設','欣羽股份有限公司','欣羽有限公司'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:79,quality:78,governance:65,service:72,risk:69},
    summary:'經濟部歷史登記顯示，欣羽股份有限公司於 2023 年更名為馥羽開發建設，實收資本額 14.3 億元；現為馥華集團建築事業體之一。',
    caveat:'公司規模與集團資源可核對，但以新名稱累積的獨立交付、售後及公開治理資料仍有限，評為 B 級。',
    sources:[
      {label:'經濟部商工登記與更名紀錄',url:'https://findbiz.nat.gov.tw/fts/company/53718426',type:'政府資料'},
      {label:'馥華集團事業體資料',url:'https://www.104.com.tw/company/1a2x6bkmhe',type:'公司公開資料'},
    ],
  },
  {
    id:'futingfeng',name:'富庭峰建設',aliases:['富庭峰建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:72,quality:69,governance:57,service:65,risk:63},
    summary:'新北市備查清冊可核對米蘭日光、水悅日光、築家三案，公開預售契約亦確認其為米蘭日光賣方。',
    caveat:'具連續推案及正式契約證據，但公司年資、完工品質、售後與治理公開資料仍少，列 C 級。',
    sources:[
      {label:'新北市預售屋備查清冊',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?n=MTEw5bm06IezMTE05bm05bey5YKZ5p%2Bl5bu65qGI5riF5YaKLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMzk5L3JlbGZpbGUvODk5My85NDY5L2NkZTQ4OTJkLTQzMzAtNDY3Zi1hYmExLTI3YzJiYjI0MjYxNi5wZGY%3D',type:'政府資料'},
      {label:'米蘭日光預售契約',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?icon=..pdf&n=57Gz6Jit5pel5YWJLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMS9yZWxmaWxlLzk2NzkvNjM4NTA5LzExYmViNGI4LTE4NTAtNDQzMC04ZjViLTMwMDE3NWRiM2NlZi5wZGY%3D',type:'政府資料'},
    ],
  },
  {
    id:'fangyuan',name:'方圓開發建設',aliases:['方圓開發建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:80,quality:76,governance:63,service:70,risk:68},
    summary:'2005 年設立、實收資本額 2.02 億元；政府公司登記與已完成都更案資料可核對公司存續、開發角色及推案。',
    caveat:'具近二十年存續及都更實績，但公開財務、售後與第三方品質量化資料有限，評為 B 級。',
    sources:[
      {label:'經濟部商工登記',url:'https://findbiz.nat.gov.tw/fts/company/28067261',type:'政府資料'},
      {label:'方圓開發都更案資料',url:'https://www.fds-archi.com/urban/',type:'關係企業官網'},
    ],
  },
  {
    id:'newmoon',name:'新月建設',aliases:['新月建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:84,quality:75,governance:62,service:70,risk:68},
    summary:'1997 年設立、實收資本額 2.005 億元；新北市公開預售契約與備查頁可核對其賣方身分及近期推案。',
    caveat:'長期存續與持續推案證據明確，但公開財務、售後與第三方品質量化資訊較少，評為 B 級。',
    sources:[
      {label:'經濟部商工登記',url:'https://findbiz.nat.gov.tw/fts/company/97394698',type:'政府資料'},
      {label:'新月御景預售契約',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?icon=..pdf&n=5a%2BM5b6h5piVLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMS9yZWxmaWxlLzk2NzkvNzI4Nzg2LzMyYmY5Yjk4LTVhMzItNDJmOS1iNjk2LTFlOTZmYmE3NmIyNC5wZGY%3D',type:'政府資料'},
      {label:'新北市預售屋契約查詢',url:'https://www.land.ntpc.gov.tw/News.aspx?PageSize=20&n=11769&page=8&sms=9679',type:'政府資料'},
    ],
  },
  {
    id:'yabo',name:'亞伯土地開發',aliases:['亞伯土地開發'],reviewed:'2026-09-14',confidence:'低',
    scores:{delivery:68,quality:64,governance:55,service:61,risk:60},
    summary:'臺北市建築執照施工資料可核對其為兩件信義區住宅案起造人，並可確認承造與監造單位。',
    caveat:'目前僅能確認起造與在建案，缺少可核實的長期完工、售後、財務治理及品質資料，故列 C 級且維持低信心。',
    sources:[
      {label:'臺北市建築執照施工資料',url:'https://www.arch.org.tw/Content/Files/News/44241633b8bf481b96b2163d124eeb4c.pdf',type:'政府資料'},
      {label:'信義區都市更新案卷',url:'https://www-ws.gov.taipei/001/Upload/public/MMO/URO/%E4%BF%A1%E7%BE%A9%E5%8D%80B0780.pdf',type:'政府案卷'},
    ],
  },
  {
    id:'tongyi_dev',name:'統一工商綜合區開發',aliases:['統一工商綜合區開發'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:82,quality:76,governance:67,service:71,risk:69},
    summary:'2002 年設立、實收資本額 26.16 億元；新北市備查清冊與契約可核對城品學苑、日安 PARK、富都馨等案，政府都更文件亦確認實施者身分。',
    caveat:'公司規模、存續與多案紀錄明確，但非公開發行公司，售後及第三方品質量化資料有限，評為 B 級。',
    sources:[
      {label:'經濟部商工登記',url:'https://findbiz.nat.gov.tw/fts/company/13066118',type:'政府資料'},
      {label:'新北市預售屋備查清冊',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?n=MTEw5bm06IezMTE05bm05bey5YKZ5p%2Bl5bu65qGI5riF5YaKLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMzk5L3JlbGZpbGUvODk5My85NDY5L2NkZTQ4OTJkLTQzMzAtNDY3Zi1hYmExLTI3YzJiYjI0MjYxNi5wZGY%3D',type:'政府資料'},
      {label:'富都馨預售契約',url:'https://www-ws.land.ntpc.gov.tw/Download.ashx?icon=..pdf&n=5a%2BM6YO96aaoLnBkZg%3D%3D&u=LzAwMS9VcGxvYWQvMS9yZWxmaWxlLzk2NzkvNzM1MjM3LzAxNmNiYWVlLTA4NjMtNDQ2NC1hNDYyLTk0MWI4YjY4N2I1ZS5wZGY%3D',type:'政府資料'},
    ],
  },
  {
    id:'tajiang',name:'大將開發',aliases:['大將開發'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:84,quality:78,governance:84,service:72,risk:61},
    summary:'1978 年設立的上市公司，實收資本額逾 11 億元；官網列有多件完銷建案，公司股東會資料可核對營建收入、銷售及損益。',
    caveat:'公開治理與長期存續優於一般區域型建商，但近年營建本業曾虧損、推案量不大，風險構面扣分後評為 B 級。',
    sources:[
      {label:'經濟部商工登記',url:'https://findbiz.nat.gov.tw/fts/company/07617901',type:'政府資料'},
      {label:'大將開發建案',url:'https://www.tajiang.com.tw/projects/',type:'建商官網'},
      {label:'112 年股東會議事錄',url:'https://www.tajiang.com.tw/wp-content/uploads/news/20230619151604271112%E5%B9%B4%E8%82%A1%E6%9D%B1%E6%9C%83%E8%AD%B0%E4%BA%8B%E9%8C%84-%E6%9C%83%E5%BE%8C20%E6%97%A5%E5%85%A7PDF%E6%AA%94.pdf',type:'公司財務資料'},
      {label:'新莊中原段審議資料',url:'https://www.ntcaa.org.tw/Content/Files/News/a23f58a6904e4dbdbfd5932a6219efca.pdf',type:'政府案卷'},
    ],
  },
  {
    id:'tengjun',name:'騰竣建設',aliases:['騰竣建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:70,quality:70,governance:56,service:67,risk:62},
    summary:'官網可確認公司、敦南竣個案及持續進行的都市更新公聽會資訊，具明確建設與更新案角色。',
    caveat:'目前公開可核對的完工量、財務治理、售後及第三方品質證據有限，依現有資料列 C 級。',
    sources:[
      {label:'騰竣建設官網',url:'https://www.teng-jun-tw.com.tw/',type:'建商官網'},
    ],
  },
  {
    id:'changze',name:'長澤建設',aliases:['長澤建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:78,quality:75,governance:66,service:70,risk:66},
    summary:'2010 年設立、實收資本額 1 億元；官網有作品與更新業務，新北市契約核備及上市公司公開說明書可核對個案與共同投資角色。',
    caveat:'公司存續、資本與個案證據充足，但公開品質、售後及治理資料仍有限，綜合評為 B 級。',
    sources:[
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/53103526',type:'政府資料'},
      {label:'長澤建設官網',url:'https://www.changze.com.tw/',type:'建商官網'},
      {label:'長澤舞月曦契約核備',url:'https://www-ws.gov.taipei/001/Upload/305/relfile/11498/7640523/f0b6d29e-42cf-4c34-9761-34d6e3664a5a.pdf',type:'政府資料'},
      {label:'合作投資公開說明書',url:'https://www.honsec.com.tw/uploads/underWriting/2211_4.pdf',type:'公開市場資料'},
    ],
  },
  {
    id:'shenghongchang',name:'昇宏昌建設',aliases:['昇宏昌建設'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:68,quality:68,governance:58,service:65,risk:61},
    summary:'2019 年設立、資本額 1 億元；臺北市預售資料可核對天母上苑，施工資料亦確認其為在建案起造人。',
    caveat:'成立年資較短、可核實完工量與售後品質資料有限；同業連帶擔保審議資料為丙級，故保守列 C 級。',
    sources:[
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/82823741',type:'政府資料'},
      {label:'臺北市預售建案受理資料',url:'https://www-ws.gov.taipei/001/Upload/305/relfile/11498/7146725/5e5409c0-5261-4495-b510-78dfc926571f.pdf',type:'政府資料'},
      {label:'同業連帶擔保審議名單',url:'https://redat.yooniks.co/storage/upload/members/1131226%E5%AF%A9%E6%A0%B8%E9%80%9A%E9%81%8E%E5%90%8D%E5%96%AE%28%E7%99%BB%E7%B6%B2%29-1735196185.pdf',type:'產業公會資料'},
    ],
  },
  {
    id:'winsing',name:'文心建設',aliases:['文心建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:84,quality:76,governance:66,service:70,risk:69},
    summary:'1977 年設立、實收資本額 19.4 億元，商工登記顯示長期存續且持續增資，並透過子公司參與合作開發。',
    caveat:'年資與資本規模強，但非公開發行公司，官網作品、售後與第三方品質資料不足，故未上調至 A，評為 B 級。',
    sources:[
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/30821861',type:'政府資料'},
      {label:'文心廣勝開發關係資料',url:'https://findbiz.nat.gov.tw/fts/company/24933538',type:'政府資料'},
    ],
  },
  {
    id:'kans',name:'甘霖建設',aliases:['甘霖建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:79,quality:78,governance:62,service:73,risk:68},
    summary:'官網可核對甘霖僑琚、甘霖環翠、木津川及多件都更案，並揭露耐震系統與五年防水保固；政府資料確認預售備查與近期起造。',
    caveat:'具集團產業背景、推案與部分品質制度，但公司級財務治理及售後績效未完整公開，評為 B 級。',
    sources:[
      {label:'甘霖建設官網',url:'https://kanscorp.com.tw/',type:'建商官網'},
      {label:'臺北市預售備查',url:'https://land.gov.taipei/News_Content.aspx?n=E8D96FA6BB2B310E&s=3C1244F021B558DD&sms=06A4332DF37FE327',type:'政府資料'},
      {label:'臺北市建照施工資料',url:'https://www.arch.org.tw/Content/Files/News/35bb276c89b44b9fabbac8272594ef1d.pdf',type:'政府資料'},
    ],
  },
  {
    id:'harvest',name:'禾碩建設',aliases:['禾碩建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:80,quality:76,governance:61,service:70,risk:67},
    summary:'2003 年設立、實收資本額 9,000 萬元；官網可核對禾碩沐晴及士林光華段都更案，並明列實施者身分。',
    caveat:'公司存續與開發案例明確，但公開財務、售後及第三方工程品質資料較少，評為 B 級。',
    sources:[
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/80660355',type:'政府資料'},
      {label:'禾碩沐晴個案',url:'https://www.harvest-tw.com/mu/',type:'建商官網'},
      {label:'士林光華段都更專區',url:'https://www.harvest-tw.com/shilin/',type:'建商官網'},
    ],
  },
  {
    id:'hansheng',name:'瀚昇國際開發',aliases:['瀚昇國際開發','瀚昇有限公司'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:69,quality:66,governance:56,service:62,risk:61},
    summary:'政府審計資料可核對其士林至善段危老合建案，臺北市施工資料亦確認同址建照、起造人與承造人；公司後續更名為瀚昇國際開發。',
    caveat:'可確認開發角色與在建案，但長期完工、財務治理、售後與品質資料不足，依現有證據列 C 級。',
    sources:[
      {label:'政府危老重建執行情形',url:'https://auditreport.audit.gov.tw/ServerFile/Get/6385734265071417106556f6d6e8254b298dd3bc9ad209f950',type:'政府資料'},
      {label:'臺北市建照施工資料',url:'https://www.arch.org.tw/Content/Files/News/35bb276c89b44b9fabbac8272594ef1d.pdf',type:'政府資料'},
    ],
  },
  {
    id:'dongguan',name:'東冠建設',aliases:['東冠建設'],reviewed:'2026-09-14',confidence:'低',
    scores:{delivery:70,quality:66,governance:56,service:62,risk:60},
    summary:'2006 年設立、登記資本額約 1.3 億元，可確認住宅開發與都市更新等營業項目。',
    caveat:'目前缺少足夠的官網作品、近期交付、售後與第三方品質證據，因此只作低信心 C 級初評。',
    sources:[
      {label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/28085850',type:'政府資料'},
    ],
  },
  {
    id:'zhanyi',name:'展宜建築開發',aliases:['展宜建築開發'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:73,quality:71,governance:59,service:66,risk:63},
    summary:'登記資本額 1.6 億元；臺北市預售備查與建照資料可核對展宜本植、士林蘭雅段等案，既有展宜浦城亦有成屋紀錄。',
    caveat:'已有跨案紀錄，但公開財務治理、售後及工程品質量化資料仍少，評為 C 級。',
    sources:[
      {label:'經濟部公司變更登記清冊',url:'https://serv.gcis.nat.gov.tw/pub/cmpy/reportAction.do?fileName=11502DOC.pdf&method=report&reportClass=cmpy&subPath=11502',type:'政府資料'},
      {label:'臺北市預售備查',url:'https://land.gov.taipei/News.aspx?n=E8D96FA6BB2B310E&sms=06A4332DF37FE327',type:'政府資料'},
      {label:'臺北市核發建照資料',url:'https://www-ws.gov.taipei/Download.ashx?icon=..pdf&n=MTExMDkwMeiHszExMjAzMzHmoLjnmbzkuYvlu7rnhacucGRm&u=LzAwMS9VcGxvYWQvNDYxL3JlbGZpbGUvNTg1NTEvODg4NzM4OS9lYzhmYjAyNy0wZTg0LTRkYzQtYmEwMi0xMDllMWE0ZjdhMTgucGRm',type:'政府資料'},
    ],
  },
  {
    id:'yihua_dev',name:'義華建設開發',aliases:['義華建設開發'],reviewed:'2026-09-14',confidence:'中低',
    scores:{delivery:69,quality:70,governance:55,service:64,risk:60},
    summary:'義華 Nº1 個案官網可核對投資興建者、國際設計合作及士林基地資訊，確認其為實際建設角色。',
    caveat:'可核實作品仍集中於單一個案，缺少長期交付、財務治理、售後與第三方品質資料，列 C 級。',
    sources:[
      {label:'義華 Nº1 個案官網',url:'https://yihua-n1.com.tw/',type:'建案官網'},
    ],
  },
  {
    id:'tatungdev',name:'大同開發',aliases:['大同開發','大同資產開發'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:84,quality:82,governance:78,service:76,risk:73},
    summary:'原大同資產開發於 2026 年更名為大同開發；官網可核對大同莊園系列、大同新紀元與新豐采的開工、完工、完銷及建築獎項。',
    caveat:'具集團資源與跨案交付，但公司級售後、品質量化及獨立治理揭露不及 A 級標竿，評為 B 級。',
    sources:[
      {label:'經濟部更名登記',url:'https://findbiz.nat.gov.tw/fts/company/29508603',type:'政府資料'},
      {label:'大同資產開發案況',url:'https://tadctatung.com.tw/news.html',type:'建商官網'},
      {label:'大同公司年報',url:'https://tatung.com/Content/download/investors/113%E4%B8%AD%E6%96%87%E5%B9%B4%E5%A0%B1.pdf',type:'公司財務資料'},
    ],
  },
  {
    id:'shihlin',name:'士林開發',aliases:['士林開發'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:86,quality:84,governance:88,service:79,risk:76},
    summary:'上櫃公司，官網完整揭露內控、公司治理主管、永續報告與綠建築制度；財務資料可核對多件在建、待售與營建用地。',
    caveat:'治理與建案透明度良好，但售後服務量化與大型住宅交付廣度仍低於 S 級標竿，評為 A 級。',
    sources:[
      {label:'士林開發官網',url:'https://www.sdc.com.tw/',type:'建商官網'},
      {label:'公司治理與永續報告',url:'https://www.sdc.com.tw/duty.php',type:'公司治理資料'},
      {label:'年度財務資料',url:'https://www.sdc.com.tw/images/upload/year_pt/year_pt_2023',type:'公司財務資料'},
    ],
  },
  {
    id:'dacin',name:'達欣工程',aliases:['達欣工程','達欣開發'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:91,quality:88,governance:88,service:80,risk:78},
    summary:'1967 年成立的上市工程公司，官網保留 2007 年起年報與季報；集團住宅開發子公司、重大公共工程及集合住宅履歷均可核對。',
    caveat:'工程技術、長期交付與公開治理證據強，但本資料庫住宅案的售後服務仍缺少同等完整量化，綜合評為 A 級。',
    sources:[
      {label:'達欣工程年報與季報',url:'https://www.dacin.com.tw/investors/reports.php',type:'公司財務資料'},
      {label:'達欣開發與集團工程履歷',url:'https://dacindev.com/about-corporate.html',type:'公司公開資料'},
      {label:'達欣開發官網',url:'https://dacindev.com/',type:'建商官網'},
    ],
  },
  {
    id:'shining',name:'鄉林建設',aliases:['鄉林建設事業','鄉林建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:85,quality:82,governance:82,service:76,risk:64},
    summary:'上市建商，官網可核對公司基本資料、歷年建案與獎項，並發布永續報告；目前仍持續推動萬華等都市更新案。',
    caveat:'公開治理、規模與交付履歷完整，但歷史 BOT 履約爭議及售後量化資料使風險與服務構面保守，評為 B 級。',
    sources:[
      {label:'鄉林公司基本資料',url:'https://shininggroup.com/company_information',type:'公司治理資料'},
      {label:'鄉林建案與獎項',url:'https://shininggroup.com.tw/about_shining/',type:'建商官網'},
      {label:'2023 永續報告',url:'https://shininggroup.com/wp-content/uploads/2024/08/Shining-Sustainability_Report-TC-2023.pdf',type:'公司永續報告'},
      {label:'行政院預售契約查核',url:'https://www.ey.gov.tw/File/162053C7F1593ECE?A=C',type:'政府資料'},
    ],
  },
  {
    id:'pauian',name:'璞園建築團隊',aliases:['璞園開發','璞永建設','璞全建設'],reviewed:'2026-09-14',confidence:'中高',
    scores:{delivery:87,quality:88,governance:75,service:84,risk:78},
    summary:'1996 年成立並垂直整合開發、營造、代銷、交屋售服與空間設計；官方團隊名單明列璞園開發、璞永、璞全等事業體，作品與工程進度可交叉核對。',
    caveat:'交付、品質與售服體系完整，但非公開發行集團，公司級財務與治理透明度低於 S 級標竿，評為 A 級。',
    sources:[
      {label:'璞園建築團隊官網',url:'https://pyct.com.tw/',type:'建商官網'},
      {label:'璞園團隊事業體名單',url:'https://www.pycg.com.tw/index.php?id=team',type:'公司公開資料'},
      {label:'璞園歷年作品',url:'https://www.pycg.com.tw/index.php?id=work',type:'建商官網'},
      {label:'璞園開發公司登記',url:'https://findbiz.nat.gov.tw/fts/company/28205004',type:'政府資料'},
    ],
  },
  {
    id:'runlong',name:'潤隆建設',aliases:['潤隆建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:87,quality:82,governance:88,service:78,risk:70},
    summary:'上市建商，官網持續揭露年報、董事專業與永續治理資訊；屬興富發集團體系，具跨區大量開發與交付能力。',
    caveat:'規模與公開治理資料完整，但大量推案模式、個案品質差異及售後量化資訊使品質與風險項保守，評為 A 級。',
    sources:[
      {label:'潤隆建設年報專區',url:'https://www.runlong.com.tw/stakeholder.php?data_type=information&page_type=annual',type:'公司財務資料'},
      {label:'114 年度年報',url:'https://www.runlong.com.tw/upload/stakeholder/infor/annual/114%E5%B9%B4%E5%A0%B1_20260526.pdf',type:'公司財務資料'},
    ],
  },
  {
    id:'liangshang',name:'聯上開發',aliases:['聯上開發'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:84,quality:79,governance:84,service:75,risk:72},
    summary:'上市建商，年報揭露土地取得、都更與危老策略，以及聯上天母、聯上大喜等成屋銷售個案，財務與營運資訊可持續追蹤。',
    caveat:'公開治理與交付證據完整，但品質、售後滿意度及大型雙北作品廣度尚不足以列 A，評為 B 級。',
    sources:[
      {label:'聯上開發 113 年年報',url:'https://www.5v.com.tw/pdf/%E9%99%84%E4%BB%B65-114%E5%B9%B4%E8%82%A1%E6%9D%B1%E5%B8%B8%E6%9C%83-113%E5%B9%B4%E5%B9%B4%E5%A0%B1.pdf',type:'公司財務資料'},
    ],
  },
  {
    id:'chonghong',name:'長虹建設',aliases:['長虹建設'],reviewed:'2026-09-14',confidence:'高',
    scores:{delivery:90,quality:87,governance:88,service:80,risk:78},
    summary:'上市建商，公開說明書與永續報告揭露工程、治理、契約及顧客服務制度，長期具住宅、商辦與大型開發交付履歷。',
    caveat:'長期交付、品質與治理均強，但售後量化資料仍少於 S 級標竿，因此評為 A 級。',
    sources:[
      {label:'長虹建設永續專區',url:'https://chonghong.com.tw/esg',type:'公司永續資料'},
      {label:'2024 永續報告',url:'https://chonghong.b-cdn.net/wp-content/uploads/2025/09/%E9%95%B7%E8%99%B9%E5%BB%BA%E8%A8%ADESG0902.pdf',type:'公司永續報告'},
      {label:'114 年公開說明書',url:'https://www.twfhcsec.com.tw/Content/fileredirect?Path=MTIzNDAwMDA1Njc4QDPijF26THW0WM0SwfrNT9GVqShCBbmcV5ZZEQjxM7OGrotMHKIhGc6lE66OFc13qIzFwQxt3jaoO_i0494XfLJ4B8k7UxoWxQ',type:'公開市場資料'},
    ],
  },
].map(profile=>{
  const score=profile.scores?weightedScore(profile.scores):null;
  return {...profile,score,rating:profile.rating||ratingFromScore(score)};
});

export const findDeveloperResearch=value=>{
  const text=String(value||'');
  return developerResearch.find(profile=>profile.aliases.some(alias=>text.includes(alias)))||null;
};
