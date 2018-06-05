// index.js
const cron = require("node-cron");
const express = require("express");
//const fs = require("fs");
const child_process = require("child_process");

var app = express();

// schedule tasks to be run on the server   
cron.schedule("0 20 * * *", function() {
    console.log("Script a task once a day");
    child_process.exec("node filescraplogger.js", (err, stdout, stderr) => {
        if (err) throw err;
        else if (stderr) throw stderr;
        console.log("Indexed files.");
    });
});

cron.schedule("0 20 * * *", function() {
    console.log("Command a task once a day");
    /*child_process.execFile(file, args, options, function(error, stdout, stderr) {
        // command output is in stdout
    });*/
    child_process.execFile("node filescraplogger.js", (err, stdout, stderr) => {
        if (err) throw err;
        else if (stderr) throw stderr;
        console.log("Indexed files.");
    });
});

app.listen(3128);