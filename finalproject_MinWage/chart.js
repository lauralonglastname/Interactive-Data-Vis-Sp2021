/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },

  let state = { 
    data: [],
    selection: "1948", // + YOUR FILTER SELECTION
  };

let svg;
let xScale;
let yScale;

d3.csv('../data/productivityWage.csv', d => {
  return {
    Year: new Date(d.Year, 01, 01) 
    ProdWage: d.prodwage,
  }
  }) 
    .then(data => {
      console.log("loaded data:", data);
      state.data = data;
      init(); 
    });

function init() {
    xScale = d3.scaleTime()
    .domain(d3.extent(state.data, d=>d.year))
    .range([margin.left, width - margin.right])
    
    yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d=>d.prodwage))
    .range([height - margin.bottom, margin.bottom])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale) 

    svg = d3.select("#d3-container")
  .append("svg")
  .attr('width', width)
  .attr('height', height)

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
  .text("Federal Minimum Wage Adjusted for Productivity")

draw();
}

function draw() {
  console.log("state.selection", state.selection)
  // + FILTER DATA BASED ON STATE
const filteredData = state.data
.filter(d => state.selection === d.year)

const lineGen = d3.line()
  .x(d=> xScale(d.year))
  .y(d=> yScale(d.prodwage))

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