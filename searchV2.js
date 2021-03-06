import http from "k6/http"
import {sleep} from "k6";
import * as utils from './utils.js';
import { check } from "k6";
import { Counter } from "k6/metrics";

/**
 * customizable paramerers 
 */
let Protocol = "http://"
let Host = "internal-digital-movies-app-alb-1839613365.ap-south-1.elb.amazonaws.com" //"apiproxy.paytm.com"
let searchV2API = "/v2/movies/search/\?"
let citiesV1API = "/v1/movies/cities"
const NumberOfAllCities = 10;
const isIncludeAllCities = true; // run test with only top cities or not?
const dates = 10; // number of future days (including today) for which you want to run test.
var count = 0;
var language = ["bn-IN","hi-IN","or-IN","mr-IN","ml-IN","kn-IN","ta-IN","te-IN","gu-IN","pa-IN"];

var myCounter = new Counter("my_counter");
/**
 * Reads userId's from userids.csv file. which fetch data user personilization redis server.
 */

const csvData = utils.readCSV("./userids.csv");

export let options = {

  vus: 30,
  duration: "5m",
  setupTimeout: "400s",
  noConnectionReuse: true,
  rps : 10,
  userAgent: "MyK6UserAgentString/1.0"
};


/**
 * @description Setup function is invoked automatically before the actual test.
 * @returns {JSON} data 
 */

export function setup() {
    var data = {};
    var dateList = []; //date
    var top_city = []; // top cities
    var all_cities = []; //all cities excluding top cities
    var cities = [];

    //Creating date objects
    dateList = utils.createDates(dates);
    console.log("Date list created");

    //Fetch all cities from cities API and store top cities & all other cities seperatly
    let citiesResponse = JSON.parse(http.get(`${Protocol}${Host}${citiesV1API}`).body);
    citiesResponse.forEach(obj => {
        if (obj.isTopCity == 1) {
            top_city.push(obj.value);
        } else {
            all_cities.push(obj.value);
        }
    });

    //shuffle all_cities array & select number of cities as specified in NumberOfAllCities parameter.
    all_cities = utils.shuffleArray(all_cities);
    all_cities = all_cities.slice(0, NumberOfAllCities);
  
    //Fetches movieid's & cinema id's for all cities using Search API
    if (isIncludeAllCities) {
      cities = top_city.concat(all_cities);
    } else {
      cities = top_city;
    }
    cities.forEach(city => {
        let url = `${Protocol}${Host}${searchV2API}city=${city}`
        console.log(url);
        const res = http.get(url);
        if (res.status == 200) {
            let code = {
                "movie_id": JSON.parse(res.body).movie_list,
                "cinema_id": JSON.parse(res.body).ordered_map.cinema_ids
            };
            data[city] = code;
        } else {
            all_cities = all_cities.filter(function(item) {
                return item !== city
            })
        }
    });

    return {
        top_city: top_city,
        all_cities: all_cities,
        data: data,
        date: dateList
    }
};

/**
 * This is the vu code. Code written in this fn is executed for each iteration of every user.
 * @param {Object} data
 */
export default function(data) {
    //console.log("Inside default function");
    var count = `${__ITER}`;  
    count = count +1;
    var locale;

    if(count%5 == 0){
      var randomTcity =  data.all_cities[Math.floor(Math.random() * data.top_city.length)];
      console.log("all");
    }
    else{
      var randomTcity = data.top_city[Math.floor(Math.random() * data.top_city.length)];
      console.log("top");
    }

    if(count%5 == 0){
      locale = language[Math.floor(Math.random() * language.length)]
    }
    else{
      locale = "en-IN";
    }
      console.log(locale);

    var randomUser = csvData.data[Math.floor(Math.random() * csvData.data.length)].id;
    var randomMovieCode =  data.data[randomTcity].movie_id[Math.floor(Math.random() * data.data[randomTcity].movie_id.length)];
    var randomCinemaCode =  data.data[randomTcity].cinema_id[Math.floor(Math.random() * data.data[randomTcity].cinema_id.length)];
    var date = data.date[Math.floor(Math.random() * data.date.length)];
    
    var baseurl = `${Protocol}${Host}${searchV2API}`

    //console.log(`${baseurl}city=${randomTcity}&moviecode=${randomMovieCode}&fromdate=${date}&customerId=${randomUser}&groupResult=true&locale=${locale}`);
    let responses_moviecode = http.batch([
        `${baseurl}city=${randomTcity}&moviecode=${randomMovieCode}&locale=${locale}`,
        `${baseurl}city=${randomTcity}&moviecode=${randomMovieCode}&fromdate=${date}&locale=${locale}`,
        `${baseurl}city=${randomTcity}&moviecode=${randomMovieCode}&fromdate=${date}&customerId=${randomUser}&locale=${locale}`,
        `${baseurl}city=${randomTcity}&moviecode=${randomMovieCode}&fromdate=${date}&customerId=${randomUser}&groupResult=true&locale=${locale}`
      ]);
      check(responses_moviecode[0], {
        "check response code": res => res.status === 200,
      });

      
    let responses_cinemacode = http.batch([
      `${baseurl}city=${randomTcity}&cinemacode=${randomCinemaCode}&locale=${locale}`,
      `${baseurl}city=${randomTcity}&cinemacode=${randomCinemaCode}&fromdate=${date}&locale=${locale}`,
      `${baseurl}city=${randomTcity}&cinemacode=${randomCinemaCode}&fromdate=${date}&customerId=${randomUser}&locale=${locale}`,
      `${baseurl}city=${randomTcity}&cinemacode=${randomCinemaCode}&fromdate=${date}&customerId=${randomUser}&groupResult=true&locale=${locale}`
    ]);
    check(responses_cinemacode[0], {
      "check response code": res => res.status === 200,
    });


};