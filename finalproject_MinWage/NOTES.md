How to add lable to line in graph?

svg.append("text")
.attr("transform", `translate(${width},${y(data[0].Federal)})`)
.attr("dy", ".35em")
.attr("text-anchor", "start")
.style("fill", "blue")
.text("Federal Min Wage");

From Javier:

Take into account that if you plan on having a static element, you won't be able to have dynamic axes (unless you make the constant element also dynamic and make it adjust automatically to each new scale, but I think that's another project). So perhaps you should change yScale to always be based on FedMinWage or show the whole extent of the data. In your case, since you are looking at minimum wage which has a relatively short range, it shouldn't be a problem.

Oh, and to remove Federal Wage from the dropdown, I think the easiest way is to create a .filter when defining state.data, like:

state.data = data.filter(d=> d.stateName !== "Federal"); // state.data is equal to anything in the data that does NOT have stateName = "Federal".

Then for the static path, you could actually refer to a unique instance of the dataset that only contains Federal, like this:

    fedData = data.filter(d=> d.stateName === "Federal");
    init();
