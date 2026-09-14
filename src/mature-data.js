import { integratedProjects } from './generated/integrated-projects.js';

const stationLines={
  北門:['G'],古亭:['G','O'],台電大樓:['G'],松江南京:['G','O'],松山:['G'],景美:['G'],
  雙連:['R'],小南門:['G'],中山:['G','R'],七張:['G'],大坪林:['G','Y'],
};

const matureStatus=/已領建照|預售中|已備查|新成屋/;

export const matureProjects=integratedProjects
  .filter(project=>matureStatus.test(project.status)&&project.locationStatus!=='unlocated'&&project.walk<=15)
  .map(project=>({...project,lines:stationLines[project.station]||[]}));

