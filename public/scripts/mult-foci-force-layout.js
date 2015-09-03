window.abreLatam = window.abreLatam || {};

window.abreLatam.fociProjectsMap = {

	
	load: function(map,cities,projects){
		map.addPlugin('packedCircles', function ( layer, data ) {  
	    
	    var self = this;   
 		window.abreLatam.fociProjectsMap.baseSvg = layer;
            	        	
        var width = 960,
	    	height = 500,
	    	transitionDuration = 300,
	    	padding = 3, // separation between nodes
	    	maxRadius = 15;

		var n = 200, // total number of nodes
		    m = 3; // number of distinct clusters


	
		var nodes = projects.map(function(n,j){
			
			var k = n.Ciudad;

			for (var i = 0; i < cities.length; i++) {
	            		c = cities[i];
	            		if (c.city === k){
	            			n.geo = c;
	            		}
	        };

			
			var xy = self.latLngToXY(n.geo.google.latitude, n.geo.google.longitude);
			
			return{
					n:n,
					radius: maxRadius/2.5,
			    	color: window.abreLatam.cloud.getColorFor(n.Tipo2.trim()),
			    	cx: xy[0],
			   		cy: xy[1]		
			};
		});

		
		var force = d3.layout.force()
		    .nodes(nodes)
		    .size([width, height])
		    .gravity(0)
		    .charge(0)
		    .on("tick", tick)
		    .start();

		var circle = window.abreLatam.fociProjectsMap.circles = layer.selectAll("circle")
		    .data(nodes)
		  .enter().append("circle")
		  	.attr('class' ,function(d){
		  		//cluster by city?
		  		var c = (d.n.Pais + "-" + d.n.Ciudad).split(' ').join('-').toLowerCase();
		  		return c;
		  	})
		    .attr("r", function(d) { return d.radius; })
		    .style("fill", function(d) { return d.color; })
		    // .call(force.drag);
		    .on('mouseover',showPopover)
		    .on('mouseout',removePopovers);


		function removePopovers () {
			var self      = d3.select(this);
          $('.popover').remove();
        }

        function showPopover (d) {

        var self      = d3.select(this);
        
    	var projectTemplate = doT.template($( "script.projectTemplate" ).html());
      
          $(self).popover({
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html : true,
            content: function() { 
              return projectTemplate(d.n);
          	}
          });
          $(self).popover('show');
        }
		function tick(e) {
		  circle
		      .each(gravity(.2 * e.alpha))
		      .each(collide(.5))
		      .attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; });
		}

		// Move nodes toward cluster focus.
		function gravity(alpha) {
		  return function(d) {
		    d.y += (d.cy - d.y) * alpha;
		    d.x += (d.cx - d.x) * alpha;
		  };
		}

		// Resolve collisions between nodes.
		function collide(alpha) {
		  var quadtree = d3.geom.quadtree(nodes);
		  return function(d) {
		    var r = d.radius + maxRadius + padding,
		        nx1 = d.x - r,
		        nx2 = d.x + r,
		        ny1 = d.y - r,
		        ny2 = d.y + r;
		    quadtree.visit(function(quad, x1, y1, x2, y2) {
		      if (quad.point && (quad.point !== d)) {
		        var x = d.x - quad.point.x,
		            y = d.y - quad.point.y,
		            l = Math.sqrt(x * x + y * y),
		            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
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

		});
	
		map.packedCircles( projects );  
	},

	showOnly: function(c){
		var layer = window.abreLatam.fociProjectsMap.baseSvg ;
		layer.selectAll('circle')
			.transition()
			.duration(1000)
			.attr('opacity',0);
		layer.selectAll('circle.' + c + '')
			.transition()
			.duration(1000)
			.attr('opacity',1);
	},
	showAll:function(){
		var layer = window.abreLatam.fociProjectsMap.baseSvg ;
		layer.selectAll('circle')
			.transition()
			.duration(1000)
			.attr('opacity',1);
	},



};