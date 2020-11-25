const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;

// Assigning variables
const submitButton = document.querySelector('.submit');
const passDOM = document.querySelector('#password');
const hideShowIcon = document.querySelector('.hide-show-icon');
const error = document.querySelector('.noerror');

const crossedEye = '../global assets/img/dark/crossed-eye.png';
const eye = '../global assets/img/dark/eye.png';


// Window controls
let win = remote.getCurrentWindow();

// When document has loaded, initialise
document.onreadystatechange = () => {
	if (document.readyState == 'complete') {
		init();
	}
};

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
}


passDOM.addEventListener('keydown', e => {
	if (e.keyCode == 13) {
		submit();
	}
});

// Password verification
function submit() {
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
			ipcRenderer.send('loginConfirmation');
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

var passwordHidden = true;
function hideShow() {
	if (passwordHidden) {
		// unhide password
		passDOM.setAttribute('type', 'text');
		hideShowIcon.setAttribute('src', crossedEye);

		passwordHidden = false;
	} else {
		// hide password
		passDOM.setAttribute('type', 'password');
		hideShowIcon.setAttribute('src', eye);
		passwordHidden = true;
	}
}
