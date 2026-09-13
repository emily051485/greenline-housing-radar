import fs from 'node:fs';
import path from 'node:path';
import { integratedProjects } from '../src/generated/integrated-projects.js';

const root = path.resolve(import.meta.dirname, '..');
const outputPath = path.join(root, 'data/raw/taipei-project-parcels.geojson');
const endpoint = 'https://gis.swc.taipei/server/rest/services/GEOGIS/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%9C%B0%E7%B1%8D_%E5%AF%A6%E9%AB%94/MapServer/2/query';

const parcelPattern = /([^\s市區()（）段]+)段(?:([一二三四五六七八九十]+)小段)?(\d+(?:-\d+)?)地號/;
const escapeSql = (value) => value.replaceAll("'", "''");
const parcelCode = (parcel) => {
  const [main, sub = '0'] = parcel.split('-');
  return `${main.padStart(4, '0')}${sub.padStart(4, '0')}`;
};

const references = integratedProjects.flatMap((project) => {
  if (project.city !== '台北市') return [];
  const match = project.name.match(parcelPattern);
  if (!match) return [];
  return [{
    projectId: project.id,
    district: project.district,
    section: match[1],
    subsection: match[2] || '',
    parcel: match[3],
    parcelCode: parcelCode(match[3]),
  }];
});

const unique = [...new Map(references.map((ref) => [
  `${ref.district}|${ref.section}|${ref.subsection}|${ref.parcelCode}`,
  ref,
])).values()];

const clauses = unique.map((ref) => {
  const parts = [
    `鄉鎮名='${escapeSql(ref.district)}'`,
    `段='${escapeSql(ref.section)}'`,
    `AA49='${ref.parcelCode}'`,
  ];
  if (ref.subsection) parts.push(`小段='${escapeSql(ref.subsection)}'`);
  return `(${parts.join(' AND ')})`;
});

// 此 ArcGIS 服務對過長的 OR 條件不報錯、但只回少數結果，因此分批查詢。
const features = [];
const batchSize = 8;
for (let offset = 0; offset < clauses.length; offset += batchSize) {
  const params = new URLSearchParams({
    where: clauses.slice(offset, offset + batchSize).join(' OR '),
    outFields: '鄉鎮名,段,小段,AA49,區段號,資料日',
    returnGeometry: 'true',
    outSR: '4326',
    f: 'geojson',
  });
  // 服務的 POST 對中文欄位值會錯誤解碼；GET 的 UTF-8 查詢可正確命中。
  const response = await fetch(`${endpoint}?${params}`);
  if (!response.ok) throw new Error(`臺北市地籍服務回應 ${response.status}`);
  const batch = await response.json();
  if (!Array.isArray(batch.features)) {
    throw new Error(`臺北市地籍服務未回傳 GeoJSON：${JSON.stringify(batch)}`);
  }
  features.push(...batch.features);
  console.log(`地籍定位 ${Math.min(offset + batchSize, clauses.length)}/${clauses.length}`);
}
const geojson = { type: 'FeatureCollection', features };

for (const feature of geojson.features) {
  const props = feature.properties;
  const matched = references.filter((ref) =>
    ref.district === props['鄉鎮名'] &&
    ref.section === props['段'] &&
    (!ref.subsection || ref.subsection === props['小段']) &&
    ref.parcelCode === props.AA49
  );
  props.projectIds = matched.map((ref) => ref.projectId);
  props.locationKind = 'official-main-parcel';
}

geojson.metadata = {
  source: '臺北市政府 TGEO 空間地理資訊平台地籍圖（2025.06.20 地政局）',
  sourceUrl: 'https://tgeo.swc.taipei/',
  generatedAt: new Date().toISOString(),
  requestedProjects: references.length,
  returnedParcels: geojson.features.length,
};
fs.writeFileSync(outputPath, `${JSON.stringify(geojson, null, 2)}\n`);
console.log(`官方主地號定位：${geojson.features.length}/${references.length} 筆，寫入 ${path.relative(root, outputPath)}`);
