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
    		var groups = _.countBy(projects, function(d){
                return d.Categoria.trim() === "" ? "N/A" : d.Categoria ;
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
            
			var root = {
            	name: "root",
            	children : nodes,
            };
            return root;
    },
    load: function(projects){
    
    	this.projects = projects;
    	var root = this.processRoot(projects);
    	this.setupColors(root);

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
    setupColors: function(root){
    	

    	window.abreLatam.cloud.categories = root.children.map(function(d,i){
    		return{
    			name:d.name,
    			pos: i,
    		}
    	});

    	window.abreLatam.cloud.color = 
    		d3.scale.category20()
		    .domain(d3.range(window.abreLatam.cloud.categories.length));
    	

    },

    getColorFor:function(category){
    	var i = window.abreLatam.cloud.getCategoryIndex(category);
    	return  window.abreLatam.cloud.color(i);
    },
   	reloadGraph: function(root){
   		var diameter = 300,
    format = d3.format(",d");


var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(10);
this.svg = d3.select("svg")
			  .append("g")
			    .attr("transform", "translate(675,200)")
			    .attr("width", diameter)
			    .attr("height", diameter)
			    .attr("class", "bubble");

var node = window.abreLatam.cloud.svg.selectAll(".node")
    .data(bubble.nodes(classes(root))
    .filter(function (d) {
    return !d.children;
}))
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
});

node.append("title")
    .text(function (d) {
    return d.className + ": " + format(d.value);
});

node.append("circle")
    .attr("r", function (d) {
    return d.r;
})
    .style("fill", function (d, i) {
    return window.abreLatam.cloud.getColorFor(d.className);
});
/* Create the text for each block */
    node.append("text")
	    .attr("dx", function(d){return -20})
	    .text(function(d){return d.className})


// Returns a flattened hierarchy containing all leaf nodes under the root.

function classes(root) {
    var classes = [];

    function recurse(name, node) {
        if (node.children) node.children.forEach(function (child) {
            recurse(node.name, child);
        });
        else classes.push({
            packageName: name,
            className: node.name,
            value: node.size
        });
    }

    recurse(null, root);
    return {
        children: classes
    };
}

//d3.select(self.frameElement).style("height", diameter + "px");


//My Refer;
var click = 0;

this.changebubble= function (root) {
    var node = this.svg.selectAll(".node")
        .data(
            bubble.nodes(classes(root)).filter(function (d){return !d.children;}),
            function(d) {return d.className} // key data based on className to keep object constancy
        );
    
    // capture the enter selection
    var nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    
    // re-use enter selection for circles
    nodeEnter
        .append("circle")
        .attr("r", function (d) {return d.r;})
        .style("fill", function (d, i) {
        	
        	return window.abreLatam.cloud.getColorFor(d.className);
        })
    
    nodeEnter.append("text")
        .attr("dx", function(d){return -20})
	    .text(function(d){return d.className;})
    

    // re-use enter selection for titles
    nodeEnter
        .append("title")
        .text(function (d) {
            return d.className + ": " + format(d.value);
        });
    
    node.select("circle")
        .transition().duration(1000)
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d, i) {
            
            return window.abreLatam.cloud.getColorFor(d.className);
        });
    node.select("text")
    	.transition().duration(1000)
	    .attr("dx", function(d){return -20})
	    .text(function(d){return d.className})


    node.transition().attr("class", "node")
        .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

    node.exit().remove();

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) {
                recurse(node.name, child);
            });
            else classes.push({
                packageName: name,
                className: node.name,
                value: node.size
            });
        }

        recurse(null, root);
        return {
            children: classes
        };
    }

    //d3.select(self.frameElement).style("height", diameter + "px");
	}

   	}
};

