let windowTitle = document.title;
// When document has loaded, initialise
document.onreadystatechange = () => {
	if (document.readyState == 'complete') {
		handleWindowControls();
	}
};
function updateTitle(text) {
	const IS_DEV = window.api.dev;
	let suffix = '';
	if (IS_DEV) suffix = ' - Dev Build';
	document.title = text + suffix;
	document.querySelector('.window-title').textContent = text + suffix;
}
updateTitle(windowTitle);


function handleWindowControls() {
	const WINDOW = window.api.window;
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById('min-button').addEventListener('click', () => {
		WINDOW.minimize();
	});

	document.getElementById('max-button').addEventListener('click', () => {
		WINDOW.maximize();
	});

	document.getElementById('restore-button').addEventListener('click', () => {
		WINDOW.maximize();
	});

	document.getElementById('close-button').addEventListener('click', (event) => {
		if (saved) {
			let popup = addPopup('confirm-logout', 'Confirmation', '').body;
			let container = addElement('div', { class: 'logout-container' }, '', popup);


			addElement('p', { class: 'dialog-prompt timeout-prompt', id: 'timeout-unsaved' }, `Do you want to save changes?`, container);
			let collection = addElement('collection', { class: 'dialog-collection timeout-collection', id: 'timeout-unsaved' }, '', container);

			let buttons = {
				save: {
					text: 'Save',
					onclick: `save(); removePopup("confirm-logout")`
				},
				dontSave: {
					text: `Don't Save`,
					onclick: 'win.close()'
				},
				cancel: {
					text: `Cancel`,
					onclick: 'removePopup("confirm-logout")'
				}
			}

			for (let button in buttons) {
				addElement('button', { class: `dialog-button timeout-button`, id: `${button}-button`, onclick: buttons[button].onclick }, buttons[button].text, collection);
			}
		} else {
			WINDOW.close();
		}
	});

	// Toggle maximise/restore buttons when maximisation/unmaximisation occurs
	toggleMaxRestoreButtons();
	WINDOW.on('maximize', toggleMaxRestoreButtons);
	WINDOW.on('unmaximize', toggleMaxRestoreButtons);

	function toggleMaxRestoreButtons() {
		if (WINDOW.isMaximized()) {
			document.body.classList.add('maximized');
		} else {
			document.body.classList.remove('maximized');
		}
	}
}


function lockVault() {
	let popup = addPopup('confirm-logout', 'Confirmation', '').body;
	let container = addElement('div', { class: 'logout-container' }, '', popup);
	if (saved) {
		addElement('p', { class: 'dialog-prompt timeout-prompt', id: 'timeout-unsaved' }, `Do you want to save changes?`, container);
		let collection = addElement('collection', { class: 'dialog-collection timeout-collection', id: 'timeout-unsaved' }, '', container);

		let buttons = {
			save: {
				text: 'Save',
				onclick: `save('all')`
			},
			dontSave: {
				text: `Don't Save`,
				onclick: 'quit()'
			},
			cancel: {
				text: `Cancel`,
				onclick: 'removePopup("confirm-logout")'
			}
		}

		for (let button in buttons) {
			addElement('button', { class: `dialog-button timeout-button`, id: `${button}-button`, onclick: buttons[button].onclick }, buttons[button].text, collection);
		}
	} else {
		addElement('p', { class: 'dialog-prompt timeout-prompt', id: 'timeout-unsaved' }, `Do you want to lock vault?`, container);
		let collection = addElement('collection', { class: 'dialog-collection timeout-collection', id: 'timeout-unsaved' }, '', container);

		let buttons = {
			lock: {
				text: 'Lock',
				onclick: 'quit()'
			},
			cancel: {
				text: 'Cancel',
				onclick: 'removePopup("confirm-logout")'
			},
		}


		for (let button in buttons) {
			addElement('button', { class: `dialog-button timeout-button`, id: `${button}-button`, onclick: buttons[button].onclick }, buttons[button].text, collection);
		}
	}
}

// Lock Vault function
function quit() {
	ipcRenderer.send('logout');
	win.close();
}