/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  // + SET UP STATE
  geojson: null,
  points: null,
  hover: {
    stateName: null,
    Change95PercentDays: null, 
    screenPosition: null, // will be array of [x,y] once mouse is hovered on something
    mapPosition: null, // will be array of [long, lat] once mouse is hovered on something
    visible: false,
  }
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, pointsData]) => {
  state.geojson = geojson
  state.points = pointsData
  console.log("state: ", state);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    // SPECIFY PROJECTION
    // a projection maps from lat/long -> x/y values
    // so it works a lot like a scale!
    const projection = d3.geoAlbersUsa()
      .fitSize([
      width-margin.left-margin.right,
      height-margin.top-margin.bottom], 
      state.geojson);

    // DEFINE PATH FUNCTION
    const path = d3.geoPath(projection)

  //   const colorScale = d3.scaleSequential(d3.interpolateBlues)
  // .domain(d3.extent(state.geojson.features, d=> d.properties.AWATER))

  // + DRAW BASE MAP PATH
      const states = svg.selectAll("path.states")
      .data(state.geojson.features)
      .join("path")
      .attr("class", 'states')
      .attr("stroke", "black")
      .attr("fill", "#e5f5eb")
      .attr("d", path)

    // EXAPMLE #1: lat/long => x/y

  svg.selectAll("circle.point")
      .data(state.points)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d=> {
        if (d.Change95PercentDays > 0) return "orange";
        else if (d.Change95PercentDays === 0) return "transparent"
        else return "green"
      })
      .attr("stroke", "gray")
      .attr("transform", d=> {
        const [x,y] = projection([d.Long, d.Lat])
        return `translate(${x}, ${y})`
      })

    // EXAMPLE #2: x/y=> lat/long
    // take mouse screen position and report location value in lat/long
    // set up event listener on our svg to see where the mouse is
    .on("mousemove", event => {
      // 1. get mouse x/y position
      const {clientX, clientY} = event

      // 2. invert the projection to go from x/y => lat/long
      // ref: https://github.com/d3/d3-geo#projection_invert
      const [long, lat] = projection.invert([clientX, clientY])
      state.hover=  {
        screenPosition: [clientX, clientY], // will be array of [x,y] once mouse is hovered on something
        mapPosition: [long, lat], // will be array of [long, lat] once mouse is hovered on something
        visible: true
      }
      draw();
    }).on("mouseout", event=>{
      // hide tooltip when not moused over a state
      state.hover.visible = false
      draw(); // redraw
    })



  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // add div to HTML and re-populate content every time `state.hover` updates
  d3.select("#d3-container") // want to add
    .selectAll('div.hover-content')
    .data([state.hover])
    .join("div")
    .attr("class", 'hover-content')
    .classed("visible", d=> d.visible)
    .style("position", 'absolute')
    .style("transform", d=> {
      // only move if we have a value for screenPosition
      if (d.screenPosition)
      return `translate(${d.screenPosition[0]}px, ${d.screenPosition[1]}px)`
    })
    .html(d=> {
      return `
      <div>
      State: ${d.stateName}</div>
      <div>
      Coordinates: ${d.mapPosition}
      </div>
      <div>
      Change in 95 Percent Days: ${d.Change95PercentDays}
      `
    })
}