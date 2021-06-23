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
	container.style = 'padding: 10px';


	if (saved) {
		addElement('p', { class: 'dialog-prompt timeout-prompt', id: 'timeout-unsaved' }, `You have been inactive for ${config.timeout} minute(s). Discarding changes in 1 minute`, container);
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
				onclick: 'removePopup("timeout-warning")'
			}
		}
		for (let button in buttons) {
			addElement('button', { class: `dialog-button timeout-button`, id: `${button}-button`, onclick: buttons[button].onclick }, buttons[button].text, collection);
		}
	} else {
		addElement('p', { class: 'dialog-prompt timeout-prompt', id: 'timeout-unsaved' }, `You have been inactive for ${config.timeout} minute(s). Closing vault in 1 minute`, container);
		let collection = addElement('collection', { class: 'dialog-collection timeout-collection', id: 'timeout-unsaved' }, '', container);

		let buttons = {
			close: {
				text: 'Close',
				onclick: `win.close()`
			},
			cancel: {
				text: `Cancel`,
				onclick: 'removePopup("timeout-warning")'
			}
		}

		for (let button in buttons) {
			addElement('button', { class: `dialog-button timeout-button`, id: `${button}-button`, onclick: buttons[button].onclick }, buttons[button].text, collection);
		}

	}
	autoClose = startTimeout(60 * 1000, 'quit');
	console.log('started autoclose timeout');
}
