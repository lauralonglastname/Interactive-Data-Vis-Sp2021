/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

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
d3.csv('../data/MinWageData2020Dollars.csv', (d)=> {
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
  .domain(d3.extent(state.data, d=> d.minwage))
  .range([height - margin.bottom, margin.bottom])
  
//     // + DEFINE AXES 
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale) 
  
//     //Create svg
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

const yAxisGroup = svg.append("g")
.attr("class", 'yAxis')
.attr("transform", `translate(${margin.left}, ${0})`) 
.call(yAxis)

xAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", width / 2)
  .attr("y", 40)
  .attr("text-anchor", "middle")
  .attr("fill", "black")
  .text("Year")

yAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", -40)
  .attr("y", height / 2)
  .attr("writing-mode", "vertical-lr")
  .attr("text-anchor", "middle")
  .attr("fill","black")
  .text("Minimum Wage")

 // + UI ELEMENT SETUP
 const selectElement = d3.select("#dropdown")
    
 // + add dropdown options
selectElement //Why did this change to selectElement from 'dropdown'?
   .selectAll("options")
   .data(Array.from(new Set(state.date.map(d=> d.usstate))))
   .join("option")
   .attr("value", d => d)
   .text(d => d)

// const dropdown = d3.select("#dropdown")

// dropdown.selectAll("options")
// .data(Array.from(new Set(state.date.map(d=> d.usstate))))
// .join("option")
// .attr("value", d => d)
// .text(d => d)
// console.log("dropdown: ", dropdown)

dropdown.on("change", event=> {
  console.log("dropdown changed!", event.target.value)
  state.selection = event.target.value
  console.log("new state:", state)
  draw();
})

  draw();
}

// })
draw(); // calls the draw function
// }

/* INITIALIZING FUNTION */ 
function init(){

}
/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  console.log("state.selection", state.selection)
  // + FILTER DATA BASED ON STATE
const filteredData = state.data
.filter(d=> state.selection === d.usstate)

  // + UPDATE SCALE(S), if needed

  // + UPDATE AXIS/AXES, if needed

  // + DRAW CIRCLES/LABEL GROUPS, if you decide to

  // + DEFINE LINE GENERATOR FUNCTION

  // + DRAW LINE AND/OR AREA
  const lineFunction = d3.line()
  .x(d=> xScale(d.year))
  .y(d=> yScale(d.minwage))

}