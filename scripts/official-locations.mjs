import fs from 'node:fs';
import path from 'node:path';

const ringCentroid = (ring) => {
  const [originX, originY] = ring[0];
  let twiceArea = 0;
  let x = 0;
  let y = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    const x1 = ring[index][0] - originX;
    const y1 = ring[index][1] - originY;
    const x2 = ring[index + 1][0] - originX;
    const y2 = ring[index + 1][1] - originY;
    const cross = x1 * y2 - x2 * y1;
    twiceArea += cross;
    x += (x1 + x2) * cross;
    y += (y1 + y2) * cross;
  }
  if (!twiceArea) {
    const points = ring.slice(0, -1);
    return {
      area: 0,
      lng: points.reduce((sum, point) => sum + point[0], 0) / points.length,
      lat: points.reduce((sum, point) => sum + point[1], 0) / points.length,
    };
  }
  return {
    area: Math.abs(twiceArea / 2),
    lng: originX + x / (3 * twiceArea),
    lat: originY + y / (3 * twiceArea),
  };
};

const geometryCentroid = (geometry) => {
  const polygons = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
  return polygons.map((polygon) => ringCentroid(polygon[0])).sort((a, b) => b.area - a.area)[0];
};

export function applyOfficialLocations(candidates, root) {
  const cachePath = path.join(root, 'data/raw/taipei-project-parcels.geojson');
  if (!fs.existsSync(cachePath)) return { applied: 0, available: 0 };
  const geojson = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  let applied = 0;
  for (const feature of geojson.features) {
    const center = geometryCentroid(feature.geometry);
    for (const projectId of feature.properties.projectIds || []) {
      const item = candidates.find((candidate) => candidate.id === projectId);
      if (!item || item.locationStatus === 'verified' || item.locationStatus === 'block') continue;
      Object.assign(item, {
        lat: center.lat,
        lng: center.lng,
        siteGeometry: feature.geometry,
        locationStatus: 'block',
        verified: true,
        locationAccuracy: `臺北市地政局官方地籍圖「${feature.properties['區段號']}」宗地多邊形中心；為更新案主地號，不代表完整更新範圍或建築入口`,
        locationSourceUrl: 'https://tgeo.swc.taipei/',
      });
      applied += 1;
    }
  }
  return { applied, available: geojson.features.length };
}
