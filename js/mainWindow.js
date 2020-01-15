// Electron shit
const electron = require('electron');
const { ipcRenderer } = electron;
let win = electron.remote.getCurrentWindow();

var settingsOn = false;
var addOn = false;
var saved = true;

function settingsFunc() {
	document.querySelector('#settings').classList.toggle('rotate');
}

function addFunc() {
	document.querySelector('#add').classList.toggle('rotate');
}
// Toggle parameters
function toggleParameters() {
	// Parameters
	document.querySelector('.settings-parameters').classList.toggle('settingsToggle');
}

// Password
var passParam = false;

function togglePassParam() {
	// Animation
	toggleParameters();
	var parentElement = document.querySelector('#pass-parameters');
	if (lockVaultOn) {
		console.log('lockvault is already on');
		lockVault();
		toggleParameters();
		setTimeout(function() {
			togglePassParam();
		}, 400);
	} else if (!passParam) {
		document.querySelector('#change-password').classList.toggle('button-header-active');
		// Creating children
		// Create old Password
		var oldPassChild = document.createElement('input');
		oldPassChild.setAttribute('class', 'password');
		oldPassChild.setAttribute('type', 'password');
		oldPassChild.setAttribute('placeholder', 'Old password');
		oldPassChild.setAttribute('id', 'old');

		// Create new Password
		var newPassChild = document.createElement('input');
		newPassChild.setAttribute('class', 'password');
		newPassChild.setAttribute('type', 'password');
		newPassChild.setAttribute('placeholder', 'New password');
		newPassChild.setAttribute('id', 'new');

		// Create Confirm new Password
		var ConfirmPassChild = document.createElement('input');
		ConfirmPassChild.setAttribute('class', 'password');
		ConfirmPassChild.setAttribute('type', 'password');
		ConfirmPassChild.setAttribute('placeholder', 'Confirm new password');
		ConfirmPassChild.setAttribute('id', 'new-confirm');

		// Create span
		var span = document.createElement('span');
		span.setAttribute('class', 'error');
		span.setAttribute('id', 'pass-error');
		span.textContent = 'ERROR';

		// Create confirm button
		var button = document.createElement('button');
		button.setAttribute('class', 'change-password-confirm');
		button.setAttribute('onclick', 'changePassword()');
		button.textContent = 'Change';

		// Packaging children
		appendChildElement = parentElement.appendChild(oldPassChild);
		appendChildElement = parentElement.appendChild(newPassChild);
		appendChildElement = parentElement.appendChild(ConfirmPassChild);
		appendChildElement = parentElement.appendChild(span);
		appendChildElement = parentElement.appendChild(button);

		passParam = true;
	} else {
		document.querySelector('#change-password').classList.toggle('button-header-active');

		setTimeout(function() {
			var first = parentElement.firstElementChild;
			while (first) {
				first.remove();
				first = parentElement.firstElementChild;
			}
		}, 200);
		passParam = false;
	}
}

// Lock Vault
var lockVaultOn = false;
function lockVault() {
	// Animation
	toggleParameters();
	var parentElement = document.querySelector('#lock-parameters');
	if (passParam) {
		console.log('PassParam is already on');
		togglePassParam();
		toggleParameters();
		setTimeout(function() {
			lockVault();
		}, 400);
	} else if (!lockVaultOn) {
		document.querySelector('#lock').classList.toggle('button-header-active');

		// Are you sure?
		var p = document.createElement('p');
		p.setAttribute('class', 'lock-param');
		p.setAttribute('id', 'confirmation');
		p.textContent = 'Quit Vault?';
		appendChildElement = parentElement.appendChild(p);

		// confimation div **div class="yesno"**
		var div = document.createElement('div');
		div.setAttribute('class', 'yesno');

		// save & quit Button
		if (!saved) {
			var saveQuitButton = document.createElement('button');
			saveQuitButton.setAttribute('class', 'lock-param');
			saveQuitButton.setAttribute('id', 'save-quit-button');
			saveQuitButton.textContent = 'Save and quit';
			appendChildElement = parentElement.appendChild(saveQuitButton);
		}

		// Quit
		var quitButton = document.createElement('button');
		quitButton.setAttribute('class', 'lock-param');
		quitButton.setAttribute('id', 'quit-button');
		quitButton.setAttribute('onclick', 'quit()');
		if (saved) {
			quitButton.textContent = 'Quit';
		} else {
			quitButton.textContent = 'Quit without saving changes';
			quitButton.style.height = '40px';
		}

		// Package Elements
		appendChildElement = parentElement.appendChild(quitButton);

		// Variable manipulation
		lockVaultOn = true;
	} else {
		document.querySelector('#lock').classList.toggle('button-header-active');

		setTimeout(function() {
			var first = parentElement.firstElementChild;
			while (first) {
				first.remove();
				first = parentElement.firstElementChild;
			}
		}, 200);
		lockVaultOn = false;
	}
}

// Lock Vault function
function quit() {
	ipcRenderer.send('logoutConfirmation');
	win.close();
	win.on('closed', () => {
		win = null;
	});
}

// Gridlines
var gridlinesButton, gridlines, td;
td = document.querySelectorAll('td');
gridlines = false;
gridlinesButton = document.querySelector('#gridlines');

function toggleGridlines() {
	// Toggle gridlines
	for (i = 0; i < td.length; i++) {
		td[i].classList.toggle('gridlinesOn');
	}

	if (!gridlines) {
		// Change Button content
		gridlinesButton.textContent = 'Hide Gridlines';

		// set gridlines to false
		gridlines = true;
	} else if (gridlines) {
		// Change Button content
		gridlinesButton.textContent = 'Show Gridlines';

		// set gridlines to false
		gridlines = false;
	}
}
