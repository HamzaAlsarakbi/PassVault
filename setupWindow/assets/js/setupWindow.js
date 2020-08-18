const remote = require('electron').remote,
	backdrop = document.querySelector('#loading-backdrop'),
	welcomeContainer = document.querySelector('.welcome'),
	passwordContainer = document.querySelector('.master-password'),
	input = document.querySelector('input'),
	errorDOM = document.querySelector('.noerror'),
	themeContainer = document.querySelector('.theme');

let win = remote.getCurrentWindow();
// Make minimise/maximise/restore/close buttons work when they are clicked
document.getElementById('close-button').addEventListener('click', (event) => {
	win.close();
	win.on('closed', () => {
		win = null;
	});
});
document.getElementById('min-button').addEventListener('click', (event) => {
	win.minimize();
});

function start() {
	backdrop.setAttribute('src', '../global assets/img/icon-backdrop-green.png');
	collapse(welcomeContainer);
	expand(passwordContainer);
}

function collapse(container, nextContainer) {
	container.style = 'opacity: 0; width: 0; padding: 0; transition: 0.5s; z-index: -1';
}
function expand(container) {
	container.style = 'width: 100vw; padding: 10px; transition: 0.5s; opacity: 1; z-index: 2';
}

var hidden = true;
function toggleHide() {
	if (hidden) {
		input.setAttribute('type', 'text');
		hidden = false;
	} else {
		input.setAttribute('type', 'password');
		hidden = true;
	}
}

function back(type) {
	if (type == 'welcome') {
		collapse(passwordContainer);
		expand(welcomeContainer);
	} else if (type == 'password') {
		collapse(themeContainer);
		expand(passwordContainer);
	}
}

function setTheme() {
	var password = input.value;
	if (password === undefined || password == '') {
		errorDOM.classList.add('error');
		errorDOM.textContent = 'Enter password.';
	} else if (password.length < 8) {
		errorDOM.classList.add('error');
		errorDOM.textContent = 'Password must be over 8 characters long.';
	} else {
		errorDOM.classList.remove('error');
		config.masterPassword = password;
		collapse(passwordContainer);
		expand(themeContainer);
	}
}
function toggleTheme(theme) {
	config.theme = theme;
	initTheme();
}
function exit() {
	config.firstTime = false;
	key = crypto.randomBytes(32);
	iv = crypto.randomBytes(16);
	param.keyO = key;
	param.ivO = iv;
	var stringifiedParam = JSON.stringify(param);
	fs.writeFileSync(paramPath, stringifiedParam, function(err) {
		if (err) throw err;
		console.log('Saved param!');
	});

	var configStringified = JSON.stringify(config);
	console.log(configStringified);

	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
	let encrypted = cipher.update(configStringified);
	encrypted = Buffer.concat([ encrypted, cipher.final() ]);
	var configEncrypted = { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
	console.log(configEncrypted);

	var configStringified = JSON.stringify(configEncrypted);
	console.log(configStringified);

	fs.writeFileSync(configFullPath, configStringified, function(err) {
		if (err) throw err;
		console.log('Saved config !');
	});
	window.location.replace('../loginWindow/loginWindow.html');
}
