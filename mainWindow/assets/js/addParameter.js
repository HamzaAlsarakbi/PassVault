function addParameter(parent, text, type, id, onclick, config, on) {
	// create parameter
	let parameter = document.createElement('div');
	parameter.setAttribute('class', 'settings-parameter');
	parameter.setAttribute('id', 'parameter-' + id);
	parent.appendChild(parameter);

	// create text parameter
	let parameterText = document.createElement('span');
	parameterText.setAttribute('class', 'parameter-text');
	parameterText.setAttribute('id', 'parameter-text-' + id);
	parameterText.textContent = text.text;
	parameter.appendChild(parameterText);

	if (type == 'switch') {
		// create switch
		let switchElement = document.createElement('div');
		switchElement.setAttribute('class', 'switch-housing');
		switchElement.setAttribute('id', 'switch-' + id);
		switchElement.setAttribute(
			'onclick',
			onclick + '; transformSwitch(document.querySelector(".switch-circle#switch-' + id + '"))'
		);
		parameter.appendChild(switchElement);

		// create circle
		let circle = document.createElement('div');
		circle.setAttribute('class', 'switch-circle');
		circle.setAttribute('id', 'switch-' + id);
		switchElement.appendChild(circle);
		if (config == on) transformSwitch(circle);
	} else if (type == 'slider') {
		let parameterContainer = document.createElement('div');
		parameterContainer.setAttribute('class', 'parameter-container');
		parameterContainer.setAttribute('id', 'parameter-container-' + id);
		parameter.appendChild(parameterContainer);
		// create slider
		let slider = document.createElement('input');
		slider.setAttribute('class', 'slider');
		slider.setAttribute('type', 'range');
		slider.setAttribute('min', text.slider.min);
		slider.setAttribute('max', text.slider.max);
		slider.setAttribute('value', text.slider.value);
		slider.setAttribute('id', 'slider-' + id);
		slider.addEventListener('input', onclick);
		parameterContainer.appendChild(slider);

		// create span
		let span = document.createElement('span');
		span.setAttribute('class', 'slider-span');
		span.setAttribute('id', 'span-' + id);
		span.textContent = Math.round(text.slider.value);
		parameterContainer.appendChild(span);
	} else if (type == 'button') {
		let button = document.createElement('button');
		button.setAttribute('class', 'parameter-button');
		button.setAttribute('id', 'parameter-button-' + id);
		button.setAttribute('onclick', onclick);
		button.textContent = text.button.text;
		parameter.appendChild(button);
	}
	return parameter;
}
function transformSwitch(switchElement) {
	switchElement.classList.toggle('switch-on');
}
