window.abreLatam = window.abreLatam || {};

window.abreLatam.cloud = {

    baseRoot: [],
    filteredRoot: [],
    reload : function(country,city,key){
    	window.abreLatam.cloud.filteredRoot = _.filter(
    		this.projects, function(p) {
    			return p.Ciudad === city && p.Pais === country;
		});
		var root = this.processRoot(window.abreLatam.cloud.filteredRoot);

		

		this.changebubble(root);
		return window.abreLatam.cloud.filteredRoot;
    },
    reloadCountry : function(country){
        window.abreLatam.cloud.filteredRoot = _.filter(
            this.projects, function(p) {
                return p.Pais === country;
        });
        var root = this.processRoot(window.abreLatam.cloud.filteredRoot);

        
        this.changebubble(root);
        return window.abreLatam.cloud.filteredRoot;
    },

   	showAll: function(){
   		var root = this.processRoot(this.projects);
   		this.changebubble(root);
   	},
   	countOrganizations:function(projects){
   		var groups = _.countBy(projects, function(d){
                return d.Quien.trim() === "" ? "N/A" : d.Quien ;
            });
            var nodes = [];
            var i = 0;
            for(var k in groups){ 
                nodes.push({
                    "cluster":0,
                    "color":i,
                    "name": k,
                    "count": groups[k],
                    "size":groups[k]
                });
                i++;
            }

            return nodes;       
   	},
    processRoot: function(projects){
    		
            var tags = [];

            projects = _.map(projects,function(d){
                var currentTags = d.Temas.toLowerCase().split(',');
                tags = tags.concat(currentTags);
                d.tags = currentTags;
                return d;
            });



            var groups = _.countBy(tags, function(d){
                return d;
            });



            var nodes = [];
            var i = 0;
            for(var k in groups){ 
                if (k.trim() != ""){
                    nodes.push({
                        "cluster":0,
                        "color":i,
                        "name": k,
                        "count": groups[k],
                        "size":groups[k]
                    });
                    i++;
                }
            }
            nodes = _.sortBy(nodes, function(o) { return o.count; }).reverse();
			var root = {
            	name: "root",
            	children : nodes,
            };
            return root;
    },
    load: function(projects){
    
    	this.projects = projects;
    	var root = this.processRoot(projects);
    	this.setupColors(projects);

    	this.reloadGraph(root);	


    },
    getCategoryIndex: function(category){
    	for (var i = 0; i < this.categories.length; i++) {
    		if (this.categories[i].name === category){
    			return i;
    		}
    	};
    	return 0;
    },
    setupColors: function(projects){
    	

    	

        var groups = _.countBy(projects, function(d){
                return d.Categoria.trim() === "" ? "N/A" : d.Categoria ;
        });


        window.abreLatam.cloud.categories =  [] 

        var i = 0;
        for(var k in groups){ 
                window.abreLatam.cloud.categories.push({
                    "cluster":0,
                    "color":i,
                    "name": k,
                    "count": groups[k],
                    "size":groups[k]
                });
                i++;
            }
        

    	window.abreLatam.cloud.color = 
    		d3.scale.category20()
		    .domain(d3.range(window.abreLatam.cloud.categories.length));
    	

    },

    getColorFor:function(category){
    	var i = window.abreLatam.cloud.getCategoryIndex(category);
    	return  window.abreLatam.cloud.color(i);
    },
   	reloadGraph: function(root){
        var data = root.children;
        var width = 420,
        barHeight = 20;

        window.abreLatam.cloud.x = d3.scale.linear()
            .range([50, width]);

        var chart = this.svg = d3.select("svg")
              .append("g")
                .attr("transform", "translate(675,200)")
                .attr("width", width)
                .attr("height", width)
                .attr("class", "bubble chart")

        
          window.abreLatam.cloud.x.domain([0, d3.max(data, function(d) { return d.size; })]);

          window.abreLatam.cloud.svg.attr("height", barHeight * data.length);

        window.abreLatam.cloud.changebubble(root); 

        
    },
    changebubble:function(root){
        var barHeight = 20;
        var data = root.children;
        
        
        
        var bar = 
            window.abreLatam.cloud.bar = 
            this.svg.selectAll("g.bar")
              .data(data, function(d,i){
                return i;
              });
        
        bar.attr("transform", function(d, i) 
                    { return "translate(0," + i * barHeight + ")"; });

        bar.enter()
                .append("g")
                .attr('class', 'bar')
                .attr("transform", function(d, i) 
                    { return "translate(0," + i * barHeight + ")"; })
        
        bar.append('rect');
        //         .attr("width", function(d) { return window.abreLatam.cloud.x(d.size); })
        //         .attr("height", barHeight - 1);
        
        bar.append('text');
        //           .attr("x", function(d) { return window.abreLatam.cloud.x(d.size) - 3; })
        //           .attr("y", barHeight / 2)
        //           .attr("dy", ".35em")
        //           .text(function(d) { return d.name +  " - " + d.size; });
        
        bar.select('rect')
                .transition()
                .duration(1000)
                .attr("width", function(d) { return window.abreLatam.cloud.x(d.size); })
                .attr("height", barHeight - 1);
        bar.select('text')
                .transition()
                .duration(1000)
                  .attr("x", function(d) { return window.abreLatam.cloud.x(d.size) - 3; })
                  .attr("y", barHeight / 2)
                  .attr("dy", ".35em")
                  .text(function(d) { return d.name +  " - " + d.size; });
        
        bar.exit().remove();
    }

};

