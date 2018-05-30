const fs = require('fs');

monitored_directories = ["L:\\Movies", "D:\\Spare Drive Contents\\Movies2", "F:\\Movies"]
dirstructure = {};
dirstructure_array = [];


function dirCrawler(directory) {
    fs.readdir(directory, function(err, files) {
        if (err) console.log('Error', err);
        else {
            for (i = 0; i < files.length; i++) {
                var temp = directory + "\\" + files[i];
                temp.replace(/\/\//g, "/");
                dirstructure_array.push(temp);
            }
            console.log('Result', dirstructure_array);
        }
    });
}

function fileCrawler(directory) {
    fs.readdir(directory, function(err, files) {
        if (err) console.log('Error', err);
        else {
            for (i = 0; i < files.length; i++) {
                var temp = directory + "\\" + files[i];
                temp.replace(/\/\//g, "/");
                dirstructure_array.push(temp); // stuff files from sub directories into a object array or get info and write to file.
            }
            console.log('Result', dirstructure_array);
        }
    });
}



dirCrawler(monitored_directories[0]);


//for loop going through dirstructure_array and calling fileCrawler for each path.