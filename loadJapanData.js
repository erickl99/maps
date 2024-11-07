import { feature, merge, mesh } from "topojson-client";

import topology from "./assets/jp-towns-merged.json";
export default function loadJapanData() {
  const dataObject = topology.objects.JPN_adm3;

  // generate prefectures by merging the towns
  const prefectureNames = {};
  // biome-ignore lint: vendor code
  dataObject.geometries.forEach((data) => {
    const name = data.properties.NAME_1;
    if (!prefectureNames[name]) prefectureNames[name] = 1;
    else prefectureNames[name] += 1;
  });

  const prefectures = [];
  // biome-ignore lint: vendor code
  Object.keys(prefectureNames).forEach((name) => {
    const prefecture = merge(
      topology,
      dataObject.geometries.filter((d) => d.properties.NAME_1 === name),
    );
    prefecture.name = name;
    prefectures.push(prefecture);
  });

  return {
    prefectures,
    towns: feature(topology, dataObject),
    borders: mesh(
      topology,
      dataObject,
      (a, b) => a.properties.ID_1 !== b.properties.ID_1,
    ),
  };
}
