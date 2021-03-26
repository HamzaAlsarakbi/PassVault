const fullPath = path.join(parentDir, '/Data/data.json');

// console colors
const errorColor = 'color: rgb(200, 50, 50);';
const greenColor = 'color: rgb(50, 200, 50);';
const orangeColor = 'color: rgb(255, 150, 0);';
const blueColor = 'color: rgb(0, 150, 255);';

var configData;
var saved;

// save function
function save(type) {
	const container = document.querySelector('.container');

	if (type == 'config') {
		// encrypt config
		configStringified = JSONstringify(config);
		configEncrypted = encrypt(configStringified);
		configStringified = JSONstringify(configEncrypted);

		// save encrypted config
		package(configStringified, configFullPath);
	} else if (type == 'show') {
		// if changes are made
		saved = true;
		var saveButton = document.createElement('button');
		saveButton.setAttribute('class', 'save');
		saveButton.setAttribute('onclick', "save('all')");
		saveButton.textContent = 'Save';
		container.appendChild(saveButton);
	} else if (type == 'all') {
		// if no changes are made
		// save data.json
		key = crypto.randomBytes(32);
		iv = crypto.randomBytes(16);
		param.keyO = key;
		param.ivO = iv;
		var stringifiedParam = JSON.stringify(param);
		fs.writeFileSync(paramPath, stringifiedParam, function(err) {
			if (err) throw err;
			console.log('Saved ' + param + '!');
		});
		
		dataStringified = JSONstringify(data);
		dataEncrypted = encrypt(dataStringified);
		dataStringified = JSONstringify(dataEncrypted);
		package(dataStringified, fullPath);
		// save config.json
		save('config');
		
		saved = false;
		var saveButtonDOM = document.querySelector('.save');
		saveButtonDOM.classList.toggle('button-slide-out');
		setTimeout(function() {
			saveButtonDOM.remove();
		}, 300);
		if (type == 'close') {
			win.close();
		}
	} else {
		console.log('invalid save type');
	}
}

function JSONstringify(object) {
	return JSON.stringify(object);
}
function JSONparse(object) {
	return JSON.parse(object);
}

function encrypt(text) {
	// encrypt string
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([ encrypted, cipher.final() ]);
	return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}
function package(object, pathOfObject) {
	fs.writeFileSync(pathOfObject, object, function(err) {
		if (err) throw err;
		console.log('Saved ' + object + '!');
	});
}

function decrypt(text) {
	let iv = Buffer.from(text.iv, 'hex');
	let encryptedText = Buffer.from(text.encryptedData, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([ decrypted, decipher.final() ]);
	return decrypted.toString();
}

checkSaveFile();
function checkSaveFile() {
	// check if there is a save file
	if (fs.existsSync(fullPath)) {
		console.log('file exists.');
		parse();
	} else {
		console.log("Save Error: File doesn't exist.");
	}
}

function parse() {
	console.log('%c parsing...', orangeColor);
	var rawData = fs.readFileSync(fullPath);
	var parsedData = JSON.parse(rawData);
	decryptedData = decrypt(parsedData);
	data = JSON.parse(decryptedData);
	try {
		for (var i = 0; i < data.cellIndex; i++) {
			// add rows
			addRow(
				data['cell-' + i].type,
				data['cell-' + i].service,
				data['cell-' + i].email,
				data['cell-' + i].password,
				i
			);
		}
		if (config.gridlinesOn) {
			var gridlinesTable = document.querySelectorAll('#tr');
			// Toggle gridlines
			for (i = 0; i < gridlinesTable.length; i++) {
				gridlinesTable[i].classList.toggle('gridlinesOn');
			}
		}
		if(!config.enableAnimations) {
			addElement('link', {class: 'disable-animations', type: 'text/css', rel: 'stylesheet', href: '../global assets/css/disableAnimations.css'}, undefined, document.head);
		}
	} catch (err) {
		console.log('cell-' + i + " doesn't exist");
	}
}

function changesChecker() {
	try {
		var rawData = fs.readFileSync(fullPath);
		var dataSaveParsed = JSON.parse(rawData);
		var dataSave = decrypt(dataSaveParsed);
		var currentData = JSON.stringify(data);
	} catch (err) {
		console.log("%c ERROR: data.json doesn't exist.", errorColor);
		save('all');
	}

	// compare two objects
	if (dataSave == currentData) {
		// console.log('%c dataSave & data are equal.', greenColor);
		updateTitle(windowTitle);
		if (saved) {
			// if the user reversed changes, has a side effect when triggering save from console
			saved = false;
			var saveButtonDOM = document.querySelector('.save');
			saveButtonDOM.classList.toggle('button-slide-out');
			setTimeout(function() {
				saveButtonDOM.remove();
			}, 300);
		}
	} else {
		if (!saved) {
			console.log('%c dataSave & data are NOT equal.', errorColor);
			save('show');
			updateTitle(windowTitle + '*');
		} else {
			// console.log('%c ERROR: caught in stalemate.', orangeColor);
		}
	}
}
setInterval(changesChecker, 500);