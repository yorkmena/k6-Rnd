import http from "k6/http"


let Protocol = "http://"
let Host = "internal-digital-movies-app-alb-1839613365.ap-south-1.elb.amazonaws.com"
let API_city = "/v2/movies/search/\?"

export let options = {
    vus: 1,
    
    duration: "10s"
  };
  
export default function() {
    
    var url = Protocol+Host+API_city+"city=delhi-ncr";
    //console.log(url);
    //var payload = JSON.stringify({ email: "aaa", password: "bbb" });
    //var params =  { headers: { "Content-Type": "application/json" } }
    //http.post(url, payload, params);
    var res=http.get(url);
    console.log(JSON.stringify(res));
  };