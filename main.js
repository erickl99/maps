/**
 * @typedef {object} Prefecture
 * @property {string} name
 * @property {number[][][][]} coordinates
 *
 */

let disable_sel = false;
const STYLES = "background-color: #9cc0fa";
const SVG_NS ="http://www.w3.org/2000/svg";

/**
 * @param {number[][]} arr array of length 2 arrays
 * @returns {number} det_sum of the arrays
 */
function det_sum(arr) {
  let sum = 0;
  let prev = arr[arr.length - 1];
  for (let i = 0; i < arr.length; i++) {
    let curr = prev;
    prev = arr[i];
    sum += curr[0] * prev[1] - curr[1] * prev[0];
  }
  return Math.abs(sum);
}

const features = [{props: {}, geometries: {}}];

function main() {
  const size = Math.min(window.innerHeight / 2, window.innerWidth / 2).toString();
  const app_div = document.querySelector("div.map");
  if (app_div != null) {
    const map_svg = document.createElementNS(SVG_NS, "svg");
    map_svg.setAttribute("width", size);
    map_svg.setAttribute("height", size);
    map_svg.setAttribute("style", STYLES);
    app_div.appendChild(map_svg);
    const svg_cont = document.createElement("g");
    map_svg.appendChild(svg_cont);
    for (let i = 0; i < 1730; i++) {
      let path = document.createElementNS(SVG_NS, "path");
      svg_cont.appendChild(path);
    }
  }
}

main();
