const path = require("path");
const fs = require("fs/promises");

async function readDir(srcPath) {
  const dirents = await fs.readdir(srcPath, {withFileTypes: true});
  let filePaths = dirents.filter(dirent => dirent.isFile())
    .map(direntFile => direntFile.name)
    .filter(fileName => path.extname(fileName) === ".css")
    .map(fileName => path.join(srcPath, fileName));
  return filePaths;
}

async function readFiles(filePaths) {
  let filesContent = [];
  for (let filePath of filePaths) {
    let fileContent = await fs.readFile(filePath);
    fileContent = fileContent.toString() + "\n"
    filesContent.push(fileContent);
  }
  return filesContent;
}

async function writeFile(filesContent, destPath) {
  const resultFilePath = path.join(destPath, "bundle.css");
  try {
    await fs.unlink(resultFilePath);
  } catch {
  } finally {
    for (let fileContent of filesContent) {
      await fs.appendFile(resultFilePath, fileContent);
    }
  }
}

let srcPath = path.join(__dirname, "styles");
let destPath = path.join(__dirname, "project-dist");
readDir(srcPath)
  .then(readFiles)
  .then((filesContent) => {
    writeFile(filesContent, destPath);
  })
  