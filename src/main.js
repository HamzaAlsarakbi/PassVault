const { app, BrowserWindow, Menu, ipcMain, autoUpdater } = require('electron');
const IS_DEV = require('./assets/components/isDev.js');
const path = require('path');
const INSTANCE_RUNNING = !app.requestSingleInstanceLock();
const configHandler = require('./assets/components/fs/config.js');
let popWindow, mainWindow;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let activeWindow;
app.on('ready', () => {
	console.log('ready');
	if (INSTANCE_RUNNING) {
		console.log('Instance already running, quitting...');
		app.quit();
	} else {
		createPopWindow();
	}
});


function createPopWindow() {
	const CONFIG = configHandler.getConfig();
	const LOAD_FILE = CONFIG.firstTime ? 'setupWindow' : 'loginWindow';
	console.log(`Loading: ${LOAD_FILE}`);
	// Create new window
	popWindow = new BrowserWindow({
		width: 250,
		height: 375,
		frame: false,
		resizable: false,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			enableRemoteModule: false,
			worldSafeExecuteJavaScript: true,
			preload: path.join(__dirname, `assets/components/preloaders/preloader.js`),
		},
		icon: path.join(__dirname, 'assets/img/icon.png')
	});
	activeWindow = popWindow;

	// Load HTML file into window
	popWindow.loadURL(path.join(__dirname, `${LOAD_FILE}/${LOAD_FILE}.html`));
	if (!IS_DEV && !CONFIG.devTools) Menu.setApplicationMenu(null);

	popWindow.on('close', () => {
		popWindow.destroy();
		popWindow = null;
	})
}

// Receive confirmation
ipcMain.on('login', () => {
	console.log('received login request.');
	if (!mainWindow) createMainWindow();
	popWindow.destroy();
	popWindow = null;
	return;
});
ipcMain.on('minimize', () => { activeWindow.minimize() });
ipcMain.on('minimize', () => { mainWindow.minimize() });
ipcMain.on('maximize', () => {
	mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});
// Receive logout confirmation
ipcMain.on('logout', function () {
	console.log('received logout request.');
	if (!popWindow) createPopWindow();
});

// mainWindow function
function createMainWindow() {
	mainWindow = new BrowserWindow({
		frame: false,
		height: 700,
		width: 620,
		minHeight: 500,
		minWidth: 620,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			enableRemoteModule: false,
			worldSafeExecuteJavaScript: true,
			preload: path.join(__dirname, `assets/components/preloaders/preloader.js`),
		},
		icon: path.join(__dirname, 'assets/img/icon.png')
	});
	activeWindow = mainWindow;

	// Load HTML file into window
	mainWindow.loadURL(path.join(__dirname, 'mainWindow/mainWindow.html'));
	mainWindow.on('close', () => {
		mainWindow = null;
	});
}