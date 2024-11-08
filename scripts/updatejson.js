import assert from "node:assert";
import fs from "node:fs";
import jsonData from "../assets/better-merged.json" assert { type: "json" };

const csvData = fs.readFileSync("./assets/clean_data_set.csv", "utf8").split("\n").filter(x => x && !x.startsWith("id"));
const townData = jsonData.objects.JPN_adm3.geometries;
assert(csvData.length === townData.length, "Not equal array lengths");
for (let i = 0; i < townData.length; i++) {
  const jsonTown = townData[i].properties;
  const csvTown = csvData[i].split(",");
  jsonTown.JP_NAME_1 = csvTown[5];
  jsonTown.JP_NAME_2 = csvTown[7];
  jsonTown.READING = csvTown[8];
}

const newJson = JSON.stringify(jsonData);
fs.writeFileSync("./assets/final.json", newJson);
