function startTimeout(length, action) {
	return setTimeout(() => {
		window[action]();
	}, length);
}

document.onclick = resetTimer;
document.onmousemove = resetTimer;
document.addEventListener('scroll', resetTimer, true);

let inactivity = startTimeout(config.timeout * 60 * 1000, 'timeoutAction');
let autoClose;
function resetTimer() {
	clearTimeout(inactivity);
	clearTimeout(autoClose);
	if (document.querySelector('.overlay') == null) timeoutDialog = null;
	inactivity = startTimeout(config.timeout * 60 * 1000, 'timeoutAction');
}
let timeoutDialog = null;
function timeoutAction() {
	if (saved) {
		timeoutDialog = showDialog(
			'Timeout Warning',
			'You have been inactive for ' + config.timeout + ' minute(s). Discarding changes in 1 minute',
			[ 'Save', "Don't save", 'Cancel' ],
			[ "save('close')", 'win.close()', 'closeDialog()' ]
		);
	} else {
		timeoutDialog = showDialog(
			'Timeout Warning',
			'You have been inactive for ' + config.timeout + ' minute(s). Locking vault in 1 minute',
			[ 'Close', 'Cancel' ],
			[ 'win.close()', 'closeDialog()' ]
		);
	}
	autoClose = startTimeout(60 * 1000, 'quit');
	console.log('started autoclose timeout');
}
