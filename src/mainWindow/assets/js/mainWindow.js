const { shell } = electron;
let parentElement;
const strengthTier = [ 'Very weak', 'Weak', 'Medium', 'Strong', 'Very strong' ];
const app = $('.container')[0]
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

// table
const table = document.querySelector('.tbody-data');
const id = [ 'type', 'service', 'email', 'password' ];

// shortcuts
document.onkeydown = e => {
	if (e.altKey && e.code == "KeyA") {
		toggleAdd();
	}
	if (e.altKey && e.code == "KeyS") {
		toggleSettings();
	}
	if (e.altKey && e.code == "KeyF") {
		toggleFilters();
	}
	if (e.ctrlKey && e.code == "KeyF") {
		toggleSearch();
	}
	if (e.ctrlKey && e.code == "KeyS") {
		if (saved) {
			save('all');
		}
	}
};


function capitalize(text) {
	return text.replace(text.substring(0, 1), text.substring(0, 1).toUpperCase());
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
	return tr;
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
function hideShowTable(e, value) {
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
		let cell = document.querySelector('#password-content' + '.' + c);
		let cellInput = document.querySelector('#table-password' + '.input-' + data[c].index);

		if (cellInput) {
			if (data[c].hidden) {
				document.querySelector('#eye-icon.' + c).setAttribute('src', icons.eye.crossed);
				cellInput.setAttribute('type', 'text');
				
			} else {
				document.querySelector('#eye-icon.' + c).setAttribute('src', icons.eye.eye);
				cellInput.setAttribute('type', 'password');
			}
		} else {
			if (data[c].hidden) {
				document.querySelector('#eye-icon.' + c).setAttribute('src', icons.eye.crossed);
				cell.textContent = data[c].password;
			} else {
				document.querySelector('#eye-icon.' + c).setAttribute('src', icons.eye.eye);
				cell.textContent = icons.bullet.repeat(data[c].password.length);
			}
		}
		data[c].hidden = !data[c].hidden;
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
		document.querySelector('.' + tr).classList.add('tr-edit');
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
			document.querySelector('.' + tr).classList.remove('tr-edit');
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
	
	document.querySelector('.' + tr).classList.remove('tr-edit');

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

function iconChecker(classList, id, text) {
	let cell = document.querySelector(classList + id);
	let originalText = text;
	text = text.toLowerCase();
	let list = [];
	let defaultList = [];

	// pull default icons
	try {
		fs.readdirSync(path.join(__dirname, '../assets/img/icons')).forEach((file) => {
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
					`" id="service-icon" src="../assets/img/icons/` +
					defaultList[i] +
					`">` +
					originalText;
			}
		}
	}
}
