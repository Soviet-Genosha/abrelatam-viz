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
	},
	show:function(d){
		
		var rel = this.getRelationsFor(d.n.Nombre);
		if (rel.length === 0){
			console.log('no relations for ',d.n.Nombre);
		}
		else {
			//Mostrar los circulos

			//Mostrar las relaciones
		}

	},
	hide:function(){
		console.log('hide relations');
	},
	processRelations: function(){
		this.links = [];
		for (var i = 0; i < this.relationships.length; i++) {
			var r  = this.relationships[i];
			r.index = i;
			r.source = this.getProjectId(r.Origen.toLowerCase());
			r.target = this.getProjectId(r.Destino.toLowerCase());
			if (r.source == -1 || r.target  == -1){
				console.log('La relacion no tiene proyectos ',r.Origen,r.Destino);
			}
			else {
				this.links.push(r);
			}
		};
		
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