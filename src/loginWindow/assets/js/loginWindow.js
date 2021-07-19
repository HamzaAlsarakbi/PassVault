function updateTitle(text) {
	const isDev = window.api.dev;
	let suffix = '';
	if (isDev) suffix = ' - Dev Build';
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


function init() {
	const WINDOW = window.api.window
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById('close-button').addEventListener('click', (event) => {
		WINDOW.close();
	});
	document.getElementById('min-button').addEventListener('click', (event) => {
		WINDOW.minimize();
	});

	// add form
	let form = new Form({ class: 'login-form', id: 'login-form' }, container).form
	new RichInput({ class: 'password', id: 'password', hidden: true }, 'Password', form);
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
	let config = window.api.configHandler.getConfig();
	let password = passDOM.value.trim();
	if (config.login.cooldown == 0) {
		if (password == config.masterPassword) {
			// Hide span if it were activated
			error.classList.remove('error');

			// reset cooldowns 
			config.login.cooldown = 0;
			config.login.cooldowns = 1;
			config.login.attempts = 0;

			// save
			window.api.configHandler.setConfig('login', config.login);

			// send confirmation
			window.api.events.login();
			window.api.window.close();
		} else if (password == '') {
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