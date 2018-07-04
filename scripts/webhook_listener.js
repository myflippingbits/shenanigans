//This webhook listener is soley built to be a wrapper for plex to splunk to send data to a splunk http event collector by rewrapping it.
var express = require('express'),
    multer = require('multer'),
    logToSplunk = require('./sendToSplunk'),
    app = express(),
    upload = multer({ storage: multer.memoryStorage() }), //upload = multer({ dest: '/tmp/' }),
    logMode = "HTTP",
    splunkLogDestination = "plex",
    port = 9000;

app.post('/', upload.single('thumb'), function(req, res) {
    var payload = JSON.parse(req.body.payload);
    console.log('Got webhook for', payload.event);
    //console.log(payload);
    logToSplunk(payload, logMode, splunkLogDestination);

    res.json({
        message: 'ok got it!'
    });
});

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

// var app = require('http').createServer(handler);   Alternative server but couldnt handle multi-part payloads.
// var statusCode = 200;

// app.listen(9000);

// function handler(req, res) {
//     var data = '';

//     if (req.method == "POST") {
//         req.on('data', function(chunk) {
//             data += chunk;
//         });

//         req.on('end', function() {
//             console.log('Received body data:');
//             console.log(data.toString());
//         });
//     }

//     res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
//     res.end();
// }

// console.log("Listening to port 9000");
// console.log("Returning status code " + statusCode.toString());