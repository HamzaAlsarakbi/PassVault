const { app, BrowserWindow, Menu,  ipcMain, autoUpdater } = require('electron');
const isDev = require('electron-is-dev');
const url = require('url');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
let popWindow, mainWindow, loadFile;

function getUserHome() {
	return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}

let parentRelDir = '/PassVault';
if(isDev) parentRelDir += 'Dev';
if(process.platform == 'win32') parentRelDir = '/AppData/Local' + parentRelDir;

let parentDir = path.join(getUserHome(), parentRelDir);

const dataDir = path.join(parentDir, '/Data');


console.log(dataDir);
console.log('Checking if parent directory exists...');
if (!fs.existsSync(parentDir)) {
	console.log("Parent directory doesn't exist");
	fs.mkdirSync(parentDir);
}
if (!fs.existsSync(dataDir)) {
	console.log("Data directory doesn't exist!");
	fs.mkdirSync(dataDir);
}
const configPath = path.join(dataDir, '/config.json');
const paramPath = path.join(dataDir, '/param.json');

let config = {
	theme: 'dark',
	masterPassword: '',
	gridlinesOn: false,
	disableAnimations: false,
	firstTime: true,
	devTools: false,
	login: {
		cooldown: 0,
		cooldowns: 1,
		attempts: 0
	}
};

let key = crypto.randomBytes(32);
let iv = crypto.randomBytes(16);
let param = {
	keyO: key,
	ivO: iv
};

try {
	param = JSON.parse(fs.readFileSync(paramPath));
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

function loadConfig() {
	try {
		// parse .json file into an object
		parsedConfig = JSON.parse(fs.readFileSync(configPath));

		// decrypt then parse into object
		config = JSON.parse(decryptConfig(parsedConfig));
		console.log('config parsed!');
		// check if first time setup
	} catch (err) {
		console.error(err);
		console.log("config doesn't exist!");
	}
	loadFile = config.firstTime ? 'setupWindow' : 'loginWindow';
}

app.on('ready', createPopWindow);
function createPopWindow() {
	loadConfig();
	// Create new window
	popWindow = new BrowserWindow({
		width: 250,
		height: 375,
		frame: false,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		},
		icon: path.join(__dirname, 'global assets/img/icon.png')
	});

	// Load HTML file into window
	popWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, `${loadFile}/${loadFile}.html`),
			protocol: 'file:',
			slashes: true
		})
	);
	if(!isDev && !config.devTools) Menu.setApplicationMenu(null);
	
	popWindow.on('close', () => {
		popWindow = null;
	})

	// Receive confirmation
	ipcMain.on('login', e => {
		console.log('received login request.');
		if(!mainWindow) createMainWindow();
	});
}


// mainWindow function
function createMainWindow() {
	mainWindow = new BrowserWindow({
		frame: false,
		height: 700,
		width: 620,
		minHeight: 500,
		minWidth: 620,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
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
	mainWindow.on('close', () => {
		mainWindow = null;
	});


	// Receive logout confirmation
	ipcMain.on('logout', function() {
		console.log('received logout request.');
		if(!popWindow) createPopWindow();
	});
}



