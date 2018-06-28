const http = require("http");
const logToSplunk = require('./sendToSplunk');


var options = {
    host: "bittrex.com",
    port: 80,
    path: "/api/v1.1/public/getticker?market=BTC-LTC",
    method: "GET"
};


function fetchAPIAndLogData(options) {
    http.request(options, function(res) {
        var body = "";

        res.on("data", function(data) {
            body += data;
        });

        res.on("end", function() {
            var JSONData = JSON.parse(body);
            console.log(JSONData);
            logToSplunk(JSONData, "HTTP");
        });
    }).end();
}

fetchAPIAndLogData(options);