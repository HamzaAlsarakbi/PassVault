const version = 'v1.1.1';
const isDev = require('electron-is-dev');
const fs = require('fs'),
	crypto = require('crypto'),
	path = require('path'),
	algorithm = 'aes-256-cbc';

var parentDir;
if (process.platform == 'win32') {
	// check if in development mode
	if (isDev) {
		parentDir = path.join(getUserHome(), '/AppData/Local/PassVaultDev');
	} else {
		// production mode
		parentDir = path.join(getUserHome(), '/AppData/Local/PassVault');
		
		// log warning messages
		console.log('%c WAIT UP!', 'color: rgb(66, 107, 196); font-size: 72px; font-weight: bold; ');
		console.log('%c If someone told you to paste any code here, there is a high chance you are being scammed. Pasting anything here could compromise your data! Close down this window unless if you know what you are doing.', 'color: rgb(200, 50, 50); font-size: 24px; font-weight: bold;');
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

const paramPath = path.join(parentDir, '/Data/param.json');
const configFullPath = path.join(parentDir, '/Data/config.json');
var key = crypto.randomBytes(32);
var iv = crypto.randomBytes(16);
var param = {
	keyO: key,
	ivO: iv
};
function getUserHome() {
	return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}

try {
	var rawParam = fs.readFileSync(paramPath);
	param = JSON.parse(rawParam);
	key = new Buffer.from(param.keyO);
	iv = new Buffer.from(param.ivO);
} catch (err) {
	console.error(err);
	console.log('failed to parse param');
}

var config = {
	theme: 'dark',
	gridlinesOn: false,
	firstTime: true,
	enableAnimations: true,
	timeout: 2,
	devTools: false,
	login: {
		cooldown: 0,
		cooldowns: 1,
		attempts: 0
	}
};

var rawConfig, parsedConfig, decryptedConfig;
try {
	rawConfig = fs.readFileSync(configFullPath);
	parsedConfig = JSON.parse(rawConfig);
	decryptedConfig = decryptConfig(parsedConfig);
	config = JSON.parse(decryptedConfig);
	console.log('%c NOTICE: config parsed!', 'color: rgb(50, 200, 50');
} catch (err) {
	console.error(err);
	console.log('%c ERROR: failed to parse object', 'color: rgb(200, 50, 50);');
}
// check if any new components are missing
if(config.devTools == undefined) config.devTools = false;
if(config.enableAnimations == undefined) config.enableAnimations = true;
if(config.login == undefined) config.login = {
	cooldown: 0,
	cooldowns: 1,
	attempts: 0
}
if(config.timeout == undefined) config.timeout = 2;





function decryptConfig(text) {
	let iv = Buffer.from(text.iv, 'hex');
	let encryptedText = Buffer.from(text.encryptedData, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([ decrypted, decipher.final() ]);
	return decrypted.toString();
}
console.log(config);
