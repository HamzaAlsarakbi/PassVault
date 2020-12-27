const { shell } = electron;
function toggleSettings() {
	document.querySelector('controls').classList.toggle('enabled');
  document.querySelector('#thead').classList.toggle('margin-settings');
	panel.classList.toggle('toggleSettings');

	// menu transitions
	menu.classList.toggle('menu-down');

	// rotate icon
	document.querySelector('#settings img').classList.toggle('rotate');

	// if one of the windows is open
	if (components.search) toggleSearch();
	if (components.filters) toggleFilters();
	if(components.add) toggleAdd();

	if (!components.settings) {
		// update icons
		elements.panel.controls.icon.setAttribute('src', icons.gear);
		elements.panel.controls.icon.setAttribute('height', '30px');
		elements.panel.controls.text.textContent = 'Settings';
		
	
		// create settingsBody
		let settingsBody = addElement('div', {class: 'settings-body'}, undefined, menu);


		// general section
		let generalSection = addSection('General', 'general', settingsBody);
		addParameter(generalSection.body, { text: 'Show gridlines', on: true }, 'switch', 'general-gridlines', 'toggleGridlines()', config.gridlinesOn);
		addParameter(generalSection.body, { text: 'Animations', on: true }, 'switch', 'enable-animations', 'toggleAnimations()', config.enableAnimations);
		addParameter(generalSection.body, { text: 'Inactivity Timeout', slider: { min: 1, max: 10, value: config.timeout } }, 'slider', 'inactivity-timeout', inactivityTimeout, config.timeout);
		addParameter(generalSection.body, { text: 'Open icons folder', button: { text: 'Open folder' } }, 'button', 'open-icons-folder', 'shell.openExternal(path.join(parentDir, "/Data/icons"))');

		// themes section
		let themeSection = addSection('Themes', 'themes', settingsBody);
		addParameter(themeSection.body, { radio:{ text: 'Dark theme' }, name: 'theme', on: 'dark'}, 'radio', 'dark-theme', selectTheme,  config.theme);
		addParameter(themeSection.body, { radio:{ text: 'Light theme' }, name: 'theme', on: 'light'}, 'radio', 'light-theme', selectTheme,  config.theme);

		// change password section
		let passwordSection = addSection('Change Password', 'password-change', settingsBody);

		let passwords = {
			oldPassword: addParameter(passwordSection.body, { input: { placeholder: 'Old password', type: 'password' }}, 'input', 'old-password'),
			newPassword: addParameter(passwordSection.body, { input: { placeholder: 'New password', type: 'password' }}, 'input', 'new-password'),
			confirmPassword: addParameter(passwordSection.body, { input: { placeholder: 'Confirm new password', type: 'password' }}, 'input', 'confirm-password')
		}
		addElement('span', { class: 'noerror', id: 'password-error' }, 'ERROR', passwordSection.body);
		addElement('button', { class: 'change-password-confirm', onclick: 'passChangeRequest()' }, 'Change Password', passwordSection.body);
		for(let p in passwords) {
			passwords[p].addEventListener('keydown', (e) => { if(e.which == 13) passChangeRequest(); });
		}

		// about
		let aboutSection = addSection('About', 'about', settingsBody);
		let header = addElement('div', { style: 'display: flex; flex-direction: row; align-items: center' }, '', aboutSection.body);
		addElement('p', { class: 'settings-sub-body-header' }, 'What is PassVault?', header);
		addElement('img', { class: 'settings-sub-body-header', style: 'margin-left: 4px; height: 26px', src: icons.PassVault.icon}, 'What is PassVault?', header);
		addElement('p', { class: 'settings-sub-body', innerHTML: true }, `PassVault is an <a href="" onclick="openExternal('github')">open-source tool</a> 
		developed by Hamza Alsarakbi that stores your encrypted passwords locally and not on the cloud to provide you 
		with the highest privacy.`, aboutSection.body);
		addElement('p', { class: 'settings-sub-body-header' }, 'Support me \u{2665}', aboutSection.body);
		addElement('p', { class: 'settings-sub-body', innerHTML: true }, `If you enjoy this app, consider following me on Instagram 
		<a href="" onclick="openExternal('instagram')">@hamza__sar</a>.
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
		addParameter(dangerSection.body, { text: 'Enable Developer Tools (not recommended. Restart for setting to take action)', on: true, important: true }, 'switch', 'enable-devtools', 'toggleDevTools()',  config.devTools);



	} else {
		elements.panel.controls.icon.setAttribute('src', '');
		elements.panel.controls.text.textContent = '';
		menu.innerHTML = '';
	}
  components.settings = !components.settings;
}

function toggleAnimations() {
	config.enableAnimations = !config.enableAnimations;
	
	if(!config.enableAnimations) {
		addElement('link', {class: 'disable-animations', type: 'text/css', rel: 'stylesheet', href: '../global assets/css/disableAnimations.css'}, undefined, document.head);
	} else {
		document.head.removeChild(document.querySelector('.disable-animations'));
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
	document.querySelector('head').removeChild(document.querySelector('.link-theme'));

	config.theme = theme;
	initTheme();
	save('config');
}

// Change password function
function passChangeRequest() {
	let oldPass = document.querySelector('#old-password-input-parameter');
	let newPass = document.querySelector('#new-password-input-parameter');
	let newConfirmPass = document.querySelector('#confirm-password-input-parameter');
	let p = document.querySelector('#password-error');
	p.classList.remove('confirm');
	// validate password
	// check if old password is correct
	if (oldPass.value == '' || newPass.value == '' || newConfirmPass.value == '') {
		// display error
		error(true);
		p.innerHTML = 'One or more of the fields is empty.';
		if (oldPass.value == '') {
			oldPass.select();
		} else if (newPass.value == '') {
			newPass.select();
		} else {
			newConfirmPass.select();
		}
	} else if (oldPass.value == config.masterPassword) {
		if (newPass.value == newConfirmPass.value) {
			if (newPass.value !== oldPass.value) {

				p.classList.add('confirm');
				p.innerHTML = 'Password Changed!';
				config.masterPassword = newPass.value;
				oldPass.value = '';
				newPass.value = '';
				newConfirmPass.value = '';
				oldPass.select();
				error(false);
				save('config');
				setTimeout(function() {
					p.classList.remove('confirm');
				}, 1000);
			} else {
				console.log('Notice: Old and new passwords match!');
				// display error
				error(true);
				p.innerHTML = 'Old and new passwords match.';
			}
		} else {
			console.log("Notice: New and new-confirm passwords DON'T match!");
			// display error
			error(true);
			p.innerHTML = 'New passwords do not match.';
		}
	} else {
		console.log('Notice: Old password is NOT correct!');
		// display error
		error(true);
		p.innerHTML = 'Old password is not correct.';
	}
}
function error(action) {
	console.log('error provoked');
	if (action) {
		document.querySelector('#password-error').classList.add('error');
	} else {
		document.querySelector('#password-error').classList.remove('error');
	}
}


function openExternal(type) {
	if (type == 'github') {
		shell.openExternal('https://github.com/Electr0d');
	} else if (type == 'instagram') {
		shell.openExternal('https://www.instagram.com/hamza__sar/');
	} else if (type == 'twitter') {
		shell.openExternal('https://twitter.com/Electr0d');
	} else if (type == 'donate') {
		shell.openExternal('https://www.patreon.com/Hamza_Sar');
	}
}

function toggleDevTools() {
	config.devTools = !config.devTools;
	save('config');
}