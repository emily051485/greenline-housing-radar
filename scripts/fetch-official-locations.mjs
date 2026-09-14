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
// 北士科的郵政行政區常標北投區，但軟橋／新洲美段的地籍管轄實際為士林區。
const cadastralDistrict = (district, section) => /^(軟橋|新洲美)$/.test(section) ? '士林區' : district;

function parseCsv(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') { if (quoted && text[index + 1] === '"') { cell += '"'; index += 1; } else quoted = !quoted; }
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && text[index + 1] === '\n') index += 1; row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = ''; }
    else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const registryRows = (() => {
  const text = fs.readFileSync(path.join(root, 'data/raw/taipei-presale-registry.csv'), 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(text), headers = rows.shift();
  if (rows[0]?.[0] === 'TOWN') rows.shift();
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])));
})();

const referenceFrom = ({ projectId, district, value }) => {
  const match = value.match(parcelPattern);
  if (!match) return [];
  return [{ projectId, district: cadastralDistrict(district, match[1]), section: match[1], subsection: match[2] || '', parcel: match[3], parcelCode: parcelCode(match[3]) }];
};

const integratedReferences = integratedProjects.flatMap((project) => {
  if (project.city !== '台北市') return [];
  return referenceFrom({ projectId: project.id, district: project.district, value: project.name });
});

// 預售屋備查檔本身帶有「坐落基地」主地號，可直接與官方地籍圖匹配。
const registryReferences = registryRows.flatMap((row) => referenceFrom({
  projectId: `registry-台北市-${row['鄉鎮市區']}-${row['建案名稱']}`,
  district: row['鄉鎮市區'],
  value: row['坐落基地'],
}));
const references = [...integratedReferences, ...registryReferences];

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
const batches = [];
for (let offset = 0; offset < clauses.length; offset += batchSize) batches.push({ offset, clauses: clauses.slice(offset, offset + batchSize) });
let completed = 0;
const fetchBatch = async ({ clauses: batchClauses }) => {
  const params = new URLSearchParams({
    where: batchClauses.join(' OR '),
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
  completed += batchClauses.length;
  console.log(`地籍定位 ${completed}/${clauses.length}`);
  return batch.features;
};
// 官方服務偶爾會限流，因此只採 6 路並行，而非一次送出全部查詢。
for (let offset = 0; offset < batches.length; offset += 6) {
  const results = await Promise.all(batches.slice(offset, offset + 6).map(fetchBatch));
  features.push(...results.flat());
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
  requestedIntegratedProjects: integratedReferences.length,
  requestedRegistryProjects: registryReferences.length,
  returnedParcels: geojson.features.length,
};
fs.writeFileSync(outputPath, `${JSON.stringify(geojson, null, 2)}\n`);
console.log(`官方主地號定位：${geojson.features.length}/${references.length} 筆，寫入 ${path.relative(root, outputPath)}`);
