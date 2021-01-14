const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;
function updateTitle(text) {
	let suffix = '';
	if(isDev) suffix = ' - Dev Build';
	document.title = text + suffix;
	document.querySelector('.window-title').textContent = text + suffix;
}
updateTitle('Login');


// Assigning variables
const container = document.querySelector('.container');
init();
const submitButton = document.querySelector('.submit');
const passDOM = document.querySelector('#password-rich-input');
const error = document.querySelector('.noerror');

const crossedEye = '../global assets/img/dark/crossed-eye.png';
const eye = '../global assets/img/dark/eye.png';


// Window controls
let win = remote.getCurrentWindow();


function init() {
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

	// add form
	let form = addForm({ class: 'login-form', id: 'login-form' }, container)
	addRichInput({ class: 'password', id: 'password', hidden: true }, 'Password', form);
	addElement('span', { class: 'noerror' }, 'ERROR', form);
	addElement('button', { class: 'submit', id: 'login', onclick: 'unlock()', type: 'button' }, 'Unlock', form);
}


passDOM.addEventListener('keydown', e => {
	if (e.keyCode == 13) {
		unlock();
	}
});

// Password verification
function unlock() {
	if(config.login.cooldown == 0) {
		if (passDOM.value == config.masterPassword) {
			// Hide span if it were activated
			error.classList.remove('error');
			
			// reset cooldowns 
			config.login.cooldown = 0;
			config.login.cooldowns = 1;
			config.login.attempts = 0;
	
			// send confirmation
			save();
			ipcRenderer.send('login');
			win.close();
		} else if (passDOM.value == '') {
			// If password is empty
			// Display span
			error.classList.add('error');
			error.textContent = 'Enter Password.';
		} else {
			// If password is wrong
			// Display span
			error.classList.add('error');
	
			error.textContent = 'Password is incorrect.';
			updateAttempts();
	
			passDOM.value = '';
		}
	}
}