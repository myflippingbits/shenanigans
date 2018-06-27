const http = require("http");
//var date = Date.now();

module.exports = function(data) {
    // Build the post string from an object
    var post_data = JSON.stringify({
        "index": "crypto",
        "host": "SplunkLogger",
        "event": data
    });

    // An object of options to indicate where to post to
    var post_options = {
        host: 'localhost',
        port: '8088',
        path: '/services/collector/event',
        method: 'POST',
        headers: {
            'Content-Type': 'text/json',
            'Content-Length': post_data.length,
            'Authorization': "Splunk 39EF2F0F-BCFD-47BA-B3B6-D7EE3B11C024"
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

};