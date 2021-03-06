const app = document.getElementById("app");

const videoGameURL =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

d3.json(videoGameURL).then(data => buildGraph(data));

const buildGraph = data => {
	const margin = {top: 10, right: 10, bottom: 150, left: 10}

  const width = 1200 - margin.left - margin.right;//app.clientWidth;
  const height = 800 - margin .top - margin.bottom;//app.clientHeight;
  const svg = d3
    .select(app)
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom);

  const root = d3
    .hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value); // Makes PacMan show up with the other smalls

  // categories
  const categories = root.children.map(d => d.data.name);
	
	const colors = d3.quantize(d3.interpolateRainbow, categories.length + 1); // color goes full circle without the +1
	const colorScale = d3.scaleOrdinal()
												.domain(categories)
												.range(colors);
  
  // tooltip
  const tooltip = d3.select('body')
                    .append('div')
                    .style('position', 'absolute')
                    .style('opacity', 0)
                    .attr('id', 'tooltip');
  
  // Treemap
  const treemapLayout = d3.treemap();
  treemapLayout
    .size([width, height])
    
    .paddingInner(3);

  treemapLayout.tile(d3.treemapBinary);

  treemapLayout(root);
  const nodes = svg
    .selectAll("g")
    .data(root.leaves()) // only uses nodes with no children, unlike descenants()
    .enter()
    .append("g");

  nodes
    .append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
		.attr("data-value", d => d.data.value)
    .attr("data-category", d => d.data.category)
    .style('fill', d => colorScale(d.data.category))
    .on('mouseover', (d,i) => {
      tooltip.style('opacity', 0.8)
              .attr('data-value', d.data.value)
              .style('z-index', 10)
              .html(
                `Name: ${d.data.name}</br>
                Category: ${d.data.category}</br>
                Value: ${d.data.value}`
              )
    })
    .on('mousemove', () => (
      tooltip.style('top', (d3.event.pageY - 20) + 'px')
              .style('left', (d3.event.pageX + 10) + 'px')

    ))
    .on('mouseout', () => tooltip.style('opacity', 0)
                                  .style('z-index', -1))

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
    text.nodes().forEach(name => { // updated each() to nodes.()forEach()
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
	// Legend
	const legendWidth = 500;
  const legendHeight = margin.bottom;
  const legendMargin = (width - legendWidth)/3
	const legend = svg.append('g')
											.attr('id', 'legend')
											.attr('width', legendWidth)
											.attr('height', legendHeight)
											.attr('transform', `translate(${legendMargin},${height+20})`)
									
	const legendElem = legend.append('g')
		.selectAll('g')
		.data(categories)
		.enter()
		.append('g')
		.attr('transform', (d,i) => transformGrid(i))


legendElem.append('rect')
    .attr('class', 'legend-item')
		.attr('width', 20)
		.attr('height', 20)
		.style('fill', d => colorScale(d))
		.attr('data-category', d => d)

legendElem.append('text')
		.text(d => d)
		.attr('x', 25)
		.attr('y', 17)
		.style('font-size', 20);

function transformGrid (index) {
	let x, y;
	const hSpacing = 120;
	const vSpacing = 50;
	const elemPerRow = 6;
	x = (index%elemPerRow)*hSpacing;
	y = (Math.floor(index/elemPerRow))*vSpacing;

	return `translate(${x},${y})`;
}

};
