function toast(message) {
	if (message != '' && !(message === undefined)) {
		let span = document.createElement('div');
		span.setAttribute('class', 'toast');
		span.textContent = message;
		document.body.appendChild(span);
		setTimeout(function() {
			span.remove();
		}, 1500);
	}
}