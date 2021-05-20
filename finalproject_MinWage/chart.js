/* CONSTANTS AND GLOBALS */
const widthProd = window.innerWidth * 0.7,
  heightProd = window.innerHeight * 0.7,
  marginProd = { top: 20, bottom: 50, left: 60, right: 40 },
  radiusProd = 3.5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svgProd;
let xScaleProd;
let yScaleProd;

/* APPLICATION STATE */
let stateProd = { 
  data: [],
  selection: "New York", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv('../data/productivityWage.csv', d => {
return {
  minwage: +d.productivityWage,
  year: new Date(d.Year, 01, 01) 
}
}) 
  .then(data => {
    console.log("loaded data:", data);
    state.data = data;
    initProd(); 
  });

// /* INITIALIZING FUNCTION */
// // this will be run *one time* when the data finishes loading in
function initProd() {
//   // + DEFINE SCALES
  xScale = d3.scaleTime()
  .domain(d3.extent(stateProd.data, d=>d.year))
  .range([marginProd.left, widthProd - marginProd.right])
  
  yScale = d3.scaleLinear()
  .domain(d3.extent(stateProd.data, d=>d.minwage))
  .range([heightProd - marginProd.bottom, marginProd.bottom])
  
//     // + DEFINE AXES 
    const xAxisProd = d3.axisBottom(xScaleProd)
    const yAxisProd = d3.axisLeft(yScaleProd) 


// + CREATE SVG ELEMENT
svgProd = d3.select("#d3-container")
  .append("svg")
  .attr('width', width)
  .attr('height', height)

  // + CREATE AXES
const xAxisGroup = svgProd.append("g")
.attr("class", 'xAxis') //what is the differnece btween " and ' 
.attr("transform", `translate(${0}, ${heightProd - marginProd.bottom})`) 
.call(xAxisProd)

xAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", width / 2 )
  .attr("y", 40)
  .attr("text-anchor", "middle")
  .attr("font-size","14")
  .attr("fill", "black")
  .text("Year")

const yAxisGroup = svgProd.append("g")
.attr("class", 'yAxis')
.attr("transform", `translate(${marginProd.left}, ${0})`) 
.call(yAxis)

yAxisGroup.append("text")
  .attr("class", 'axis-title')
  .attr("x", -40)
  .attr("y", height /2)
  .attr("writing-mode", "vertical-lr")
  .attr("text-anchor", "middle")
  .attr("font-size","14")
  .attr("fill","black")
  .text("Minimum Wage Adjust for Productivity")

  // /* CREATE FIXED FED MIN WAGE LINE */ 
const lineFunctionProd = d3.line()
.x(d=> xScaleProd(d.year))
.y(d=> yScaleProd(d.minwage))

svgProd.selectAll("path.minLine")
.data([d.productivityWage])
.join("path")
.attr("class", "minLine")
.attr("d", d=> lineFunctionProd(d))
.attr("stroke", "blue")
.attr("fill", "none")
    
drawProd(); // calls the draw function
}



// draw();
// }

/* INITIALIZING FUNTION */ 
// function init(){

// }
/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function drawProd() {
  console.log("state.selection", state.selection)
  // + FILTER DATA BASED ON STATE
const filteredData = state.data
.filter(d => state.selection === d.usstate)

  // + DRAW CIRCLES/LABEL GROUPS, if you decide to

  const dotsProd = svgProd 
  .selectAll(".dot")
  .data(filteredData, d => d.productivityWage)
  .join(
    enter => enter.append("g")
      .attr("class", "dot")
      .attr("fill", "#228D57")
      .attr("transform", d => `translate(${xScaleProd(d.year)}, ${yScaleProd(d.productivityWage)})`)
    ,
    updateProd => updateProd
      .call(updateProd => updateProd.transition()
        .duration(900)
        .attr("transform", d => `translate(${xScaleProd(d.year)}, ${yScaleProd(d.productivityWage)})`)
    ),
    exit => exit.remove()
  );

dotsProd.selectAll("circle")
    .data(d => [d]) 
    .join("circle")
    .attr("r", radiusProd)


  // + DEFINE LINE GENERATOR FUNCTION
  const lineGenProd = d3.line()
  .x(d=> xScaleProd(d.year))
  .y(d=> yScaleProd(d.productivityWage))

  // + DRAW LINE AND/OR AREA

  svgProd.selectAll("path.line")
  .data([filteredData])
  .join("path")
  .attr("class", "line")
  .attr("d", d=> lineGen(d))
  .attr("fill", "none")
  .attr("stroke", "#228D57")

    const areaGen = d3.area()
  .x(d => xScaleProd(d.year))
  .y0(yScaleProd(0))
  .y1(d => yScaleProd(d.productivityWage))

  svgProd.selectAll(".area")
  .data([filteredData]) // data needs to take an []
  .join("path")
  .attr("class", 'area')
  .attr("fill", "#85bb65")
  .attr("opacity", 0.5)
  .transition()
  .duration(1000)
  .attr("d", d => areaGen(d))

}


