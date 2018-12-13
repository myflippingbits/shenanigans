import argparse, json, time, os, backports.os

"""
{"timestamp":1544139712113,
    "drive":"E",
    "folder":"E:\\Movies\\A",
    "filePath":"E:\\Movies\\A\\Avengers Infinity War (2018) x265 AC3 6ch 2160p, 3840x1608, 4 567 Kbps.mkv",
    "file":"Avengers Infinity War (2018) x265 AC3 6ch 2160p, 3840x1608, 4 567 Kbps.mkv",
    "size":5115839113,
    "created":1538928289076.3435,
    "accessed":1533161368187.5266,
    "modified":1533161354199.2502
}
"""

default_dirs = ["E:\\Movies", "E:\\Movies2"] #Add any directories you want scanned by default
default_save = os.path.join(os.getcwd(),"parsed_files.json")
#default_save = "" #uncomment this line to override current working directory as default

#parse arguments
#arguments include directories to be parsed, save location
parser = argparse.ArgumentParser(description='Parse files')
parser.add_argument('-r', '-d', '--read', '--dir', action='append', dest='directories', default=default_dirs, help='Specify a directory to read from.  For multiple directories, use the switch multiple times. (default current working directory)')
parser.add_argument('-w', '--write', dest='savedir', default=default_save, help='Specify a directory to write to. (default current working directory)')

args = parser.parse_args()
if len(args.directories)==0:
    args.directories = [os.getcwd()]

print("Saving to %s"%args.savedir)

for top in args.directories:
    print("Parsing %s..."%os.path.join(top,"*"))
    #recursively pull file list
    for root,dirs,files in os.walk(top): #Roots is the root dir.  dirs and files are what the root contains.  Dirs will be referenced as roots as the function recurses.
        if files: #only parse if files exist
            for file in files:
                try:
                    #initialize data blob
                    blob = {}
                    #build data blob
                    blob['timestamp'] = int(round(time.time() * 1000)) #Python does time in seconds with a decimal up to nano seconds.  time*1000 gets us milliseconds.
                    blob['drive'] = os.path.splitdrive(os.path.join(root,file))[0]
                    blob['folder'] = root
                    blob['filePath'] = os.path.join(root,file) #os.path.join accounts for slashes and stuff
                    blob['file'] = file
                    blob['size'] = os.path.getsize(os.path.join(root,file))
                    blob['created'] = os.stat(os.path.join(root,file)).st_ctime*1000
                    blob['accessed'] = os.stat(os.path.join(root,file)).st_atime*1000
                    blob['modified'] = os.stat(os.path.join(root,file)).st_mtime*1000
                    #write blob to file
                    with open(args.savedir, 'a') as out_file:
                        out_file.write(json.dumps(blob, ensure_ascii=False) + "\n")
                except Exception as e:
                    print("There was an error with %s:\n%s"%(blob,e))

print("Stick a fork in me, I'm done!")