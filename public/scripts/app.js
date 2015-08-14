var colors = d3.scale.category20c();

$(document).ready(function(){
    new WOW().init();
    
    var ready = function(error, projects, cities,us,relations){

        window.abreLatam.map.load();
        window.abreLatam.map.setupBubbles(cities);
        // window.abreLatam.relationships.load(us, cities, relations);
        window.abreLatam.cloud.load(projects);
    };
    queue()
            .defer(d3.json, "data/abrelatam-v1.json")
            .defer(d3.json, "data/cities.json")
            .defer(d3.json, "data/us.json")
            .defer(d3.csv, "data/relations.csv")
            .await(ready);

    

   

});