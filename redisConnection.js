var redis = require('redis');
var sleep = require('sleep');
var fs = require('fs')
readline = require('readline');

var hostname = '127.0.0.1' //10.1.4.104
var port = '6379'
var password = 'password' //optional
var db = 1;
var client = redis.createClient(port,hostname,{no_ready_check: true})
//client.select(db, function() { /* ... */ });
//client.select(db);
client.on('connect', function() {
        console.log('Client was connected')
})

/*
// write data to redis db
var rd = readline.createInterface({
  input: fs.createReadStream('/home/ashishmathur/temp_redisUserid.txt'),
  output: process.stdout,
  console: false
});

rd.on('line', function(line) {
  client.set(line, 'my test value', redis.print);
  //console.log(line);
});

console.log("done")

*/

var custid = [];
var f = fs.createWriteStream('userids.csv', {
  //flags: 'a' // 'a' means appending (old data will be preserved)
})
f.write("id" + "\n");
client.keys("*", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        //console.log("    " + i + ": " + reply);
        reply = reply.substring(reply.lastIndexOf("_")+1).trim()
        custid.push(reply);
        f.write(reply + "\n");
        console.log(reply);

        //sleep.msleep(10);
    });
    client.quit();
    f.end();
    console.log("user id's are: ");
    console.log(JSON.stringify(custid));
    console.log("size of Custid is: "+custid.length);
});
