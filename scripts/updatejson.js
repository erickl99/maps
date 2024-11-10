import assert from "node:assert";
import fs from "node:fs";
import jsonData from "../assets/jp-towns-merged.json" assert { type: "json" };

const csvData = fs.readFileSync("./assets/clean_data_set.csv", "utf8").split("\n").filter(x => x && !x.startsWith("id"));
const townData = jsonData.objects.JPN_adm3.geometries;
assert(csvData.length === townData.length, "Not equal array lengths");
for (let i = 0; i < townData.length; i++) {
  const jsonTown = townData[i].properties;
  const csvTown = csvData[i].split(",");
  const newProperties = {
    TOWN_ID: Number.parseInt(csvTown[0]),
    EN_TOWN_NAME: jsonTown.NAME_2,
    JP_TOWN_NAME: csvTown[7],
    READING: csvTown[8],
    PREF_ID: jsonTown.ID_1,
    EN_PREF_NAME: jsonTown.NAME_1,
    JP_PREF_NAME: csvTown[5],
  };
  townData[i].properties = newProperties;
}

const newJson = JSON.stringify(jsonData);
fs.writeFileSync("./assets/town_map.json", newJson);
