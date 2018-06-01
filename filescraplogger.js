const fs = require('fs');
fss = fs;
monitored_directories = ["L:\\Movies", "D:\\Spare Drive Contents\\Movies2", "F:\\Movies"];
//dirstructure = {};
//dirstructure_array = [];
//folderfiles = {};


function dirCrawler(directory) {
    fs.readdir(directory, function(err, subDurectories) {
        if (err) console.log('Error', err);
        else {
            for (i = 0; i < subDurectories.length; i++) {
                let folder = directory + "\\" + subDurectories[i];
                folder.replace(/\/\//g, "/");
                //dirstructure_array.push(folder);
                let stats = fs.statSync(folder);
                if (stats.isDirectory()) {
                    fileCrawler(folder);
                } else
                    fileLogger(folder);
            }
        }
    });
}

function fileCrawler(fullDirectory) {
    fs.readdir(fullDirectory, function(err, files) {
        if (err) console.log('Error', err);

        let stats = fss.statSync(fullDirectory);
        if (stats.isDirectory()) {
            fileCrawler(fullDirectory);
        } else {
            for (n = 0; n < files.length; n++) {
                fileLogger(fullDirectory, files[n]);
            }
        }
    });
}

function fileLogger(directory, file) {
    let data = {};
    data.drive = directory.slice(0, 1);
    data.folder = directory;
    data.filePath = directory + "\\" + file;
    data.filePath.replace(/\/\//g, "/");
    data.file = file;
    let stats = fss.statSync(data.filePath);
    data.size = stats['size'];
    console.log(data);
}


/*
for (i = 0; i < fulldirectory.length; i++) {
    let tempfulldirectory = fulldirectory[i];
    fs.readdir(tempfulldirectory, function(err, files) {
        if (err) console.log('Error', err);
        else {
            folderfiles[tempfulldirectory] = [];
            for (n = 0; n < files.length; n++) {
                let temp = tempfulldirectory + "\\" + files[n];
                temp.replace(/\/\//g, "/");
                let log = 'drive="' + tempfulldirectory.slice(0, 1) + '" folder="' + tempfulldirectory + '" path="' + temp + '" filename="' + files[n] + '"';
                folderfiles[tempfulldirectory].push(log); // stuff files from sub directories into a object array or get info and write to file.
            }
            console.log('Result', folderfiles[tempfulldirectory]);
        }
    });
}*/





dirCrawler(monitored_directories[0]);

//fileCrawler(dirstructure_array[0]);


//for loop going through dirstructure_array and calling fileCrawler for each path.