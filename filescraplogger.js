const fs = require('fs');

monitored_directories = ["L:\\Movies", "D:\\Spare Drive Contents\\Movies2", "F:\\Movies"]
dirstructure = {};
dirstructure_array = [];
folderfiles = {};


function dirCrawler(directory) {
    fs.readdir(directory, function(err, subDurectories) {
        if (err) console.log('Error', err);
        else {
            for (i = 0; i < subDurectories.length; i++) {
                let temp = directory + "\\" + subDurectories[i];
                temp.replace(/\/\//g, "/");
                dirstructure_array.push(temp);
            }
            console.log('Result', dirstructure_array);
            fileCrawler(dirstructure_array);
        }
    });
}

function fileCrawler(fulldirectory) {
    for (i = 0; i < fulldirectory.length; i++) {
        let tempfulldirectory = fulldirectory[i];
        fs.readdir(tempfulldirectory, function(err, files) {
            if (err) console.log('Error', err);
            else {
                folderfiles[tempfulldirectory] = [];
                for (n = 0; n < files.length; n++) {
                    let temp = tempfulldirectory + "\\" + files[n];
                    temp.replace(/\/\//g, "/");
                    folderfiles[tempfulldirectory].push(temp); // stuff files from sub directories into a object array or get info and write to file.
                }
                console.log('Result', folderfiles[tempfulldirectory]);
            }
        });
    }
}



dirCrawler(monitored_directories[0]);

//fileCrawler(dirstructure_array[0]);


//for loop going through dirstructure_array and calling fileCrawler for each path.