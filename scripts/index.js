// index.js
const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
const child_process = require("child_process");

app = express();

// schedule tasks to be run on the server   
cron.schedule("0 20 * * *", function() {
    console.log("running a task once a day");
    child_process.exec("node filescraplogger.js", (err, stdout, stderr) => {
        if (err) throw err;
        console.log("Indexed files.")
    });
});

app.listen(3128);