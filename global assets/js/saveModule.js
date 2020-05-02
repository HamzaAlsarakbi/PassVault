const fullPath = path.join(__dirname, '../data/data.json');
// console colors
const errorColor = 'color: rgb(200, 50, 50);';
const greenColor = 'color: rgb(50, 200, 50);';
const orangeColor = 'color: rgb(255, 150, 0);';
const blueColor = 'color: rgb(0, 150, 255);';

var configData;

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
		console.log('displaying save button.');
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
		if (lockVaultOn) {
			lockVault();
			setTimeout(lockVault, 400);
		} else if (type == 'close') {
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
	// encrypt some stuff here
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
	try {
		if (fs.existsSync(fullPath)) {
			console.log('file exists.');
			parse();
		} else {
			console.log("Save Error: File doesn't exist.");
		}
	} catch (err) {
		console.error(err);
	}
}

function parse() {
	console.log('%c parsing...', orangeColor);
	var rawData = fs.readFileSync(fullPath);
	var parsedData = JSON.parse(rawData);
	decryptedData = decrypt(parsedData);
	data = JSON.parse(decryptedData);
	for (var i = 0; i < config.cellIndex; i++) {
		addSavedData('cell' + i, i);
	}
}

// add rows
function addSavedData(c, index) {
	if (c in data) {
		console.log('%c' + c + ' is in data', greenColor);
		const table = document.querySelector('.tbody-data');
		// create table row
		tr = document.createElement('div');
		tr.setAttribute('class', 'row' + index);
		tr.setAttribute('id', 'tr');
		// create td type
		tdType = document.createElement('div');
		tdType.setAttribute('class', c);
		tdType.setAttribute('onclick', 'copyText(this)');

		tdType.setAttribute('id', 'type');
		tdType.textContent = data[c].type;

		// create td service
		tdService = document.createElement('div');
		tdService.setAttribute('class', c);
		tdService.setAttribute('onclick', 'copyText(this)');

		tdService.setAttribute('id', 'service');
		tdService.textContent = data[c].service;
		// create td email
		tdEmail = document.createElement('div');
		tdEmail.setAttribute('class', c);

		tdEmail.setAttribute('id', 'email');
		tdEmail.setAttribute('onclick', 'copyText(this)');
		tdEmail.textContent = data[c].email;

		// create td pass
		tdPassword = document.createElement('div');
		tdPassword.setAttribute('class', c);

		tdPassword.setAttribute('id', 'password');
		// create controls
		tdControls = document.createElement('div');
		tdControls.setAttribute('class', c);

		tdControls.setAttribute('id', 'controls');

		// create edit button
		var edit = document.createElement('div');
		edit.setAttribute('class', c);
		edit.setAttribute('id', 'cell-edit');
		edit.setAttribute('onclick', 'editRow(this)');

		// create edit icon
		var pencil = document.createElement('img');
		pencil.setAttribute('class', c);
		pencil.setAttribute('id', 'edit-icon');
		pencil.setAttribute('src', pencilIcon);
		pencil.setAttribute('height', '15px');

		// create show/hide button
		var showHideButton = document.createElement('div');
		showHideButton.setAttribute('class', c);
		showHideButton.setAttribute('id', 'cell-showHide');
		showHideButton.setAttribute('onclick', 'hideShow(this)');

		// create eye icon
		var eyeIcon = document.createElement('img');
		eyeIcon.setAttribute('class', c);
		eyeIcon.setAttribute('id', 'eye-icon');
		eyeIcon.setAttribute('height', '15px');

		// password check if hidden == true
		if (data[c].hidden) {
			tdPassword.textContent = bullet.repeat(data[c].password.length);
			eyeIcon.setAttribute('src', eye);
		} else {
			tdPassword.textContent = data[c].password;
			eyeIcon.setAttribute('src', crossedEye);
		}

		// create delete button
		var deleteButton = document.createElement('div');
		deleteButton.setAttribute('class', c);
		deleteButton.setAttribute('id', 'cell-delete');
		deleteButton.setAttribute('onclick', 'deleteFunc(this)');

		// create delete icon
		var deleteIcon = document.createElement('img');
		deleteIcon.setAttribute('class', c);
		deleteIcon.setAttribute('id', 'delete-icon');
		deleteIcon.setAttribute('src', trashcan);
		deleteIcon.setAttribute('height', '15px');

		// package children
		table.appendChild(tr);
		tr.appendChild(tdType);
		tr.appendChild(tdService);
		tr.appendChild(tdEmail);
		tr.appendChild(tdPassword);
		tr.appendChild(tdControls);
		tdControls.appendChild(edit);
		edit.appendChild(pencil);
		tdControls.appendChild(showHideButton);
		showHideButton.appendChild(eyeIcon);
		tdControls.appendChild(deleteButton);
		deleteButton.appendChild(deleteIcon);

		if (config.gridlinesOn) {
			document.querySelector('.row' + index).setAttribute('class', 'gridlinesOn');
			document.querySelector('#thead #tr').setAttribute('class', 'gridlinesOn');
		}
	} else {
		console.log('%c' + c + " doesn't exist", errorColor);
	}
}

var dataSave = {};
function changesChecker() {
	try {
		var rawData = fs.readFileSync(fullPath);
		var dataSaveParsed = JSON.parse(rawData);
		dataSaveDecrypted = decrypt(dataSaveParsed);
		dataSave = JSON.parse(dataSaveDecrypted);
	} catch (err) {
		console.log("%c ERROR: data.json doesn't exist. Checking if data object is empty", errorColor);
	}

	// compare two objects
	if (angular.equals(dataSave, data)) {
		// console.log('%c dataSave & data are equal.', greenColor);
		if (saved) {
			// if the user reversed changes, has a side effect when triggering save from console
			saved = false;
			var saveButtonDOM = document.querySelector('.save');
			saveButtonDOM.classList.toggle('button-slide-out');
			setTimeout(function() {
				saveButtonDOM.remove();
			}, 300);
			if (lockVaultOn) {
				lockVault();
				setTimeout(lockVault, 400);
			}
		}
	} else {
		if (!saved) {
			console.log('%c dataSave & data are NOT equal.', errorColor);
			save('show');
			if (lockVaultOn) {
				lockVault();
				setTimeout(lockVault, 400);
			}
		} else {
			console.log('%c ERROR: caught in stalemate.', orangeColor);
		}
	}
}

setInterval(changesChecker, 500);
