const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;

// Assigning variables
const submitButton = document.querySelector('.submit');
const passDOM = document.querySelector('#password');
var password = passDOM.value;

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

	// Button Style
	submitButton.classList.add('pending');
}

// packaging input.value
passDOM.addEventListener('input', function() {
	password = passDOM.value;
});

passDOM.addEventListener('keyup', function() {
	if (event.keyCode == 13) {
		submit();
	}
});

// Password verification
function submit() {
	var errorSpan = document.querySelector('.error');
	if (password == CPassword) {
		// Hide span if it were activated
		errorSpan.style = 'display: none;';

		// Change style of login button
		submitButton.classList.add('login-successful');
		submitButton.classList.add('login-successful');
		submitButton.textContent = 'Login Successful';
		// send confirmation
		ipcRenderer.send('loginConfirmation');
		win.close();
	} else if (password == '' || typeof password == undefined) {
		// If password is empty
		// Display span
		errorSpan.textContent = 'Enter Password.';
		errorSpan.style = 'display: inline;';
	} else {
		// If password is wrong
		// Display span
		errorSpan.textContent = 'Password is incorrect.';
		errorSpan.style = 'display: inline;';
	}
}
