// filters
function toggleFilters() {
  let dropdown = document.querySelector('dropDown');
  dropdown.classList.toggle('enabled');
	if (components.add) toggleAdd();
	if (components.settings) toggleSettings();
	if (!components.filters) {
    // make drop-down and header
    addElement('div', { class: 'filters-header' }, 'Search By:', dropdown);
    let container = addElement('div', { class: 'drop-down' }, '', dropdown);

		// create parameters
		for (i = 0; i < id.length; i++) {
      // create parameter
      let label = addElement('label', { class: 'label' }, id[i], container);

      // create checkbox
			let input = document.createElement('input');
			input.setAttribute('type', 'checkbox');
			input.setAttribute('id', id[i]);
			input.setAttribute('onclick', 'setFilter(this)');

			// if search by is turned off for this specific parameter, then don't 'check' it.
			if (searchBy[id[i]]) input.setAttribute('checked', 'checked');
			label.appendChild(input);

      // create checkmark
      addElement('span', { class: 'checkmark' }, '', label);
		}
	} else {
    setTimeout(() => { dropdown.innerHTML = '';}, 200);
	}
  components.filters = !components.filters;
}
function setFilter(e) {
	let id = e.id;
	if (searchBy[id]) {
		searchBy[id] = false;
	} else {
		searchBy[id] = true;
	}
	search();
}