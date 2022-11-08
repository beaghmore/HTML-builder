const path = require("path");
const fs = require("fs/promises");

const copyDir = async (src, dest) => {
  try {
    await fs.rm(dest,  { recursive: true });
  } catch(err) {
    console.log(err);
  } finally {
    await fs.mkdir(dest, {recursive: true});
    const dirents = await fs.readdir(src, {withFileTypes: true});

    dirents.forEach(async dirent => {
      const srcPath = path.join(src, dirent.name);
      const destPath = path.join(dest, dirent.name);

      if (dirent.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    });
  }
  

}


const src = path.join(__dirname, "files");
const dest = path.join(__dirname, "files-copy");
copyDir(src, dest);
