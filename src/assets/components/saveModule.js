const DATA_PATH = path.join(parentDir, '/Data/data.json');

let configData;
let saved;

// save function
function save(type) {
	const container = document.querySelector('.app');

	if (type == 'config') {
		// encrypt config
		pack(config, CONFIG_PATH);
		console.log('%cSaved config', 'color: green');
	} else if (type == 'show') {
		// if changes are made
		saved = true;
		addElement('button', { class: 'save', onclick: `save()` }, 'Save', container);

	} else {
		// generate new key
		generateKey();
		console.log("Generated new key");

		// save param
		fs.writeFileSync(PARAM_PATH, JSON.stringify(param));
		console.log('%cSaved param', 'color: lime');

		// save data
		pack(data, DATA_PATH);
		console.log('%cSaved data', 'color: lime');

		// save config.json
		save('config');


		saved = false;
		let saveButton = document.querySelector('button.save');
		if (saveButton) {
			saveButton.classList.toggle('button-slide-out');
			setTimeout(function () {
				saveButton.remove();
			}, 300);
		}
		if (type == 'close') {
			win.close();
		}
	}
}
function generateKey() {

	param.keyO = crypto.randomBytes(32);
	param.ivO = crypto.randomBytes(16);
}

function encrypt(text) {
	// encrypt string
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(param.keyO), Buffer.from(param.ivO));
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return { iv: param.ivO.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function pack(object, path) {
	fs.writeFile(path, JSON.stringify(encrypt(JSON.stringify(object))), function (err) {
		if (err) throw err;
	});
}


function decrypt(text) {
	let encryptedText = Buffer.from(text.encryptedData, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(param.keyO), Buffer.from(text.iv, 'hex'));
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

function unpack() {
	return JSON.parse(decrypt(JSON.parse(fs.readFileSync(DATA_PATH))));
}

function parse() {
	if (config.gridlinesOn) document.querySelector('.row-header').classList.add('table-gridlines');
	if (fs.existsSync(DATA_PATH)) {
		console.log('data.json exists.');
		console.log('%cParsing data.json ...', 'color: orange');
		data = unpack(DATA_PATH);
		if (data.cellIndex != 0) {
			// add rows
			let currentIndex = 0;
			let rowInterval = setInterval(() => {
				let row = addRow(
					{
						type: data[`cell-${currentIndex}`].type,
						service: data[`cell-${currentIndex}`].service,
						email: data[`cell-${currentIndex}`].email,
						password: data[`cell-${currentIndex}`].password
					}, data[`cell-${currentIndex}`].index);
				if (config.gridlinesOn) row.classList.add('table-gridlines');
				currentIndex++;
				if (currentIndex >= data.cellIndex) window.clearInterval(rowInterval);
			}, 100);

			// disable animations if enabled
			if (!config.enableAnimations) {
				addElement('link', { class: 'disable-animations', type: 'text/css', rel: 'stylesheet', href: '../assets/components/disableAnimations.css' }, undefined, document.head);
			}

		}
	} else {
		console.log("%cSave Error: data doesn't exist. Creating one.", 'color: orange');
		save()
	}
	setInterval(changesChecker, 500);
}

function changesChecker() {
	let savedData, currentData;
	try {
		savedData = JSON.stringify(unpack(DATA_PATH));
		currentData = JSON.stringify(data);
	} catch (err) {
		console.log("%c ERROR: data.json doesn't exist.", 'color: red');
		console.error(err);
		// save('all');
	}

	// compare two objects
	if (savedData == currentData) {
		// console.log('%c saved & current data are equal.', 'color: lime');
		updateTitle(windowTitle);
		if (saved) {
			// if the user reversed changes, has a side effect when triggering save from console
			saved = false;
			let saveButtonDOM = document.querySelector('.save');
			saveButtonDOM.classList.toggle('bu	tton-slide-out');
			setTimeout(function () {
				saveButtonDOM.remove();
			}, 300);
		}
	} else {
		if (!saved) {
			console.log('%c saved & current data are NOT equal.', 'color: orange');
			save('show');
			updateTitle(windowTitle + '*');
		} else {
			// console.log('%c ERROR: caught in stalemate.', 'color: orange');
		}
	}
}