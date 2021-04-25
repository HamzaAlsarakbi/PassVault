// edit row function
function editRow(properties, action) {
	let c = properties.classList[0];
	let index = c.replace('cell-', '');

	// row transition
	document.querySelector(`.row-${data[c].index}`).classList.add('tr-edit');

	// remove onclick from cell and readonly from input.
	// Yes, I could use a for loop, but it's ironically less efficient because I only reference these DOMS once
	document.querySelector(`.${c}.table-cell.type`).removeAttribute('onclick');
	document.querySelector(`.${c}.table-cell.service`).removeAttribute('onclick');
	document.querySelector(`.${c}.table-cell.email`).removeAttribute('onclick');
	document.querySelector(`.${c}.table-cell.password`).removeAttribute('onclick');

	document.querySelector(`.${c}.cell-content.type`).removeAttribute('readonly');
	document.querySelector(`.${c}.cell-content.service`).removeAttribute('readonly');
	document.querySelector(`.${c}.cell-content.email`).removeAttribute('readonly');
	document.querySelector(`.${c}.cell-content.password`).removeAttribute('readonly');
	
	// change controls
	let editButton = document.querySelector(`#cell-edit-${index}`);
	editButton.setAttribute('onclick', 'confirmEdits(this)');
	editButton.setAttribute('onmouseover', 'addTooltip(this, "Confirm", true)');
	document.querySelector(`#cell-edit-icon-${index}`).setAttribute('src', icons.confirm);
	
	let deleteButton = document.querySelector(`#cell-delete-${index}`);
	deleteButton.setAttribute('onclick', 'cancelEdits(this)');
	deleteButton.setAttribute('onmouseover', 'addTooltip(this, "Cancel", true)');
	document.querySelector(`#cell-delete-icon-${index}`).setAttribute('src', icons.remove);
}


// confirm edits
function confirmEdits(e) {
	let c = e.classList[0];
	let index = c.replace('cell-', '');
	let inputs = {
		type: document.querySelector(`.${c}.cell-content.type`),
		service: document.querySelector(`.${c}.cell-content.service`),
		email: document.querySelector(`.${c}.cell-content.email`),
		password: document.querySelector(`.${c}.cell-content.password`)
	}
	// make sure elements are not empty
	let empty = false
	for(let input in inputs) {
		if(inputs[input].value == '') {
			empty = true;
			inptus[input].select();
			break;
		}
	}

	if(!empty) {
		removeEditMode(index, c);
		
		// when confirm button is clicked
		for(let input in inputs) {
			data[c][input] = inputs[input].value;
			inputs[input].setAttribute('readonly', '');
		}

		iconChecker(document.querySelector(`.${c}.table-cell.service`), inputs.service.value);
	}
	search();
}


function cancelEdits(e) {
	let c = e.classList[0];
	let index = c.replace('cell-', '');
	let inputs = {
		type: document.querySelector(`.${c}.cell-content.type`),
		service: document.querySelector(`.${c}.cell-content.service`),
		email: document.querySelector(`.${c}.cell-content.email`),
		password: document.querySelector(`.${c}.cell-content.password`)
	}
	
	// when cancel button is pressed
	for(let input in inputs) {
		inputs[input].value = data[c][input];
		inputs[input].setAttribute('readonly', '');
	}
	
	removeEditMode(index, c);

	iconChecker(document.querySelector(`.${c}.table-cell.service`), inputs.service.value);
	// check strength
	updateStrength({ target: inputs.password });
}



function removeEditMode(index, c) {
	// transitions
	document.querySelector(`.row-${index}`).classList.remove('tr-edit');
		
	// reset control buttons
	document.querySelector(`.cell-edit.${c}`).setAttribute('onclick', 'editRow(this)');
	document.querySelector(`.cell-edit.${c}`).setAttribute('onmouseover', 'addTooltip(this, "Edit", true)');
	document.querySelector(`.cell-delete.${c}`).setAttribute('onclick', 'deleteRow(this)');
	document.querySelector(`.cell-delete.${c}`).setAttribute('onmouseover', 'addTooltip(this, "Delete", true)');

	// reset icons
	document.querySelector(`.cell-edit-icon.${c}`).setAttribute('src', icons.pencil);
	document.querySelector(`.cell-delete-icon.${c}`).setAttribute('src', icons.trashcan);

	document.querySelector(`.${c}.table-cell.type`).setAttribute('onclick', 'copy(this)');
	document.querySelector(`.${c}.table-cell.service`).setAttribute('onclick', 'copy(this)');
	document.querySelector(`.${c}.table-cell.email`).setAttribute('onclick', 'copy(this)');
	document.querySelector(`.${c}.table-cell.password`).setAttribute('onclick', 'copy(this)');
}
