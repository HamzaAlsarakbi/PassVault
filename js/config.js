const fs = require('fs'),
	path = require('path'),
	SimpleCrypto = require('simple-crypto-js').default,
	configFullPath = path.join(__dirname, '../data/config.txt'),
	password = 'PassVaultPassword',
	simpleCrypto = new SimpleCrypto(password);
	
	/*
var rawConfig = fs.readFileSync(OldConfigFullPath);
config = JSON.parse(rawConfig);

*/

console.log('parsing config...');
var rawConfig = fs.readFileSync(configFullPath, 'utf-8');
var config = simpleCrypto.decrypt(rawConfig, true);
