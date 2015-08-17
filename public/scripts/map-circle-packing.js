window.abreLatam = window.abreLatam || {};
window.abreLatam.packedCircles = {


	load: function(map,cities,projects){
		map.addPlugin('packedCircles', function ( layer, data ) {  
		   			// hold this in a closure
		    var self = this;

		    // a class you'll add to the DOM elements
		    var className = 'bigCircles';

		    // make a D3 selection.
		    var bubbles = layer
		           .selectAll(className)
		           .data( data, JSON.stringify );

		    // bubbles
		    //   .enter()
		    //     .append('circle')
		    //     .attr('class', className) //remember to set the class name
		    //     .attr('cx', function ( datum ) {
		    //     	console.log(datum);
		    //       return self.latLngToXY(datum.google.latitude, datum.google.longitude)[0];
		    //     })
		    //     .attr('cy', function ( datum ) {
		    //       return self.latLngToXY(datum.google.latitude, datum.google.longitude)[1];
		    //     })
		    //     .attr('r', 10);


 			var padding = 5, // separation between same-color nodes
            	clusterPadding = 15, // separation between different-color nodes
            	maxRadius = 30;

            var projectsByCity = _.groupBy(projects, 'Ciudad');
            
            var nodes = [];
            var i = 0;
            for(var k in projectsByCity){ 

            	
            	if (k !== ""){
            		var city;
	            	for (var i = 0; i < cities.length; i++) {
	            		c = cities[i];
	            		if (c.city === k){
	            			city = c;
	            		}
	            	};

	            	projectsByCity[k] = projectsByCity[k].map(function(d){
	            		d.size = 1;
	            		return d;
	            	});
	                nodes.push({
	                    "cluster":0,
	                    "name": k,
	                    "geo" : city,
	                    "children" : projectsByCity[k],
	                    "count": projectsByCity[k].length,
	                    "size":projectsByCity[k].length
	                });
            	}
                i++;
            }
        	

            for (var i = 0; i < nodes.length; i++) {
            	var n = nodes[i];
            	 var root = {
	            	name: "root",
	            	children: n.children
	            };
	            
				var diameter = 50,
				    format = d3.format(",d");

				var pack = d3.layout.pack()
				    .size([diameter - 4, diameter - 4])
				    .value(function(d) { return d.size; });

				var xy = self.latLngToXY(n.geo.google.latitude, n.geo.google.longitude);
				

				var svg = d3.select("svg")
				  .append("g")
				  .attr('class', 'packed-circles')
				    .attr("transform", "translate(" + (xy[0]-20) + "," + (xy[1]-20) + ")");

				
				 var node = svg.datum(root)
				 	   .selectAll(".node")
				      .data(pack.nodes)
				    .enter().append("g")
				      .attr("class", 
				      	function(d) { return d.children ? "node" : "leaf node"; })
				      .attr("transform", 
				      	function(d) { 
				      		return "translate(" + d.x + "," + d.y + ")"; 
				      	});

				  node.append("title")
				      .text(function(d) { return d.Nombre + (d.children ? "" : ": " + format(d.size)); });

				  node.append("circle")
				      .attr("r", function(d) { return 7; })
				      .filter(function(d) { return !d.children; })
				      .attr('class', function(d){
				      	
				      	return d.Tipo1.toLowerCase() + " " + 
				      			d.Tipo2.toLowerCase();
				      })
				      .on('click',function(d){
				      	alert(d.Nombre + ":" + d.Descripcion);
				      });

				  node.filter(function(d) { return !d.children; })
				  	  .append("text")
				      .attr("dy", ".3em")
				      .style("text-anchor", "middle")
				      .text(function(d) { 
				      	return "";
				      	// return d.Nombre.substring(0, d.r / 3); 
				      });

				d3.select(self.frameElement).style("height", diameter + "px");


            };
   












		});
	
		map.packedCircles( projects );  
	},
};