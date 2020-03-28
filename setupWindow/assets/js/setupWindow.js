const remote = require('electron').remote,
	backdrop = document.querySelector('#loading-backdrop'),
	welcomeContainer = document.querySelector('.welcome'),
	passwordContainer = document.querySelector('.master-password'),
	input = document.querySelector('input'),
	errorDOM = document.querySelector('.noerror'),
	themeContainer = document.querySelector('.theme');

let win = remote.getCurrentWindow();

function init() {
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById('close-button').addEventListener('click', (event) => {
		win.close();
		win.on('closed', () => {
			win = null;
		});
	});
}
init();

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
	save('config');
	window.location.replace('../loginWindow/loginWindow.html');
}
