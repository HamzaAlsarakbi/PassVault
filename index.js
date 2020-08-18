const electron = require('electron');
const { app, BrowserWindow, Menu, globalShortcut, focusedWindow, ipcMain, autoUpdater, dialog } = electron;
const isDev = require('electron-is-dev');
const developerTools = true;
const url = require('url'),
	crypto = require('crypto'),
	path = require('path');
algorithm = 'aes-256-cbc';
const fs = require('fs');

function getUserHome() {
	return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}
var parentDir;
if (process.platform == 'win32') {
	// check if in development mode
	if (isDev) {
		parentDir = path.join(getUserHome(), '/AppData/Local/PassVaultDev');
	} else {
		// production mode
		parentDir = path.join(getUserHome(), '/AppData/Local/PassVault');
	}
} else {
	// linux
	// check if in development mode
	if (isDev) {
		parentDir = path.join(getUserHome(), '/PassVaultDev');
	} else {
		// production mode
		parentDir = path.join(getUserHome(), '/PassVault');
	}
}
const dataDir = path.join(parentDir, '/Data');

console.log(dataDir);
console.log('Checking if directory exists...');
if (!fs.existsSync(parentDir)) {
	console.log("Parent directory doesn't exist");
	fs.mkdirSync(parentDir);
}
if (!fs.existsSync(dataDir)) {
	console.log("Directory doesn't exist!");
	fs.mkdirSync(dataDir);
}
const configFullPath = path.join(dataDir, '/config.json');
const paramPath = path.join(dataDir, '/param.json');

let loginWindow;
let mainWindow;
var mainWindowOn = 0;
let loadFile;

var config = {
	theme: 'dark',
	masterPassword: '',
	gridlinesOn: false,
	firstTime: true
};
console.log(config.firstTime);
var key = crypto.randomBytes(32);
var iv = crypto.randomBytes(16);
var param = {
	keyO: key,
	ivO: iv
};

try {
	var rawParam = fs.readFileSync(paramPath);
	param = JSON.parse(rawParam);
	key = new Buffer.from(param.keyO);
	iv = new Buffer.from(param.ivO);
} catch (err) {
	console.error(err);
	console.log('failed to parse param');
}

// decryption function
function decryptConfig(text) {
	let iv = Buffer.from(text.iv, 'hex');
	let encryptedText = Buffer.from(text.encryptedData, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([ decrypted, decipher.final() ]);
	return decrypted.toString();
}

// Listen for app to be ready
app.on('ready', ready);
function ready() {
	try {
		var rawConfig = fs.readFileSync(configFullPath);
		parsedConfig = JSON.parse(rawConfig);
		decryptedConfig = decryptConfig(parsedConfig);
		config = JSON.parse(decryptedConfig);
		console.log('config parsed!');
		// check if first time setup
	} catch (err) {
		console.log("config doesn't exist!");
	}
	if (config.firstTime == false) {
		loadFile = 'loginWindow';
	} else {
		loadFile = 'setupWindow';
	}
	//Create new window
	loginWindow = new BrowserWindow({
		width: 250,
		height: 375,
		frame: false,
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		},
		icon: path.join(__dirname, 'global assets/img/icon.png')
	});

	// Load HTML file into window
	loginWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, loadFile + '/' + loadFile + '.html'),
			protocol: 'file:',
			slashes: true
		})
	);

	// Toggle Developer Mode
	const devTools = globalShortcut.register('Ctrl+Shift+I', () => {
		if (developerTools) {
			if (mainWindowOn == 0) {
				loginWindow.webContents.toggleDevTools();
			} else {
				mainWindow.webContents.toggleDevTools();
			}
		}
	});

	// Refresh page
	const refresh = globalShortcut.register('Ctrl+R', () => {
		if (developerTools) {
			if (mainWindowOn == 0) {
				loginWindow.webContents.reloadIgnoringCache();
			} else {
				mainWindow.webContents.reloadIgnoringCache();
			}
		}
	});

	// Receive confirmation
	ipcMain.on('loginConfirmation', function() {
		console.log('received login request.');
		// If mainWinow is opened
		if (mainWindowOn == 0) {
			mainWindowOn = 1;
			createMainWindow();
		}
	});
}

// app properties
Menu.setApplicationMenu(false);

// mainWindow function
function createMainWindow() {
	win = 'mainWindow';
	mainWindow = new BrowserWindow({
		frame: false,
		height: 700,
		width: 620,
		minHeight: 500,
		minWidth: 620,
		webPreferences: {
			nodeIntegration: true
		},
		icon: path.join(__dirname, 'global assets/img/icon.png')
	});

	// Load HTML file into window
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'mainWindow/mainWindow.html'),
			protocol: 'file:',
			slashes: true
		})
	);
	// Receive logout confirmation
	ipcMain.on('logoutConfirmation', function() {
		console.log('received logout request.');
		// If mainWinow is opened
		if (mainWindowOn == 1) {
			mainWindowOn = 0;
			ready();
			console.log('firstTime: ' + config.firstTime);
			mainWindow.on('close', function() {
				mainWindow = null;
			});
		}
	});
}

/*
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: [ 'Restart', 'Later' ],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Restart the application to apply the updates.'
	};
	
	dialog.showMessageBox(dialogOpts).then((returnValue) => {
		if (returnValue.response === 0) autoUpdater.quitAndInstall();
	});
});
autoUpdater.on('error', (message) => {
	console.error('There was a problem updating the application');
	console.error(message);
});

setInterval(() => {
	autoUpdater.checkForUpdates();
}, 60000);
*/
