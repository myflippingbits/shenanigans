const http = require("http");
const fs = require("fs");
var file_date = Date().toLocaleString().slice(4, 21).replace(/\s|:/g, "_");
//var date = Date.now();

//http://dev.splunk.com/view/event-collector/SP-CAAAE6P
//Data format example
// {
//     "time": 1426279439, // epoch time
//     "host": "localhost",
//     "source": "SplunkLogger",
//     "index": "main",
//     "event": {"text": "Hello world!"}
// }

module.exports = function(data, how, destination) {
    if (how == "HTTP") {
        var index, post_data;

        if (destination == "crypto") {
            index = "Splunk 39EF2F0F-BCFD-47BA-B3B6-D7EE3B11C024";
            post_data = JSON.stringify({
                "index": "crypto",
                "host": "SplunkLogger",
                "event": data
            });
        } else if (destination == "plex") {
            index = "Splunk 6014D059-23DB-42F0-83E5-1DFF4223EDCC";
            post_data = JSON.stringify({
                "index": "plex",
                "host": "SplunkLogger",
                "event": data
            });
        }

        // An object of options to indicate where to post to
        var post_options = {
            host: 'localhost',
            port: '8088',
            path: '/services/collector/event',
            method: 'POST',
            headers: {
                'Content-Type': 'text/json',
                'Content-Length': post_data.length,
                'Authorization': index
            }
        };

        // Set up the request
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                console.log('Splunk Response: ' + chunk);
            });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
    } else if (how == "File") {
        fs.appendFile("S:\\LogsForSplunk\\fileInfo\\file_entries_" + file_date + ".txt", JSON.stringify(data) + "\n", function(err) {
            if (err) throw "Error writing entry to file" + err;
        });
    }
};