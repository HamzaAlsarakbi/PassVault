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

// icons
const eye = '../assets/img/dark/eye.png';
const crossedEye = '../assets/img/dark/crossed-eye.png';
const pencilIcon = '../assets/img/dark/pencil.png';
const bullet = '\u{2022}';
const trashcan = '../assets/img/dark/trashcan.png';
const remove = '../assets/img/dark/remove.png';
const confirm = '../assets/img/dark/confirm.png';
const addIcon = '../assets/img/dark/add.png';
const gearsIcon = '../assets/img/dark/gear.png';
// table
const table = document.querySelector('.tbody-data');

// initialization
init();
// add icons
function init(type) {
	const addButton = document.querySelector('.control#add');
	const settingsButton = document.querySelector('.control#settings');
	// add icon

	var addButtonIcon = document.createElement('img');
	addButtonIcon.setAttribute('height', '15px');
	addButtonIcon.setAttribute('src', addIcon);
	addButton.appendChild(addButtonIcon);
	// settings Icon
	var settingsButtonIcon = document.createElement('img');
	settingsButtonIcon.setAttribute('height', '23px');
	settingsButtonIcon.setAttribute('src', gearsIcon);
	settingsButton.appendChild(settingsButtonIcon);
}
// shortcuts
document.onkeyup = function(e) {
	// console.log('Notice: shortcut triggered.');
	if (e.altKey && e.which == 65) {
		addFunc();
	} else if (e.altKey && e.which == 83) {
		settingsFunc();
	} else if (e.ctrlKey && e.which == 83) {
		if (stalemate) {
			save();
		}
	}
};

// Toggle Settings Menu
function settingsFunc() {
	toggleMenus();
	document.querySelector('#thead').classList.toggle('margin-settings');
	document.querySelector('#tbody').classList.toggle('body-margin-settings');

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
			document.querySelector('#thead').classList.toggle('margin-settings');
			document.querySelector('#tbody').classList.toggle('body-margin-settings');
		}, 100);

		// If add icon is already on
	} else if (addOn) {
		document.querySelector('#settings').classList.toggle('rotate');

		addFunc();
		toggleMenus();
		document.querySelector('controls').classList.toggle('toggleSettings');
		document.querySelector('#thead').classList.toggle('margin-settings');
		document.querySelector('#tbody').classList.toggle('body-margin-settings');

		setTimeout(function() {
			settingsFunc();
		}, 500);
	} else if (!settingsOn) {
		// Create header
		var header = document.createElement('div');
		header.setAttribute('class', 'settings-header');

		// create icon
		var headerIcon = document.createElement('img');
		headerIcon.setAttribute('src', gearsIcon);
		headerIcon.setAttribute('height', '30px');
		headerIcon.setAttribute('class', 'header-icon');

		// create text
		var headerText = document.createElement('span');
		headerText.textContent = 'Settings';

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

		// create change config.theme button
		changeTheme = document.createElement('button');
		changeTheme.setAttribute('class', 'button-header');
		changeTheme.setAttribute('id', 'switch-theme');
		changeTheme.setAttribute('onclick', 'switchTheme()');
		if (config.theme == 'dark') {
			changeTheme.textContent = 'Switch to light theme';
		} else if (config.theme == 'light') {
			changeTheme.textContent = 'Switch to dark theme';
		}

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
		if (!config.gridlinesOn) {
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

		// Packaging
		parentElement.appendChild(header);
		header.appendChild(headerIcon);
		header.appendChild(headerText);
		parentElement.appendChild(settingsBody);
		settingsBody.appendChild(settingsButtons);
		settingsButtons.appendChild(toggleGridlinesButton);
		settingsButtons.appendChild(changeTheme);
		settingsButtons.appendChild(changePassword);
		settingsButtons.appendChild(lockVaultButton);
		settingsBody.appendChild(settingsParameters);

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
// Change password function

function passChangeRequest() {
	console.log('Password Change Requested');
	var oldPass = document.querySelector('.password#old');
	var newPass = document.querySelector('.password#new');
	var newConfirmPass = document.querySelector('.password#new-confirm');
	var p = document.querySelector('#pass-error');
	p.classList.remove('confirm');
	// validate password
	// check if old password is correct
	console.log('comparing ' + oldPass.value + ' with ' + config.masterPassword);
	if (oldPass.value == '' || newPass.value == '' || newConfirmPass.value == '') {
		console.log('Notice: one of the fields is empty');
		// display error
		error(true);
		p.innerHTML = 'One or more of the fields is empty.';
		if (oldPass.value == '') {
			oldPass.select();
		} else if (newPass.value == '') {
			newPass.select();
		} else {
			newConfirmPass.select();
		}
	} else if (oldPass.value == config.masterPassword) {
		if (newPass.value == newConfirmPass.value) {
			if (newPass.value !== oldPass.value) {
				console.log('Notice: New and new-confirm passwords match!');
				p.classList.add('confirm');
				p.innerHTML = 'Password Changed!';
				config.masterPassword = newPass.value;
				oldPass.value = '';
				newPass.value = '';
				newConfirmPass.value = '';
				error(false);
				save('config');
				setTimeout(function() {
					p.classList.remove('confirm');
				}, 1000);
			} else {
				console.log('Notice: Old and new passwords match!');
				// display error
				error(true);
				p.innerHTML = 'Old and new passwords match.';
			}
		} else {
			console.log("Notice: New and new-confirm passwords DON'T match!");
			// display error
			error(true);
			p.innerHTML = 'New passwords do not match.';
		}
	} else {
		console.log('Notice: Old password is NOT correct!');
		// display error
		error(true);
		p.innerHTML = 'Old password is not correct.';
	}
}
function error(msg) {
	console.log('error provoked');
	if (msg) {
		document.querySelector('#pass-error').classList.add('error');
		console.log('msg == true');
	} else {
		document.querySelector('#pass-error').classList.remove('error');
	}
}
// data object
var data = {};

// function dataFunc(config.cellIndex, type, service, email, password) {}

// Toggle add icon
var submission;
function addFunc() {
	toggleMenus();
	document.querySelector('#add').classList.toggle('rotate');
	document.querySelector('controls').classList.toggle('toggleAdd');
	document.querySelector('#thead').classList.toggle('margin-add');
	document.querySelector('#tbody').classList.toggle('body-margin-add');
	var parentElement = document.querySelector('.add');

	if (settingsOn) {
		settingsFunc();
		toggleMenus();
		document.querySelector('#add').classList.toggle('rotate');
		document.querySelector('controls').classList.toggle('toggleAdd');
		document.querySelector('#thead').classList.toggle('margin-add');
		document.querySelector('#tbody').classList.toggle('body-margin-add');

		setTimeout(function() {
			addFunc();
		}, 500);
	} else if (!addOn) {
		// create header
		var header = document.createElement('div');
		header.setAttribute('class', 'settings-header');

		// create icon
		var headerIcon = document.createElement('img');
		headerIcon.setAttribute('src', addIcon);
		headerIcon.setAttribute('height', '20px');
		headerIcon.setAttribute('class', 'header-icon');

		// create text
		var headerText = document.createElement('span');
		headerText.textContent = 'Add';

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

		// create eye icon
		var eyeIcon = document.createElement('img');
		eyeIcon.setAttribute('class', 'eye-icon');
		eyeIcon.setAttribute('id', 'add-icon');
		eyeIcon.setAttribute('height', '10px');
		eyeIcon.setAttribute('src', eye);

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
		header.appendChild(headerIcon);
		header.appendChild(headerText);
		parentElement.appendChild(div);
		div.appendChild(typeInput);
		div.appendChild(serviceInput);
		div.appendChild(emailInput);
		div.appendChild(passwordDiv);
		passwordDiv.appendChild(passwordInput);
		passwordDiv.appendChild(hideShow);
		hideShow.appendChild(eyeIcon);
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
		// addData() when enter is clicked

		typeDOM.addEventListener('keyup', enterFunc);
		serviceDOM.addEventListener('keyup', enterFunc);
		emailDOM.addEventListener('keyup', enterFunc);
		passwordDOM.addEventListener('keyup', enterFunc);
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
function enterFunc(event) {
	if (event.keyCode === 13) {
		console.log('enter');
		addData();
	}
}
function addData() {
	const typeDOM = document.getElementById('add-type');
	const serviceDOM = document.getElementById('add-service');
	const emailDOM = document.getElementById('add-email');
	const passwordDOM = document.getElementById('add-password');
	const span = document.getElementById('add-error');
	submission.type = typeDOM.value;
	submission.service = serviceDOM.value;
	submission.email = emailDOM.value;
	submission.password = passwordDOM.value;
	console.log(submission);
	// verify that all entries are full
	if (typeDOM.value == '' || serviceDOM.value == '' || emailDOM.value == '' || passwordDOM.value == '') {
		console.log('one or more of the fields is empty');
		span.classList.add('error');
		document.querySelector('controls').classList.add('controlsSpan');
		if (typeDOM.value == '') {
			typeDOM.select();
		} else if (serviceDOM.value == '') {
			serviceDOM.select();
		} else if (emailDOM.value == '') {
			emailDOM.select();
		} else if (passwordDOM.value == '') {
			passwordDOM.select();
		}
	} else {
		// remove error if it were correct
		span.classList.remove('error');
		document.querySelector('controls').classList.remove('controlsSpan');
		// create table row
		tr = document.createElement('div');
		tr.setAttribute('class', 'row' + config.cellIndex);
		tr.setAttribute('id', 'tr');
		// create td type
		tdType = document.createElement('div');
		tdType.setAttribute('class', 'cell' + config.cellIndex);
		console.log('cell' + config.cellIndex);
		tdType.setAttribute('onclick', 'copyText(this)');

		tdType.setAttribute('id', 'type');
		tdType.textContent = submission.type;

		// create td service
		tdService = document.createElement('div');
		tdService.setAttribute('class', 'cell' + config.cellIndex);
		tdService.setAttribute('onclick', 'copyText(this)');

		tdService.setAttribute('id', 'service');
		tdService.textContent = submission.service;
		// create td email
		tdEmail = document.createElement('div');
		tdEmail.setAttribute('class', 'cell' + config.cellIndex);

		tdEmail.setAttribute('id', 'email');
		tdEmail.setAttribute('onclick', 'copyText(this)');
		tdEmail.textContent = submission.email;

		// create td pass
		tdPassword = document.createElement('div');
		tdPassword.setAttribute('class', 'cell' + config.cellIndex);

		tdPassword.setAttribute('id', 'password');
		tdPassword.textContent = bullet.repeat(submission.password.length);

		// create controls
		tdControls = document.createElement('div');
		tdControls.setAttribute('class', 'cell' + config.cellIndex);

		tdControls.setAttribute('id', 'controls');

		// create edit button
		var edit = document.createElement('div');
		edit.setAttribute('class', 'cell' + config.cellIndex);
		edit.setAttribute('id', 'cell-edit');
		edit.setAttribute('onclick', 'editRow(this)');

		// create edit icon
		var pencil = document.createElement('img');
		pencil.setAttribute('class', 'cell' + config.cellIndex);
		pencil.setAttribute('id', 'edit-icon');
		pencil.setAttribute('src', pencilIcon);
		pencil.setAttribute('height', '15px');

		// create show/hide button
		var showHideButton = document.createElement('div');
		showHideButton.setAttribute('class', 'cell' + config.cellIndex);
		showHideButton.setAttribute('id', 'cell-showHide');
		showHideButton.setAttribute('onclick', 'hideShow(this)');

		// create eye icon
		var eyeIcon = document.createElement('img');
		eyeIcon.setAttribute('class', 'cell' + config.cellIndex);
		eyeIcon.setAttribute('id', 'eye-icon');
		eyeIcon.setAttribute('height', '15px');
		eyeIcon.setAttribute('src', eye);

		// create delete button
		var deleteButton = document.createElement('div');
		deleteButton.setAttribute('class', 'cell' + config.cellIndex);
		deleteButton.setAttribute('id', 'cell-delete');
		deleteButton.setAttribute('onclick', 'deleteFunc(this)');

		// create delete icon
		var deleteIcon = document.createElement('img');
		deleteIcon.setAttribute('class', 'cell' + config.cellIndex);
		deleteIcon.setAttribute('id', 'delete-icon');
		deleteIcon.setAttribute('src', trashcan);
		deleteIcon.setAttribute('height', '15px');

		// tbody animation
		table.classList.add('tbody-animation');
		setTimeout(function() {
			table.classList.remove('tbody-animation');
		}, 250);
		// package children
		table.appendChild(tr);
		tr.appendChild(tdType);
		tr.appendChild(tdService);
		tr.appendChild(tdEmail);
		tr.appendChild(tdPassword);
		tr.appendChild(tdControls);
		tdControls.appendChild(edit);
		edit.appendChild(pencil);
		tdControls.appendChild(showHideButton);
		showHideButton.appendChild(eyeIcon);
		tdControls.appendChild(deleteButton);
		deleteButton.appendChild(deleteIcon);

		if (config.gridlinesOn) {
			document.querySelector('.row' + config.cellIndex).setAttribute('class', 'gridlinesOn');
		}

		data['cell' + config.cellIndex] = {
			type: typeDOM.value,
			service: serviceDOM.value,
			email: emailDOM.value,
			password: passwordDOM.value,
			index: config.cellIndex,
			class: 'cell' + config.cellIndex,
			hidden: true,
			onCopy: false
		};
		console.log(data);

		// empty out input fields
		typeDOM.value = '';
		serviceDOM.value = '';
		emailDOM.value = '';
		passwordDOM.value = '';
		console.log(config.cellIndex);
		config.cellIndex++;
		// go back to type input field (convenience)
		typeDOM.select();
	}
}
var addHideShow = false;
function hideShow(pro, value) {
	var d = pro.id;
	var c = pro.classList;
	console.log('#eye-icon.' + c);

	var querySelect = '#password' + '.' + c;
	if (d == 'add-switch') {
		if (!addHideShow) {
			document.querySelector('#add-password').setAttribute('type', 'text');
			document.querySelector('.eye-icon').setAttribute('src', crossedEye);
			addHideShow = true;
		} else {
			document.querySelector('.eye-icon').setAttribute('src', eye);

			document.querySelector('#add-password').setAttribute('type', 'password');
			addHideShow = false;
		}
	} else {
		// if it is table
		var querySelectInput = '#table-password' + '.input-' + data[c].index;
		if (!editOn) {
			console.log('data hidden was == ' + data[c].hidden);
			if (data[c].hidden) {
				document.querySelector('#eye-icon.' + c).setAttribute('src', crossedEye);
				document.querySelector(querySelect).textContent = data[c].password;
				data[c].hidden = false;
			} else {
				document.querySelector('#eye-icon.' + c).setAttribute('src', eye);
				document.querySelector(querySelect).textContent = bullet.repeat(data[c].password.length);
				data[c].hidden = true;
			}
			console.log('data hidden is now == ' + data[c].hidden);
		} else {
			if (data[c].hidden) {
				document.querySelector('#eye-icon.' + c).setAttribute('src', crossedEye);

				document.querySelector(querySelectInput).setAttribute('type', 'text');
				data[c].hidden = false;
			} else {
				document.querySelector('#eye-icon.' + c).setAttribute('src', eye);
				document.querySelector(querySelectInput).setAttribute('type', 'password');
				data[c].hidden = true;
			}
		}
	}
}
function copyText(properties) {
	var d = properties.id;
	var c = properties.classList;
	if (!data[c].onCopy) {
		stalemate = true;
		data[c].onCopy = true;
		var copyVar = data[c][d];
		var copyDOM = document.createElement('input');
		copyDOM.setAttribute('class', 'hidden');
		copyDOM.style = 'position: absolute; left: -50000px';
		copyDOM.value = copyVar;
		document.querySelector('#email').appendChild(copyDOM);
		document.querySelector('.hidden').select();
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying ' + c + d + ' was successful, and the message is: ' + copyVar);
			var span = document.createElement('div');
			span.setAttribute('class', c);
			span.setAttribute('id', 'copy');
			span.textContent = 'Copied!';
			document.querySelector('#' + d + '.' + c).appendChild(span);
			setTimeout(function() {
				span.remove();
				data[c].onCopy = false;
				stalemate = false;
			}, 1500);
		} catch (err) {
			console.log('Copying ' + c + d + ' was unsuccessful!');
		}
		document.querySelector('#email').removeChild(copyDOM);
	} else {
		console.log('ERROR: failed to because onCopy is set to true');
	}
}

// edit row function
var editOn = false;
function editRow(properties) {
	var d = properties.id;
	var c = properties.classList;
	var tr = 'row' + data[c].index;
	var typeDOM = document.querySelector('#type.' + c);
	var serviceDOM = document.querySelector('#service.' + c);
	var emailDOM = document.querySelector('#email.' + c);
	var passwordDOM = document.querySelector('#password.' + c);

	console.log('class: ' + c + ' | id: ' + d);
	// remove onclick
	typeDOM.removeAttribute('onclick');
	serviceDOM.removeAttribute('onclick');
	emailDOM.removeAttribute('onclick');

	if (!editOn) {
		typeDOM.removeAttribute('onclick');
		serviceDOM.removeAttribute('onclick');
		emailDOM.removeAttribute('onclick');
		// when edit is toggled
		// change icons
		document.querySelector('#delete-icon.' + c).setAttribute('src', remove);
		document.querySelector('#edit-icon.' + c).setAttribute('src', confirm);

		// tr effects
		console.log(tr);
		document.querySelector('.' + tr).classList.toggle('tr-edit');
		// remove text
		typeDOM.textContent = '';
		serviceDOM.textContent = '';
		emailDOM.textContent = '';
		passwordDOM.textContent = '';

		// add input
		// create type input
		var typeInput = document.createElement('input');
		typeInput.setAttribute('class', 'input-' + data[c].index);
		typeInput.setAttribute('id', 'table-type');
		typeInput.setAttribute('placeholder', 'Type');
		typeInput.value = data[c].type;

		// create service input
		var serviceInput = document.createElement('input');
		serviceInput.setAttribute('class', 'input-' + data[c].index);
		serviceInput.setAttribute('id', 'table-service');
		serviceInput.setAttribute('placeholder', 'Service');
		serviceInput.value = data[c].service;

		// create email input
		var emailInput = document.createElement('input');
		emailInput.setAttribute('class', 'input-' + data[c].index);
		emailInput.setAttribute('id', 'table-email');
		emailInput.setAttribute('placeholder', 'Email');
		emailInput.value = data[c].email;

		// create password input
		var passwordInput = document.createElement('input');
		passwordInput.setAttribute('class', 'input-' + data[c].index);
		passwordInput.setAttribute('id', 'table-password');
		passwordInput.setAttribute('placeholder', 'Password');
		if (!data[c].hidden) {
			passwordInput.setAttribute('type', 'text');
		} else {
			passwordInput.setAttribute('type', 'password');
		}
		passwordInput.value = data[c].password;

		// package children
		typeDOM.appendChild(typeInput);
		serviceDOM.appendChild(serviceInput);
		emailDOM.appendChild(emailInput);
		passwordDOM.appendChild(passwordInput);
		editOn = true;

		// shortcuts
		document.querySelector('.row' + data[c].index).addEventListener('keyup', function(e, pro) {
			if (e.which == 27) {
				editOn = true;
				deleteFunc(properties);
				console.log('ESC triggered');
			} else if (e.which == 13) {
				editRow(properties);
				console.log('ENTER triggered');
			}
		});
	} else {
		var typeInputDOM = document.querySelector('.input-' + data[c].index + '#table-type');
		var serviceInputDOM = document.querySelector('.input-' + data[c].index + '#table-service');
		var emailInputDOM = document.querySelector('.input-' + data[c].index + '#table-email');
		var passwordInputDOM = document.querySelector('.input-' + data[c].index + '#table-password');
		if (
			typeInputDOM.value == '' ||
			serviceInputDOM.value == '' ||
			emailInputDOM.value == '' ||
			passwordInputDOM.value == ''
		) {
			console.log('one or more of the fields is empty');
			if (typeInputDOM.value == '') {
				typeInputDOM.select();
			} else if (serviceInputDOM.value == '') {
				serviceInputDOM.select();
			} else if (emailInputDOM.value == '') {
				emailInputDOM.select();
			} else if (passwordInputDOM.value == '') {
				passwordInputDOM.select();
			}
		} else {
			document.querySelector('.' + tr).classList.toggle('tr-edit');

			// reset icons
			document.querySelector('#delete-icon.' + c).setAttribute('src', trashcan);
			document.querySelector('#edit-icon.' + c).setAttribute('src', pencilIcon);

			// when confirm button is clicked
			data[c].type = document.querySelector('#table-type.input-' + data[c].index).value;
			data[c].service = document.querySelector('#table-service.input-' + data[c].index).value;
			data[c].email = document.querySelector('#table-email.input-' + data[c].index).value;
			data[c].password = document.querySelector('#table-password.input-' + data[c].index).value;
			console.log('data row changed');
			editOn = false;
			// add td text
			typeDOM.textContent = data[c].type;
			serviceDOM.textContent = data[c].service;
			emailDOM.textContent = data[c].email;

			if (!data[c].hidden) {
				passwordDOM.textContent = data[c].password;
			} else {
				passwordDOM.textContent = bullet.repeat(data[c].password.length);
			}
			typeDOM.setAttribute('onclick', 'copyText(this)');
			serviceDOM.setAttribute('onclick', 'copyText(this)');
			emailDOM.setAttribute('onclick', 'copyText(this)');
		}
	}
}
// delete row function
function deleteFunc(properties) {
	var d = properties.id;
	var c = properties.classList;
	var tr = 'row' + data[c].index;
	console.log('class: ' + c + ' | id: ' + d);
	var index = data[c].index;
	console.log(index);
	if (!editOn) {
		tr = document.querySelector('.row' + index);
		tr.classList.toggle('draw-out-animation');
		setTimeout(function() {
			tr.remove();
			delete data[c];
			console.log('data after deletion: ' + data);
		}, 250);
		// draw-out animations
	} else {
		// if its exiting edit mode
		// reset icons
		document.querySelector('#delete-icon.' + c).setAttribute('src', trashcan);
		document.querySelector('#edit-icon.' + c).setAttribute('src', pencilIcon);

		document.querySelector('#type.' + c).textContent = data[c].type;
		document.querySelector('#service.' + c).textContent = data[c].service;
		document.querySelector('#email.' + c).textContent = data[c].email;

		if (!data[c].hidden) {
			document.querySelector('#password.' + c).textContent = data[c].password;
		} else {
			document.querySelector('#password.' + c).textContent = bullet.repeat(data[c].password.length);
		}
		document.querySelector('#type.' + c).setAttribute('onclick', 'copyText(this)');
		document.querySelector('#service.' + c).setAttribute('onclick', 'copyText(this)');
		document.querySelector('#email.' + c).setAttribute('onclick', 'copyText(this)');
		editOn = false;
		document.querySelector('.' + tr).classList.toggle('tr-edit');
	}
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
	parentElement = document.querySelector('.settings-parameters');
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
		var p = document.createElement('p');
		p.setAttribute('class', 'noerror');
		p.setAttribute('id', 'pass-error');
		p.textContent = 'ERROR';

		// Create confirm button
		var button = document.createElement('button');
		button.setAttribute('class', 'change-password-confirm');
		button.setAttribute('onclick', 'passChangeRequest()');
		button.textContent = 'Change';

		// Packaging children
		parentElement.appendChild(oldPassChild);
		parentElement.appendChild(newPassChild);
		parentElement.appendChild(ConfirmPassChild);
		parentElement.appendChild(p);
		parentElement.appendChild(button);

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
	parentElement = document.querySelector('.settings-parameters');
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
		if (saved) {
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
			quitButton.textContent = 'Quit without saving changes';
			quitButton.style.height = '40px';
		} else {
			quitButton.textContent = 'Quit';
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
	var gridlinesTable = document.querySelectorAll('#tr');
	// Toggle gridlines
	for (i = 0; i < gridlinesTable.length; i++) {
		gridlinesTable[i].classList.toggle('gridlinesOn');
	}
	if (!config.gridlinesOn) {
		// Change Button content
		document.querySelector('#gridlines').textContent = 'Hide Gridlines';

		// set gridlines to false
		config.gridlinesOn = true;
	} else if (config.gridlinesOn) {
		// Change Button content
		document.querySelector('#gridlines').textContent = 'Show Gridlines';

		// set gridlines to false
		config.gridlinesOn = false;
	}
	save('config');
}
function switchTheme() {
	var changeTheme = document.querySelector('#switch-theme');
	if (config.theme == 'dark') {
		config.theme = 'light';
		changeTheme.textContent = 'Switch to dark theme';
	} else if (config.theme == 'light') {
		config.theme = 'dark';
		changeTheme.textContent = 'Switch to light theme';
	}
	save('config');
	initTheme();
}
