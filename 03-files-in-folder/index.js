const path = require("path");
const fs = require("fs/promises");


async function readDir() {
  const directory = path.join(__dirname, "secret-folder");
  const dirents = await fs.readdir(directory, {withFileTypes: true});
  let fileNames = dirents.filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);

  fileNames.forEach(async (fileName) => {
    const filePath = path.join(directory, fileName);
    const extention = path.extname(filePath);
    const fileBaseName = path.basename(filePath, extention);
    const stats = await fs.stat(filePath);
    const size = (stats.size / 1024).toFixed(3)
    console.log(`${fileBaseName} - ${extention.slice(1)} - ${size}kb`);
  })
}

readDir();