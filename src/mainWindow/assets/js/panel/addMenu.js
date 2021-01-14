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
		let addContainer = addForm({ class: 'add-container' }, menu);

		// create type input
		let typeInput = addRichInput({ class: 'add-input', id: 'add-type' }, 'Type (Personal, Work)', addContainer);

		// create service input
		let serviceInput = addRichInput({ class: 'add-input', id: 'add-service' }, 'Service (Gmail, Twitter)', addContainer);

		// create email input
		let emailInput = addRichInput({ class: 'add-input', id: 'add-email' }, 'Email (name@service.com)', addContainer);

		// create password input
		let passwordInput = addRichInput({ class: 'add-input', id: 'add-password', hidden: true }, 'Password', addContainer);
		
		addElement('span', { class: 'noerror', id: 'add-error' }, 'At least one field is empty.', addContainer);

		addElement('button', { class: 'add-button', onclick: 'addData()', type: 'button' }, 'Add', addContainer);

		typeInput.addEventListener('keydown', addEnter);
		serviceInput.addEventListener('keydown', addEnter);
		emailInput.addEventListener('keydown', addEnter);
		passwordInput.addEventListener('keydown', addEnter);
		typeInput.select();
	} else {
		elements.panel.controls.icon.setAttribute('src', '');
		elements.panel.controls.text.textContent = '';
		panel.classList.remove('controlsSpan');
		menu.innerHTML = '';
  }
  
  components.add = !components.add;
}
function addEnter(event) {
	if (event.keyCode === 13) {
		addData();
	}
}


function addData() {
	const typeDOM = document.querySelector('input#add-type-rich-input');
	const serviceDOM = document.querySelector('input#add-service-rich-input');
	const emailDOM = document.querySelector('input#add-email-rich-input');
	const passwordDOM = document.querySelector('input#add-password-rich-input');
	const span = document.querySelector('#add-error');

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