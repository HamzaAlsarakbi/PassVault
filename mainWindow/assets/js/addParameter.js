function addParameter(parent, text, interaction, id, onclick, on, returnStatement) {
	// create parameter
	var parameter = document.createElement('div');
	parameter.setAttribute('class', 'settings-parameter');
	parameter.setAttribute('id', 'parameter-' + id);
	parent.appendChild(parameter);

	// create text parameter
	var parameterText = document.createElement('span');
	parameterText.setAttribute('class', 'parameter-text');
	parameterText.setAttribute('id', 'parameter-text-' + id);
	parameterText.textContent = text.text;
	parameter.appendChild(parameterText);

	if (interaction == 'switch') {
		// create switch
		var switchElement = document.createElement('div');
		switchElement.setAttribute('class', 'switch-housing');
		switchElement.setAttribute('id', 'switch-' + id);
		switchElement.setAttribute('onclick', onclick);
		parameter.appendChild(switchElement);

		// create circle
		var circle = document.createElement('div');
		circle.setAttribute('class', 'switch-circle');
		circle.setAttribute('id', 'switch-' + id);
		switchElement.appendChild(circle);
		if (data.users[data.users.currentUser].preferences[id] == on) tranformSwitch(circle);
	} else if (interaction == 'slider') {
		var parameterContainer = document.createElement('div');
		parameterContainer.setAttribute('class', 'parameter-container');
		parameterContainer.setAttribute('id', 'parameter-container-' + id);
		parameter.appendChild(parameterContainer);
		// create slider
		var slider = document.createElement('input');
		slider.setAttribute('class', 'slider');
		slider.setAttribute('type', 'range');
		slider.setAttribute('min', text.slider.min);
		slider.setAttribute('max', text.slider.max);
		slider.setAttribute('value', text.slider.value);
		slider.setAttribute('id', 'slider-' + id);
		slider.addEventListener('input', onclick);
		parameterContainer.appendChild(slider);

		// create span
		var span = document.createElement('span');
		span.setAttribute('class', 'slider-span');
		span.setAttribute('id', 'span-' + id);
		span.textContent = Math.round(text.slider.value);
		parameterContainer.appendChild(span);
	} else if (interaction == 'button') {
		var button = document.createElement('button');
		button.setAttribute('class', 'parameter-button');
		button.setAttribute('id', 'parameter-button-' + id);
		button.setAttribute('onclick', onclick);
		button.textContent = text.button.text;
		parameter.appendChild(button);
	}
	if (returnStatement) return data.users[data.users.currentUser].preferences[id] == on;
}
