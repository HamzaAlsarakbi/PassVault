function toggleSettings() {
	$('controls').classList.toggle('panel-active');
	$('#thead').classList.toggle('margin-settings');
	panel.classList.toggle('toggleSettings');

	// menu transitions
	menu.classList.toggle('menu-down');

	// rotate icon
	$('.control#settings').classList.toggle('panel-active');

	// if one of the windows is open
	if (components.search) toggleSearch();
	if (components.filters) toggleFilters();
	if (components.add) toggleAdd();

	if (!components.settings) {
		// update icons
		elements.panel.controls.icon.setAttribute('src', icons.gear);
		elements.panel.controls.icon.setAttribute('height', '30px');
		elements.panel.controls.text.textContent = 'Settings';


		// create settingsBody
		let settingsBody = $('menu.menu-down');


		// general section
		let generalSection = addSection('General', 'general', settingsBody);
		addParameter(generalSection.body, { text: 'Show gridlines', on: true }, 'switch', 'general-gridlines', 'toggleGridlines()', config.gridlinesOn);
		addParameter(generalSection.body, { text: 'Enable Animations', on: true }, 'switch', 'enable-animations', 'toggleAnimations()', config.enableAnimations);
		addParameter(generalSection.body, { text: 'Inactivity Timeout', slider: { min: 1, max: 10, value: config.timeout } }, 'slider', 'inactivity-timeout', inactivityTimeout, config.timeout);
		addParameter(generalSection.body, { text: 'Open icons folder', button: { text: 'Open Folder' } }, 'button', 'open-icons-folder', 'shell.openExternal(path.join(parentDir, "/Data/icons"))');
		addParameter(generalSection.body, { text: 'Change Master Password', button: { text: 'Change' } }, 'button', 'change-master-password', 'openChangePasswordDialog()');

		// themes section
		let themeSection = addSection('Themes', 'themes', settingsBody);
		addParameter(themeSection.body, { radio: { text: 'Dark theme' }, name: 'theme', on: 'dark' }, 'radio', 'dark-theme', selectTheme, config.theme);
		addParameter(themeSection.body, { radio: { text: 'Light theme' }, name: 'theme', on: 'light' }, 'radio', 'light-theme', selectTheme, config.theme);

		// about
		let aboutSection = addSection('About', 'about', settingsBody);
		let header = addElement('div', { style: 'display: flex; flex-direction: row; align-items: center' }, '', aboutSection.body);
		addElement('p', { class: 'settings-sub-body-header' }, 'What is PassVault?', header);
		addElement('img', { class: 'settings-sub-body-header', style: 'margin-left: 4px; height: 26px', src: icons.PassVault.icon }, 'What is PassVault?', header);
		addElement('p', { class: 'settings-sub-body', innerHTML: true }, `PassVault is an <a href="" onclick="openExternal('github')">open-source program</a> 
		developed by Hamza Alsarakbi that stores your encrypted passwords locally and not on the cloud, prioritizing your privacy.`, aboutSection.body);
		addElement('p', { class: 'settings-sub-body-header' }, 'Support me \u{2665}', aboutSection.body);
		addElement('p', { class: 'settings-sub-body', innerHTML: true }, `If you enjoy this app, consider following me on Instagram 
		<a href="" onclick="openExternal('instagram')">@hamza.alsarakbi</a>.
		 If you encounter a bug with this app. 
		 If you want to <a href="" onclick="openExternal('donate')">donate</a>, 
		 you can. It helps maintain this app, and build future projects.
		 <br>
		 <br>
		 Copyright (C) 2020-present Hamza Alsarakbi, licensed under GNU GPL v3
		 <br>
		 Version: ` + version, aboutSection.body);

		// developer settings
		let dangerSection = addSection('Danger Zone', 'danger-zone', settingsBody);
		addParameter(dangerSection.body, { text: 'Enable Developer Tools (Not recommended. Restart for setting to take action)', on: true, important: true }, 'switch', 'enable-devtools', 'toggleDevTools()', config.devTools);



	} else {
		elements.panel.controls.icon.setAttribute('src', '');
		elements.panel.controls.text.textContent = '';
		menu.innerHTML = '';
	}
	components.settings = !components.settings;
}

function toggleAnimations() {
	config.enableAnimations = !config.enableAnimations;

	if (!config.enableAnimations) {
		addElement('link', { class: 'disable-animations', type: 'text/css', rel: 'stylesheet', href: '../assets/components/disableAnimations.css' }, undefined, document.head);
	} else {
		document.head.removeChild($('.disable-animations'));
	}
	save('config');
}

function inactivityTimeout(e) {
	let id = e.target.id;
	updateSpan(id.replace('slider-', ''), e.target.value);
	config.timeout = Number(e.target.value);
	save('config');
}

function selectTheme(e) {
	let theme = e.target.id.replace('-theme-radio', '').replace('-input', '');
	$('head').removeChild($('.link-theme'));

	config.theme = theme;
	save('config');
	loadTheme();
}
function openChangePasswordDialog() {
	let popup = addPopup('change-master-password', 'Change Master Password', '').body;

	// change password section
	let form = new Form({ class: 'password-change', id: 'password-change' }, popup).form;

	let passwords = {
		oldPassword: new RichInput({ class: 'change-password-input', id: 'old-password', hidden: true }, 'Old password', form).input,
		newPassword: new RichInput({ class: 'change-password-input', id: 'new-password', hidden: true }, 'New password', form).input,
		confirmPassword: new RichInput({ class: 'change-password-input', id: 'confirm-password', hidden: true }, 'Confirm new password', form).input
	}
	addElement('span', { class: 'noerror', id: 'password-error' }, 'ERROR', form);
	addElement('button', { class: 'change-password-button', onclick: 'passChangeRequest()', type: 'button' }, 'Change Master Password', form);
	for (let p in passwords) {
		passwords[p].addEventListener('keydown', (e) => { if (e.keyCode == 13) passChangeRequest(); });
	}
	passwords.oldPassword.select();
}






// Change password function
function passChangeRequest() {
	let inputs = {
		old: $('#old-password-rich-input'),
		new: $('#new-password-rich-input'),
		newConfirm: $('#confirm-password-rich-input')
	}
	let p = $('#password-error');
	p.classList.remove('confirm');
	// validate password
	// check if old password is correct
	let trimmed = {}
	for (let input in inputs) {
		let trimmedPassword = inputs[input].value.trim();
		trimmed[input] = trimmedPassword;
		if (trimmedPassword == '') {
			error(true, 'Input fields must not be empty.');
			inputs[input].select();
			return;
		}
	}
	if (trimmed.old == config.masterPassword) {
		if (trimmed.old != trimmed.new) {
			if (trimmed.new == trimmed.newConfirm) {
				let strength = getStrengthOf(trimmed.new).strength;
				// if password is below "Very Strong" level
				if (strength < 4) {
					error(true, "Your password is too weak. You need upper and lower case letters, numbers and symbols for a strong password.");
					inputs.new.value = '';
					inputs.new.select();
					inputs.newConfirm.value = '';
				} else {
					// save changes and show confirmation
					config.masterPassword = trimmed.new;
					save('config');
					p.classList.add('confirm-password-change');
					p.textContent = "Password Changed!";


					// clear inputs and deselect them
					for (input in inputs) {
						inputs[input].value = "";
						inputs[input].blur();
					}
					setTimeout(() => {
						removePopup('change-master-password');
					}, 1250);
				}

			} else {
				// highglight error, clear new inputs and select new password
				error(true, "New passwords don't match.");
				inputs.new.value = '';
				inputs.new.select();
				inputs.newConfirm.value = '';
			}
		} else {
			error(true, 'Master password matches the new password.');
			inputs.new.value = '';
			inputs.new.select();
			inputs.newConfirm.value = '';
		}
	} else {
		error(true, 'Master password is incorrect.');
		inputs.old.value = '';
		inputs.old.select();
	}
}
function error(action, text) {
	let span = $('#password-error');
	span.classList[action ? 'add' : 'remove']('error');
	span.textContent = text;
}


function openExternal(type) {
	// type can be instagram, github, or donate
	let types = {
		github: 'https://github.com/Electr0d',
		instagram: 'https://www.instagram.com/hamza.alsarakbi/',
		donate: 'https://www.patreon.com/Hamza_Sar'
	}
	shell.openExternal(types[type]);
}

function toggleDevTools() {
	config.devTools = !config.devTools;
	save('config');
}



// Gridlines
function toggleGridlines() {
	let gridlinesTable = $$('#tr');
	// Toggle gridlines
	for (let i = 0; i < gridlinesTable.length; i++) {
		gridlinesTable[i].classList.toggle('table-gridlines');
	}
	// toggle gridlines
	config.gridlinesOn = !config.gridlinesOn;
	save('config');
}