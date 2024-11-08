import fs from "node:fs";
import jsonData from "../assets/jp-towns-merged.json" assert { type: "json" };

const towns = jsonData.objects.JPN_adm3.geometries;
let id = 0;
for (const town of towns) {
  town.properties.ID_2 = id;
  id++;
}

const stringData = JSON.stringify(jsonData);
fs.writeFileSync("./assets/ordered.json", stringData);
