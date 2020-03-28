const electron = require('electron');
const remote = electron.remote;
const { ipcRenderer } = electron;

// Assigning variables
const submitButton = document.querySelector('.submit');
const passDOM = document.querySelector('#password');
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
