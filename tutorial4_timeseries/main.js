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
  console.log(d)
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

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // SCALES
  xScale = d3.scaleTime()
  .domain(d3.extent(state.data, d=> d.year))
  .range([margin.left, width - margin.right])

yScale = d3.scaleLinear()
  .domain(d3.extent(state.data, d=> d.envScore2020)) // [min, max]
  .range([height-margin.bottom, margin.top])

// AXES
const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale)

// Create svg
svg = d3.select("#d3-container")
.append("svg")
.attr('width', width)
.attr('height', height)

svg.append("g")
.attr("class", "xAxis")
.attr("transform", `translate(${0}, ${height-margin.bottom})`)
.call(xAxis)
.append("text")
.text("Ideology Score 2020")
.attr("transform", `translate(${width/2}, ${40})`)

svg.append("g")
.attr("class", "yAxis")
.attr("transform", `translate(${margin.left}, ${0})`)
.call(yAxis)

// SETUP UI ELEMENTS
const dropdown = d3.select("#dropdown")

dropdown.selectAll("options")
.data(["All","R", "D"])
.join("option")
.attr("value", d => d)
.text(d=> d)

dropdown.on("change", event=> {
console.log("dropdown changed!", event.target.value)
state.selectedParty = event.target.value
console.log("new state:", state)
draw();
})

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE

  // + UPDATE SCALE(S), if needed

  // + UPDATE AXIS/AXES, if needed

  // + DRAW CIRCLES/LABEL GROUPS, if you decide to

  // + DEFINE LINE GENERATOR FUNCTION

  // + DRAW LINE AND/OR AREA
}
