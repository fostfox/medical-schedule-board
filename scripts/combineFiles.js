const fs = require('fs');
const path = require('path');

// List of files and directories to exclude
const excludeFilesAndDirs = [
  'package-lock.json', 
  'LICENSE', 
  '.compiled', 
  'node_modules', 
  '.git',
  '.clasp.json',
  'fonts',
  '.vscode',
];

const dir = path.join(__dirname, '..');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
      if (!excludeFilesAndDirs.includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (!excludeFilesAndDirs.includes(file)) {
        console.log(fullPath);
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Function to combine all files into a single .txt file
function combineFiles(outputFilePath) {
  const allFiles = getAllFiles(dir);
  const outputStream = fs.createWriteStream(outputFilePath);

  allFiles.forEach((file) => {
    const relativeFilePath = path.relative(__dirname, file);
    const fileContent = fs.readFileSync(file, 'utf8');
    outputStream.write(`\n--- ${relativeFilePath} ---\n`);
    outputStream.write(fileContent);
    outputStream.write('\n');
  });

  outputStream.end();
}

// Combine files and save to combined.txt
combineFiles('combined.txt');
