window.abreLatam = window.abreLatam || {};
window.abreLatam.map = {
    map :{},
    load: function(){
        this.map = new Datamap(
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
                // dataUrl: '/scripts/latam.json', //ESTO DEBERIA CARGAR SOLO EL MAPA DE LATAM!
                borderColor: '#e5e3df',
              highlightOnHover: true,
            },
            setProjection: function(element) {
                this.projection = d3.geo.mercator() //ACA CAMBIE LA PROYECCION
                .center([-35,  -17])
              .rotate([2.7, 0])
              .scale(450)
              .translate([element.offsetWidth / 2
                , element.offsetHeight / 1.5]);
            this.path = d3.geo.path()
                    .projection(this.projection);
    
            return {path: this.path, projection: this.projection};
        },
         done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit')
            .on('mouseover', function(geography) {
                //Mostrar solo regionales.
                window.abreLatam.controller.showOnlyByCountry(geography.properties.name);
            })
            .on('mouseout', function(geography){
                window.abreLatam.controller.showAll();
            })
        },
        });
    //HACK: To hide the rest of the wolrd
    d3.select("svg")
                .append("rect")
                .attr("transform", "translate(600,-50)")
                .attr("class","back")
                .attr("x", 10)
                .attr("y", 10)
                .attr("width", 1025)
                .attr("height", 1000)
        
    },
    setupBubbles: function(cities){

            var bubbles = []
            for (var i = 0; i < cities.length; i++) {
                var  c = cities[i];
                bubbles.push({
                    raw: c,
                    name: c.city, 
                    latitude: c.google.latitude, 
                    longitude: c.google.longitude,
                    radius: 6, 
                    fillKey: 'gt500'
                })
            };

            window.abreLatam.map.map.bubbles(bubbles, {
             popupTemplate: function(geo, data) {
               return "<div class='hoverinfo'>Bubble for " + data.raw.city + "";
             }
            });

        

        
    }
}