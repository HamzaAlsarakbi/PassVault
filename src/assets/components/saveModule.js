const DATA_PATH = path.join(parentDir, '/Data/data.json');

var configData;
var saved;

// save function
function save(type) {
	const container = document.querySelector('.app');

	if (type == 'config') {
		// encrypt config
		pack(config, CONFIG_PATH);
	} else if (type == 'show') {
		// if changes are made
		saved = true;
		addElement('button', { class: 'save', onclick: `save('all')` }, 'Save', container);

	} else if (type == 'all') {
		// if no changes are made
		// save data.json
		key = crypto.randomBytes(32);
		iv = crypto.randomBytes(16);
		param.keyO = key;
		param.ivO = iv;
		let stringifiedParam = JSON.stringify(param);
		fs.writeFileSync(PARAM_PATH, stringifiedParam, function (err) {
			if (err) throw err;
			console.log('Saved ' + param + '!');
		});

		pack(data);
		// save config.json
		save('config');

		saved = false;
		let saveButtonDOM = document.querySelector('.save');
		saveButtonDOM.classList.toggle('button-slide-out');
		setTimeout(function () {
			saveButtonDOM.remove();
		}, 300);
		if (type == 'close') {
			win.close();
		}
	} else {
		console.log('invalid save type');
	}
}

function encrypt(text) {
	// encrypt string
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function pack(object, path)  {
	fs.writeFileSync(path, JSON.stringify(encrypt(JSON.stringify(object))), function (err) {
		if (err) throw err;
		console.log('Saved ' + object + '!');
	});
}


function decrypt(text) {
	let iv = Buffer.from(text.iv, 'hex');
	let encryptedText = Buffer.from(text.encryptedData, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

function unpack() {
	return JSON.parse(decrypt(JSON.parse(fs.readFileSync(DATA_PATH))));
}

function parse() {
	if (fs.existsSync(DATA_PATH)) {
		if(data.cellIndex != 0) {
			console.log('file exists.');
			console.log('%c parsing...', 'color: orange');
			data = unpack(DATA_PATH);
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
					if(config.gridlinesOn) row.classList.add('table-gridlines');
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
		pack(data, DATA_PATH);
	}
	setInterval(changesChecker, 500);
}

function changesChecker() {
	let savedData;
	try {
		savedData = JSON.stringify(unpack(DATA_PATH));
		var currentData = JSON.stringify(data);
	} catch (err) {
		console.log("%c ERROR: data.json doesn't exist.", 'color: red');
		save('all');
	}

	// compare two objects
	if (savedData == currentData) {
		// console.log('%c saved & current data are equal.', 'color: lime');
		updateTitle(windowTitle);
		if (saved) {
			// if the user reversed changes, has a side effect when triggering save from console
			saved = false;
			var saveButtonDOM = document.querySelector('.save');
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