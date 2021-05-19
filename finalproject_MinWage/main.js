//MAP MODULE 

/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 50, bottom: 50, left: 60, right: 40 };

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
  d3.csv("../data/MinWageMap.csv", d3.autoType),
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
    .select("#d3-map")
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
        if (d.State = Greater) return "orange";
        if (d.State = Equals) return "green";
        if (d.State = None) return "black";
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
  d3.select("#d3-map") // want to add
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
      State: ${d.State}</div>
      <div>
       2021 Minimum Wage: ${d.minwage}
      </div>
      `
    })
}

// AREA GRAPH MODULE 

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 3.5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = { 
  data: [],
  selection: "Federal", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv('../data/MinWageData2020Dollars.csv', d => {
return {
  usstate: d.State,
  minwage: +d.StateMinWage,
  fedwage: +d.FedMinWage,
  year: new Date(d.Year, 01, 01) 
}
}) 
  .then(data => {
    console.log("loaded data:", data);
    state.data = data;
    init(); 
  });

// /* INITIALIZING FUNCTION */
// // this will be run *one time* when the data finishes loading in
function init() {
//   // + DEFINE SCALES
  xScale = d3.scaleTime()
  .domain(d3.extent(state.data, d=>d.year))
  .range([margin.left, width - margin.right])
  
  yScale = d3.scaleLinear()
  .domain(d3.extent(state.data, d=>d.minwage))
  .range([height - margin.bottom, margin.bottom])
  
//     // + DEFINE AXES 
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale) 
  
    // + UI ELEMENT SETUP
  const dropdown = d3.select('#dropdown')

  // add in dropdown options from the unique values in the data
  dropdown.selectAll("option")
    .data(
      Array.from(new Set(state.data.map(d => d.usstate))))
    .join("option")
    .attr("value", d => d)
    .text(d => d)

    // How to remove just Fed from the dropdown? 

    dropdown.on("change", event => {
      console.log("dropdown changed!", event.target.value)
      state.selection = event.target.value
      console.log("new state", state)
      draw();
    })

// + CREATE SVG ELEMENT
svg = d3.select("#d3-container")
  .append("svg")
  .attr('width', width)
  .attr('height', height)

  // + CREATE AXES
const xAxisGroup = svg.append("g")
.attr("class", 'xAxis') //what is the differnece btween " and ' 
.attr("transform", `translate(${0}, ${height - margin.bottom})`) 
.call(xAxis)

xAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", width / 2 )
  .attr("y", 40)
  .attr("text-anchor", "middle")
  .attr("font-size","14")
  .attr("fill", "black")
  .text("Year")

const yAxisGroup = svg.append("g")
.attr("class", 'yAxis')
.attr("transform", `translate(${margin.left}, ${0})`) 
.call(yAxis)

yAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", -40)
  .attr("y", height /2)
  .attr("writing-mode", "vertical-lr")
  .attr("text-anchor", "middle")
  .attr("font-size","14")
  .attr("fill","black")
  .text("Minimum Wage $USD 2020")

  // /* CREATE FIXED FED MIN WAGE LINE */ 
const lineFunction = d3.line()
.x(d=> xScale(d.year))
.y(d=> yScale(d.minwage))

svg.selectAll("path.line")
.data([filteredData = state.data.filter(d => state.selection === d.FedMinWage)])
.join("path")
.attr("class", "line")
.attr("d", d=> lineFunction(d))
.attr("stroke", "blue")

//  // + UI ELEMENT SETUP
//  const selectElement = d3.select("#dropdown")
    
//  // + add dropdown options
// selectElement //Why did this change to selectElement from 'dropdown'?
//    .selectAll("options")
//    .data(Array.from(new Set(state.date.map(d=> d.usstate))))
//    .join("option")
//    .attr("value", d => d)
//    .text(d => d)

// })
draw(); // calls the draw function
}



// draw();
// }

/* INITIALIZING FUNTION */ 
// function init(){

// }
/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  console.log("state.selection", state.selection)
  // + FILTER DATA BASED ON STATE
const filteredData = state.data
.filter(d => state.selection === d.usstate)

  // + UPDATE SCALE(S), if needed

  // + UPDATE AXIS/AXES, if needed

  // + DRAW CIRCLES/LABEL GROUPS, if you decide to

  const dots = svg 
  .selectAll(".dot")
  .data(filteredData, d => d.minwage)
  .join(
    enter => enter.append("g")
      .attr("class", "dot")
      .attr("fill", "#228D57")
      .attr("transform", d => `translate(${xScale(d.year)}, ${yScale(d.minwage)})`)
    ,
    update => update
      .call(update => update.transition()
        .duration(900)
        .attr("transform", d => `translate(${xScale(d.year)}, ${yScale(d.minwage)})`)
    ),
    exit => exit.remove()
  );

dots.selectAll("circle")
    .data(d => [d]) 
    .join("circle")
    .attr("r", radius)


  // + DEFINE LINE GENERATOR FUNCTION
  const lineGen = d3.line()
  .x(d=> xScale(d.year))
  .y(d=> yScale(d.minwage))

  // + DRAW LINE AND/OR AREA

  svg.selectAll("path.line")
  .data([filteredData])
  .join("path")
  .attr("class", "line")
  .attr("d", d=> lineGen(d))
  .attr("fill", "none")
  .attr("stroke", "#228D57")

    const areaGen = d3.area()
  .x(d => xScale(d.year))
  .y0(yScale(0))
  .y1(d => yScale(d.minwage))

  svg.selectAll(".area")
  .data([filteredData]) // data needs to take an []
  .join("path")
  .attr("class", 'area')
  .attr("fill", "#85bb65")
  .attr("opacity", 0.5)
  .transition()
  .duration(1000)
  .attr("d", d => areaGen(d))

}

// LINE GRAPH MODULE

