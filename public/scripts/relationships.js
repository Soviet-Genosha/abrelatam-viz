window.abreLatam = window.abreLatam || {};
window.abreLatam.relationships = {
	load:function( us, airports, flights){
		var width = 960,
	    height = 500;


		var projection = d3.geo.albers()
		    .translate([width / 3, height / 2])
		    .scale(100);

		var path = d3.geo.path()
		    .projection(projection);
		var voronoi = d3.geom.voronoi()
		    .x(function(d) { return d.x; })
		    .y(function(d) { return d.y; })
		    .clipExtent([[0, 0], [width, height]]);

		var svg = d3.select("svg");

	

		
		  var airportById = d3.map(),
		      positions = [];

		  airports.forEach(function(d) {

		    airportById.set(d.key, d);
		    d.outgoing = [];
		    d.incoming = [];
		  });

		  console.log(airportById);
		  flights.forEach(function(flight) {
		    var source = airportById.get(flight.origin),
		        target = airportById.get(flight.destination),
		        link = {source: source, target: target};
		        if (source && target){
		    		source.outgoing.push(link);
		    		target.incoming.push(link);
		    		console.log(link)	
		        }
		  });

		  airports = airports.filter(function(d) {
		    if (d.count = Math.max(d.incoming.length, d.outgoing.length)) {
		      d[0] = +d.google.longitude;
		      d[1] = +d.google.latitude;
		      var position = projection(d);
		      d.x = position[0];
		      d.y = position[1];
		      return true;
		    }
		  });

		  voronoi(airports)
		      .forEach(function(d) { d.point.cell = d; });

		  svg.append("path")
		      .datum(topojson.feature(us, us.objects.land))
		      .attr("class", "states")
		      .attr("d", path);

		  svg.append("path")
		      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
		      .attr("class", "state-borders")
		      .attr("d", path);

		  var airport = svg.append("g")
		      .attr("class", "airports")
		    .selectAll("g")
		      .data(airports.sort(function(a, b) { return b.count - a.count; }))
		    .enter().append("g")
		      .attr("class", "airport");

		  airport.append("path")
		      .attr("class", "airport-cell")
		      .attr("d", function(d) { return d.cell.length ? "M" + d.cell.join("L") + "Z" : null; });

		  airport.append("g")
		      .attr("class", "airport-arcs")
		    .selectAll("path")
		      .data(function(d) { return d.outgoing; })
		    .enter().append("path")
		      .attr("d", function(d) { return path({type: "LineString", coordinates: [d.source, d.target]}); });

		  airport.append("circle")
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		      .attr("r", function(d, i) { return Math.sqrt(d.count); });


	}
}