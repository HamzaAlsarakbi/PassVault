const { shell } = electron;
const app = $('.app');
// data object
let data = {
	cellIndex: 0
};

function $(query) {
	return document.querySelector(query);
}
function $$(query) {
	return document.querySelectorAll(query);
}
// menu
const panel = $('panel');
const menu = $('menu');

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
			label: $('.controls-label'),
			text: $('.control-text'),
			icon: $('.control-icon')
		}
	},
	table: $('.tbody')
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

// Toggle parameters
function toggleParameters() {
	// Parameters
	$('.settings-parameters').classList.toggle('settingsToggle');
}


// general functions
function capitalize(text) {
	return text.replace(text.substring(0, 1), text.substring(0, 1).toUpperCase());
}
function clamp(value, min, max) {
	// clamp value
	return value < min ? min : value > max ? max : value;
}