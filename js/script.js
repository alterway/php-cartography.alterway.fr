window.onload = function() {
    var w = 960,
        h = 800,
        r = 720,
        x = d3.scale.linear().range([0, r]),
        y = d3.scale.linear().range([0, r]),
        node,
        root;

    var pack = d3.layout.pack()
        .size([r, r])
        .value(function(d) { return 1; /* We cannot use the following code for the moment: return d.size; */ })



    var vis = d3.select("#svg").insert("svg:svg", "h2")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

    // Init tooltip
    var tipCirclePack = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            if(d == node && !d.children) {
                return "click to open website of " + d.name + "<br>" + d.description;
            }
            return "<strong>" + d.name + "</strong><br />" + (d.description ? d.description : '');
        })
    vis.call(tipCirclePack);
    var currentZoom = 0;
    d3.json("data.json", function(data) {
        node = root = data;

        var nodes = pack.nodes(root);

        vis.selectAll("circle")
            .data(nodes)
            .enter().append("svg:circle")
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.r; })
            .on("click", function(d) {
                if(d == node && !d.children) {
                    var win = window.open(d.uri, '_blank');
                    win.focus();
                }
                return zoom(node == d ? root : d);

            })

            // aw
            .attr("rInit", function(d, i) { return d.r })
            .on('mouseover', function (d,i) {
                tipCirclePack.show(d)                 ;
            })
            .on('mouseout', function (d,i) {
                tipCirclePack.hide(d)
            })

        ;

        vis.selectAll("text")
            .data(nodes)
            .enter().append("svg:text")
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("opacity", function(d) {return d.depth == currentZoom + 1 ? 1 : 0;  })
            .text(function(d) {
                return d.name;
            })
        ;

        d3.select(window).on("click", function() { zoom(root); });
    });

    function zoom(d, i) {
        var k = r / d.r / 2;
        x.domain([d.x - d.r, d.x + d.r]);
        y.domain([d.y - d.r, d.y + d.r]);
        currentZoom = d.depth;
        var t = vis.transition()
            .duration(d3.event.altKey ? 7500 : 750);

        t.selectAll("circle")
            .attr("cx", function(d) { return x(d.x); })
            .attr("cy", function(d) { return y(d.y); })
            .attr("r", function(d) { return k * d.r; });

        t.selectAll("text")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .style("opacity", function(d) { return d.depth <= currentZoom + 1 ? 1 : 0; });

        node = d;
        d3.event.stopPropagation();
    }
}