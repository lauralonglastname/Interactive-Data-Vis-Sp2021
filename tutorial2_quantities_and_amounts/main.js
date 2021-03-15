
// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv('../data/squirrelActivities.csv', d3.autoType)
  .then(data => {
    // confirm that the data loaded in by looking in the console
    console.log("data", data)

    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width = window.innerWidth * .8;
    const height = window.innerHeight / 3;
    const margins = { top: 10, bottom: 25, left: 100, right: 100 };
    const paddingInner = 0.2;
          const color = d3.scaleSequential()
      .domain([0, d3.max(data, d=> d.count)])
      .interpolator(d3.interpolateGreens)

    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale

    const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]) // grab the max value
    .range([0, width - margins.right - margins.left])

    const yScale = d3.scaleBand()
    .domain(data.map(d => d.activity)) // get all the `activity` values
    .range([margins.top, height - margins.bottom])
    .paddingInner(paddingInner)

    /** DRAWING ELEMENTS */
    const svg = d3.select('#barchart-container')
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // draw rectangles
    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("height", yScale.bandwidth())
      .attr("width", (d, i) => xScale(d.count))
      .attr("fill", d=>color(d.count))
      .attr("x", (d => margins.left))
      .attr("y", (d => yScale(d.activity)))

    // draw bottom 'activity' text
    svg.selectAll("text.activity")
      .data(data)
      .join("text")
      .attr("class", 'activity')
      .attr("x", d => margins.top)
      .attr("y", d => yScale(d.activity))
      .attr("dy", "2em") // adjust the text a bit lower down
      .attr("text-anchor", 'center') // set the x/y to refer to the right of the word
      .text(d => d.activity) // set the text

    // draw top 'count' text // How do I get the info to be next to each other? 
    svg.selectAll("text.count")
      .data(data)
      .join("text")
      .attr("class", 'count')
      .attr("x", d => xScale(d.count) + margins.right)
      .attr("y", d => yScale(d.activity)+ yScale.bandwidth() / 2) //moves it to the center of the bar 
      .attr("dy", ".75em") // how would i get them on the same line?
      .attr("text-anchor", "start") // How do I offset the text further off the rect? 
      .text(d => d3.format(",")(d.count)) // set the text, add a formatter to properly format numbers: https://github.com/d3/d3-format

  })
