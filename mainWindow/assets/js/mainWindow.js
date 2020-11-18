const electron = require('electron');
const { TouchBarSegmentedControl } = require('electron');
const shell = electron.shell;
const { ipcRenderer } = electron;
let win = electron.remote.getCurrentWindow();
let parentElement;
const strengthTier = [ 'Very weak', 'Weak', 'Medium', 'Strong', 'Very strong' ];
// data object
let data = {
	cellIndex: 0
};
let searchBy = {
	type: true,
	service: true,
	email: true,
	password: true
};

// menu
const panel = document.querySelector('panel');
const menu = document.querySelector('menu');

// search
const searchInput = document.querySelector('input.control');

// settings
let components = {

	strengthMeterOn: true,
	settings: {
		on: false,
		generalOn: false
	},
	add: {
		on: false,
	}
};

// icons
const eye = '../global assets/img/dark/eye.png';
const crossedEye = '../global assets/img/dark/crossed-eye.png';
const pencilIcon = '../global assets/img/dark/pencil.png';
const bullet = '\u{2022}';
const trashcan = '../global assets/img/dark/trashcan.png';
const remove = '../global assets/img/dark/remove.png';
const confirm = '../global assets/img/dark/confirm.png';
const addIcon = '../global assets/img/dark/add.png';
const gearsIcon = '../global assets/img/dark/gear.png';

// table
const table = document.querySelector('.tbody-data');
const id = [ 'type', 'service', 'email', 'password' ];

// shortcuts
document.onkeydown = (e) => {
	if (e.altKey && e.which == 65) {
		addFunc();
	}
	if (e.altKey && e.which == 83) {
		settingsFunc();
	}
	if (e.altKey && e.which == 70) {
		toggleFilters();
	}
	if (e.ctrlKey && e.which == 70) {
		searchToggle();
	}
	if (e.ctrlKey && e.which == 83) {
		if (saved) {
			save('all');
		}
	}
};

// Toggle Settings Menu
function settingsFunc() {
	document.querySelector('#thead').classList.toggle('margin-settings');
	panel.classList.toggle('toggleSettings');

	// menu transitions
	menu.classList.toggle('menu-down');

	// rotate icon
	document.querySelector('#settings').classList.toggle('rotate');

	// if one of the windows is open
	if (passParam) togglePassParam();
	if (lockVaultOn) lockVault();
	if (aboutOn) about();
	if (components.add.on) addFunc();
	if (searchOn) searchToggle();
	if (filtersOn) toggleFilters();

	if (!components.settings.on) {
		// Create header
		let header = addElement('div', {class: 'settings-header'}, undefined, menu);

		// create icon
		addElement('img', {src: gearsIcon, height: '30px', class: 'header-icon'}, undefined, header);

		// create text
		addElement('span', {}, 'Settings', header);
		

		// create settingsBody
		let settingsBody = addElement('div', {class: 'settings-body'}, undefined, menu);


		// create settingsButton
		let settingsButtons = addElement('div', {class: 'settings-buttons'}, undefined, settingsBody);
	
		// create general button
		addElement('button', {class: 'button-header', id: 'general', onclick: 'general()'}, 'General', settingsButtons);
		
		// create change config.theme button
		let theme = config.theme == 'dark' ? 'light' : 'dark';
		addElement('button', {class: 'button-header', id: 'switch-theme', onclick: 'switchTheme()'}, 'Switch to ' + theme + ' theme', settingsButtons);
		
		// create change password button
		addElement('button', {class: 'button-header', id: 'change-password', onclick: 'togglePassParam()'}, 'Change Password', settingsButtons);
		
		// create lock vault button
		addElement('button', {class: 'button-header', id: 'lock', onclick: 'lockVault()'}, 'Lock Vault', settingsButtons);
		
		// create about button
		addElement('button', {class: 'button-header', id: 'about', onclick: 'about()'}, 'About', settingsButtons);

		// create div for parameters
		addElement('div', {class: 'settings-parameters'}, undefined, settingsBody);


	} else {
		menu.innerHTML = '';
	}
	components.settings.on = !components.settings.on;
}

// genaral
function general() {
	toggleParameters();
	parentElement = document.querySelector('.settings-parameters');
	if (passParam) {
		console.log('PassParam is already on');
		togglePassParam();
		toggleParameters();
		setTimeout(function() {
			general();
		}, 400);
	} else if (lockVaultOn) {
		console.log('LockVault is already on');
		lockVault();
		toggleParameters();
		setTimeout(function() {
			general();
		}, 400);
	} else if (!components.settings.generalOn) {
		// button effects
		document.querySelector('#general').classList.toggle('button-header-active');

		// create header
		let headerDiv = document.createElement('div');
		headerDiv.setAttribute('class', 'settings-parameters-header');
		parentElement.appendChild(headerDiv);
		let headerText = document.createElement('p');
		headerText.setAttribute('class', 'settings-header-text');
		headerText.textContent = 'General';
		headerDiv.appendChild(headerText);
		components.settings.generalOn = true;

		// create toggle gridlines button
		addParameter(parentElement, {text: 'Show gridlines'}, 'switch', 'general-gridlines', 'toggleGridlines()', config.gridlinesOn, true);
		addParameter(parentElement, {text: 'Animations'}, 'switch', 'enable-animations', 'toggleAnimations()', config.enableAnimations, true);


		
	} else {
		// close general section
		document.querySelector('#general').classList.toggle('button-header-active');

		setTimeout(function() {
			parentElement.innerHTML = '';
		}, 200);
		components.settings.generalOn = false;
	}
}

// Change password function
function passChangeRequest() {
	let oldPass = document.querySelector('#change-password-input-old');
	let newPass = document.querySelector('#change-password-input-new');
	let newConfirmPass = document.querySelector('#change-password-input-new-confirm');
	console.log(oldPass.value, newPass.value, newConfirmPass.value);
	let p = document.querySelector('#pass-error');
	p.classList.remove('confirm');
	// validate password
	// check if old password is correct
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
				oldPass.select();
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


function toggleAnimations() {
	config.enableAnimations = !config.enableAnimations;
	
	if(!config.enableAnimations) {
		addElement('link', {class: 'disable-animations', type: 'text/css', rel: 'stylesheet', href: '../global assets/css/disableAnimations.css'}, undefined, document.head);
	} else {
		document.head.removeChild(document.querySelector('.disable-animations'));
	}
	save('config');
}



function addFunc() {
	document.querySelector('#add').classList.toggle('rotate');
	panel.classList.toggle('toggleAdd');
	document.querySelector('#thead').classList.toggle('margin-add');
	menu.classList.toggle('menu-down');
	if (components.settings.on) {
		settingsFunc();
	}
	if (searchOn) {
		searchToggle();
	}
	if (filtersOn) {
		toggleFilters();
	}
	if (!components.add.on) {
		// create header
		let header = document.createElement('div');
		header.setAttribute('class', 'settings-header');
		menu.appendChild(header);

		// create icon
		let headerIcon = document.createElement('img');
		headerIcon.setAttribute('src', addIcon);
		headerIcon.setAttribute('height', '20px');
		headerIcon.setAttribute('class', 'header-icon');
		header.appendChild(headerIcon);

		// create text
		let headerText = document.createElement('span');
		headerText.textContent = 'Add';
		header.appendChild(headerText);

		// Create div for input
		div = document.createElement('div');
		div.setAttribute('class', 'add-div');
		menu.appendChild(div);

		// create type input
		let typeInput = document.createElement('input');
		typeInput.setAttribute('class', 'add-input');
		typeInput.setAttribute('id', 'add-type');
		typeInput.setAttribute('placeholder', 'Type (Personal, Work)');
		div.appendChild(typeInput);

		// create service input
		let serviceInput = document.createElement('input');
		serviceInput.setAttribute('class', 'add-input');
		serviceInput.setAttribute('id', 'add-service');
		serviceInput.setAttribute('placeholder', 'Service (Gmail, Twitter)');
		div.appendChild(serviceInput);

		// create email input
		let emailInput = document.createElement('input');
		emailInput.setAttribute('class', 'add-input');
		emailInput.setAttribute('id', 'add-email');
		emailInput.setAttribute('placeholder', 'Email (name@service.com)');
		div.appendChild(emailInput);

		// create password div
		let passwordDiv = document.createElement('div');
		passwordDiv.setAttribute('class', 'pass-div');
		passwordDiv.setAttribute('id', 'add-pass');
		div.appendChild(passwordDiv);

		// create password input
		let passwordInput = document.createElement('input');
		passwordInput.setAttribute('class', 'add-input');
		passwordInput.setAttribute('id', 'add-password');
		passwordInput.setAttribute('placeholder', 'Password');
		passwordInput.setAttribute('type', 'password');
		passwordDiv.appendChild(passwordInput);

		// create password hide/show switch
		let hideShow = document.createElement('div');
		hideShow.setAttribute('class', 'hide-show');
		hideShow.setAttribute('id', 'add-switch');
		hideShow.setAttribute('onclick', 'hideShow(this)');
		passwordDiv.appendChild(hideShow);

		// create eye icon
		let eyeIcon = document.createElement('img');
		eyeIcon.setAttribute('class', 'eye-icon');
		eyeIcon.setAttribute('id', 'add-icon');
		eyeIcon.setAttribute('height', '10px');
		eyeIcon.setAttribute('src', eye);
		hideShow.appendChild(eyeIcon);

		// create error message
		let span = document.createElement('span');
		span.setAttribute('class', 'noerror');
		span.setAttribute('id', 'add-error');
		span.textContent = 'One or more of the fields is empty.';
		div.appendChild(span);

		// create add button
		let addButton = document.createElement('button');
		addButton.setAttribute('class', 'add-button');
		addButton.setAttribute('onclick', 'addData()');
		addButton.textContent = 'Add';
		div.appendChild(addButton);
		components.add.on = true;

		typeInput.addEventListener('keyup', enterFunc);
		serviceInput.addEventListener('keyup', enterFunc);
		emailInput.addEventListener('keyup', enterFunc);
		passwordInput.addEventListener('keyup', enterFunc);
		typeInput.select();
	} else {
		panel.classList.remove('controlsSpan');
		menu.innerHTML = '';
		components.add.on = false;
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

	// verify that all entries are full
	if (typeDOM.value == '' || serviceDOM.value == '' || emailDOM.value == '' || passwordDOM.value == '') {
		console.log('one or more of the fields is empty');
		span.classList.add('error');
		panel.classList.add('controlsSpan');
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
		panel.classList.remove('controlsSpan');

		data['cell-' + data.cellIndex] = {
			type: typeDOM.value,
			service: serviceDOM.value,
			email: emailDOM.value,
			password: passwordDOM.value,
			index: data.cellIndex,
			class: 'cell-' + data.cellIndex,
			hidden: true,
			onCopy: false
		};
		addRow(typeDOM.value, serviceDOM.value, emailDOM.value, passwordDOM.value, data.cellIndex);
		if (config.gridlinesOn) {
			document.querySelector('.row-' + data.cellIndex).classList.add('gridlinesOn');
		}

		// empty out input fields
		typeDOM.value = '';
		serviceDOM.value = '';
		emailDOM.value = '';
		passwordDOM.value = '';
		console.log(data.cellIndex);
		data.cellIndex++;
		// go back to type input field (convenience)
		typeDOM.select();
	}
}
function addRow(type, service, email, password, index) {
	// create table row
	tr = document.createElement('div');
	tr.setAttribute('class', 'row-' + index);
	tr.setAttribute('id', 'tr');
	table.appendChild(tr);
	let text = [ type, service, email, password, index ];

	for (i = 0; i < id.length; i++) {
		// create cell
		let cell = document.createElement('div');
		cell.setAttribute('class', 'cell-' + index);
		cell.setAttribute('id', id[i]);
		cell.setAttribute('onclick', 'copy(this)');

		// create content div
		let content = document.createElement('div');
		content.setAttribute('class', 'cell-' + index);
		content.setAttribute('id', id[i] + '-content');

		tr.appendChild(cell);
		cell.appendChild(content);
		if (id[i] == 'password') {
			if (data['cell-' + index].hidden) {
				content.textContent = bullet.repeat(password.length);
			} else {
				content.textContent = password;
			}

			// create strength div
			let strengthD = document.createElement('div');
			strengthD.setAttribute('class', 'cell-' + index);
			strengthD.setAttribute('id', 'strength-div');
			cell.appendChild(strengthD);

			// get strength value
			let strength = strengthMeter(text[i]);
			// create strength text
			let strengthText = document.createElement('p');
			strengthText.setAttribute('class', 'cell-' + index);
			strengthText.setAttribute('id', 'strength-text');
			strengthText.textContent = strengthTier[strength];
			strengthD.appendChild(strengthText);

			// create strength bar
			let strengthBar = document.createElement('div');
			strengthBar.setAttribute('class', 'cell-' + index);
			strengthBar.setAttribute('id', 'strength-bar');
			strengthD.appendChild(strengthBar);
			strengthBar.style.background = ' var(--strength-' + strength + ')';
			strengthBar.style.width = (strength + 1) / strengthTier.length * 100 + '%';
		} else {
			content.textContent = text[i];
		}
		if (id[i] == 'service') {
			iconChecker('.cell-' + index, '#' + id[i] + '-content', text[i]);
		}
	}

	// create controls
	tdControls = document.createElement('div');
	tdControls.setAttribute('class', 'cell-' + index);
	tdControls.setAttribute('id', 'controls');
	tr.appendChild(tdControls);

	// create edit button
	let edit = document.createElement('div');
	edit.setAttribute('class', 'cell-' + index);
	edit.setAttribute('id', 'cell-edit');
	edit.setAttribute('onclick', 'editRow(this, "show")');
	tdControls.appendChild(edit);

	// create edit icon
	let pencil = document.createElement('img');
	pencil.setAttribute('class', 'cell-' + index);
	pencil.setAttribute('id', 'edit-icon');
	pencil.setAttribute('src', pencilIcon);
	pencil.setAttribute('height', '15px');
	edit.appendChild(pencil);

	// create show/hide button
	let showHideButton = document.createElement('div');
	showHideButton.setAttribute('class', 'cell-' + index);
	showHideButton.setAttribute('id', 'cell-showHide');
	showHideButton.setAttribute('onclick', 'hideShow(this)');
	tdControls.appendChild(showHideButton);

	// create eye icon
	let eyeIcon = document.createElement('img');
	eyeIcon.setAttribute('class', 'cell-' + index);
	eyeIcon.setAttribute('id', 'eye-icon');
	eyeIcon.setAttribute('height', '15px');
	if (data['cell-' + index].hidden) {
		eyeIcon.setAttribute('src', eye);
	} else {
		eyeIcon.setAttribute('src', crossedEye);
	}
	showHideButton.appendChild(eyeIcon);

	// create delete button
	let deleteButton = document.createElement('div');
	deleteButton.setAttribute('class', 'cell-' + index);
	deleteButton.setAttribute('id', 'cell-delete');
	deleteButton.setAttribute('onclick', 'deleteFunc(this)');
	tdControls.appendChild(deleteButton);

	// create delete icon
	let deleteIcon = document.createElement('img');
	deleteIcon.setAttribute('class', 'cell-' + index);
	deleteIcon.setAttribute('id', 'delete-icon');
	deleteIcon.setAttribute('src', trashcan);
	deleteIcon.setAttribute('height', '15px');
	deleteButton.appendChild(deleteIcon);

	// tbody animation
	table.classList.add('tbody-animation');
	setTimeout(function() {
		table.classList.remove('tbody-animation');
	}, 250);
}

function strengthMeter(text) {
	if (components.strengthMeterOn) {
		let strength = 0;

		// check for special characters
		let characters = [
			'!',
			'@',
			'#',
			'$',
			'%',
			'^',
			'&',
			'*',
			'(',
			')',
			'-',
			'_',
			'=',
			'+',
			',',
			'.',
			'/',
			'?',
			';',
			':',
			"'",
			'"',
			'`',
			'~',
			'[',
			']',
			'{',
			'}'
		];
		let includes1Character = false;
		for (let i = 0; i < characters.length; i++) {
			if (!includes1Character && text.includes(characters[i])) {
				strength++;
				includes1Character = true;
			}
		}
		// check for numbers
		if (/\d/.test(text)) strength++;

		// check for uppercase and lowercase characters
		if (text.toLowerCase() != text && text.toUpperCase() != text) strength++;

		// check for character number
		if (text.length >= 8) strength++;

		// print summary
		// console.log('strength: ' + strength);
		return strength;
	}
}
function hideShow(pro, value) {
	let d = pro.id;
	let c = pro.classList;
	// if it is an input
	if (d == 'add-switch' || d.includes('change-password-icon-div')) {
		let input;
		let icon;

		// if it is the add menu
		if (d == 'add-switch') {
			input = document.querySelector('#add-password');
			icon = document.querySelector('.eye-icon');
		} else {
			// if it is the change password menu
			let inputD = d.replace('change-password-icon-div-', '');
			input = document.querySelector('#change-password-input-' + inputD);
			icon = document.querySelector('#' + d + ' #change-password-icon');
		}

		// toggle depending on input type
		if (input.type == 'password') {
			input.type = 'text';
			icon.setAttribute('src', crossedEye);
		} else {
			input.type = 'password';
			icon.setAttribute('src', eye);
		}
	} else {
		// if it is table
		let querySelect = '#password-content' + '.' + c;
		let querySelectInput = '#table-password' + '.input-' + data[c].index;
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
function toast(message) {
	if (message != '' && !(message === undefined)) {
		let span = document.createElement('div');
		span.setAttribute('class', 'toast');
		span.textContent = message;
		document.body.appendChild(span);
		setTimeout(function() {
			span.remove();
		}, 1500);
	}
}
function copy(properties) {
	let d = properties.id;
	let c = properties.classList;
	let copylet = data[c][d];
	let copyDOM = document.createElement('input');
	copyDOM.setAttribute('class', 'hidden');
	copyDOM.style = 'position: absolute; left: -50000px';
	copyDOM.value = copylet;
	document.body.appendChild(copyDOM);
	document.querySelector('.hidden').select();
	try {
		document.execCommand('copy');
		console.log('Copying .' + c + '#' + d + ' was successful, and the message is: ' + copylet);
		toast('Copied to clipboard!');
	} catch (err) {
		console.log('Copying ' + c + d + ' was unsuccessful!');
	}
	document.body.removeChild(copyDOM);
}

// edit row function
function editRow(properties, action) {
	let d = properties.id;
	let c = properties.classList;
	let tr = 'row-' + data[c].index;
	let typeDOM = document.querySelector('#type-content.' + c);
	let serviceDOM = document.querySelector('#service-content.' + c);
	let emailDOM = document.querySelector('#email-content.' + c);
	let passwordDOM = document.querySelector('#password-content.' + c);
	passwordDOM.classList.toggle('edit-on');

	// edit transitions

	if (action == 'show') {
		document.querySelector('#type.' + c).removeAttribute('onclick');
		document.querySelector('#service.' + c).removeAttribute('onclick');
		document.querySelector('#email.' + c).removeAttribute('onclick');
		document.querySelector('#password.' + c).removeAttribute('onclick');
		// when edit is toggled

		// change controls
		document.querySelector('#cell-edit.' + c).setAttribute('onclick', 'editRow(this, "hide")');
		document.querySelector('#cell-delete.' + c).setAttribute('onclick', 'cancelEdit(this)');

		// change icons
		document.querySelector('#delete-icon.' + c).setAttribute('src', remove);
		document.querySelector('#edit-icon.' + c).setAttribute('src', confirm);

		// tr effects
		console.log(tr);
		document.querySelector('.' + tr).classList.toggle('tr-edit');
		// remove overflow thingy

		// remove text
		typeDOM.textContent = '';
		serviceDOM.textContent = '';
		emailDOM.textContent = '';
		passwordDOM.textContent = '';

		// add input
		// create type input
		let typeInput = document.createElement('input');
		typeInput.setAttribute('class', 'input-' + data[c].index);
		typeInput.setAttribute('id', 'table-type');
		typeInput.setAttribute('placeholder', 'Type');
		typeInput.value = data[c].type;
		typeDOM.appendChild(typeInput);

		// create service input
		let serviceInput = document.createElement('input');
		serviceInput.setAttribute('class', 'input-' + data[c].index);
		serviceInput.setAttribute('id', 'table-service');
		serviceInput.setAttribute('placeholder', 'Service');
		serviceInput.value = data[c].service;
		serviceDOM.appendChild(serviceInput);

		// create email input
		let emailInput = document.createElement('input');
		emailInput.setAttribute('class', 'input-' + data[c].index);
		emailInput.setAttribute('id', 'table-email');
		emailInput.setAttribute('placeholder', 'Email');
		emailInput.value = data[c].email;
		emailDOM.appendChild(emailInput);

		// create password input
		let passwordInput = document.createElement('input');
		passwordInput.setAttribute('class', 'input-' + data[c].index);
		passwordInput.setAttribute('id', 'table-password');
		passwordInput.setAttribute('placeholder', 'Password');
		if (!data[c].hidden) {
			passwordInput.setAttribute('type', 'text');
		} else {
			passwordInput.setAttribute('type', 'password');
		}
		passwordInput.value = data[c].password;
		passwordInput.addEventListener('input', function() {
			let strength = strengthMeter(passwordInput.value);
			document.querySelector('#strength-text.' + c).textContent = strengthTier[strength];
			document.querySelector('#strength-bar.' + c).style.background = ' var(--strength-' + strength + ')';
			document.querySelector('#strength-bar.' + c).style.width = (strength + 1) / strengthTier.length * 100 + '%';
		});
		passwordDOM.appendChild(passwordInput);
	} else {
		let typeInputDOM = document.querySelector('.input-' + data[c].index + '#table-type');
		let serviceInputDOM = document.querySelector('.input-' + data[c].index + '#table-service');
		let emailInputDOM = document.querySelector('.input-' + data[c].index + '#table-email');
		let passwordInputDOM = document.querySelector('.input-' + data[c].index + '#table-password');
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
			// confirm edits
			document.querySelector('.' + tr).classList.toggle('tr-edit');
			document.querySelector('#cell-edit.' + c).setAttribute('onclick', 'editRow(this, "show")');
			document.querySelector('#cell-delete.' + c).setAttribute('onclick', 'deleteFunc(this)');

			// reset icons
			document.querySelector('#edit-icon.' + c).setAttribute('src', pencilIcon);
			document.querySelector('#delete-icon.' + c).setAttribute('src', trashcan);

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
			document.querySelector('#type.' + c).setAttribute('onclick', 'copy(this)');
			document.querySelector('#service.' + c).setAttribute('onclick', 'copy(this)');
			document.querySelector('#email.' + c).setAttribute('onclick', 'copy(this)');
			document.querySelector('#password.' + c).setAttribute('onclick', 'copy(this)');
			iconChecker('.' + c, '#service-content', document.querySelector('#service-content.' + c).textContent);
		}
	}
}

function cancelEdit(properties) {
	let c = properties.classList['value'];
	let index = data[c].index;
	let tr = 'row-' + index;

	document.querySelector('.' + tr).classList.remove('edit-on');

	// reset controls
	document.querySelector('#cell-edit.' + c).setAttribute('onclick', 'editRow(this, "show")');
	document.querySelector('#cell-delete.' + c).setAttribute('onclick', 'deleteFunc(this)');

	// reset icons
	document.querySelector('#delete-icon.' + c).setAttribute('src', trashcan);
	document.querySelector('#edit-icon.' + c).setAttribute('src', pencilIcon);

	document.querySelector('#type-content.' + c).textContent = data[c].type;
	document.querySelector('#service-content.' + c).textContent = data[c].service;
	document.querySelector('#email-content.' + c).textContent = data[c].email;

	if (!data[c].hidden) {
		document.querySelector('#password-content.' + c).textContent = data[c].password;
	} else {
		document.querySelector('#password-content.' + c).textContent = bullet.repeat(data[c].password.length);
	}
	document.querySelector('#type.' + c).setAttribute('onclick', 'copy(this)');
	document.querySelector('#service.' + c).setAttribute('onclick', 'copy(this)');
	document.querySelector('#email.' + c).setAttribute('onclick', 'copy(this)');
	document.querySelector('#password.' + c).setAttribute('onclick', 'copy(this)');
	editOn = false;
	document.querySelector('.' + tr).classList.toggle('tr-edit');

	// add service icon
	iconChecker('.' + c, '#service-content', document.querySelector('#service-content.' + c).textContent);

	// check strength
	let strength = strengthMeter(data[c].password);
	document.querySelector('#strength-text.' + c).textContent = strengthTier[strength];
	document.querySelector('#strength-bar.' + c).style.background = ' var(--strength-' + strength + ')';
	document.querySelector('#strength-bar.' + c).style.width = (strength + 1) / strengthTier.length * 100 + '%';
}

// delete row function
function deleteFunc(properties) {
	let d = properties.id;
	let c = properties.classList['value'];
	let index = data[c].index;
	console.log(c);
	let tr = 'row-' + index;
	tr = document.querySelector('.row-' + index);
	tr.classList.toggle('draw-out-animation');
	setTimeout(() => {
		let removedIndex = Number(c.replace('cell-', ''));
		console.log('removedIndex: ' + removedIndex);
		tr.remove();
		delete data[c];
		for (let i = removedIndex + 1; i < data.cellIndex; i++) {
			let row = data['cell-' + i];
			data['cell-' + (i - 1)] = {
				class: 'cell-' + (i - 1),
				type: row.type,
				service: row.service,
				email: row.email,
				password: row.password,
				onCopy: row.onCopy,
				index: i - 1,
				hidden: row.hidden
			};

			// update class name of cells
			let rowCells = document.querySelectorAll('.cell-' + i);
			let rowLength = rowCells.length;
			for (let x = 0; x < rowLength; x++) {
				let element = rowCells[x];
				element.setAttribute('class', 'cell-' + (i - 1));
			}

			// update class name of rows
			document.querySelector('.row-' + i).setAttribute('class', 'row-' + (i - 1));
		}
		data.cellIndex--;
		delete data['cell-' + data.cellIndex];
	}, 250);
	// draw-out animations
}

// Toggle parameters
function toggleParameters() {
	// Parameters
	document.querySelector('.settings-parameters').classList.toggle('settingsToggle');
}

// Password
let passParam = false;

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
	} else if (aboutOn) {
		console.log("'about' is already on");
		about();
		toggleParameters();
		setTimeout(function() {
			togglePassParam();
		}, 400);
	} else if (!passParam) {
		document.querySelector('#change-password').classList.toggle('button-header-active');
		// Creating children

		// Create header div
		let headerDiv = document.createElement('div');
		headerDiv.setAttribute('class', 'settings-parameters-header');
		parentElement.appendChild(headerDiv);

		// Create header icon
		let headerIcon = document.createElement('img');
		headerIcon.setAttribute('class', 'icon');
		headerIcon.setAttribute('src', '');
		headerDiv.appendChild(headerIcon);

		// Create header text
		let headerText = document.createElement('p');
		headerText.setAttribute('class', 'settings-header-text');
		headerText.textContent = 'Change Password';
		headerDiv.appendChild(headerText);

		// create inputs
		let id = [ 'old', 'new', 'new-confirm' ];
		let placeHolderText = [ 'Old password', 'New password', 'Confirm new password' ];

		for (let i = 0; i < id.length; i++) {
			// create parent div
			let parentDiv = document.createElement('div');
			parentDiv.setAttribute('class', 'change-password');
			parentDiv.setAttribute('id', 'change-password-parent');
			parentElement.appendChild(parentDiv);

			// create placeholder
			let placeHolder = document.createElement('placeholder');
			placeHolder.setAttribute('class', 'change-password');
			placeHolder.setAttribute('id', 'change-password-placeholder');
			placeHolder.textContent = placeHolderText[i];
			parentDiv.appendChild(placeHolder);

			// create input div
			let inputDiv = document.createElement('div');
			inputDiv.setAttribute('class', 'change-password');
			inputDiv.setAttribute('id', 'change-password-input-div');
			parentDiv.appendChild(inputDiv);

			// create input
			let input = document.createElement('input');
			input.setAttribute('class', 'change-password');
			input.setAttribute('id', 'change-password-input-' + id[i]);
			input.setAttribute('type', 'password');
			inputDiv.appendChild(input);

			// create password hide/show switch
			let hideShow = document.createElement('hideShow');
			hideShow.setAttribute('class', 'change-password');
			hideShow.setAttribute('id', 'change-password-icon-div-' + id[i]);
			hideShow.setAttribute('onclick', 'hideShow(this)');
			inputDiv.appendChild(hideShow);

			// create eye icon
			let eyeIcon = document.createElement('img');
			eyeIcon.setAttribute('class', 'change-password');
			eyeIcon.setAttribute('id', 'change-password-icon');
			eyeIcon.setAttribute('height', '10px');
			eyeIcon.setAttribute('src', eye);
			hideShow.appendChild(eyeIcon);
		}

		// Create span
		let p = document.createElement('p');
		p.setAttribute('class', 'noerror');
		p.setAttribute('id', 'pass-error');
		p.textContent = 'ERROR';

		// Create confirm button
		let button = document.createElement('button');
		button.setAttribute('class', 'change-password-confirm');
		button.setAttribute('onclick', 'passChangeRequest()');
		button.textContent = 'Change';

		// Packaging children
		parentElement.appendChild(p);
		parentElement.appendChild(button);

		passParam = true;

		document.querySelector('#change-password-input-old').addEventListener('keyup', function(e, pro) {
			if (e.which == 13) {
				passChangeRequest();
				console.log('ENTER triggered');
			}
		});
		document.querySelector('#change-password-input-new').addEventListener('keyup', function(e, pro) {
			if (e.which == 13) {
				passChangeRequest();
				console.log('ENTER triggered');
			}
		});
		document.querySelector('#change-password-input-new-confirm').addEventListener('keyup', function(e, pro) {
			if (e.which == 13) {
				passChangeRequest();
				console.log('ENTER triggered');
			}
		});
	} else {
		document.querySelector('#change-password').classList.toggle('button-header-active');

		setTimeout(function() {
			parentElement.innerHTML = '';
		}, 200);
		passParam = false;
	}
}

// Lock Vault
let lockVaultOn = false;
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
	} else if (aboutOn) {
		console.log("'about' is already on");
		about();
		toggleParameters();
		setTimeout(function() {
			lockVault();
		}, 400);
	} else if (!lockVaultOn) {
		document.querySelector('#lock').classList.toggle('button-header-active');

		// Are you sure?
		let p = document.createElement('p');
		p.setAttribute('class', 'lock-param');
		p.setAttribute('id', 'confirmation');
		p.textContent = 'Are you sure you want to lock vault?';
		appendChildElement = parentElement.appendChild(p);

		// confimation div **div class="yesno"**
		let div = document.createElement('div');
		div.setAttribute('class', 'yesno');

		// save & quit Button
		if (saved) {
			let saveQuitButton = document.createElement('button');
			saveQuitButton.setAttribute('class', 'lock-param');
			saveQuitButton.setAttribute('id', 'save-quit-button');
			saveQuitButton.textContent = 'Save and quit';
			appendChildElement = parentElement.appendChild(saveQuitButton);
		}

		// Quit
		let quitButton = document.createElement('button');
		quitButton.setAttribute('class', 'lock-param');
		quitButton.setAttribute('id', 'quit-button');
		quitButton.setAttribute('onclick', 'quit()');
		if (saved) {
			quitButton.textContent = 'Lock without saving changes';
		} else {
			quitButton.textContent = 'Yes';
		}

		// Package Elements
		appendChildElement = parentElement.appendChild(quitButton);

		// letiable manipulation
		lockVaultOn = true;
	} else {
		document.querySelector('#lock').classList.toggle('button-header-active');

		setTimeout(function() {
			let first = parentElement.firstElementChild;
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
	let gridlinesTable = document.querySelectorAll('#tr');
	// Toggle gridlines
	for (let i = 0; i < gridlinesTable.length; i++) {
		gridlinesTable[i].classList.toggle('gridlinesOn');
	}
	// toggle gridlines
	config.gridlinesOn = !config.gridlinesOn;
	save('config');
}
function switchTheme() {
	let changeTheme = document.querySelector('#switch-theme');
	document.querySelector('head').removeChild(document.querySelector('.link-theme'));
	if (config.theme == 'dark') {
		config.theme = 'light';
		changeTheme.textContent = 'Switch to dark theme';
	} else if (config.theme == 'light') {
		config.theme = 'dark';
		changeTheme.textContent = 'Switch to light theme';
	}
	initTheme();
	save('config');
}

// About section
let aboutOn = false;
function about() {
	toggleParameters();
	parentElement = document.querySelector('.settings-parameters');
	if (passParam) {
		console.log('PassParam is already on');
		togglePassParam();
		toggleParameters();
		setTimeout(function() {
			about();
		}, 400);
		setTimeout(() => {
			parentElement.classList.add('toggleAbout');
		}, 200);
	} else if (lockVaultOn) {
		console.log('LockVault is already on');
		lockVault();
		toggleParameters();
		setTimeout(function() {
			about();
		}, 400);
		setTimeout(() => {
			parentElement.classList.add('toggleAbout');
		}, 200);
	} else if (!aboutOn) {
		parentElement.classList.add('toggleAbout');
		// button effects
		document.querySelector('#about').classList.toggle('button-header-active');
		// create header
		let headerDiv = document.createElement('div');
		headerDiv.setAttribute('class', 'settings-parameters-header');
		let headerIcon = document.createElement('img');
		headerIcon.setAttribute('class', 'icon');
		headerIcon.setAttribute('src', '');
		let headerText = document.createElement('p');
		headerText.setAttribute('class', 'settings-header-text');
		headerText.textContent = 'About';

		// create header div
		let bodyHeaderDIV = document.createElement('div');
		bodyHeaderDIV.setAttribute('style', 'display: flex; flex-direction: row; align-items: center');

		// create header of paragraph
		let bodyHeaderText = document.createElement('p');
		bodyHeaderText.setAttribute('class', 'settings-sub-body-header');
		bodyHeaderText.textContent = 'What is PassVault?';

		// create header icon
		let bodyHeaderImg = document.createElement('img');
		bodyHeaderImg.setAttribute('class', 'settings-sub-body-header');
		bodyHeaderImg.setAttribute('style', 'margin-left: 4px');
		bodyHeaderImg.setAttribute('height', '26px');
		bodyHeaderImg.setAttribute('src', '../global assets/img/icon-transparent.png');

		// create paragraph

		let bodyText1 = document.createElement('p');
		bodyText1.setAttribute('class', 'settings-sub-body');
		bodyText1.innerHTML = `PassVault is an <a href="" onclick="openExternal('github')">open-source tool</a> 
		developed by Hamza Alsarakbi that stores your encrypted passwords locally and not on the cloud to provide you 
		with the highest privacy.`;
		// open source link
		let openSourceLink = document.createElement('a');
		openSourceLink.setAttribute('href', 'www.google.ca');
		openSourceLink.textContent = 'open-source tool';

		// create header of paragraph
		let bodyHeader2 = document.createElement('p');
		bodyHeader2.setAttribute('class', 'settings-sub-body-header');
		bodyHeader2.textContent = 'Support me \u{2665}';

		// create paragraph
		let bodyText2 = document.createElement('p');
		bodyText2.setAttribute('class', 'settings-sub-body');
		bodyText2.innerHTML =
			`If you enjoy this app, consider following me on Instagram 
		<a href="" onclick="openExternal('instagram')">@hamza__sar</a>.
		 If you encounter a bug with this app. 
		 If you want to <a href="" onclick="openExternal('donate')">donate</a>, 
		 you can. It helps maintain this app, and build future projects.
		 <br>
		 <br>
		 Version: ` + version;

		parentElement.appendChild(headerDiv);
		headerDiv.appendChild(headerIcon);
		headerDiv.appendChild(headerText);
		parentElement.appendChild(bodyHeaderDIV);
		bodyHeaderDIV.appendChild(bodyHeaderText);
		bodyHeaderDIV.appendChild(bodyHeaderImg);
		parentElement.appendChild(bodyText1);
		parentElement.appendChild(bodyHeader2);
		parentElement.appendChild(bodyText2);
		aboutOn = true;
	} else {
		document.querySelector('#about').classList.toggle('button-header-active');

		setTimeout(function() {
			parentElement.classList.remove('toggleAbout');
			let first = parentElement.firstElementChild;
			while (first) {
				first.remove();
				first = parentElement.firstElementChild;
			}
		}, 200);
		aboutOn = false;
	}
}

function openExternal(type) {
	if (type == 'github') {
		shell.openExternal('https://github.com/Electr0d');
	} else if (type == 'instagram') {
		shell.openExternal('https://www.instagram.com/hamza__sar/');
	} else if (type == 'twitter') {
		shell.openExternal('https://twitter.com/Electr0d');
	} else if (type == 'donate') {
		shell.openExternal('https://www.patreon.com/Hamza_Sar');
	}
}

function showDialog(titleContent, promptContent, buttons, buttonActions) {
	if (buttons.length == buttonActions.length) {
		const body = document.querySelector('body');
		// create overlay
		let overlay = document.createElement('div');
		overlay.setAttribute('class', 'overlay');
		body.appendChild(overlay);
		// create dialog box
		let dialogBox = document.createElement('div');
		dialogBox.setAttribute('class', 'dialog-box');
		overlay.appendChild(dialogBox);

		// create title
		let title = document.createElement('p');
		title.setAttribute('class', 'dialog-box-title');
		title.textContent = titleContent;
		dialogBox.appendChild(title);
		// create prompt
		let prompt = document.createElement('p');
		prompt.setAttribute('class', 'dialog-box-prompt');
		prompt.textContent = promptContent;
		dialogBox.appendChild(prompt);
		// create buttons
		for (i = 0; i < buttons.length; i++) {
			let button = document.createElement('button');
			button.setAttribute('class', 'dialog-box-button');
			button.setAttribute('id', 'dialog-box-button-' + i);
			button.setAttribute('onclick', buttonActions[i]);
			button.textContent = buttons[i];
			dialogBox.appendChild(button);
		}
		document.querySelector('.container').classList.add('container-freeze');
	} else {
		console.log('%c ERROR: buttons != buttonActions', errorColor);
	}
}
function closeDialog() {
	let overlay = document.querySelector('.overlay');
	if (overlay === undefined) {
		// throw error
	} else {
		document.querySelector('.dialog-box').classList.add('dialog-box-close');
		document.querySelector('.container').classList.remove('container-freeze');
		setTimeout(function() {
			document.querySelector('body').removeChild(document.querySelector('.overlay'));
		}, 240);
	}
}
let searchOn = false;
function searchToggle() {
	if (components.add.on) addFunc();
	if (components.settings.on) settingsFunc();

	// transitions
	searchInput.classList.toggle('toggleSearch');
	document.querySelector('div.control#search').classList.toggle('toggleSearch');

	// clear search input
	searchInput.value = '';
	if (!searchOn) {
		// toggle on search
		searchInput.select();
		searchOn = true;
	} else if (searchOn) {
		// toggle off search
		searchOn = false;
	}
}
// filters
let filtersOn = false;
function toggleFilters() {
	if (components.add.on) addFunc();
	if (components.settings.on) settingsFunc();
	if (!filtersOn) {
		// make drop-down
		let container = document.createElement('div');
		container.setAttribute('class', 'drop-down');
		document.querySelector('dropDown').appendChild(container);

		// create header
		let header = document.createElement('div');
		header.setAttribute('class', 'header');
		header.textContent = 'Search By:';
		container.appendChild(header);

		// create parameters
		for (i = 0; i < id.length; i++) {
			// create parameter
			let label = document.createElement('label');
			label.setAttribute('class', 'label');
			label.textContent = id[i];
			container.appendChild(label);

			// create checkbox
			let input = document.createElement('input');
			input.setAttribute('type', 'checkbox');
			input.setAttribute('id', id[i]);
			input.setAttribute('onclick', 'setFilter(this)');

			// if search by is turned off for this specific parameter, then don't 'check' it.
			if (searchBy[id[i]]) input.setAttribute('checked', 'checked');
			label.appendChild(input);

			// create checkmark
			let span = document.createElement('span');
			span.setAttribute('class', 'checkmark');
			label.appendChild(span);
		}
		filtersOn = true;
	} else {
		document.querySelector('dropDown').innerHTML = '';
		filtersOn = false;
	}
}
function setFilter(e) {
	let id = e.id;
	if (searchBy[id]) {
		searchBy[id] = false;
	} else {
		searchBy[id] = true;
	}
	console.log(id + ': ' + searchBy[id]);
	search();
}
searchInput.addEventListener('input', search);

function search() {
	// get input value
	text = searchInput.value.toLowerCase();
	for (i = 0; i < data.cellIndex; i++) {
		try {
			document.querySelector('.row-' + i).classList.add('no-match');
			for (c = 0; c < id.length; c++) {
				// check if searchby is active
				if (searchBy[id[c]]) {
					let cellData = data['cell-' + i][id[c]].toLowerCase();
					if (cellData.includes(text)) {
						document.querySelector('.row-' + i).classList.remove('no-match');
					}
				}
			}
		} catch (err) {
			console.error(err);
			console.log('%c WARNING: Cell ' + i + " doesn't exist", orangeColor);
		}
	}
}
function iconChecker(classList, id, text) {
	let cell = document.querySelector(classList + id);
	let originalText = text;
	text = text.toLowerCase();
	let list = [];
	let defaultList = [];

	// pull default icons
	try {
		fs.readdirSync('global assets/img/icons').forEach((file) => {
			defaultList.push(file);
		});
	} catch (err) {
		console.error(err);
	}

	// pull data/icons.json
	try {
		fs.readdirSync(path.join(parentDir, '/Data/icons')).forEach((file) => {
			list.push(file);
		});
	} catch (err) {
		console.error(err);
		console.log("icons folder likely doesn't exist. Using default folder.");

		fs.mkdirSync(path.join(parentDir, '/Data/icons'));
	}

	if (!(list === undefined || list.length == 0)) {
		for (let i = 0; i < list.length; i++) {
			if (text.includes(list[i].substring(0, list[i].length - 4))) {
				cell.innerHTML =
					`
			<img class="` +
					classList.replace('.', '') +
					`" id="service-icon" src="` +
					path.join(parentDir, '/Data/icons/' + list[i]) +
					`">` +
					originalText;
				i = list.length;
			} else {
				defaultAdd();
			}
		}
	} else {
		defaultAdd();
	}

	function defaultAdd() {
		for (let i = 0; i < defaultList.length; i++) {
			if (text.includes(defaultList[i].substring(0, defaultList[i].length - 4))) {
				cell.innerHTML =
					`
				<img class="` +
					classList.replace('.', '') +
					`" id="service-icon" src="../global assets/img/icons/` +
					defaultList[i] +
					`">` +
					originalText;
			}
		}
	}
}
