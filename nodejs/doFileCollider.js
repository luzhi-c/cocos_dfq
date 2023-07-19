let fs = require("fs")
let path = require("path")

let baseDir = "../assets/resources/config/collider";
console.log(baseDir)
let saveJson = (filePath, newData) => {
    fs.unlink(filePath, (err) => {
        console.log(err)
    });
    filePath = filePath.replace(".cfg", ".json")
    fs.writeFile(filePath, newData, (err) =>
        console.log(err)
    );
}

let replaceCmd = (dir) => {
   
    fs.readdir(dir, (err, dirfiles) => {
        console.log(dirfiles.length)
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < dirfiles.length; i++) {
            if (dirfiles[i].indexOf(".meta") == -1) {
                let filepath = path.join(dir, dirfiles[i]);
                console.log(filepath);
                fs.stat(filepath, (err, stats) => {
                    if (!err) {
                        if (stats.isFile()) {
                            fs.readFile(filepath, "utf-8", (err, data) => {
                                let newData = data.replace("return", "")
                                .replace("damage", "\"damage\"")
                                .replace("attack", "\"attack\"")
                                .replace(/x/g, "\"x\"")
                                .replace(/y1/g, "\"y1\"")
                                .replace(/z/g, "\"z\"")
                                .replace(/w/g, "\"w\"")
                                .replace(/y2/g, "\"y2\"")
                                .replace(/h/g, "\"h\"")
                                .replace(/=/g, ":");
                                saveJson(filepath, newData);
                            });
                        }
                        else {
                            replaceCmd(filepath);
                        }
                    }
                    else{
                        console.log(err)
                    }
                })
            }
        }
    }
    )
}

replaceCmd(baseDir)

