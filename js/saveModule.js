const fs = require('fs');

// save function
save();
function save() {
	const body = document.querySelector('body');
	if (!saved) {
		var saveButton = document.createElement('button');
		saveButton.setAttribute('class', 'save');
		saveButton.setAttribute('onclick', 'save()');
		saveButton.textContent = 'Save';
		body.appendChild(saveButton);
		console.log('displaying save button.');
		saved = true;
	} else {
		fs.appendFile('data/data.json', data, function(err) {
			if (err) throw err;
			console.log('Saved!');
		});
		console.log(data);
		saved = false;
		var saveButtonDOM = document.querySelector('.save');
		saveButtonDOM.classList.toggle('button-slide-out');
		setTimeout(function() {
			saveButtonDOM.remove();
		}, 300);
	}
}
