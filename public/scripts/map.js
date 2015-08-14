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
             borderColor: '#e5e3df',
              highlightOnHover: false,
            },
            setProjection: function(element) {
                this.projection = d3.geo.equirectangular()
                .center([-65.85606,  -15.41684])
              .rotate([4.4, 0])
              .scale(375)
              .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            this.path = d3.geo.path()
                    .projection(this.projection);
    
            return {path: this.path, projection: this.projection};
        },
        });
        
    },
    setupBubbles: function(){

        var ready = function ready(error, cities) {

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

            console.log(bubbles);
            window.abreLatam.map.map.bubbles(bubbles, {
             popupTemplate: function(geo, data) {
               return "<div class='hoverinfo'>Bubble for " + data.raw.city + "";
             }
            });

        };
        queue()
            .defer(d3.json, "data/cities.json")
            .await(ready);

        
    }
}