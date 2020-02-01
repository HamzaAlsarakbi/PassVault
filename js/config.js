const fs = require('fs'),
	path = require('path');
const configFullPath = path.join(__dirname, '../data/config.json');

console.log('parsing...');
var rawConfig = fs.readFileSync(configFullPath);
config = JSON.parse(rawConfig);
console.log(config);
