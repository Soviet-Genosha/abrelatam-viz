window.abreLatam = window.abreLatam || {};
window.abreLatam.stats = {
	svg : {},
	load:function(proyectos){

		this.svg = d3.select("svg")
			.append("g")
			.attr('class','stats')
		    .attr("transform", "translate(650,20)")
		    .attr("width", 1000)
		    .attr("height", 2000)
		    .attr("class", "bubble");
		this.svg
			.append('text')
			.attr('class','label count')
			.attr("dx", function(d){return 20})
	    	

	    this.svg
			.append('text')
			.attr('class','label zona')
			.attr("dx", function(d){return 50})
		
		this.svg
			.append('text')
			.attr('class','label organizaciones')
			.attr("dx", function(d){return 20})
			.attr("dy", function(d){return 20})

		

		this.proyectos = proyectos
		this.showAll();

	},
	showOnly:function(country,city,filtered){
		window.abreLatam.stats.svg
			.select('text.zona')
			.text(country);
		
		window.abreLatam.stats.svg
			.select('text.count')
			.text(filtered.length);

		var organizations = 
			window.abreLatam.cloud.countOrganizations(filtered);

		window.abreLatam.stats.svg
			.select('text.organizaciones')
			.text(organizations.length + " organizaciones");
		
	},
	showAll:
		function(){
			window.abreLatam.stats.svg
			.select('text.zona')
			.text("Todos los Proyectos");

		window.abreLatam.stats.svg
			.select('text.count')
			.text(window.abreLatam.stats.proyectos.length);

		var organizations = window.abreLatam.cloud.countOrganizations(window.abreLatam.stats.proyectos);

		window.abreLatam.stats.svg
			.select('text.organizaciones')
			.text(organizations.length + " organizaciones");
	},
}