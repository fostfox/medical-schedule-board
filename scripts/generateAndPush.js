const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Get the scriptId and spreadsheetId from the environment variables
const scriptId = process.env.GOOGLE_APPS_SCRIPT_ID;
const spreadsheetId = process.env.SPREADSHEET_ID;

if (!scriptId) {
  console.error('Error: GOOGLE_APPS_SCRIPT_ID environment variable is not set.');
  process.exit(1);
}
if (!spreadsheetId) {
  console.error('Error: SPREADSHEET_ID environment variable is not set.');
  process.exit(1);
}

// Constants
const srcDir = path.resolve(__dirname, '../src');
const compiledDir = path.resolve(__dirname, '../.compiled');
const configFilePath = path.join(compiledDir, 'server', 'Config.gs');

// Remove the .compiled directory if it exists
if (fs.existsSync(compiledDir)) {
  fs.rmSync(compiledDir, { recursive: true });
}
fs.mkdirSync(compiledDir, { recursive: true });

// Copy all files from src to .compiled
function copyFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyFiles(srcDir, compiledDir);

// Define the content for .clasp.json
const claspConfig = {
  scriptId: scriptId,
  rootDir: compiledDir
};

// Write the .clasp.json file
fs.writeFile('.clasp.json', JSON.stringify(claspConfig, null, 2), (err) => {
  if (err) {
    console.error('Error writing .clasp.json:', err);
    return;
  }
  console.log('.clasp.json generated successfully.');

  // Read the Config.gs file
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading Config.gs:", err);
      process.exit(1);
    }

    // Replace the placeholder with the actual spreadsheetId
    const updatedData = data.replace(/__SPREADSHEET_ID__/g, spreadsheetId);
    fs.writeFile(configFilePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error("Error writing Config.gs:", err);
        process.exit(1);
      }
      console.log("Config.gs has been updated successfully.");

      // Run clasp push
      exec('clasp push --force', (err, stdout, stderr) => {
        if (err) {
          console.error('Error running clasp push:', err);
          return;
        }
        console.log('clasp push output:', stdout);
        if (stderr) {
          console.error('clasp push errors:', stderr);
        }
      });
    });
  });
});
