import { integratedProjects } from './generated/integrated-projects.js';
import { findDeveloperResearch } from './developer-research.js';

const seedProjects = [
  {id:1,name:'松山車站特定區更新案',city:'台北市',district:'松山區',station:'松山',walk:6,address:'八德路四段與松山路口周邊',builder:'待選定實施者',rating:'B',status:'整合／審議中',completion:'2031（估）',type:'都更／未開賣',size:'待公告',price:'待公告',lat:25.0494,lng:121.5779,source:'臺北都市開發審議地圖',verified:true},
  {id:2,name:'南京復興都市更新案',city:'台北市',district:'中山區',station:'南京復興',walk:7,address:'南京東路三段周邊',builder:'潤泰創新',rating:'S',status:'整合／審議中',completion:'2030（估）',type:'都更／未開賣',size:'待公告',price:'待公告',lat:25.0522,lng:121.5426,source:'北市更新案件進度',verified:true},
  {id:3,name:'中山段都市更新案',city:'台北市',district:'中山區',station:'中山',walk:5,address:'南京西路、承德路口周邊',builder:'華固建設',rating:'S',status:'已領建照',completion:'2029（估）',type:'預售前',size:'待公告',price:'165–185 萬／坪（估）',lat:25.0532,lng:121.5186,source:'建造執照摘要',verified:true},
  {id:4,name:'城中段危老重建案',city:'台北市',district:'中正區',station:'西門',walk:8,address:'衡陽路與博愛路周邊',builder:'冠德建設',rating:'A',status:'已領建照',completion:'2028（估）',type:'預售前',size:'20–42 坪（估）',price:'145–165 萬／坪（估）',lat:25.0421,lng:121.5109,source:'建造執照摘要',verified:true},
  {id:5,name:'古亭生活圈新案',city:'台北市',district:'中正區',station:'古亭',walk:4,address:'羅斯福路二段周邊',builder:'大陸建設',rating:'S',status:'預售中',completion:'2029',type:'預售屋',size:'24–48 坪',price:'150–175 萬／坪',lat:25.0267,lng:121.5229,source:'預售屋銷售備查',verified:true},
  {id:6,name:'公館水岸更新案',city:'台北市',district:'中正區',station:'公館',walk:10,address:'汀州路三段周邊',builder:'璞園建築團隊',rating:'A',status:'整合／審議中',completion:'2032（估）',type:'都更／未開賣',size:'待公告',price:'待公告',lat:25.0133,lng:121.5326,source:'北市更新案件進度',verified:true},
  {id:7,name:'七張站捷運生活案',city:'新北市',district:'新店區',station:'七張',walk:6,address:'北新路二段周邊',builder:'國泰建設',rating:'S',status:'預售中',completion:'2028',type:'預售屋',size:'22–45 坪',price:'78–92 萬／坪',lat:24.9750,lng:121.5428,source:'預售屋銷售備查',verified:true},
  {id:8,name:'新店站廣場更新案',city:'新北市',district:'新店區',station:'新店',walk:9,address:'北宜路一段周邊',builder:'待選定實施者',rating:'C',status:'整合／審議中',completion:'2033（估）',type:'都更／未開賣',size:'待公告',price:'待公告',lat:24.9588,lng:121.5377,source:'新北都更案件查詢',verified:true}
];

// 有政府案件時以整合結果為主；種子資料只作離線備援。
const rawProjects=integratedProjects.length ? integratedProjects : seedProjects;
export const projects=rawProjects.map(project=>{
  const research=findDeveloperResearch(project.builder);
  if(research)return {...project,rating:research.rating,ratingBasis:`建商研究 ${research.score} 分（${research.reviewed} 覆核）；評級由五項公開證據加權推導`};
  if(project.rating==='NR')return project;
  return {...project,rating:'NR',ratingBasis:'待評估：尚未完成一致口徑的公司級公開資料查核，不以品牌名稱或案量推定等級'};
});

export const greenLine = [
  [25.0501,121.5777],[25.0514,121.5650],[25.0518,121.5518],[25.0520,121.5440],[25.0521,121.5331],[25.0527,121.5200],[25.0517,121.5134],[25.0422,121.5083],[25.0353,121.5006],[25.0279,121.5067],[25.0264,121.5229],[25.0205,121.5285],[25.0149,121.5342],[25.0018,121.5390],[24.9920,121.5413],[24.9828,121.5414],[24.9750,121.5428],[24.9676,121.5415],[24.9579,121.5376]
];
