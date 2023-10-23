/**
 * @typedef {object} Prefecture
 * @property {string} name
 * @property {number[][][][]} coordinates
 *
 */

let disable_sel = false;
const STYLES = "background-color: #9cc0fa";

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

/**
 * @param {any} one
 * @param {number} two
 * @returns {number}
 */
function maker(one, two) {
  return 69;
}

/**
 * @param {any} par_node
 * @param {number[]} group_node
 * @param {number[]} acc
 * @param {number[]} reused
 * @param {number[]} selected
 * @param {number[]} towns_arr
 */
function uhh(par_node, group_node, acc, reused, selected, towns_arr) {
  for (let i = 0; i < towns_arr.length; i++) {
    if (group_node[i]) {
      let thing = group_node[i];
      thing.__data__ = towns_arr[i];
      reused[i] = thing;
    } else {
      acc[i] = maker(par_node, towns_arr[i]);
    }
  }
  for (let i = 0; i < group_node.length; i++) {
    if (group_node[i]) {
      selected[i] = group_node[i];
    }
  }
}

/**
 * @typedef {object} Hnode
 * @property {number[][]} groups
 * @property {number[][]} parents
 */

/**
 * @param {Hnode} obj_one 
 * @param {Hnode} obj_two
 */
function merger(obj_one, obj_two) {
  let one_groups = obj_one.groups;
  let two_groups = obj_two.groups;
  let len = Math.min(one_groups.length, two_groups.length);
  let merged = new Array(one_groups.length);
  for (let i = 0; i < len; i++) {
    let g_one = one_groups[i];
    let g_two = two_groups[i];
    let acc = new Array(g_one.length);
    for (let j = 0; j < g_one.length; j++) {
      if (g_one[j]) {
        acc[j] = g_one[j];
      } else if (g_two[j]) {
        acc[j] = g_two[j];
      }
    }
    merged[i] = acc;
  }
  return merged;
}

let node_one = {groups: [[1, 2, 3, 4]], parents: [[1]]};
let node_two = {groups: [[5, 6, 7, 8]], parents: [[1]]};

console.log(merger(node_one, node_two));


function main() {
  const size = Math.min(window.innerHeight / 2, window.innerWidth / 2).toString();
  const app_div = document.querySelector("div.map");
  if (app_div != null) {
    const map_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    map_svg.setAttribute("width", size);
    map_svg.setAttribute("height", size);
    map_svg.setAttribute("style", STYLES);
    const svg_cont = document.createElement("g");
    app_div.appendChild(map_svg);
  }
}

main();
