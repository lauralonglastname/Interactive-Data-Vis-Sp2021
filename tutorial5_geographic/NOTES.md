## NOTES

---

INSTRUCTIONS:
Use this markdown file to keep track of open questions/challenges from this week's assignment.

- What did you have trouble solving?
- What went easier than expected?
- What, if anything, is currently blocking you?

Sometimes it helps to formulate what you understood and where you got stuck in order to move forward. Feel free to include `code snippets`, `screenshots`, and `error message text` here as well.

If you find you're not able complete this week's assignment, reflecting on where you are getting stuck here will help you get full credit for this week's tutorial

---

/\*\*

- CONSTANTS AND GLOBALS
- _/
  const width = window.innerWidth _ 0.9,
  height = window.innerHeight \* 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/\*\* these variables allow us to access anything we manipulate in

- init() but need access to in draw().
- All these variables are empty before we assign something to them.\*/
  let svg;

/\*\*

- APPLICATION STATE
- \*/
  let state = {
  // + SET UP STATE
  geojson: null,
  heat: null,
  };

/\*\*

- LOAD DATA
- Using a Promise.all([]), we can load more than one dataset at a time
- \*/
  Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
  ]).then(([geojson, heatData]) => {
  // + SET STATE WITH DATA
  state.geojson = geojson
  state.heatData = heatData
  console.log("state: ", state);
  init();
  });

/\*\*

- INITIALIZING FUNCTION
- this will be run _one time_ when the data finishes loading in
- \*/
  function init() {

// + SET UP PROJECTION
const projection = d3.geoAlbersUsa()
.fitSize([width, height], state.geojson);

const colorScale = d3.scaleSequential(d3.interpolateBlues)
.domain(d3.extent(state.geojson.features, d=> d.properties.AWATER))

// const [x, y] = projection([Longitude, Latitude]);

// + SET UP GEOPATH
const pathFunction = d3.geoPath(projection)

// create an svg element in our main `d3-container` element
svg = d3
.select("#d3-container")
.append("svg")
.attr("width", width)
.attr("height", height);

svg.selectAll("path")
.data(state.geojson.features)
.join("path")
.attr("stroke", "black")
.attr("fill", d=> {
console.log(d)
return colorScale(d.properties.AWATER)
})
.attr("d", pathFunction)

    svg.selectAll("circle")
    .data(heatData)
    .join("circle")
    .attr("fill", "red")
    .attr("r",  7)
    .attr("transform", d => {
      console.log("d", d)
      const point = projection([d.long, d.lat])
      console.log("point", point)
          return `translate(${point[0]}, ${point[1]})`
    })

// + DRAW BASE MAP PATH
// + ADD EVENT LISTENERS (if you want)

draw(); // calls the draw function
}

/\*\*

- DRAW FUNCTION
- we call this everytime there is an update to the data/state
- \*/
  function draw() {}
