import http from "k6/http"
import moment from "./libs/moment.js"
import papaparse from "./libs/papaparse.js"
import { sleep } from "k6";

let Protocol = "https://"
let Host = "apiproxy.paytm.com" //"internal-digital-movies-app-alb-1839613365.ap-south-1.elb.amazonaws.com"
let searchV2API = "/v2/movies/search/\?"
const csvData = papaparse.parse(open("./userids.csv"), {header: true});
const NumberOfAllCities = 10;
const isIncludeAllCities = true;

/*
export let options = {
    "vus": 50,
    "duration": "3m",
  //"K6_SETUP_TIMEOUT": "60s",
    "setupTimeout": "120s",
    "iterations": 500,
  //httpDebug: "full"
  };
  */
  //var top_city=["Delhi/NCR", "Bengaluru", "Chennai", "Hyderabad", "Mumbai", "Pune", "Kolkata", "Bengaluru","Ahmedabad"]
  //var all_cities=["Almora", "delhi-ncr", "Chennai", "Agra", "Jaipur", "Pune", "Mumbai", "Ahmedabad", "Chandigarh", "Aligarh", "Gwalior", "Guwahati", "Nainital", "Amritsar", "Jammu", "Dhar", "Goa", "Karnal", "Moga", "Shimla", "Patna", "Jodhpur", "Faridabad", "Gurgaon", "Ghaziabad"];
  
  export function setup(){

    var dateList = [];
    for (let i = 0 ; i < 10 ; i++){
      dateList.push(moment().add(i,'days').format('YYYY-MM-DD'));
    }  

  //console.log(JSON.stringify(dateList));  
    
    var url= "https://apiproxy.paytm.com/v1/movies/cities"
    var resp = http.get(url);
    let citiesRes = JSON.parse(resp.body);

    var top_city = [];  // top cities
    var all_cities = [];  //all cities excluding top cities


    citiesRes.forEach(obj => {
      if(obj.isTopCity == 1){
        top_city.push(obj.value);
        //console.log("TOP CITY -" +obj.value);
      }
      else{
        all_cities.push(obj.value);
      }
    });

    //console.log("all cities size: "+all_cities.length);
    all_cities =  all_cities.slice(0,10);
    //console.log("all cities size: "+all_cities.length);

   // console.log
    //all_cities = all_cities.filter( function( el ) {
    //  return top_city.indexOf( el ) < 0;
    //} );

    //******************************************************
    
     //Fetch cinema code and movie code
    
    var data = {};
    var cities = [];
    if(isIncludeAllCities){
         cities =  top_city.concat(all_cities);
    }
    else {
       cities = top_city;
    }
    
    //console.log("cities size: "+ cities.length);

    cities.forEach(city => {
      var url1= "https://apiproxy.paytm.com/v2/movies/search?city="+city
      //console.log(url1);
      const res1 = http.get(url1);
      if(res1.status == 200){
      let temp1 = JSON.parse(res1.body).movie_list;
      let temp2 = JSON.parse(res1.body).ordered_map.cinema_ids;
       
      let code = {
        "movie_id": temp1,
        "cinema_id": temp2
      };
      data[city]=code;
    }
    else{
      all_cities = all_cities.filter(function(item) { 
        return item !== city
    })
    }
      //console.log(JSON.stringify(code));
      //data[city]=code;
});
     
    //console.log(JSON.stringify(data));
    
    return {
      top_city : top_city,
      all_cities : all_cities,
      data : data,
      date : dateList
    }  

    };
    var count = 0;
  export default function(data) {
  count = count +1;
    //console.log("Inside default function");
    //console.log(counter);
    //var count = `${__ITER}`;
    //count = Number(count)+1;
    //console.log(count);
    if(count%5 == 0){
      var randomTcity =  data.all_cities[Math.floor(Math.random() * data.top_city.length)];
      console.log("all");
    }
    else{
      var randomTcity = data.top_city[Math.floor(Math.random() * data.top_city.length)];
      console.log("top");
    }
    //console.log(`VU: ${__VU}  -  ITER: ${__ITER}`);
    //console.log(`VU: ${__VU}`);
    //console.log(randomTcity);
    
    //console.log(JSON.stringify(data));
    var randomUser = csvData.data[Math.floor(Math.random() * csvData.data.length)].id;
    //console.log(randomUser);
    //var randomTcity =  data.top_city[Math.floor(Math.random() * data.top_city.length)];
    //console.log(randomTcity);
    var randomMovieCode =  data.data[randomTcity].movie_id[Math.floor(Math.random() * data.data[randomTcity].movie_id.length)];
    //console.log(randomMovieCode);
    var randomCinemaCode =  data.data[randomTcity].cinema_id[Math.floor(Math.random() * data.data[randomTcity].cinema_id.length)];
    //console.log(randomCinemaCode);
    var date = data.date[Math.floor(Math.random() * data.date.length)];
    //console.log(date);
    
    var baseurl = `${Protocol}${Host}${searchV2API}`

    // url = Protocol+Host+searchV2API+"city=" +randomTcity+ "&moviecode=" +randomMovieCode;
     //url = Protocol+Host+searchV2API+"city=" +randomTcity+ "&moviecode=" +randomMovieCode+ "&fromdate=" +date
     //url = Protocol+Host+searchV2API+"city=" +randomTcity+ "&moviecode=" +randomMovieCode+ "&customerId=" +randomUser+ "&groupResult=" +true
     //var url = Protocol+Host+searchV2API+"city=" +randomTcity+ "&moviecode=" +randomMovieCode+ "&fromdate=" +date+ "&customerId=" +randomUser+ "&groupResult=" +true
     //console.log(url);
    // http.get(url);
    
    //var res = http.get(url);
    //console.log(JSON.stringify(res.body));

    //var url2 = `${baseurl}city=${randomTcity}&cinemacode=${randomCinemaCode}&fromdate=${date}&customerId=+${randomUser}&groupResult=true`
    //console.log(url2);
    //counter = counter+1;
    sleep(3);
    //console.log("*********************");
    //var res = http.get(url2);
    //console.log(JSON.stringify(res.body));

    //console.log(JSON.stringify(csvData.data[Math.floor(Math.random() * csvData.data.length)][0]));
    //let randomUser = JSON.stringify(csvData.data[Math.floor(Math.random() * csvData.data.length)][0]);
    //console.log("Random user: ", randomUser);
    //var payload = JSON.stringify({ email: "aaa", password: "bbb" });
    //var params =  { headers: { "Content-Type": "application/json" } }
    //http.post(url, payload, params);
    //var res=http.get(url);
    //console.log(JSON.stringify(res));
  };