window.abreLatam = window.abreLatam || {};
window.abreLatam.stats = {
	svg : {},
	load:function(proyectos){

		this.svg = d3.select("svg")
			.append("g")
			.attr('class','stats')
		    .attr("transform", "translate(650,40)")
		    .attr("width", 1000)
		    .attr("height", 2000)
		    .attr("class", "bubble");
		
		this.svg
			.append('text')
			.attr('class','label zona')
			.attr("dx", function(d){return 40})
	    
		this.svg
			.append('text')
			.attr('class','label count')
			.attr("dx", function(d){return 40})
	    	.attr("dy", function(d){return 60})

	    this.svg
			.append('text')
			.attr('class','label copy')
			.attr("dx", function(d){return 140})
			.attr("dy", function(d){return 60})
		
		this.svg
			.append('text')
			.attr('class','label organizaciones count')
			.attr("dx", function(d){return 40})
			.attr("dy", function(d){return 120})
		
		this.svg
			.append('text')
			.attr('class','label organizaciones copy')
			.attr("dx", function(d){return 140})
			.attr("dy", function(d){return 120})


		

		this.proyectos = proyectos
		this.showAll();

	},
	showOnly:function(filtered,country,city){
		window.abreLatam.stats.svg
			.select('text.zona')
			.text(country);
		
		window.abreLatam.stats.svg
			.select('text.count')
			.text(filtered.length);

		var organizations = 
			window.abreLatam.cloud.countOrganizations(filtered);

		window.abreLatam.stats.svg
			.select('text.organizaciones.copy')
			.text(" organizaciones")
		window.abreLatam.stats.svg
			.select('text.organizaciones.count')
			.text(organizations.length);

	
		

		// var projectTemplate = doT.template($( "script.countryTemplateTemplate" ).html());
      	
  //         $(self).popover({
  //           placement: 'auto top',
  //           container: 'body',
  //           trigger: 'manual',
  //           html : true,
  //           content: function() { 
  //             return projectTemplate(d.n);
  //         	}
  //         });
  //         $(self).popover('show');
	},
	showAll:
		function(){
			window.abreLatam.stats.svg
			.select('text.zona')
			.text(" Mundo");

		window.abreLatam.stats.svg
			.select('text.copy')
			.text(" proyectos");
		window.abreLatam.stats.svg
			.select('text.count')
			.text(window.abreLatam.stats.proyectos.length);

		var organizations = window.abreLatam.cloud.countOrganizations(window.abreLatam.stats.proyectos);

		window.abreLatam.stats.svg
			.select('text.organizaciones.copy')
			.text(" organizaciones");

		window.abreLatam.stats.svg
			.select('text.organizaciones.count')
			.text(organizations.length);

	},
}