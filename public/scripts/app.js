var colors = d3.scale.category20c();

$(document).ready(function(){
    new WOW().init();
    var map = new Datamap(
    	{
    		element: document.getElementById('container'),
    		scope: 'world',
    		fills: {
    			defaultFill: "#ffffff",
    			 gt50: colors(Math.random() * 20),
			    eq50: colors(Math.random() * 20),
			    lt25: colors(Math.random() * 10),
			    gt75: colors(Math.random() * 200),
			    lt50: colors(Math.random() * 20),
			    eq0: colors(Math.random() * 1),
			    pink: '#0fa0fa',
			    gt500: colors(Math.random() * 1)
    		},
    		geographyConfig:{
    		 borderColor: '#e5e3df',
    		  highlightOnHover: false,
    		},
    		setProjection: function(element) {
		    	var projection = d3.geo.equirectangular()
		      	.center([-65.85606,  -15.41684])
		      .rotate([4.4, 0])
		      .scale(375)
		      .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
		    	var path = d3.geo.path()
		      		.projection(projection);
    
    		return {path: path, projection: projection};
  		},
    });
    map.bubbles([ 
 		
 		{name: 'Buenos Aires', latitude: -34.60368, longitude: -58.38156, radius: 6, fillKey: 'gt500'},
 		{name: 'Bogota', latitude: 4.71099, longitude:  -74.07209, radius: 6, fillKey: 'eq50'},
 		{name: 'Rio de Janeiro', latitude: -22.90685,  longitude:  -43.17290, radius: 6, fillKey: 'eq50'},
 		{name: 'Santiago', latitude:  -33.44714,   longitude:-70.64950, radius: 6, fillKey: 'lt50'},
 		{name: 'Montevideo', latitude: -34.90505, longitude:  -56.16453, radius: 6, fillKey: 'lt25'},
 		
 		
], {
 popupTemplate: function(geo, data) {
   return "<div class='hoverinfo'>Bubble for " + data.name + "";
 }
});

});