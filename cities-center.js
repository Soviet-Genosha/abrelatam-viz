var fs = require('fs');


var geocoderProvider = 'google';
var httpAdapter = 'https';
// optionnal 
var extra = {
    apiKey: 'AIzaSyBFQvkWCPHonzdAWDJPpNHvCdURbZ1DPBk', // for Mapquest, OpenCage, Google Premier 
    formatter: null         // 'gpx', 'string', ... 
};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
 

 // Or using Promise 

var saveJSON= function(data){
	var jsonDB = JSON.stringify(data, null, 4);


	  	var outputFilename = 'public/data/cities.json';

		fs.writeFile(outputFilename, jsonDB, function(err) {
		    if(err) {
		      console.log(err);
		    } else {
		      console.log("JSON saved to " + outputFilename);
		    }
		}); 
	}

var runGeocoder = function(data,next,cb){
		
		try{
			if (next == data.lenght-1){
				cb();
				return;
			}
			var currentPlace = data[next];
			if (!currentPlace){
				cb();
				return;
			}
			

			var geocodingKey = currentPlace.city + " " + currentPlace.country;
			console.log('Searching for:', next, " ",geocodingKey);
			geocoder.geocode(geocodingKey)
			    .then(function(res) {
			    	if (res.length > 0){
			    		currentPlace.google = res[0];
			    	}
			        runGeocoder(cities,next+1,cb);
			        return;
			    })
			    .catch(function(err) {
			        console.log(err);
			        runGeocoder(cities,next+1,cb);
			        return;
			    });
			}
		catch(e){
			console.log('error:',e.message);
			runGeocoder(cities,next+1,cb);
			return;
		}

	};


var file = 'public/data/abrelatam-v1.json';
var data = JSON.parse(fs.readFileSync(file, 'utf8'));

var cities = [];
var lookup = [];
for (var i = 0; i < data.length; i++) {
	var d = data[i];
  	var city = d.Ciudad;
  	var country = d.Pais;
  	if (city != "" && country!= "" && country != "No Identificado"){
  		
	  	var key = city.trim() + "-" + country.trim();

		if (!(key in lookup)) {
			lookup[key] = 1;
			cities.push({
				key : key.trim(),
				city : city,
				country: country
			});
		}
	}
}

runGeocoder(cities,0,function(){
	saveJSON(cities);
});
	



  	
