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
		panelTitle('add');
		
		let addContainer = new Form({ class: 'add-container' }, menu).form;
		// Create inputs
		let inputs = {
			type: new RichInput({ class: 'add-input', id: 'add-type' }, 'Type (Personal, Work)', addContainer),
			service: new RichInput({ class: 'add-input', id: 'add-service' }, 'Service (Gmail, Twitter)', addContainer),
			email: new RichInput({ class: 'add-input', id: 'add-email' }, 'Email (name@service.com)', addContainer),
			password: new RichInput({ class: 'add-input', id: 'add-password', hidden: true }, 'Password', addContainer)
		}
		addElement('span', { class: 'noerror', id: 'add-error' }, 'At least one field is empty.', addContainer);
		addElement('button', { class: 'add-button', onclick: 'addData()', type: 'button' }, 'Add', addContainer);

		for(input in inputs) {
			inputs[input].input.addEventListener('keydown', addEnter);
		}
		inputs.type.input.select();
	} else {
		elements.panel.controls.icon.setAttribute('src', '');
		elements.panel.controls.text.textContent = '';
		panelTitle('remove');
		panel.classList.remove('panel-extend');
		menu.innerHTML = '';
  }
  
  components.add = !components.add;
}
function addEnter(e) {
	if (e.keyCode === 13) {
		addData();
	}
}


function addData() {
	const inputs = {
		type: document.querySelector('input#add-type-rich-input'),
		service: document.querySelector('input#add-service-rich-input'),
		email: document.querySelector('input#add-email-rich-input'),
		password: document.querySelector('input#add-password-rich-input')
	}
	const span = document.querySelector('#add-error');

	// verify that all entries are full
	let empty = false;
	let invalidInputs = [];
	for(let input in inputs) {
		if(inputs[input].value == '') {
			invalidInputs.push(inputs[input]);
			span.classList.add('error');
			panel.classList.add('panel-extend');
			inputs[input].select();
			inputInvalid(inputs[input], 'add');
			empty = true;
		}
	}
	if(empty) {
		invalidInputs[0].select();


	} else {
		// remove error
		span.classList.remove('error');
		panel.classList.remove('panel-extend');

		data['cell-' + data.cellIndex] = {
			type: inputs.type.value,
			service: inputs.service.value,
			email: inputs.email.value,
			password: inputs.password.value,
			index: data.cellIndex,
			class: 'cell-' + data.cellIndex,
			hidden: true
		};
		let row = addRow(inputs.type.value, inputs.service.value, inputs.email.value, inputs.password.value, data.cellIndex);

		// turn on gridlines if it is on
		if (config.gridlinesOn) row.classList.add('gridlinesOn');

		// empty input fields
		for(let input in inputs) inputs[input].value = '';
		data.cellIndex++;
		
		// select first input
		inputs.type.select();
		search();
	}
}