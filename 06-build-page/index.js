const path = require("path");
const fs = require("fs/promises");

async function readTemplate(templatePath) {
  const templateContent = await fs.readFile(templatePath);
  return templateContent.toString();
}

async function replaceTags(templateContent, srcHtmlPath) {
  const tags = templateContent.match(/{{.*}}/gi);
  let result = templateContent;
  for (let tag of tags) {
    const tagInner = tag.match(/{{(.*)}}/)[1];
    const componentPath = path.join(srcHtmlPath, tagInner) + ".html";
    let component = await fs.readFile(componentPath);
    component = component.toString();
    result = result.replace(tag, component);
  }
  return result;
}

async function saveIndexHtml(indexHtml, destPath) {
  try {
    await fs.rm(destPath, { recursive: true });
  } catch {
  } finally {
    await fs.mkdir(destPath);
    const indexHtmlPath = path.join(destPath, "index.html");
    await fs.writeFile(indexHtmlPath, indexHtml);
  }
}

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
  const resultFilePath = path.join(destPath, "style.css");
  for (let fileContent of filesContent) {
    await fs.appendFile(resultFilePath, fileContent);
  }
}

const copyDir = async (src, dest) => {
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

const srcCssPath = path.join(__dirname, "styles");
const srcHtmlPath = path.join(__dirname, "components");
const srcAssetsPath = path.join(__dirname, "assets");
const destPath = path.join(__dirname, "project-dist");
const destAssetsPath = path.join(destPath, "assets")
const templatePath = path.join(__dirname, "template.html");

readTemplate(templatePath)
  .then(templateContent => replaceTags(templateContent, srcHtmlPath))
  .then(indexHtml => saveIndexHtml(indexHtml, destPath))
  .then(() => readDir(srcCssPath))
  .then(readFiles)
  .then(filesContent => writeFile(filesContent, destPath))
  .then(() => copyDir(srcAssetsPath, destAssetsPath))




