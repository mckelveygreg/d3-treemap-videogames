const app = document.getElementById("app");

const videoGameURL =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

d3.json(videoGameURL).then(data => buildGraph(data));

const buildGraph = data => {
  const width = app.clientWidth;
  const height = app.clientHeight;
  const svg = d3
    .select(app)
    .append("svg")
    .attr("width", 1200)
    .attr("height", 700);

  const root = d3
    .hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value); // Makes PacMan show up with the other smalls
  //console.log(root);

  // categories
  const categories = root.children.map(d => d.data.name);
	
	const colors = d3.quantize(d3.interpolateRainbow, categories.length);
	console.log(colors);
	const colorScale = d3.scaleOrdinal()
												.domain(categories)
												.range(colors);
	
  const treemapLayout = d3.treemap();
  treemapLayout
    .size([1200, 700])
    .paddingOuter(3)
    .paddingInner(3);

  treemapLayout.tile(d3.treemapBinary);

  treemapLayout(root);

  const nodes = svg
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g");

  nodes
    .append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("data-rando", "random")
    //.attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
		.attr("data-value", d => d.data.value)
		.style('fill', d => colorScale(d.data.category))

  nodes
    .append("text")
    .style("fill", "black")
    //.attr("dx", 0)
    //.attr("dy", 15) // don't know what it adjusts...
    .attr("x", 2) // positions text in rect
    .attr("y", 12)
    .attr("transform", d => `translate(${[d.x0, d.y0]})`)

    .text(d => d.data.name)
    .call(wrap, 50);

  // Text Wrap from: https://bl.ocks.org/mbostock/7555321
  function wrap(text, width) {
    text.nodes().forEach(name => {
      var text = d3.select(name),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1; // ems??
      x = text.attr("x");
      (y = text.attr("y")),
        (dy = 0), //parseFloat(text.attr('dy')),
        (tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em"));
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }
};
