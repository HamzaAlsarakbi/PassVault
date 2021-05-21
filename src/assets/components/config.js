const version = 'v1.2.0';
const isDev = require('electron-is-dev');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

if (!isDev) {
	// log warning messages
	console.log('%cWarning!', 'color: rgb(200, 50, 50); font-size: 72px; font-weight: bold; ');
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


const paths = {
	param: path.join(parentDir, '/Data/param.json'),
	config: path.join(parentDir, '/Data/config.json')
}
let key = crypto.randomBytes(32);
let iv = crypto.randomBytes(16);
let param = {
	keyO: key,
	ivO: iv
};

function unpackConfig() {
	try {
		param = JSON.parse(fs.readFileSync(paths.param));
		key = new Buffer.from(param.keyO);
		iv = new Buffer.from(param.ivO);
	} catch (err) {
		console.error(err);
		throw new Error('Failed to parse param');
	}

	let config = {
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

	// read config
	try {
		config = JSON.parse(decryptConfig(JSON.parse(fs.readFileSync(paths.config))));
		console.log('%cNOTICE: config parsed!', 'color: lime');
	} catch (err) {
		console.error(err);
		throw new Error('Failed to parse object');
	}
	// check if any new components are missing
	for (let component in newComponents) {
		if (!config[component]) {
			console.log(`%cAppending missing component "${component}".`, 'color: orange');
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