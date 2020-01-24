// Electron shit
const electron = require('electron');
const { ipcRenderer } = electron;
let win = electron.remote.getCurrentWindow();

var parentElement;

// settings
var settingsOn = false;
var addOn = false;
var saved = false; // to be changed later
var settingsOn = false;
var td = document.querySelectorAll('td');
var gridlines = false;

// icons
const eye = '\u{1F441}';
const pencilIcon = '\u{270E}';
const crossedEye = '';
const bullet = '\u{2022}';

// Toggle Settings Menu
function settingsFunc() {
	toggleMenus();
	document.querySelector('.data').classList.toggle('margin-settings');
	document.querySelector('controls').classList.toggle('toggleSettings');
	// rotate icon
	var parentElement = document.querySelector('.settings');
	document.querySelector('#settings').classList.toggle('rotate');

	// if one of the windows is open
	if (passParam || lockVaultOn) {
		console.log('passParam already on');
		if (passParam) {
			togglePassParam();
		}
		if (lockVaultOn) {
			lockVault();
		}
		setTimeout(function() {
			settingsFunc();
			document.querySelector('menu').classList.toggle('togglemenus');
			document.querySelector('controls').classList.toggle('toggleSettings');
			document.querySelector('.data').classList.toggle('margin-settings');
		}, 100);

		// If add icon is already on
	} else if (addOn) {
		document.querySelector('#settings').classList.toggle('rotate');

		addFunc();
		toggleMenus();
		document.querySelector('controls').classList.toggle('toggleSettings');
		document.querySelector('.data').classList.toggle('margin-settings');

		setTimeout(function() {
			settingsFunc();
		}, 500);
	} else if (!settingsOn) {
		// Create header
		var header = document.createElement('div');
		header.setAttribute('class', 'settings-header');
		header.textContent = 'Settings';

		// create settingsBody
		settingsBody = document.createElement('div');
		settingsBody.setAttribute('class', 'settings-body');

		// create settingsButton
		settingsButtons = document.createElement('div');
		settingsButtons.setAttribute('class', 'settings-buttons');

		// create change password button
		changePassword = document.createElement('button');
		changePassword.setAttribute('class', 'button-header');
		changePassword.setAttribute('id', 'change-password');
		changePassword.setAttribute('onclick', 'togglePassParam()');
		changePassword.textContent = 'Change Password';

		// create change theme button
		changeTheme = document.createElement('button');
		changeTheme.setAttribute('class', 'button-header');
		changeTheme.setAttribute('id', 'change-theme');
		changeTheme.setAttribute('onclick', 'switchTheme()');
		changeTheme.textContent = 'Change Theme';

		// create lock vault button
		lockVaultButton = document.createElement('button');
		lockVaultButton.setAttribute('class', 'button-header');
		lockVaultButton.setAttribute('id', 'lock');
		lockVaultButton.setAttribute('onclick', 'lockVault()');
		lockVaultButton.textContent = 'Lock Vault';

		// create toggle gridlines button
		toggleGridlinesButton = document.createElement('button');
		toggleGridlinesButton.setAttribute('class', 'button-header');
		toggleGridlinesButton.setAttribute('id', 'gridlines');
		toggleGridlinesButton.setAttribute('onclick', 'toggleGridlines()');
		if (!gridlines) {
			toggleGridlinesButton.textContent = 'Show Gridlines';
		} else {
			toggleGridlinesButton.textContent = 'Hide Gridlines';
		}

		// create div for parameters
		settingsParameters = document.createElement('div');
		settingsParameters.setAttribute('class', 'settings-parameters');

		// create div for parameters
		settingsParameters = document.createElement('div');
		settingsParameters.setAttribute('class', 'settings-parameters');

		// create password parameters for parameters
		passParameters = document.createElement('div');
		passParameters.setAttribute('class', 'params');
		passParameters.setAttribute('id', 'pass-parameters');

		// create lock parameters for parameters
		lockParameters = document.createElement('div');
		lockParameters.setAttribute('class', 'params');
		lockParameters.setAttribute('id', 'lock-parameters');

		// Packaging
		parentElement.appendChild(header);
		parentElement.appendChild(settingsBody);
		settingsBody.appendChild(settingsButtons);
		settingsButtons.appendChild(toggleGridlinesButton);
		settingsButtons.appendChild(changeTheme);
		settingsButtons.appendChild(changePassword);
		settingsButtons.appendChild(lockVaultButton);
		settingsBody.appendChild(settingsParameters);
		settingsParameters.appendChild(passParameters);
		settingsParameters.appendChild(lockParameters);

		settingsOn = true;
	} else {
		setTimeout(function() {
			var first = parentElement.firstElementChild;
			while (first) {
				first.remove();
				first = parentElement.firstElementChild;
			}
		}, 200);
		settingsOn = false;
	}
}
// save button

// data constructor
var data = {};

// function dataFunc(cellIndex, type, service, email, password) {}

// Toggle add icon
var submission;
function addFunc() {
	toggleMenus();
	document.querySelector('#add').classList.toggle('rotate');
	document.querySelector('controls').classList.toggle('toggleAdd');
	document.querySelector('.data').classList.toggle('margin-add');
	var parentElement = document.querySelector('.add');

	if (settingsOn) {
		settingsFunc();
		toggleMenus();
		document.querySelector('#add').classList.toggle('rotate');
		document.querySelector('controls').classList.toggle('toggleAdd');
		document.querySelector('.data').classList.toggle('margin-add');

		setTimeout(function() {
			addFunc();
		}, 500);
	} else if (!addOn) {
		// create header
		var header = document.createElement('div');
		header.setAttribute('class', 'settings-header');
		header.textContent = 'Add';

		// Create div for input
		div = document.createElement('div');
		div.setAttribute('class', 'add-div');

		// create type input
		var typeInput = document.createElement('input');
		typeInput.setAttribute('class', 'add-input');
		typeInput.setAttribute('id', 'add-type');
		typeInput.setAttribute('placeholder', 'Type');

		// create service input
		var serviceInput = document.createElement('input');
		serviceInput.setAttribute('class', 'add-input');
		serviceInput.setAttribute('id', 'add-service');
		serviceInput.setAttribute('placeholder', 'Service');

		// create email input
		var emailInput = document.createElement('input');
		emailInput.setAttribute('class', 'add-input');
		emailInput.setAttribute('id', 'add-email');
		emailInput.setAttribute('placeholder', 'Email');

		// create password div
		var passwordDiv = document.createElement('div');
		passwordDiv.setAttribute('class', 'pass-div');
		passwordDiv.setAttribute('id', 'add-pass');

		// create password input
		var passwordInput = document.createElement('input');
		passwordInput.setAttribute('class', 'add-input');
		passwordInput.setAttribute('id', 'add-password');
		passwordInput.setAttribute('placeholder', 'Password');
		passwordInput.setAttribute('type', 'password');

		// create password hide/show switch
		var hideShow = document.createElement('div');
		hideShow.setAttribute('class', 'hide-show');
		hideShow.setAttribute('id', 'add-switch');
		hideShow.setAttribute('onclick', 'hideShow(this)');
		hideShow.textContent = eye;
		// create error message
		var span = document.createElement('span');
		span.setAttribute('class', 'noerror');
		span.setAttribute('id', 'add-error');
		span.textContent = 'One or more of the fields is empty.';

		// create add button
		var addButton = document.createElement('button');
		addButton.setAttribute('class', 'add-button');
		addButton.setAttribute('onclick', 'addData()');
		addButton.textContent = 'Add';

		// Packaging Children
		parentElement.appendChild(header);
		parentElement.appendChild(div);
		div.appendChild(typeInput);
		div.appendChild(serviceInput);
		div.appendChild(emailInput);
		div.appendChild(passwordDiv);
		passwordDiv.appendChild(passwordInput);
		passwordDiv.appendChild(hideShow);
		document.querySelector('.add').appendChild(span);
		div.appendChild(addButton);
		addOn = true;

		// submission
		submission = {
			type: '',
			service: '',
			email: '',
			password: ''
		};
		const typeDOM = document.getElementById('add-type');
		const serviceDOM = document.getElementById('add-service');
		const emailDOM = document.getElementById('add-email');
		const passwordDOM = document.getElementById('add-password');

		/*
		document.querySelector('#add-type').addEventListener('input', function() {
			submission
		})
*/
	} else {
		document.querySelector('controls').classList.remove('controlsSpan');
		setTimeout(function() {
			var first = parentElement.firstElementChild;
			while (first) {
				first.remove();
				first = parentElement.firstElementChild;
			}
		}, 200);
		addOn = false;
	}
}
var cellIndex = 1; // must be changed later on
function addData() {
	const parentElement = document.querySelector('.table-contents');
	const typeDOM = document.getElementById('add-type');
	const serviceDOM = document.getElementById('add-service');
	const emailDOM = document.getElementById('add-email');
	const passwordDOM = document.getElementById('add-password');
	const span = document.getElementById('add-error');
	const table = document.querySelector('.data');
	submission.type = typeDOM.value;
	submission.service = serviceDOM.value;
	submission.email = emailDOM.value;
	submission.password = passwordDOM.value;
	console.log(submission);
	// verify that all entries are full
	if (typeDOM.value == '' || serviceDOM.value == '' || emailDOM.value == '' || passwordDOM.value == '') {
		console.log('one of the fields is empty');
		span.classList.add('error');
		document.querySelector('controls').classList.add('controlsSpan');
	} else {
		// remove error if it were correct
		span.classList.remove('error');
		document.querySelector('controls').classList.remove('controlsSpan');
		// create table row
		tr = document.createElement('tr');
		tr.setAttribute('class', 'row' + cellIndex);
		// create td type
		tdType = document.createElement('td');
		tdType.setAttribute('class', 'cell' + cellIndex);
		if (gridlines) {
			tdType.setAttribute('class', 'gridlinesOn');
		}
		tdType.setAttribute('id', 'type');
		tdType.textContent = submission.type;

		// create td service
		tdService = document.createElement('td');
		tdService.setAttribute('class', 'cell' + cellIndex);
		if (gridlines) {
			tdService.setAttribute('class', 'gridlinesOn');
		}
		tdService.setAttribute('id', 'service');
		tdService.textContent = submission.service;
		// create td email
		tdEmail = document.createElement('td');
		tdEmail.setAttribute('class', 'cell' + cellIndex);
		if (gridlines) {
			tdEmail.setAttribute('class', 'gridlinesOn');
		}
		tdEmail.setAttribute('id', 'email');
		tdEmail.setAttribute('onclick', 'copyText(this)');
		tdEmail.textContent = submission.email;

		// create td pass
		tdPassword = document.createElement('td');
		tdPassword.setAttribute('class', 'cell' + cellIndex);
		if (gridlines) {
			tdPassword.setAttribute('class', 'gridlinesOn');
		}
		tdPassword.setAttribute('id', 'password');
		tdPassword.textContent = bullet.repeat(submission.password.length);

		// create controls
		tdControls = document.createElement('td');
		tdControls.setAttribute('class', 'cell' + cellIndex);
		if (gridlines) {
			tdControls.setAttribute('class', 'gridlinesOn');
		}
		tdControls.setAttribute('id', 'controls');

		// create edit button
		var pencil = document.createElement('span');
		pencil.setAttribute('class', 'cell' + cellIndex);
		pencil.setAttribute('id', 'cell-control');
		pencil.setAttribute('onclick', 'editRow(this)');
		pencil.textContent = pencilIcon;

		// create show/hide button
		var showHideButton = document.createElement('span');
		showHideButton.setAttribute('class', 'cell' + cellIndex);
		showHideButton.setAttribute('id', 'cell-control');
		showHideButton.setAttribute('onclick', 'hideShow(this)');
		showHideButton.textContent = eye;

		// create delete button
		var deleteButton = document.createElement('span');
		deleteButton.setAttribute('class', 'cell' + cellIndex);
		deleteButton.setAttribute('id', 'cell-control');
		deleteButton.setAttribute('onclick', 'deleteFunc(this)');
		deleteButton.textContent = '\u{1F5D1}';

		// package children
		table.appendChild(tr);
		tr.appendChild(tdType);
		tr.appendChild(tdService);
		tr.appendChild(tdEmail);
		tr.appendChild(tdPassword);
		tr.appendChild(tdControls);
		tdControls.appendChild(pencil);
		tdControls.appendChild(showHideButton);
		tdControls.appendChild(deleteButton);
		data['cell' + cellIndex] = {
			type: typeDOM.value,
			service: serviceDOM.value,
			email: emailDOM.value,
			password: passwordDOM.value,
			index: cellIndex,
			class: 'cell' + cellIndex,
			hidden: true
		};
		console.log(data);

		// empty out input fields
		typeDOM.value = '';
		serviceDOM.value = '';
		emailDOM.value = '';
		passwordDOM.value = '';
		console.log(cellIndex);
		cellIndex++;
	}
}
var addHideShow = false;
function hideShow(pro, value) {
	var d = pro.id;
	var c = pro.classList;
	var querySelect = '#password' + '.' + c;
	console.log('class: ' + c + ' | ' + 'id: ' + d);
	if (d == 'add-switch') {
		if (!addHideShow) {
			document.querySelector('#add-password').setAttribute('type', 'text');
			console.log('has');
			addHideShow = true;
		} else {
			document.querySelector('#add-password').setAttribute('type', 'password');
			console.log('had');
			addHideShow = false;
		}
	} else {
		// if it is table
		console.log('table');
		console.log(data[c].password);
		console.log(data[c].hidden);
		if (data[c].hidden) {
			document.querySelector(querySelect).textContent = data[c].password;
			data[c].hidden = false;
			console.log('data has: ' + data[c]);
		} else {
			document.querySelector(querySelect).textContent = bullet.repeat(data[c].password.length);
			data[c].hidden = true;
			console.log('data had: ' + data[c]);
		}
	}
}
function copyText(properties) {
	var d = properties.id;
	var c = properties.classList;
	console.log('class: ' + c + ' | id: ' + d);
	var copyText = data[c][d];
	console.log(copyText);
	copyText.select();
	/*
	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Copying text command was ' + msg);
	} catch (err) {
		console.log('Oops, unable to copy');
	}*/
}
// edit row function
var editOn = false;
function editRow(properties) {
	var d = properties.id;
	var c = properties.classList;
	var tr = 'row' + data[c].index;
	var typeDOM = document.querySelector('#type.' + c);
	var servicesDOM = document.querySelector('#service.' + c);
	var emailDOM = document.querySelector('#email.' + c);
	var passwordDOM = document.querySelector('#password.' + c);
	console.log('class: ' + c + ' | id: ' + d);
	if (!editOn) {
		// when edit is toggled
		// remove text
		typeDOM.textContent = '';
		servicesDOM.textContent = '';
		emailDOM.textContent = '';
		passwordDOM.textContent = '';
		// add input
		// create type input
		var typeInput = document.createElement('input');
		typeInput.setAttribute('class', 'table-input');
		typeInput.setAttribute('id', 'add-type');
		typeInput.setAttribute('placeholder', 'Type');
		typeInput.value = data[c].type;

		// create service input
		var serviceInput = document.createElement('input');
		serviceInput.setAttribute('class', 'table-input');
		serviceInput.setAttribute('id', 'add-service');
		serviceInput.setAttribute('placeholder', 'Service');
		serviceInput.value = data[c].service;

		// create email input
		var emailInput = document.createElement('input');
		emailInput.setAttribute('class', 'table-input');
		emailInput.setAttribute('id', 'add-email');
		emailInput.setAttribute('placeholder', 'Email');
		emailInput.value = data[c].email;

		// create password input
		var passwordInput = document.createElement('input');
		passwordInput.setAttribute('class', 'table-input');
		passwordInput.setAttribute('id', 'add-password');
		passwordInput.setAttribute('placeholder', 'Password');
		passwordInput.setAttribute('type', 'password');
		passwordInput.value = data[c].password;

		// package children
		typeDOM.appendChild(typeInput);
		servicesDOM.appendChild(serviceInput);
		emailDOM.appendChild(emailInput);
		passwordDOM.appendChild(passwordInput);
		editOn = true;
	} else {
		// when confirm button is clicked

		editOn = false;
	}
}

// delete row function
function deleteFunc(properties) {
	var d = properties.id;
	var c = properties.classList;
	console.log('class: ' + c + ' | id: ' + d);
	var index = data[c].index;
	console.log(index);
	tr = document.querySelector('tr.row' + index);
	tr.remove();
}
// Toggle menus
function toggleMenus() {
	document.querySelector('menu').classList.toggle('togglemenus');
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
	parentElement = document.querySelector('#pass-parameters');
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
		span.setAttribute('class', 'noerror');
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
	parentElement = document.querySelector('#lock-parameters');
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

function toggleGridlines() {
	td = document.querySelectorAll('td');
	// Toggle gridlines
	for (i = 0; i < td.length; i++) {
		td[i].classList.toggle('gridlinesOn');
	}

	if (!gridlines) {
		// Change Button content
		document.querySelector('#gridlines').textContent = 'Hide Gridlines';

		// set gridlines to false
		gridlines = true;
	} else if (gridlines) {
		// Change Button content
		document.querySelector('#gridlines').textContent = 'Show Gridlines';

		// set gridlines to false
		gridlines = false;
	}
}
