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
    // console.log(root);

    const treemapLayout = d3.treemap();

    treemapLayout.size([1500, 1000])
                    .paddingOuter(3)
                    .paddingInner(3);

    treemapLayout.tile(d3.treemapBinary);
    
    treemapLayout(root);
    
    console.log(root.descendants());
    svg.append('g')
        .selectAll('rect')
        .data(root.descendants())
        .enter()
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)

    // var nodes = svg.select('g')
    //     .selectAll('g')
    //     .data(root.descendants())
    //     .enter()
    //     .append('g')
    //     .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'})
      
    //   nodes
    //     .append('rect')
    //     .attr('width', function(d) { return d.x1 - d.x0; })
    //     .attr('height', function(d) { return d.y1 - d.y0; })
      
    //   nodes
    //     .append('text')
    //     .attr('dx', 4)
    //     .attr('dy', 14)
    //     .text(function(d) {
    //       return d.data.name;
    //     })
}