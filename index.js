const electron = require('electron');
const { app, BrowserWindow, Menu, globalShortcut, focusedWindow, ipcMain, autoUpdater, dialog } = electron;
const url = require('url'),
	path = require('path'),
	fs = require('fs'),
	SimpleCrypto = require('simple-crypto-js').default,
	configFullPath = path.join(__dirname, 'data/config.txt'),
	password = 'PassVaultPassword',
	simpleCrypto = new SimpleCrypto(password);

let loginWindow;
let mainWindow;
var mainWindowOn = 0;
let loadFile;

var config = {
	theme: 'dark',
	cellIndex: 0,
	gridlinesOn: false,
	firstTime: true
};



// Listen for app to be ready
app.on('ready', ready);

function ready() {
	try {
		var rawConfig = fs.readFileSync(configFullPath, 'utf-8');
		config = simpleCrypto.decrypt(rawConfig, true);
		console.log('config parsed!');
	} catch (err) {
		console.log("config doesn't exist!");
	}
	// check if first time setup
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
		if (mainWindowOn == 0) {
			loginWindow.webContents.toggleDevTools();
		} else {
			mainWindow.webContents.toggleDevTools();
		}
	});

	// Refresh page
	const refresh = globalShortcut.register('Ctrl+R', () => {
		if (mainWindowOn == 0) {
			loginWindow.webContents.reloadIgnoringCache();
		} else {
			mainWindow.webContents.reloadIgnoringCache();
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
