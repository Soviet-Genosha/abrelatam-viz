window.abreLatam = window.abreLatam || {};

window.abreLatam.cloud = {

    reload : function(country){

    },
    load: function(projects){
    
    var width = 1280,
            height = 720,
            padding = 2, // separation between same-color nodes
            clusterPadding = 25, // separation between different-color nodes
            maxRadius = 50;

            var groups = _.countBy(projects, function(d){
                return d.Tipo2.trim() === "" ? "N/A" : d.Tipo2 ;
            });
            var nodes = [];
            var i = 0;
            for(var k in groups){ 
                nodes.push({
                    "cluster":0,
                    "name": k,
                    "count": groups[k],
                    "radius":groups[k]*2
                });
                i++;
            }
            console.log(nodes);
            
        //count in.
        var n = 50, // total number of nodes
            m = 1; // number of distinct clusters


            var color = d3.scale.category10()
                .domain(d3.range(m));



        // The largest node for each cluster.
        var clusters = new Array(m);

            

            nodes.forEach(function(d) { clusters[d.cluster] = d; });

         // Use the pack layout to initialize node positions.
            d3.layout.pack()
                .sort(null)
                .size([width, height])
                .children(function(d) { return d.values; })
                .value(function(d) { return d.radius * d.radius; })
                .nodes({values: d3.nest()
                  .key(function(d) { return d.cluster; })
                  .entries(nodes)});



        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0.005)
            .charge(0.005)
            .on("tick", tick)
            .start();

        var svg = d3.select("svg")
        .append("svg")
            // .attr("width", "100%")
            // .attr("height", "100%")
            // .attr("viewBox", "0 0 1280 720");

        var node = svg.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "node")
            .style("fill", function (d) {
                        return color(d.cluster);
                    })
            .call(force.drag)

            .on('mouseover', function(d){
                
            });
            node.append("text")
                .text(function(d) { return d.name; })
                .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
                .attr("dy", ".35em");

            
            node.transition()
                .duration(3000)
                .delay(function (d, i) {
                return i * .5;
            }).attrTween("r", function (d) {
                    var i = d3.interpolate(0, d.radius);
                        return function (t) {
                                    return d.radius = i(t);
                                };
                    })
             
            node.selectAll("text")
                .transition()
                    .duration(3000)
                    .delay(function (d, i) {
                    return i * .5;
                })
                .style("font-size", function(d) { 
                    return Math.min(2 * d.r, (2 * d.r - 8) / 
                        this.getComputedTextLength() * 24) + "px"; })
                

                        
        function tick(e) {
            node.each(cluster(3 * e.alpha * e.alpha))
                .each(collide(.08))
                .attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                return d.y;
            });
        }

        // Move d to be adjacent to the cluster node.
        function cluster(alpha) {
            return function (d) {
                var cluster = clusters[d.cluster];
                if (cluster === d) return;
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l != r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
            };
        }

        // Resolves collisions between d and all other circles.
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes);
            return function (d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }


        function update() {

            console.log(nodes[3].cluster);
            
            // Update the nodes…
            node = svg.selectAll("circle.node")
                .data(nodes)
                .style("fill", function (d) {
                        return color(d.cluster);
                    })
             .attr("r", function (d) {
                return d.radius;
            });
           //  // Enter any new nodes.
           //  node.enter().append("circle")
           //      .attr("class", "node")
           //      .attr("cx", function (d) {
           //      return d.x;
           //  })
           //      .attr("cy", function (d) {
           //      return d.y;
           //  })
           //      .attr("r", function (d) {
           //      return d.radius;
           //  })

           //      .style("fill", function (d) {
           //           return color(d.cluster);
                    // })
           //      .call(force.drag);

           // //  // Exit any old nodes.
           //   node.exit().remove();

            // Restart the force layout.
            force.start();
        }


        function addNode() {
            // nodes.push({
            //     cluster: Math.round(Math.random()*3),
            //     radius: Math.random()*100,
            //     x: Math.cos(3 / 4 * 2 * Math.PI) * 200 + width / 2 + Math.random(),
            //     y: Math.sin(5 / 4 * 2 * Math.PI) * 200 + height / 2 + Math.random()
            // });
            nodes.forEach(function(d) {
                d.cluster = Math.round(Math.random()* 3)  ;
                d.radius = Math.round(Math.random()* 100)  ;

                 });
            update();
        }

        d3.select('button').on("click", addNode);


        




    }
};

