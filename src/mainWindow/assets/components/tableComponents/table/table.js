function addRow(tableData, index) {
	let row = addElement('div', { class: `row-${index}`, id: 'tr' }, '', elements.table);
	// append data values
	for (let dataType in tableData) {
		let cell = addElement('div', { class: `cell-${index} table-cell ${dataType}`, id: `${dataType}-${index}`, onclick: 'copy(this)' }, '', row);
		let content = addElement('div', { class: `cell-${index} cell-content ${dataType}`, id: `${dataType}-content` }, '', cell);
		let input = addElement('input', { class: `cell-${index} cell-input ${dataType}`, id: `${dataType}-input`, readonly: '' }, tableData[dataType], content);

		// set the content text to bullets if data type is password and is set to hidden
		if (dataType == 'password') {
			input.type = 'password';
			// get strength and append to html
			let strength = getStrengthOf(tableData[dataType]);
			strength.container = addElement('div', { class: `cell-${index} strength-container`, id: 'strength-div' }, '', cell);
			// strength text and bar
			addElement('p', { class: `cell-${index} strength-text`, id: 'strength-text' }, strength.tier, strength.container);
			let strengthBar = addElement('div', { class: `cell-${index} strength-bar`, id: 'strength-bar' }, '', strength.container);
			strengthBar.style.background = strength.bar.background;
			strengthBar.style.width = strength.bar.width;

			// add event listener
			input.addEventListener('input', updateStrength);
		}
		input.addEventListener('input', updateSize);
		updateSize({ target: input });

		// add icon if its a service icon
		if (dataType == 'service') {
			fetchExternalIcons();
			iconChecker(content, tableData[dataType]);
		}
	}
	let controlsCell = addElement('div', { class: `cell-${index} controls`, id: `controls-${index}` }, '', row);

	let controls = {
		edit: {
			onclick: 'editRow(this, "show")',
			icon: icons.pencil,
			tooltip: 'Edit'
		},
		hideShow: {
			onclick: 'togglePasswordVisibility(this)',
			icon: icons.eye.eye,
			tooltip: 'Hide/Show'
		},
		delete: {
			onclick: 'deleteRow(this)',
			icon: icons.trashcan,
			tooltip: 'Delete'
		}
	}
	for (let control in controls) {
		// add control
		let container = addElement('div', { class: `cell-${index} cell-control cell-${control}`, id: `cell-${control}-${index}`, onmouseover: `addTooltip(this, "${controls[control].tooltip}", true)`, onclick: controls[control].onclick }, '', controlsCell);

		// add control icon
		addElement('img', { class: `cell-${index} cell-control-icon cell-${control}-icon`, id: `cell-${control}-icon-${index}`, src: controls[control].icon }, '', container);
	}
	return row;
}

function copy(e) {
	let c = e.classList[0];
	let d = e.id.replace(`-${data[c].index}`, '');
	let copylet = data[c][d];

	e.classList.add('cell-click');
	setTimeout(() => { e.classList.remove('cell-click'); }, 200);
	let input = addElement('input', { class: 'hidden', style: 'position: absolute; left: -50000px' }, copylet, document.body);
	input.select();
	try {
		document.execCommand('copy');
		toast('Copied to clipboard!');
		document.body.removeChild(input);
	} catch (err) {
		toast(`Copying ${c}${d} was unsuccessful!`);
	}
}

// delete row function
function deleteRow(e) {
	let d = e.id;
	let c = e.classList[0];
	let index = data[c].index;
	let row = `row-${index}`;
	row = $(`.row-${index}`);
	row.classList.toggle('draw-out-animation');
	setTimeout(() => {
		let removedIndex = Number(c.replace('cell-', ''));
		row.remove();
		delete data[c];
		for (let i = removedIndex + 1; i < data.cellIndex; i++) {
			let row = data['cell-' + i];
			data['cell-' + (i - 1)] = {
				class: 'cell-' + (i - 1),
				type: row.type,
				service: row.service,
				email: row.email,
				password: row.password,
				onCopy: row.onCopy,
				index: i - 1,
				hidden: row.hidden
			};

			// update class name of cells
			let rowCells = $All('.cell-' + i);
			let rowLength = rowCells.length;
			for (let x = 0; x < rowLength; x++) {
				let element = rowCells[x];
				// change first class while keeping other classes
				element.setAttribute('class', element.classList['value'].replace(element.classList[0], `cell-${(i - 1)}`));
			}

			// update class name of rows
			$(`.row-${i}`).setAttribute('class', `row-${(i - 1)}`);
		}
		data.cellIndex--;
		delete data[`cell-${data.cellIndex}`];
	}, 250);
	// draw-out animations
}

function togglePasswordVisibility(e) {
	let c = e.classList[0];
	let password = $(`.${c}.cell-input.password`);
	let icon = $(`.${c}.cell-hideShow-icon`);

	// toggle password visibility
	if (password.type == 'password') {
		password.type = 'text';
		icon.setAttribute('src', icons.eye.crossed);
	} else {
		password.type = 'password';
		icon.setAttribute('src', icons.eye.eye);
	}
}
function updateSize(e) {
	e.target.setAttribute('size', clamp(e.target.value.length, 1, 100));
}