function toast(message) {
	if (message != '' && !(message === undefined)) {
		let span = addElement('div', { class: 'toast' }, message, document.body);
		setTimeout(function() {
			span.remove();
		}, 1500);
	}
}