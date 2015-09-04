var colors = d3.scale.category20c();

function googleColors(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}
$(document).ready(function(){
    new WOW().init();
    window.abreLatam.controller.load();
    
});


window.abreLatam = window.abreLatam || {};
window.abreLatam.controller = {

    load: function(){
    
    var ready = function(error, projects, cities,relationships){

        var filterProjects = _.filter(projects, function(p) {
            if (!p.Ciudad){
                console.log("El projecto " + p.Nombre + " no tiene ciudad y no se lo podra visualizar");
            }
            return p.Ciudad;
        });

        window.abreLatam.map.load();
        window.abreLatam.relationships.load(filterProjects,relationships);
        window.abreLatam.cloud.load(filterProjects);
        window.abreLatam.fociProjectsMap.load(window.abreLatam.map.map,cities,filterProjects);
        window.abreLatam.stats.load(filterProjects);        
    };
    queue()
            .defer(d3.json, "data/proyectos.json")
            .defer(d3.json, "data/ciudades.json")
            .defer(d3.json,"data/relaciones.json")
            .await(ready);

    


        },
        showRelated: function(d){
            window.abreLatam.relationships.show(d);
        },
        hideRelated: function(){
            window.abreLatam.relationships.hide();
        },
        showOnly:function(c){
            var k =(c.country + "-" + c.city).split(' ').join('-').toLowerCase();
                
            window.abreLatam.fociProjectsMap.showOnly(k.toLowerCase());
            var filtered = window.abreLatam.cloud.reload(c.country,c.city,k.toLowerCase());

            window.abreLatam.stats.showOnly(c.country,c.city,filtered);
        },
        showAll:function(){
            window.abreLatam.fociProjectsMap.showAll();
            window.abreLatam.cloud.showAll();
            window.abreLatam.stats.showAll();
        }
};