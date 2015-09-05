window.abreLatam = window.abreLatam || {};
window.abreLatam.relationships = {
	

	load:function(projects,relationships){
		this.projects = projects;
		this.relationships = relationships;
		this.processRelations();
	},
	draw:function(){
		var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y; })
                         .interpolate("linear");
        //para cada relacion tengo que buscar origen y destino.
        var linesXY = [];
        for (var i = 0; i < this.links.length; i++) {
        	var line= [];
        	var s = this.links[i].source;
        	var t = this.links[i].target;

        	if (s !== t){
        		var sCircle = d3.selectAll('circle[data-id="'+ s + '"]').data()[0];
        		var tCircle = d3.selectAll('circle[data-id="'+ t + '"]').data()[0];
        		if (!sCircle || !tCircle){
        			console.log('Faltan proyectos para visualizar la relacion: ',this.links[i])
        		}
        		else {
        			line.push(sCircle);
        			line.push(tCircle);
        			linesXY.push(line);
        		}
        	}
        };
        for (var i = 0; i < linesXY.length; i++) {
        	var l = linesXY[i];
        	var lineGraph =  d3.select("svg").append("path")
        					.attr('data-source',l[0].id)
        					.attr('data-target',l[1].id)
        					.attr("class","relationship")
                            .attr("d", lineFunction(l))
                            .attr("opacity",0)
                            .attr("stroke", "blue")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

        };
	},
	show:function(d){
		
		var rel = this.getRelationsFor(d.n.Nombre);
		d3.selectAll('circle.map-item')
							.transition()
							.duration(1000)
							.attr('opacity',0.2);

			//Mostrar las relaciones
				var selector = 'path[data-source="' + d.id + '"]';
				selector +=', ';
				selector += 'path[data-target="'+ d.id + '"]';
				d3.selectAll(selector)
				 			.transition()
							.duration(1000)
							.attr('opacity',1);

			//Muesto el ciruclo actual
			var r = rel[i];
				var selector = 'circle.map-item[data-id="' + d.id + '"]';
				d3.selectAll(selector)
				 			.transition()
							.duration(1000)
							.attr('opacity',1);

		if (rel.length === 0){
			console.log('no relations for ',d.n.Nombre);
		}
		else {
			

			//Mostrar los circulos
			for (var i = 0; i < rel.length; i++) {

				var r = rel[i];
				var selector = 'circle.map-item[data-id="' + r.target + '"]';
				selector +=', ';
				selector += 'circle.map-item[data-id="'+ r.source + '"]';
				d3.selectAll(selector)
				 			.transition()
							.duration(1000)
							.attr('opacity',1);
			};
			
		}

	},
	hide:function(){
		d3.selectAll('path.relationship')
			.transition()
			.duration(1000)
			.attr('opacity',0);
		
		d3.selectAll('circle.map-item')
							.transition()
							.duration(1000)
							.attr('opacity',1);
	},
	processRelations: function(){
		this.links = [];
		for (var i = 0; i < this.relationships.length; i++) {
			var r  = this.relationships[i];
			r.index = i;
			r.source = this.getProjectId(r.Origen);
			r.target = this.getProjectId(r.Destino);
			if (r.source == -1 || r.target  == -1){
				console.log('La relacion no tiene proyectos ',r.Origen,r.Destino);
			}
			else {
				this.links.push(r);
			}
		}
		console.log(this.links);
		
	},
	getRelationsFor:function(k){
		var id = this.getProjectId(k);
		if (id === -1){
			console.log('No Id for ',k);
			return [];
		}
		else {
			var result = [];
			for (var i = 0; i < this.relationships.length; i++) {
				var r  = this.relationships[i];
				if(r.source == id || r.target == id){
					result.push(r);
				}
			}
			return result;
		}
	},
	getProjectId:function(k){
		for (var i = 0; i < this.projects.length; i++) {
			if (this.projects[i].Nombre == k){
				return i;
			}
		}
		return -1;
	}
};