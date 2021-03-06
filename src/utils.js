const { resolve } = require('path');
const {
  lstatSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
} = require('fs');

const resolvePath = (...paths) => resolve(...paths);
const isDirectory = path => lstatSync(path).isDirectory();
const validateDir = directory => !existsSync(directory) && mkdirSync(directory);

function validateFile(filePath) {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, '', { encoding: 'utf8', mode: 0o600 });
  }
}

function getTranslateFiles(directory, filter = 'json') {
  const files = readdirSync(directory);

  return files
    .map(file => {
      const fileFullPath = resolvePath(directory, file);

      if (isDirectory(fileFullPath)) {
        return getTranslateFiles(fileFullPath);
      }

      if (new RegExp(`.${filter}$`).test(file)) {
        return fileFullPath;
      }

      return false;
    })
    .filter(file => file)
    .flatMap(file => file);
}

module.exports = {
  resolvePath,
  isDirectory,
  validateDir,
  validateFile,
  getTranslateFiles,
};
