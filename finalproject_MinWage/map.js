/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 0, right: 110 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  geojson: null,
  wagecsv: null,
  hover: {
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
]).then(([geojson, wagecsv]) => {
  state.geojson = geojson
  state.wagecsv = wagecsv
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
      height-margin.top-margin.bottom], state.geojson);

    // DEFINE PATH FUNCTION
    const path = d3.geoPath(projection)

    // DEFINE FILL COLOR SCALE 
    // TBD 

    // draw base layer path - one path for each state
    const states = svg.selectAll("path.states")
      .data(state.geojson.features)
      .join("path")
      .attr("class", 'states')
      .attr("stroke", "#3E3E3C")
      .attr("fill", "#E8E9C9")
      .attr("d", path) 

      const legends = ["Greater than Fed Mid Wage", "Equals Federal Min Wage", "No State Min Wage"]
      const legendScale = d3.scaleOrdinal()
              .domain(legends)
              .range(["#228D57", "#E8E9C9", "#3E3E3C"])
      svg.selectAll("legend")
        .data(legends)
        .enter()
        .append("circle")
          .attr("class", "legend")
          .attr("cx", width-margin.right-100)
          .attr("cy", function(d,i) {return (height-margin.bottom)- i*25})
          .attr("r", 7)
          .attr("fill", d => legendScale(d))
          .attr("stroke", "white")
          .attr("stroke-width", "1")
      svg.selectAll("legendLabel")
          .data(legends)
          .enter()
          .append("text")
          .attr("class", "legend")
          .attr("x", width-margin.right-80)
          .attr("y", function(d,i) {return (height-margin.bottom+2.5)- i*25})
          .text(d=>(d))
      
    states
    .on("mousemove", event => {
      const {clientX, clientY} = event
      const [long, lat] = projection.invert([clientX, clientY])
      state.hover=  {
        screenPosition: [clientX, clientY],
        mapPosition: [long, lat], 
        visible: true
      }
      draw();
    }).on("mouseout", event=>{
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
      <div>State Minimum Wage</div>
      State: ${d.StateName}
      <div>
      Minimum Wage: ${d.minwage}
      </div>
      `
    })
}
