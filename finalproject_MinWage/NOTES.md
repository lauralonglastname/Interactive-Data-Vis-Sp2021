Data from 1938 to 1968 is inconsistent. For example, Alaska did not become a state until 1959. Should I delete the data points from 1938-1958 from Alaska to reflect that? Or best practives to just stick to post 1968?

How do I create the fixed fed min wage line? I delete the entire area graph every time I try it out.

// /_ CREATE FIXED FED MIN WAGE LINE _/
const lineFunction = d3.line()
.x(d=> xScale(d.year))
.y(d=> yScale(d.minwage))

svg.selectAll("path.line")
.data([filteredData = state.data.filter(d => state.selection === d.FedMinWage)])
.join("path")
.attr("class", "line")
.attr("d", d=> lineFunction(d))
.attr("stroke", "black")
