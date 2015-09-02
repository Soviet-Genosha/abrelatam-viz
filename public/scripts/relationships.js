window.abreLatam = window.abreLatam || {};
window.abreLatam.relationships = {
	load:function(us, airports, flights){
		var width = 960,
	    height = 500;


		var voronoi = d3.geom.voronoi()
		    .x(function(d) { return d.x; })
		    .y(function(d) { return d.y; })
		    .clipExtent([[0, 0], [width/1.5, height]]);

		var svg = d3.select("svg");
		
		  var airportById = d3.map(),
		      positions = [];

		  airports.forEach(function(d) {
		    airportById.set(d.key, d);
		    d.outgoing = [];
		    d.incoming = [];
		  });

		  flights.forEach(function(flight) {
		    var source = airportById.get(flight.origin),
		        target = airportById.get(flight.destination),
		        link = {source: source, target: target};
		        if (source && target){
		    		source.outgoing.push(link);
		    		target.incoming.push(link);
		    		
		        }
		  });

		  airports = airports.filter(function(d) {
		    if (d.count = Math.max(d.incoming.length, d.outgoing.length)) {
		      d[0] = +d.google.longitude;
		      d[1] = +d.google.latitude;
		      var position = window.abreLatam.map.map.projection(d);
		      d.x = position[0];
		      d.y = position[1];
		      return true;
		    }
		  });

		  voronoi(airports)
		      .forEach(function(d) { d.point.cell = d; });

		 

		  var airport = svg.append("g")
		      .attr("class", "airports")
		    .selectAll("g")
		      .data(airports.sort(function(a, b) { return b.count - a.count; }))
		    .enter().append("g")
		      .attr("class", "airport");

		  airport.append("path")
		      .attr("class", "airport-cell")
		      .on('mouseover', function(d){
		      	console.log(d);
		      })
		      .attr("d", function(d) 
		      	{ return d.cell.length ? "M" + d.cell.join("L") + "Z" : null; });

		  airport.append("g")
		      .attr("class", "airport-arcs")
		    .selectAll("path")
		      .data(function(d) { return d.outgoing; })
		    .enter().append("path")
		      .attr("d", function(d) { return window.abreLatam.map.map.path({type: "LineString", coordinates: [d.source, d.target]}); });

		  airport.append("circle")
		      .attr("transform", function(d) 
		      	{ return "translate(" + d.x + "," + d.y + ")"; })
		      .attr("r", function(d, i) { return d.count; });


	}
}