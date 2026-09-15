export const developerRubric=[
  {key:'delivery',label:'履約與推案',weight:25},
  {key:'quality',label:'工程品質制度',weight:25},
  {key:'governance',label:'財務與治理',weight:20},
  {key:'service',label:'售後與保固',weight:20},
  {key:'risk',label:'風險管理',weight:10},
];

export const ratingFromScore=score=>score>=90?'S':score>=82?'A':score>=72?'B':score>=60?'C':'NR';
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
    id:'hanhuang',name:'漢皇開發',aliases:['漢皇開發','漢皇建設'],reviewed:'2026-09-14',confidence:'中低',
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
    id:'shinruenn',name:'新潤建設',aliases:['新潤建設'],reviewed:'2026-09-14',confidence:'中',
    scores:{delivery:80,quality:81,governance:58,service:78,risk:68},
    summary:'2007 年起累積作品，旗下建設、營造與客服整合，公開電話客服與到府維修制度。',
    caveat:'公司資料以官網自述為主，缺少連續財報、永續報告與量化售服結果，因此無法給予更高證據分。',
    sources:[
      {label:'公司沿革與服務體系',url:'https://www.shinruenn.com.tw/about_us',type:'公司揭露'},
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
    id:'sunfon',name:'三豐建設',aliases:['三豐建設'],reviewed:'2026-09-14',confidence:'不足',rating:'NR',scores:null,
    summary:'已確認公司持續登記及長期開發業務，但目前不足以用同一口徑評估工程制度、售後與風險管理。',
    caveat:'完成公司級年報、品管及售服證據查核前不給分；未評等不代表低於 C。',
    sources:[{label:'經濟部公司登記',url:'https://findbiz.nat.gov.tw/fts/company/22817225',type:'政府資料'}],
  },
  {
    id:'heyang',name:'和暘建設',aliases:['和暘建設'],reviewed:'2026-09-14',confidence:'不足',rating:'NR',scores:null,
    summary:'政府預售備查可確認公司為個案起造與開發主體，但尚缺足以支持公司級品質評分的公開制度資料。',
    caveat:'預售備查只能證明案件與責任主體，不代表工程品質或售後能力，因此暫不評分。',
    sources:[{label:'臺北市預售備查',url:'https://land.gov.taipei/News_Content.aspx?n=E8D96FA6BB2B310E&s=B9FB950496A8E523&sms=06A4332DF37FE327',type:'政府資料'}],
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
].map(profile=>{
  const score=profile.scores?weightedScore(profile.scores):null;
  return {...profile,score,rating:profile.rating||ratingFromScore(score)};
});

export const findDeveloperResearch=value=>{
  const text=String(value||'');
  return developerResearch.find(profile=>profile.aliases.some(alias=>text.includes(alias)))||null;
};
