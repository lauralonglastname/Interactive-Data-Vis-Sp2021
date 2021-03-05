/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 1,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedParty: "All" // + YOUR INITIAL FILTER SELECTION
};

/* LOAD DATA */
d3.json("../data/environmentRatings.json", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  console.log('state', state)
  // + DEFINE SCALES
xScale = d3.scaleLinear()
.domain(d3.extent(state.data, d=>d.ideologyScore2020))
.range([margin.left, width - margin.right])

yScale = d3.scaleLinear( )
.domain(d3.extent(state.data, d=> d.envScore2020))
.range([height-margin.bottom, margin.top])

  // + DEFINE AXES
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale) 


  // + UI ELEMENT SETUP
  const dropdown = d3.select("#dropdown")
    
  dropdown.selectAll("options")
    .data(["All", "R", "D"])
    .join("option")
    .attr("value", d=> d)
    .text(d=> d)

    dropdown.on("change", event=> {
      console.log("dropdown changed!", event.target.value)
      state.selectedParty = event.target.value
      console.log("new state", state)
      draw();
    })

  // + add dropdown options
  // + add event listener for 'change'

  // + CREATE SVG ELEMENT
svg = d3.select("#d3-container")
  .append("svg")
  .attr('width', width)
  .attr('height', height)

  // + CREATE AXES
svg.append("g")
.attr("class", "xAxis")
.attr("transform", `translate(${0}, ${height-margin.bottom})`) 
.call(xAxis)

svg.append("g")
.attr("class", "yAxis")
.attr("transform", `translate(${margin.left}, ${0})`) 
.call(yAxis)

 // draw(); // calls the draw function 
draw();
 
}

  
/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {

svg.append("circle")

// + FILTER DATA BASED ON STATE
const filteredData = state.data
.filter(d=> {
  if (state.selectedParty === "All") return true
  else return d.Party=== state.selectedParty
}) // <--- update to filter

svg.selectAll("circle")
.data(filteredData, d => d.BioID) //array of objects
.join(
  enter=> enter.append("circle")
  .attr("r", radius)
  .attr("cx", margin.left)
  .attr("fill", d=> {
    if (d.Party==="R") return "red"
    else return "blue"
      } )
  .attr("cy", d=> yScale(d.envScore2020))
  .call(enter=> enter.transition()
    .duration(1000)
    .attr("cx", d=> xScale(d.ideologyScore2020))
  )
  ,
  update => update,
  exit => exit.remove()
);
}
