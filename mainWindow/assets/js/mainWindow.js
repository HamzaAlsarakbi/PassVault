const electron = require('electron');
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
	settings: false,
	add: false,
	dialog: false,
	search: false,
	tooltip: false,
	filters: false
};

const elements = {
	panel: {
		controls: {
			label: document.querySelector('.controls-label'),
			text: document.querySelector('.control-text'),
			icon: document.querySelector('.control-icon')
		}
	}
}

const icons = {
	eye: {
		eye: '../global assets/img/dark/eye.png',
		crossed: '../global assets/img/dark/crossed-eye.png'
	},
	pencil: '../global assets/img/dark/pencil.png',
	bullet: '\u{2022}',
	trashcan: '../global assets/img/dark/trashcan.png',
	remove: '../global assets/img/dark/remove.png',
	confirm: '../global assets/img/dark/confirm.png',
	add: '../global assets/img/dark/add.png',
	gear: '../global assets/img/dark/gear.png',
	PassVault: {
		icon: '../global assets/img/icon-transparent.png'
	}
}

// icons

// table
const table = document.querySelector('.tbody-data');
const id = [ 'type', 'service', 'email', 'password' ];

// shortcuts
document.onkeydown = (e) => {
	if (e.altKey && e.which == 65) {
		toggleAdd();
	}
	if (e.altKey && e.which == 83) {
		toggleSettings();
	}
	if (e.altKey && e.which == 70) {
		toggleFilters();
	}
	if (e.ctrlKey && e.which == 70) {
		toggleSearch();
	}
	if (e.ctrlKey && e.which == 83) {
		if (saved) {
			save('all');
		}
	}
};


function capitalize(text) {
	return text.replace(text.substring(0, 1), text.substring(0, 1).toUpperCase());
}







function toggleAdd() {
	document.querySelector('controls').classList.toggle('enabled');
	document.querySelector('#add img').classList.toggle('rotate');
	panel.classList.toggle('toggleAdd');
	document.querySelector('#thead').classList.toggle('toggleAdd');
	menu.classList.toggle('menu-down');
	if (components.settings) {
		toggleSettings();
	}
	if (components.search) {
		toggleSearch();
	}
	if (components.filters) {
		toggleFilters();
	}
	if (!components.add) {

		elements.panel.controls.icon.setAttribute('src', icons.add);
		elements.panel.controls.icon.setAttribute('height', '20px');
		elements.panel.controls.text.textContent = 'Add';

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
		eyeIcon.setAttribute('src', icons.eye.eye);
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
		components.add = true;

		typeInput.addEventListener('keyup', enterFunc);
		serviceInput.addEventListener('keyup', enterFunc);
		emailInput.addEventListener('keyup', enterFunc);
		passwordInput.addEventListener('keyup', enterFunc);
		typeInput.select();
	} else {
		elements.panel.controls.icon.setAttribute('src', '');
		elements.panel.controls.text.textContent = '';
		panel.classList.remove('controlsSpan');
		menu.innerHTML = '';
		components.add = false;
	}
}
function enterFunc(event) {
	if (event.keyCode === 13) {
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
		data.cellIndex++;
		// go back to type input field (convenience)
		typeDOM.select();
		search();
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
				content.textContent = icons.bullet.repeat(password.length);
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
	edit.setAttribute('onmouseover', 'addTooltip(this, "Edit")');
	edit.setAttribute('onclick', 'editRow(this, "show")');
	tdControls.appendChild(edit);

	// create edit icon
	let pencil = document.createElement('img');
	pencil.setAttribute('class', 'cell-' + index);
	pencil.setAttribute('id', 'edit-icon');
	pencil.setAttribute('src', icons.pencil);
	pencil.setAttribute('height', '15px');
	edit.appendChild(pencil);

	// create show/hide button
	let showHideButton = document.createElement('div');
	showHideButton.setAttribute('class', 'cell-' + index);
	showHideButton.setAttribute('id', 'cell-showHide');
	showHideButton.setAttribute('onmouseover', 'addTooltip(this, "Show/Hide")');
	showHideButton.setAttribute('onclick', 'hideShow(this)');
	tdControls.appendChild(showHideButton);

	// create eye icon
	let eyeIcon = document.createElement('img');
	eyeIcon.setAttribute('class', 'cell-' + index);
	eyeIcon.setAttribute('id', 'eye-icon');
	eyeIcon.setAttribute('height', '15px');
	if (data['cell-' + index].hidden) {
		eyeIcon.setAttribute('src', icons.eye.eye);
	} else {
		eyeIcon.setAttribute('src', icons.eye.crossed);
	}
	showHideButton.appendChild(eyeIcon);

	// create delete button
	let deleteButton = document.createElement('div');
	deleteButton.setAttribute('class', 'cell-' + index);
	deleteButton.setAttribute('id', 'cell-delete');
	deleteButton.setAttribute('onmouseover', 'addTooltip(this, "Delete")');
	deleteButton.setAttribute('onclick', 'deleteFunc(this)');
	tdControls.appendChild(deleteButton);

	// create delete icon
	let deleteIcon = document.createElement('img');
	deleteIcon.setAttribute('class', 'cell-' + index);
	deleteIcon.setAttribute('id', 'delete-icon');
	deleteIcon.setAttribute('src', icons.trashcan);
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
		return strength;
	}
}
let editOn = false;
function hideShow(e, value) {
	let d = e.id;
	let c = e.classList;
	// if it is an input
	if (d == 'add-switch' || d.includes('input-icon-parameter')) {
		let input, icon;

		// if it is the add menu
		if (d == 'add-switch') {
			input = document.querySelector('#add-password');
			icon = document.querySelector('.eye-icon');

		} else {
			// if it is a parameter
			input = document.querySelector('.input-parameter#' + d.replace('-icon', ''));
			icon = e;			
		}
		
		// toggle depending on input type
		if (input.type == 'password') {
			input.type = 'text';
			icon.setAttribute('src', icons.eye.crossed);
		} else {
			input.type = 'password';
			icon.setAttribute('src', icons.eye.eye);
		}
	} else {
		// if it is table
		let querySelect = '#password-content' + '.' + c;
		let querySelectInput = '#table-password' + '.input-' + data[c].index;
		if (!editOn) {
			if (data[c].hidden) {
				document.querySelector('#eye-icon.' + c).setAttribute('src', icons.eye.crossed);
				document.querySelector(querySelect).textContent = data[c].password;
				data[c].hidden = false;
			} else {
				document.querySelector('#eye-icon.' + c).setAttribute('src', icons.eye.eye);
				document.querySelector(querySelect).textContent = icons.bullet.repeat(data[c].password.length);
				data[c].hidden = true;
			}
		} else {
			if (data[c].hidden) {
				document.querySelector('#eye-icon.' + c).setAttribute('src', icons.eye.crossed);

				document.querySelector(querySelectInput).setAttribute('type', 'text');
				data[c].hidden = false;
			} else {
				document.querySelector('#eye-icon.' + c).setAttribute('src', icons.eye.eye);
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
		{
			let cell = document.querySelector('#cell-edit.' + c);
			cell.setAttribute('onclick', 'editRow(this, "hide")');
			cell.setAttribute('onmouseover', 'addTooltip(this, "Confirm")');
		}
		{
			let cell = document.querySelector('#cell-delete.' + c);
			cell.setAttribute('onclick', 'cancelEdit(this)');
			cell.setAttribute('onmouseover', 'addTooltip(this, "Cancel")');	
		}


		// change icons
		document.querySelector('#delete-icon.' + c).setAttribute('src', icons.remove);
		document.querySelector('#edit-icon.' + c).setAttribute('src', icons.confirm);

		// tr effects
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
			document.querySelector('#cell-edit.' + c).setAttribute('onmouseover', 'addTooltip(this, "Edit")');
			document.querySelector('#cell-delete.' + c).setAttribute('onclick', 'deleteFunc(this)');
			document.querySelector('#cell-delete.' + c).setAttribute('onmouseover', 'addTooltip(this, "Delete")');

			// reset icons
			document.querySelector('#edit-icon.' + c).setAttribute('src', icons.pencil);
			document.querySelector('#delete-icon.' + c).setAttribute('src', icons.trashcan);

			// when confirm button is clicked
			data[c].type = document.querySelector('#table-type.input-' + data[c].index).value;
			data[c].service = document.querySelector('#table-service.input-' + data[c].index).value;
			data[c].email = document.querySelector('#table-email.input-' + data[c].index).value;
			data[c].password = document.querySelector('#table-password.input-' + data[c].index).value;
			
			editOn = false;
			// add td text
			typeDOM.textContent = data[c].type;
			serviceDOM.textContent = data[c].service;
			emailDOM.textContent = data[c].email;

			if (!data[c].hidden) {
				passwordDOM.textContent = data[c].password;
			} else {
				passwordDOM.textContent = icons.bullet.repeat(data[c].password.length);
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
	document.querySelector('#cell-edit.' + c).setAttribute('onmouseover', 'addTooltip(this, "Edit")');
	document.querySelector('#cell-delete.' + c).setAttribute('onclick', 'deleteFunc(this)');
	document.querySelector('#cell-delete.' + c).setAttribute('onmouseover', 'addTooltip(this, "Delete")');

	// reset icons
	document.querySelector('#delete-icon.' + c).setAttribute('src', icons.trashcan);
	document.querySelector('#edit-icon.' + c).setAttribute('src', icons.pencil);

	document.querySelector('#type-content.' + c).textContent = data[c].type;
	document.querySelector('#service-content.' + c).textContent = data[c].service;
	document.querySelector('#email-content.' + c).textContent = data[c].email;

	if (!data[c].hidden) {
		document.querySelector('#password-content.' + c).textContent = data[c].password;
	} else {
		document.querySelector('#password-content.' + c).textContent = icons.bullet.repeat(data[c].password.length);
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
	let tr = 'row-' + index;
	tr = document.querySelector('.row-' + index);
	tr.classList.toggle('draw-out-animation');
	setTimeout(() => {
		let removedIndex = Number(c.replace('cell-', ''));
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



// Lock Vault
function toggleLockVault() {
	if (!components.settings.subMenus.lockVault) {
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
		components.settings.subMenus.lockVault = true;
	} else {
		document.querySelector('#lock').classList.toggle('button-header-active');

		setTimeout(function() {
			parentElement.innerHTML = '';
		}, 200);
		components.settings.subMenus.lockVault = false;
	}
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


// About section
function toggleAbout() {
		
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
}


function showDialog(titleContent, promptContent, buttons, buttonActions) {
	if(!components.dialog) {
		if (buttons.length == buttonActions.length) {
			// create overlay
			let overlay = document.createElement('div');
			overlay.setAttribute('class', 'overlay');
			document.body.appendChild(overlay);
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
			components.dialog = true;
			return overlay;
		}
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
	components.dialog = false;
}
function toggleSearch() {
	if (components.add) toggleAdd();
	if (components.settings) toggleSettings();
	components.search = !components.search;

	// transitions
	searchInput.classList.toggle('toggleSearch');
	document.querySelector('div.control#search img').classList.toggle('toggleSearch');

		// clear search input
	searchInput.value = '';
	search();
	if(components.search) {
		searchInput.select();
	} else {
		searchInput.blur();
	}
	
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
		fs.readdirSync(path.join(__dirname, '../global assets/img/icons')).forEach((file) => {
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
