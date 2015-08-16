window.abreLatam = window.abreLatam || {};

window.abreLatam.cloud = {

    reload : function(country){

    },
    load: function(projects){
    
    var 	width = 500,
            height = 600,
            padding = 2, // separation between same-color nodes
            clusterPadding = 15, // separation between different-color nodes
            maxRadius = 20;

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
                    "size":groups[k]
                });
                i++;
            }
            console.log(nodes);
            
            var root = {
            	name: "root",
            	children : nodes,
            };


			var diameter = 600,
			    format = d3.format(",d");

			var pack = d3.layout.pack()
			    .size([diameter - 4, diameter - 4])
			    .value(function(d) { return d.size; });

			var svg = d3.select("svg")
			  .append("g")
			    .attr("transform", "translate(500,2)");

			
			 var node = svg.datum(root).selectAll(".node")
			      .data(pack.nodes)
			    .enter().append("g")
			      .attr("class", 
			      	function(d) { return d.children ? "node" : "leaf node"; })
			      .attr("transform", 
			      	function(d) { 
			      		return "translate(" + d.x + "," + d.y + ")"; 
			      	});

			  node.append("title")
			      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

			  node.append("circle")
			      .attr("r", function(d) { return d.r; });

			  node.filter(function(d) { return !d.children; })
			  	  .append("text")
			      .attr("dy", ".3em")
			      .style("text-anchor", "middle")
			      .text(function(d) { return d.name.substring(0, d.r / 3); });

			d3.select(self.frameElement).style("height", diameter + "px");



    }
};




