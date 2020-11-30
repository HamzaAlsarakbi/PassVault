const remote = require('electron').remote;
let windowTitle = document.title;
// When document has loaded, initialise
document.onreadystatechange = () => {
	if (document.readyState == 'complete') {
		handleWindowControls();
	}
};
function updateTitle(text) {
	let suffix = '';
	if(isDev) suffix = ' - Dev Build';
	document.title = text + suffix;
	document.querySelector('.window-title').textContent = text + suffix;
}
updateTitle(windowTitle);


function handleWindowControls() {
	let win = remote.getCurrentWindow();
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById('min-button').addEventListener('click', (event) => {
		win.minimize();
	});

	document.getElementById('max-button').addEventListener('click', (event) => {
		win.maximize();
	});

	document.getElementById('restore-button').addEventListener('click', (event) => {
		win.unmaximize();
	});

	document.getElementById('close-button').addEventListener('click', (event) => {
		if (saved) {
			showDialog(
				'Confirmation',
				'Do you want to save changes?',
				[ 'Save', "Don't save", 'Cancel' ],
				[ "save('close')", 'win.close()', 'closeDialog()' ]
			);
		} else {
			win.close();
		}
	});

	// Toggle maximise/restore buttons when maximisation/unmaximisation occurs
	toggleMaxRestoreButtons();
	win.on('maximize', toggleMaxRestoreButtons);
	win.on('unmaximize', toggleMaxRestoreButtons);

	function toggleMaxRestoreButtons() {
		if (win.isMaximized()) {
			document.body.classList.add('maximized');
		} else {
			document.body.classList.remove('maximized');
		}
	}
}


function lockVault() {
	if (saved) {
		showDialog(
			'Confirmation',
			'Save changes?',
			[ 'Save', "Don't save", 'Cancel' ],
			[ "save('all'); quit()", 'quit()', 'closeDialog()' ]
		);
	} else {
		showDialog(
			'Confirmation',
			'Lock the vault?',
			[ 'Lock', 'Cancel' ],
			[ "quit()", 'closeDialog()' ]
		);
	}
}

// Lock Vault function
function quit() {
	ipcRenderer.send('logoutConfirmation');
	win.close();
	win.on('closed', () => {
		win = null;
	});
}