const fs = require("fs");
const p = require("path");

const path = p.join(__dirname, "text.txt")
const readStream = fs.createReadStream(path);
readStream.on("data", chunk => process.stdout.write(chunk));
readStream.on("end", chunk => process.stdout.write("\n"));