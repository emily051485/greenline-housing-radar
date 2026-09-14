import { integratedProjects } from './generated/integrated-projects.js';
import { matureRegistryProjects } from './generated/mature-registry-projects.js';

const lineStations={
  R:'象山、台北101/世貿、信義安和、大安、大安森林公園、東門、中正紀念堂、台大醫院、台北車站、中山、雙連、民權西路、圓山、劍潭、士林、芝山、明德、石牌、唭哩岸、奇岩、北投、新北投、復興崗、忠義、關渡、竹圍、紅樹林、淡水',
  G:'新店、新店區公所、七張、小碧潭、大坪林、景美、萬隆、公館、台電大樓、古亭、中正紀念堂、小南門、西門、北門、中山、松江南京、南京復興、台北小巨蛋、南京三民、松山',
  O:'南勢角、景安、永安市場、頂溪、古亭、東門、忠孝新生、松江南京、行天宮、中山國小、民權西路、大橋頭、台北橋、菜寮、三重、先嗇宮、頭前庄、新莊、輔大、丹鳳、迴龍、三重國小、三和國中、徐匯中學、三民高中、蘆洲',
  BL:'頂埔、永寧、土城、海山、亞東醫院、府中、板橋、新埔、江子翠、龍山寺、西門、台北車站、善導寺、忠孝新生、忠孝復興、忠孝敦化、國父紀念館、市政府、永春、後山埤、昆陽、南港、南港展覽館',
  BR:'動物園、木柵、萬芳社區、萬芳醫院、辛亥、麟光、六張犁、科技大樓、大安、忠孝復興、南京復興、中山國中、松山機場、大直、劍南路、西湖、港墘、文德、內湖、大湖公園、葫洲、東湖、南港軟體園區、南港展覽館',
  Y:'大坪林、十四張、秀朗橋、景平、景安、中和、橋和、中原、板新、板橋、新埔民生、頭前庄、幸福、新北產業園區',
};
const stationLines={};
for(const [line,names] of Object.entries(lineStations)){
  for(const station of names.split('、'))(stationLines[station]??=[]).push(line);
}

const matureStatus=/已領建照|預售中|已備查|新成屋/;

const registryPermits=new Set(matureRegistryProjects.map(project=>project.permit).filter(Boolean));
const verifiedExisting=integratedProjects
  .filter(project=>matureStatus.test(project.status)&&project.locationStatus!=='unlocated'&&project.walk<=15&&!registryPermits.has(project.governmentId))
  .map(project=>({...project,lines:stationLines[project.station]||[]}));

const existingNames=new Set(verifiedExisting.map(project=>project.name.replace(/[・。\s]/g,'')));
export const matureProjects=[
  ...verifiedExisting,
  ...matureRegistryProjects
    .filter(project=>!existingNames.has(project.name.replace(/[・。\s]/g,'')))
    .map(project=>({...project,lines:project.lines?.length?project.lines:(stationLines[project.station]||[])})),
];
