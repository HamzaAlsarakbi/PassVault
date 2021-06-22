const version = 'v1.2.0';
const isDev = require('electron-is-dev');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

if (!isDev) {
	// log warning messages
	console.log('%cWarning!', 'color: red; font-size: 72px; font-weight: bold; ');
	console.log('%cIf someone told you to paste any code here, there is a high chance you are being scammed. Pasting anything here could compromise your data! Close this window unless if you know what you are doing.', 'font-size: 24px; font-weight: bold;');
}

function getUserHome() {
	return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}
let appName = '/PassVault';
// append "Dev" if in development mode
if (isDev) appName += 'Dev';
if (process.platform == 'win32') appName = '/AppData/Local' + appName;



let parentDir = path.join(getUserHome(), appName);



const PARAM_PATH = path.join(parentDir, '/Data/param.json');
const CONFIG_PATH = path.join(parentDir, '/Data/config.json');
let key = crypto.randomBytes(32);
let iv = crypto.randomBytes(16);
let param = {
	keyO: key,
	ivO: iv
};

function unpackConfig() {
	let config = {
		theme: 'dark',
		gridlinesOn: false,
		firstTime: true,
	};

	let newComponents = {
		devTools: false,
		enableAnimations: true,
		login: {
			cooldown: 0,
			cooldowns: 1,
			attempts: 0
		},
		timeout: 2
	}

	try {
		param = JSON.parse(fs.readFileSync(PARAM_PATH));
		key = new Buffer.from(param.keyO);
		iv = new Buffer.from(param.ivO);
		console.log('Using saved parameters.');
	} catch (err) {
		console.error(err);
		console.log('%cFailed to parse param. Using random parameters', 'color: orange');
	}

	// read config
	try {
		let parsedConfig = JSON.parse(fs.readFileSync(CONFIG_PATH));
		config = JSON.parse(decryptConfig(parsedConfig));
		console.log('%cNOTICE: config parsed!', 'color: lime');
	} catch (err) {
		console.error(err);
		console.log('%cFailed to parse saved config. Using default config', 'color: orange');
	}
	// check if any new components are missing
	for (let component in newComponents) {
		if (!config[component]) {
			console.log(`%cAppending missing component "${component}".`, 'color: cyan');
			config[component] = newComponents[component];
		}
	}

	return config;
}
config = unpackConfig();

function decryptConfig(text) {
	let iv = Buffer.from(text.iv, 'hex');
	let encryptedText = Buffer.from(text.encryptedData, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}