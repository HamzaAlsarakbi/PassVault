const electron = require('electron');
const { app, BrowserWindow, Menu, globalShortcut, focusedWindow, ipcMain } = electron;
const url =require('url');
const path = require('path');

let loginWindow;
let mainWindow;
var mainWindowOn = 0;
let win = 'loginWindow';
// Listen for app to be ready
app.on('ready', ready);

function ready() {
	//Create new window
	loginWindow = new BrowserWindow({
		width: 200,
		height: 300,
		frame: false,
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// Load HTML file into window
	loginWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'html/loginWindow.html'),
			protocol: 'file:',
			slashes: true
		})
	);

	// Toggle Developer Mode
	const devTools = globalShortcut.register('Ctrl+Shift+I', () => {
		if(mainWindowOn == 0) {
			loginWindow.webContents.toggleDevTools();
		} else {
			mainWindow.webContents.toggleDevTools();
		}
	});

	// Refresh page
	const refresh = globalShortcut.register('Ctrl+R', () => {
		if(mainWindowOn == 0) {
			loginWindow.webContents.reloadIgnoringCache();
		} else {
			mainWindow.webContents.reloadIgnoringCache();
		}
	});

	// Receive confirmation
	ipcMain.on('loginConfirmation', function() {
		console.log('received login request.');
		// If mainWinow is opened
		if(mainWindowOn == 0) {
			mainWindowOn = 1;
			createMainWindow();
		}});
}

// app properties
Menu.setApplicationMenu(false);

// mainWindow function
function createMainWindow() {
	win = 'mainWindow';
	mainWindow = new BrowserWindow({
		frame: false,
		height: 500,
		width: 620,
		minHeight: 500,
		minWidth: 620,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// Load HTML file into window
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'html/mainWindow.html'),
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
			mainWindow.on('close', function() {
				mainWindow = null;
			});
		}
	});
}
