const app = document.getElementById('app')

const videoGameURL = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

d3.json(videoGameURL).then(data => buildGraph(data));

const buildGraph = (data) => {
    const width = app.clientWidth;
    const height = app.clientHeight
    const svg = d3.select(app)
                    .append('svg')
                    .attr('width', 1500)
                    .attr('height', 1000);

    const root = d3.hierarchy(data)
    .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value); // Makes PacMan show up with the other smalls
    //console.log(root);

    // catagories
    const catagories = root.children.map(d => d.data.name)
    console.log(catagories);
    const treemapLayout = d3.treemap();

    treemapLayout.size([1500, 1000])
                    .paddingOuter(3)
                    .paddingInner(3);

    treemapLayout.tile(d3.treemapBinary);
    
    treemapLayout(root);
    
    svg.append('g')
        .selectAll('rect')
        .data(root.descendants())
        .enter()
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('class', 'tile')
        //.attr('data-name', )
       // .attr('fill', d => console.log(d))

    const nodes = svg.append('g')
                    .selectAll('g')
                    .data(root.descendants())
                    .enter()
                    .append('g')
                    .attr('transform', d => `translate(${[d.x0, d.y0]})`);

        nodes
            .append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
        nodes
            .append('text')
            .attr('dx', 3)
            .attr('dy', 15)
            .attr('x', 6) // wouldn't place right till I added x and y.. ?
            .attr('y', 15)
            .text(d => d.data.name)
            .call(wrap, 50);


    // Text Wrap from: https://bl.ocks.org/mbostock/7555321
    function wrap(text, width) {
        text.nodes().forEach((name) => {
            var text = d3.select(name),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1 // ems??
                x = text.attr('x')
                y = text.attr('y'),
                dy = 0, //parseFloat(text.attr('dy')),
                tspan = text.text(null)
                            .append('tspan')
                            .attr('x', x)
                            .attr('y', y)
                            .attr('dy', dy + 'em');
            while(word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if(tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text.append('tspan')
                                .attr('x', x)
                                .attr('y', y)
                                .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                                .text(word);
                }
            } 
        });
    }
}