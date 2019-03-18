moment = require('moment')
var PD = require('probability-distributions');

//console.log(PD.sample(["H", "T"], 10, true, [0.1, 0.9])) 
//console.log(moment() );
const isIncludeAllCities = true;
//var key = "user_profile_569279392";
//var final = key.substring(key.lastIndexOf("_")+1).trim();
//console.log(final);
//var top_city=["Delhi/NCR", "Bengaluru", "Chennai", "Hyderabad", "Mumbai", "Pune", "Kolkata", "Bengaluru","Ahmedabad"]
//var all_cities=["Almora", "delhi-ncr", "Chennai", "Agra", "Jaipur", "Pune", "Mumbai", "Ahmedabad", "Chandigarh", "Aligarh", "Gwalior", "Guwahati", "Nainital", "Amritsar", "Jammu", "Dhar", "Goa", "Karnal", "Moga", "Shimla", "Patna", "Jodhpur", "Faridabad", "Gurgaon", "Ghaziabad"];
//console.log(top_city.length)
//console.log(all_cities.length)
for(var i=0; i<10;i++){
console.log(Math.random().toFixed(1));
}




//var value = "Agra"

//var arr = [1, 2, 3, 4, 5, 3]
/*
console.log(JSON.stringify(all_cities));
all_cities = all_cities.filter(function(item) { 
    return item !== value
})

console.log(JSON.stringify(all_cities));
*/
/*
var cities = [];
if(isIncludeAllCities){
     cities =  top_city.concat(all_cities);
}
else {
   cities = top_city;
}
*/
//console.log("size of array is "+ top_city.length);
//all_cities.splice(10);
//onsole.log("after"+all_cities.length);

/*Protocol="http";
Host = "internal-digital-movies-app-alb-1839613365.ap-south-1.elb.amazonaws.com"
var top_city=["Delhi/NCR", "Bengaluru", "Chennai", "Hyderabad", "Mumbai", "Pune", "Kolkata", "Bengaluru","Ahmedabad"]
var all_cities=["Almora", "delhi-ncr", "Chennai", "Agra", "Jaipur", "Pune", "Mumbai", "Ahmedabad", "Chandigarh", "Aligarh", "Gwalior", "Guwahati", "Nainital", "Amritsar", "Jammu", "Dhar", "Goa", "Karnal", "Moga", "Shimla", "Patna", "Jodhpur", "Faridabad", "Gurgaon", "Ghaziabad"];
API_city="V2/movies/search"

cinamas=[1231, 12323, 43434];
/*
all_cities = all_cities.filter( function( el ) {
   return top_city.indexOf( el ) < 0;
 } );

 counter=1;
while(counter<=10){
     if(counter>10){
      counter=0;
   }
if(counter<=8){
   var city = top_city[Math.floor(Math.random() * top_city.length)];
}
else{
   var city = all_cities[Math.floor(Math.random() * all_cities.length)];
}


if(counter%2.5==0 || counter%2.5==0.5){
   var city = all_cities[Math.floor(Math.random() * all_cities.length)];
}
else{
   var city = top_city[Math.floor(Math.random() * top_city.length)];
}
   var url = Host+API_city+"?city="+city;
   console.log(url);
   counter=counter+1;
}
*/
/*
JSON.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}', (key, value) => {
   console.log(key); // log the current property name, the last is "".
  // return value;     // return the unchanged property value.
 });
 */