const fs = require('fs'),
	path = require('path'),
	SimpleCrypto = require('simple-crypto-js').default,
	configFullPath = path.join(__dirname, '../data/config.txt'),
	password = 'PassVaultPassword',
	simpleCrypto = new SimpleCrypto(password);

var config = {
	theme: 'dark',
	cellIndex: 0,
	gridlinesOn: false,
	firstTime: true
};

try {
	var rawConfig = fs.readFileSync(configFullPath, 'utf-8');
	config = simpleCrypto.decrypt(rawConfig, true);
	console.log('%c NOTICE: onfig parsed!', 'color: rgb(50, 200, 50');
} catch (err) {
	console.log('%c ERROR: failed to parse object', 'color: rgb(200, 50, 50);');
}
