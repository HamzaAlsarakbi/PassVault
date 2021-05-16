function addParameter(parent, info, type, id, onclick, config) {
	// create parameter
	let parameter = document.createElement('div');
	parameter.setAttribute('class', 'settings-parameter');
	parameter.setAttribute('id', 'parameter-' + id);
	parent.appendChild(parameter);

	if (info.text != undefined) {
		// create text parameter
		let parameterText = document.createElement('span');
		parameterText.setAttribute('class', 'parameter-text');
		parameterText.setAttribute('id', 'parameter-text-' + id);
		parameterText.textContent = info.text;
		parameter.appendChild(parameterText);
	}
	switch (type) {
		case 'switch':
			let switchElement = addElement('div', {
				class: 'switch-housing', id: `switch-${id}`,
				onclick: `${onclick}; transformSwitch(document.querySelector(".switch-circle#switch-${id}"))`
			}, '', parameter);
			let circle = addElement('div', { class: 'switch-circle', id: `switch-${id}` }, '', switchElement);
			if (config == info.on) transformSwitch(circle);
			break;
		case 'slider':
			let parameterContainer = addElement('div', { class: 'parameter-container', id: `parameter-container-${id}` }, '', parameter);
			// create slider
			let slider = addElement('input', {
				class: 'slider', type: 'range', min: info.slider.min, max: info.slider.max, id: `slider-${id}`
			}, info.slider.value, parameterContainer);
			slider.addEventListener('input', onclick);

			// create span
			addElement('span', { class: 'slider-span', id: `span-${id}` }, Math.round(info.slider.value), parameterContainer);
			break;
		case 'button':
			addElement('button', { class: 'parameter-button', id: 'parameter-button-' + id, onclick: onclick }, info.button.text, parameter);
			break;
		case 'radio':
			let radio = addElement('label', { id: id + '-radio', class: 'parameter-radio' }, info.radio.text, parameter);
			let radioInput = addElement('input', { name: info.name, id: id + '-radio-input', class: 'radio-input', type: 'radio' }, '', radio);
			addElement('span', { id: id + '-radio-checkmark', class: 'radio-checkmark' }, '', radio);
			radio.addEventListener('input', onclick);
			if (config == info.on) radioInput.checked = true;
			parameter.setAttribute('class', 'radio-parameter');
			break;
		case 'input':
			// create parent div
			let parentDiv = addElement('div', { class: 'parameter-input', id: id + '-parameter-input' }, '', parameter);

			// create placeholder
			addElement('div', { class: 'placeholder palceholder-parameter', id: id + '-palceholder-parameter' }, info.input.placeholder, parentDiv);

			// create input div
			let inputDiv = addElement('div', { class: 'parent-input-parameter', id: id + '-parent-input-parameter' }, '', parentDiv);
			// create input
			let input = addElement('input', { class: 'input-parameter', id: id + '-input-parameter', type: info.input.type }, '', inputDiv);
			input.addEventListener('input', onclick);
			// create password hide/show switch
			if (info.input.type == 'password') addElement('img', { class: 'input-icon-parameter', id: id + '-input-icon-parameter', onclick: 'hideShow(this)', src: icons.eye.eye }, '', inputDiv);
			break;
	}
	return parameter;
}
function transformSwitch(switchElement) {
	switchElement.classList.toggle('switch-on');
}


function updateSpan(id, text) {
	document.querySelector('#span-' + id).textContent = text;
}