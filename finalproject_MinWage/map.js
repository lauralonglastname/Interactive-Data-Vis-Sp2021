/*** CONSTANTS AND GLOBALS
 * */
const widthMap = window.innerWidth * 0.9,
  heightMap = window.innerHeight * 0.7,
  marginMap = { top: 50, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svgMap;

/**
 * APPLICATION STATE
 * */
let stateMap = {
  // + SET UP STATE
  geojson: null,
  points: null,
  hover: {
    StateName: null, //where is this pulling from?
    MinWage: null, 
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
  d3.csv("../data/USMinWageMap.csv", d3.autoType),
]).then(([geojson, pointsData]) => {
  stateMap.geojson = geojson
  stateMap.points = pointsData
  console.log("stateMap: ", stateMap);
  initMap();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function initMap() { 
  // create an svg element in our main `d3-map` element
  svgMap = d3
    .select("#d3-map")
    .append("svg")
    .attr("width", widthMap)
    .attr("height", heightMap);

    // SPECIFY PROJECTION
    // a projection maps from lat/long -> x/y values
    // so it works a lot like a scale!
    const projection = d3.geoAlbersUsa()
      .fitSize([
      widthMap-marginMap.left-marginMap.right,
      heightMap-marginMap.top-marginMap.bottom], 
      stateMap.geojson);

    // DEFINE PATH FUNCTION
    const pathMap = d3.geoPath(projection)

  //   const colorScale = d3.scaleSequential(d3.interpolateBlues)
  // .domain(d3.extent(state.geojson.features, d=> d.properties.AWATER))

  // + DRAW BASE MAP PATH
      const states = svgMap.selectAll("pathMap.states")
      .data(stateMap.geojson.features)
      .join("pathMap")
      .attr("class", 'states')
      .attr("stroke", "black")
      .attr("fill", "black")
      //is this where i create if statements for data?
      .attr("d", pathMap)

    // EXAMPLE #2: x/y=> lat/long
    // take mouse screen position and report location value in lat/long
    // set up event listener on our svg to see where the mouse is
    .on("mousemove", event => {
      // 1. get mouse x/y position
      const {clientX, clientY} = event

      // 2. invert the projection to go from x/y => lat/long
      // ref: https://github.com/d3/d3-geo#projection_invert
      const [long, lat] = projection.invert([clientX, clientY])
      stateMap.hover=  {
        screenPosition: [clientX, clientY], // will be array of [x,y] once mouse is hovered on something
        mapPosition: [long, lat], // will be array of [long, lat] once mouse is hovered on something
        visible: true
      }
      drawMap();
    }).on("mouseout", event=>{
      // hide tooltip when not moused over a state
      stateMap.hover.visible = false
      drawMap(); // redraw
    })



  drawMap(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function drawMap() {
  // add div to HTML and re-populate content every time `state.hover` updates
  d3.select("#d3-map") // want to add
    .selectAll('div.hover-content')
    .data([stateMap.hover])
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
      U.S. State: ${d.StateName}</div>
      <div>
      Minimum Wage: ${d.MinWage}
      </div>
      `
    })
}