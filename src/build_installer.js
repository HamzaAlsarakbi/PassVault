// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
const BIN_COLLECTION = path.resolve(__dirname, '../bin/');
const BIN_DIR = path.join(BIN_COLLECTION, '/PassVault-win32-x64');
const ICON_DIR = path.join(BIN_DIR, '/icon.ico');


// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = path.resolve(BIN_COLLECTION, './installer');


// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: BIN_DIR,
  outputDirectory: OUT_DIR,
  shortcutName: 'PassVault',
  shortcutFolderName: 'PassVault',
  icon: ICON_DIR,


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