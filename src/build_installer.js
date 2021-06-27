// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
const BIN_DIR = path.resolve(__dirname, '../bin/');
const APP_DIR = path.join(BIN_DIR, '/PassVault-win32-x64');
console.log(BIN_DIR, APP_DIR)

// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = path.resolve(BIN_DIR, './installer');

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,
  shortcutName: 'PassVault',
  shortcutFolderName: 'PassVault',
  icon: path.join(APP_DIR, 'icon.ico'),


  // Configure metadata
  description: 'Welcome to the PassVault installer',
  exe: 'PassVault',
  name: 'PassVault',
  manufacturer: 'Hamza Alsarakbi',
  version: '1.2.0',

  // Configure installer User Interface
  ui: {
    chooseDirectory: true
  },
});

// 4. Create a .wxs template file
msiCreator.create().then(function () {

  // Step 5: Compile the template to a .msi file
  msiCreator.compile();
});