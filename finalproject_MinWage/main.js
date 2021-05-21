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

svg.selectAll("path.fedline")
.data([state.data.filter(d => d.usstate === "Federal")])
.join("path")
.attr("class", "fedline")
.attr("d", d=> lineFunction(d))
.attr("stroke", "#228D57")
.attr("fill", "none")

//HOW DO I GET A LABEL AT THE END OF THE LINE? 

// svg.append("text")
// 		.attr("transform", `translate(${width},${y(data[0].usstate)})`)
// 		.attr("dy", ".35em")
// 		.attr("text-anchor", "start")
// 		.style("fill", "blue")
//     .text("Federal Min Wage");
    
  // svg.selectAll("text.usstate")
  //     .data(data)
  //     .join("text")
  //     .attr("class", 'usstate')
  //     .attr("x", d => xScale(d.usstate) + margins.right)
  //     .attr("y", d => yScale(d.StateMinWage)+ yScale.bandwidth() / 2)
  //     .attr("dy", ".75em") 
  //     .attr("text-anchor", "start") 
  //     .text(d => d3.format(",")(d.usstate)) 
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
  .attr("stroke", "#85BB65")

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


