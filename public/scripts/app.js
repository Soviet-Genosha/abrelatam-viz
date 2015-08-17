var colors = d3.scale.category20c();

function googleColors(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}
$(document).ready(function(){
    new WOW().init();
    
    var ready = function(error, projects, cities,us,relations){


        window.abreLatam.map.load();
        window.abreLatam.cloud.load(projects);
        window.abreLatam.relationships.load(us, cities, relations);
        window.abreLatam.packedCircles.load(window.abreLatam.map.map,cities,projects);
        
        
    };
    queue()
            .defer(d3.json, "data/abrelatam-v1.json")
            .defer(d3.json, "data/cities.json")
            .defer(d3.json, "data/us.json")
            .defer(d3.csv, "data/relations.csv")
            .await(ready);

    

   

});