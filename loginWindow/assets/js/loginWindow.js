const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;

// Assigning variables
const submitButton = document.querySelector('.submit');
const passDOM = document.querySelector('#password');
const hideShowIcon = document.querySelector('.hide-show-icon');

const crossedEye = '../global assets/img/dark/crossed-eye.png';
const eye = '../global assets/img/dark/eye.png';

var passwordValue = passDOM.value;

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

// packaging input.value
passDOM.addEventListener('input', function() {
	passwordValue = passDOM.value;
});

passDOM.addEventListener('keyup', function() {
	if (event.keyCode == 13) {
		submit();
	}
});

// Password verification
function submit() {
	const errorSpan = document.querySelector('.noerror');
	if (passwordValue == config.masterPassword) {
		// Hide span if it were activated
		errorSpan.classList.remove('error');

		// send confirmation
		ipcRenderer.send('loginConfirmation');
		win.close();
	} else if (passwordValue == '' || typeof passwordValue == undefined) {
		// If password is empty
		// Display span
		errorSpan.classList.add('error');
		errorSpan.textContent = 'Enter Password.';
	} else {
		// If password is wrong
		// Display span
		errorSpan.classList.add('error');

		errorSpan.textContent = 'Password is incorrect.';
		errorSpan.style = 'display: inline;';
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
