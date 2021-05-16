const { shell } = electron;
const app = document.querySelector('.app');
// data object
let data = {
	cellIndex: 0
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
	},
	table: document.querySelector('.tbody')
}

// table
const id = ['type', 'service', 'email', 'password'];

// shortcuts
document.onkeydown = e => {
	if (e.altKey && e.code == "KeyA") {
		toggleAdd();
	} else if (e.altKey && e.code == "KeyS") {
		toggleSettings();
	} else if (e.altKey && e.code == "KeyF") {
		toggleFilters();
	} else if (e.ctrlKey && e.code == "KeyF") {
		toggleSearch();
	} else if (e.ctrlKey && e.code == "KeyS") {
		if (saved) save('all');
	}
};


function capitalize(text) {
	return text.replace(text.substring(0, 1), text.substring(0, 1).toUpperCase());
}


// Toggle parameters
function toggleParameters() {
	// Parameters
	document.querySelector('.settings-parameters').classList.toggle('settingsToggle');
}



function showDialog(titleContent, promptContent, buttons, buttonActions) {
	if (!components.dialog) {
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
			app.classList.add('container-freeze');
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
		app.classList.remove('container-freeze');
		setTimeout(function () {
			document.querySelector('body').removeChild(document.querySelector('.overlay'));
		}, 240);
	}
	components.dialog = false;
}