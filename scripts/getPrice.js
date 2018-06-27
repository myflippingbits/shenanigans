const http = require("http");
const logToSplunk = require('./postToSplunk');


var options = {
    host: "bittrex.com",
    port: 80,
    path: "/api/v1.1/public/getticker?market=BTC-LTC",
    method: "GET"
};

http.request(options, function(res) {
    var body = "";

    res.on("data", function(data) {
        body += data;
    });

    res.on("end", function() {
        var price = JSON.parse(body);
        console.log(price);
        logToSplunk(price);
    });
}).end();