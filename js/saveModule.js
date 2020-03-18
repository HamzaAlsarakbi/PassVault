const fullPath = path.join(__dirname, '../data/data.txt');

const errorColor = 'color: rgb(200, 50, 50);';
var configData;

// save function
function save(type) {
	const body = document.querySelector('body');
	if (type == 'config') {
		// encrypt config
		console.log('config save triggered');

		configEncrypted = encrypt(config);
		console.log('config encrypted');
		console.log(configEncrypted);

		// save
		package(configEncrypted, configFullPath);
	} else if (!saved) {
		// if changes are made
		var saveButton = document.createElement('button');
		saveButton.setAttribute('class', 'save');
		saveButton.setAttribute('onclick', 'save()');
		saveButton.textContent = 'Save';
		body.appendChild(saveButton);
		console.log('displaying save button.');
		saved = true;
	} else {
		// if no changes are made
		// save data.json
		dataEncrypted = encrypt(data);
		package(dataEncrypted, fullPath);
		// save config.json
		save('config');

		saved = false;
		stalemate = false;
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
}

function encrypt(object) {
	// encrypt some stuff here
	var encrypted = simpleCrypto.encrypt(object);
	return encrypted;
}
function package(object, pathOfObject) {
	fs.writeFileSync(pathOfObject, object, function(err) {
		if (err) throw err;
		console.log('Saved ' + object + '!');
	});
}
function decrypt(object) {
	decrypted = simpleCrypto.decrypt(object, true);
	return decrypted;
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
	console.log('parsing...');
	var rawData = fs.readFileSync(fullPath, 'utf-8');
	console.log(rawData);
	data = decrypt(rawData);
	console.log(data);
	console.log('data.length == ' + config.cellIndex);
	for (var i = 1; i <= config.cellIndex; i++) {
		addSavedData('cell' + i, i);
	}
}

// add rows
function addSavedData(c, index) {
	if (c in data) {
		console.log(c + ' is in data');
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
		console.log(c + " doesn't exist");
	}
}

var dataSave = {};
var stalemate = false;
function changesChecker() {
	var rawData = fs.readFileSync(fullPath, 'utf-8');
	dataSave = decrypt(rawData);

	// compare two objects
	if (!stalemate) {
		if (angular.equals(dataSave, data)) {
			// console.log('dataSave & data are equal.');
		} else {
			console.log('dataSave & data are NOT equal.');
			save();
			if (lockVaultOn) {
				lockVault();
				setTimeout(lockVault, 400);
			}
			stalemate = true;
		}
	} else {
		console.log('%c ERROR: caught in stalemate.', 'color: rgb(250, 50, 50);');
	}
}

setInterval(changesChecker, 500);
console.log(data);
console.log(dataSave);
