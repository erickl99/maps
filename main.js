import * as d3 from "d3";
import "./main.css";
import { feature, merge, mesh } from "topojson-client";
import { townNames, prefectureNames } from "./names";
import topology from "./assets/final.json";

/** @type {HTMLDivElement}*/
const mapDiv = document.querySelector(".map");
/** @type {HTMLButtonElement}*/
const townButton = document.getElementById("townButton");
/** @type {HTMLHeadingElement}*/
const townHeader = document.querySelector("h1");
/** @type {HTMLParagraphElement}*/
const chosenText = document.querySelector("p");

function loadMapData() {
  const dataObject = topology.objects.JPN_adm3;
  /** @type {Array<Prefecture>} */
  const prefectures = new Array(47);
  for (const name of prefectureNames) {
    /** @type {Prefecture} */
    const prefecture = merge(
      topology,
      dataObject.geometries.filter((d) => {
        return d.properties.NAME_1 === name;
      }),
    );
    prefecture.name = name;
    prefectures.push(prefecture);
  }
  const idx = Math.round(Math.random() * townNames.length);
  townHeader.innerText = townNames[idx];
  /** @type {Array<string>} */
  return {
    selected_city: townNames[idx],
    prefectures,
    towns: feature(topology, dataObject),
    borders: mesh(
      topology,
      dataObject,
      (a, b) => a.properties.ID_1 !== b.properties.ID_1,
    ),
  };
}

function getDimensions() {
  const size = Math.min(window.innerHeight / 2, window.innerWidth / 2);
  return { width: size, height: size };
}

function main() {
  const mapData = loadMapData();
  const { prefectures, towns, borders } = mapData;
  const projection = d3.geoMercator().precision(0.1).center([137, 38]);
  const path = d3.geoPath(projection);
  let selected = mapData.selected_city;

  townButton.addEventListener("click", () => {
    const idx = Math.round(Math.random() * townNames.length);
    mapData.selected_city = townNames[idx];
    townHeader.innerText = townNames[idx];
  });

  function initializeMap() {
    const correctId = mapDiv.getAttribute("correct")?.split(".");
    console.log(correctId);
    let correctFeature = null;
    if (correctId) {
      const idx = correctId[0];
      correctFeature = towns.feature[idx];
    } else {
      selected = null;
      mapData.selected_city = null;
    }

    const { width, height } = getDimensions();
    const containingDiv = d3.select(".map");
    containingDiv.selectAll("svg").remove();
    const svg = containingDiv
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("style", "background-color: #9cc0fa");
    const map = svg.append("g");

    const land = map.selectAll(".towns").data(towns.features).join("path");

    land.on("click", (event) => {
      selectFeature(event.target.__data__);
    });

    const bounds = map.append("path").datum(borders).attr("class", "borders");

    const zoom = d3
      .zoom()
      .scaleExtent([1000, 100000])
      .on("zoom", (event) => {
        const t = event.transform;
        projection.scale(t.k).translate([t.x, t.y]);
        land
          .attr(
            "class",
            (d) =>
              `towns ${
                d.properties.ID_2 === selected?.properties?.ID_2 ? "active" : ""
              } ${d === correctFeature ? "correct" : ""}`,
          )
          .attr("d", path);
        bounds.attr("d", path);
      });
    svg.call(zoom);

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(2000),
    );

    function focusOnFeature(feature, focusedFeature = null) {
      let focused = null;
      if (
        focusedFeature &&
        feature.properties.NAME_1 !== focusedFeature?.properties?.NAME_1
      ) {
        focused = {
          type: "FeatureCollection",
          features: [feature, focusedFeature],
        };
      } else {
        focused = prefectures.find(
          (prefecture) => prefecture.name === feature.properties.NAME_1,
        );
      }

      if (!focused) return;
      projection.fitSize([width, height], focused);
      const scaleFactor = projection.scale();
      const translateMatrix = projection.translate();

      svg.call(
        zoom.transform,
        d3.zoomIdentity.translate(...translateMatrix).scale(scaleFactor),
      );
    }

    function selectFeature(feature) {
      selected = feature;
      console.log(selected.properties);
      if (!correctId) mapData.selected_city = feature;
      land
        .attr(
          "class",
          (d) =>
            `towns ${
              d.properties.ID_2 === selected?.properties?.ID_2 ? "active" : ""
            } ${d === correctFeature ? "correct" : ""}`,
        )
        .attr("d", path);
    }

    if (correctFeature) {
      focusOnFeature(correctFeature, selected);
    }
  }
  initializeMap();
}

main();

/** @typedef {ReturnType<typeof merge>} MultiPolygon*/
/** @typedef {MultiPolygon & {name: string}} Prefecture */
