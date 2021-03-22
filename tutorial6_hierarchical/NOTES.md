## NOTES

---

INSTRUCTIONS:
Use this markdown file to keep track of open questions/challenges from this week's assignment.

- What did you have trouble solving?
- What went easier than expected?
- What, if anything, is currently blocking you?

Sometimes it helps to formulate what you understood and where you got stuck in order to move forward. Feel free to include `code snippets`, `screenshots`, and `error message text` here as well.

If you find you're not able complete this week's assignment, reflecting on where you are getting stuck here will help you get full credit for this week's tutorial

---

flare is the data set
"flare" is the high level parent, name is the property
which as a "children array", which has its own "children array"
each end node as a name and a value
we want to take the value for all the child nodes within a parent, and sum it up, and represent that spcae graphically
each nidividual box is going to be end node value, and the groupings are other parents.

d3.heirarchy helps create a root node (the stump of the tree) and return a json of the structure i.e. node.height
when you create a root node you, take d3 heirary and pass it in json data
the .sum tells d3 how to add the child nodes, how to represetn each region, which is called d.value
and then you can pass it in a sort

when we pass d3 hierary, we get back a data structure called Node Type, Node {} which includes info like data, height, depth , parent, (as defined in d3.heirary), and the value (which determines sizing and positioning of the elements)

once we have the root node we can pass it to a layout function. This is like how we specify the path function. and we can add custom attributes. Once we pass it into layout function we get y0 (initial) x0, and x1, y1. (This means we dont need scales because algorthim takes care of positioning)

Then we can map over it, or render the tree nodes, by passing through .data(root.leaves())

Once you have hierarchical data and root node, you can pass it through any layout function

If we need to get to the tree map, what pieces do we need?
define the tree function (const tree = d3.treemap) where we know we can specify the size

And now we want to pass through the root data treeLayout(root), but we need to calculate the root heirarchy node. So do that we are going to define a new variable root = d3.heiarachy(state.data)

then we want to connect the layout to the root node: const tree = treeLayout(root) which gives you the x0, y0, x, y properties. This is where you get different info when running "circle pack".

Nodes are the data we want to map into it.But now we want to create rectangles. We want a rect for each children node, aka the "leaf". We want a rect for each leaf.

once we have a root, we can pull out all the leaves (const leaves = root.leaves())

we create each rect via svg selectAll, but we need to get the value to attach to the size.

We can set the value with node.sum or node.count.

---

How do I change the stroke weight between the childnre v parent data levels?

How do I change the opacity of the mouseover container? line 50
