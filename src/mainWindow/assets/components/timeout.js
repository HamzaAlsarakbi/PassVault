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
	let popup = addPopup('timeout-warning', 'Timeout Warning', '').body;
	let container = addElement('div', { class: 'timeout-container' }, '', popup);


	if (saved) {
		timeoutDialog = addParameter(container, {
			text: `You have been inactive for ${config.timeout} minute(s). Discarding changes in 1 minute`,
			buttons: {
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
					onclick: 'removePopup("timeout-warning")'
				}
			}
		}, 'buttons', 'timeout-buttons');
	} else {
		timeoutDialog = addParameter(container, {
			text: `You have been inactive for ${config.timeout} minute(s). Discarding changes in 1 minute`,
			buttons: {
				close: {
					text: 'Close',
					onclick: `win.close()`
				},
				cancel: {
					text: `Cancel`,
					onclick: 'removePopup("timeout-warning")'
				}
			}
		}, 'buttons', 'timeout-buttons');
	}
	autoClose = startTimeout(60 * 1000, 'quit');
	console.log('started autoclose timeout');
}
