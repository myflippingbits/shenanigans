const fs = require('fs');
const logToSplunk = require('./sendToSplunk');
var fss = fs;
var json = JSON.parse(require('fs')
	.readFileSync('config.json', 'utf8')); //format is {"monitored_directories": ["directory_path1","directory_path2"]}
var monitored_directories = json.monitored_directories;

function dirCrawler(directory) {
	fs.readdir(directory, function(err, child) {
		if (err) console.log('Error in dirCrawler', err);
		else {
			for (i = 0; i < child.length; i++) {
				let filePath = directory + '\\' + child[i];
				filePath.replace(/\/\//g, '/');
				let stats = fss.statSync(filePath);
				if (stats.isDirectory()) {
					dirCrawler(filePath);
				} else
					fileLogger(directory, child[i]);
			}
		}
	});
}

function fileLogger(directory, file) {
	let data = {};
	data.timestamp = Date.now();
	data.drive = directory.slice(0, 1);
	data.folder = directory;
	data.filePath = directory + '\\' + file;
	data.filePath.replace(/\/\//g, '/');
	data.file = file;
	let stats = fss.statSync(data.filePath);
	data.size = stats.size;
	data.created = stats.ctimeMs;
	data.accessed = stats.atimeMs;
	data.modified = stats.mtimeMs;
	logToSplunk(data, 'File');
	//console.log(data);
}

for (var i in monitored_directories)
	dirCrawler(monitored_directories[i]);