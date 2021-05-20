Data from 1938 to 1968 is inconsistent. For example, Alaska did not become a state until 1959. Should I delete the data points from 1938-1958 from Alaska to reflect that? Or best practives to just stick to post 1968?

How to add lable to line in graph?

svg.append("text")
.attr("transform", `translate(${width},${y(data[0].Federal)})`)
.attr("dy", ".35em")
.attr("text-anchor", "start")
.style("fill", "blue")
.text("Federal Min Wage");
