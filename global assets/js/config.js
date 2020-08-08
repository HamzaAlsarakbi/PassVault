const { platform } = require('os');

const fs = require('fs'),
crypto = require('crypto'),
	path = require('path'),
	configFullPath = process.platform == 'win32' ? path.join(process.env.HOME, '/AppData/Local/PassVault/Data/config.json') : path.join(process.env.HOME, '/PassVault/Data/config.json');
	algorithm = 'aes-256-cbc',
	paramPath = process.platform == 'win32' ? path.join(process.env.HOME, '/AppData/Local/PassVault/Data/param.json') : path.join(process.env.HOME, '/PassVault/Data/param.json');


var	key = crypto.randomBytes(32);
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
} catch(err) {
	console.error(err);
	console.log('failed to parse param');
}



var config = {
	theme: 'dark',
	gridlinesOn: false,
	firstTime: true
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
function decryptConfig(text) {
	let iv = Buffer.from(text.iv, 'hex');
	let encryptedText = Buffer.from(text.encryptedData, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([ decrypted, decipher.final() ]);
	return decrypted.toString();
}
console.log(config);

