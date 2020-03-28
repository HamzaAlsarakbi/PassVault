const fs = require('fs'),
	path = require('path'),
	SimpleCrypto = require('simple-crypto-js').default,
	configFullPath = path.join(__dirname, '../data/config.txt'),
	password = 'PassVaultPassword',
	simpleCrypto = new SimpleCrypto(password);

var config = {
	theme: 'light',
	cellIndex: 0,
	gridlinesOn: false,
	firstTime: true
};

var rawConfig = fs.readFileSync(configFullPath, 'utf-8');
config = simpleCrypto.decrypt(rawConfig, true);
console.log('%c config parsed!', 'color: rgb(50, 200, 50');
