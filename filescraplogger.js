const fs = require('fs');
fss = fs;
monitored_directories = ["L:\\Movies", "D:\\Spare Drive Contents\\Movies2", "F:\\Movies"];

function dirCrawler(directory) {
    fs.readdir(directory, function(err, subDurectories) {
        if (err) console.log('Error', err);
        else {
            for (i = 0; i < subDurectories.length; i++) {
                let folder = directory + "\\" + subDurectories[i];
                folder.replace(/\/\//g, "/");
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
        else {
            for (i = 0; i < files.length; i++) {
                let filePath = fullDirectory + "\\" + files[i];
                let stats = fss.statSync(filePath);
                if (stats.isDirectory()) {
                    fileCrawler(filePath);
                } else {
                    fileLogger(fullDirectory, files[i]);
                }
            }
        }
    });
}

function fileLogger(directory, file) {
    let data = {};
    data.timestamp = Date.now();
    data.drive = directory.slice(0, 1);
    data.folder = directory;
    data.filePath = directory + "\\" + file;
    data.filePath.replace(/\/\//g, "/");
    data.file = file;
    let stats = fss.statSync(data.filePath);
    data.size = stats['size'];
    data.created = stats['ctimeMs'];
    data.accessed = stats['atimeMs'];
    data.modified = stats['mtimeMs'];
    console.log(data);
}

dirCrawler(monitored_directories);