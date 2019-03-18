var redis = require('redis');
var sleep = require('sleep');
var fs = require('fs')
readline = require('readline');

/**
 * Redis configurations
 */
var hostname = "10.1.4.104" //"127.0.0.1"
var port = '6379'
var password = 'password' //optional
var db = 1;
var custid = [];
var f = fs.createWriteStream('userids.csv', {
    //flags: 'a' // 'a' means appending (old data will be preserved)
})

/**
 * fetches data from redis server and create userid.csv file.
 */

redisClient = setupRedisConnection(6379, hostname)
f.write("id" + "\n");
redisClient.keys("*", function(err, replies) {
    console.log("Number of entries: " + replies.length);
    console.log("Reading from Redis & writing to userid.csv file..");
    replies.forEach(function(reply) {
        reply = reply.substring(reply.lastIndexOf("_") + 1).trim()
        custid.push(reply);
        f.write(reply + "\n");
        //console.log(reply);
    });
    redisClient.quit();
    f.end();
    console.log("csv created");
});

/**
 * @description Setup connection with redis server and returns redis client obj
 * @param {Integer} port
 * @param {string} hostname
 * @param {Integer} dbNumber [optional]
 * @returns {Object} redis client object
 */

function setupRedisConnection(port, hostname, dbNumber) {
    var client = redis.createClient(port, hostname, {
        no_ready_check: true
    })
    if (db) {
        client.select(db);
    }
    client.on('connect', function() {
        console.log('Redis Client connected')
    })
    return client;
}

/**
 * @description: fetch all keys from redis  
 * @param {Object} [redisClient] 
 * @returns {Array} All the keys 
 */
function fetchAllKeys(redisClient) {
    keys = []
    redisClient.keys("*", function(err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function(reply, i) {
            console.log("    " + i + ": " + reply);
            keys.push(reply);
            console.log(reply);
        })
    })
    return keys
}

/**
 * @description reads a file and inserts each line of file as key to redis. value will will "test value".
 * @param {Object} [redisClient]
 * @param {string} [filePath]
 */
function writeCsvToRedis(redisClient, filePath) {
    var rd = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        console: false
    });

    rd.on('line', function(line) {
        redisClient.set(line, 'test value', redis.print);
    });
    console.log("Writing to redis finished")
}