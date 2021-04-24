let searchInput;
function toggleSearch() {
	// close other panels
  if (components.add) toggleAdd();
	if (components.settings) toggleSettings();
	document.querySelector('.control#search img').classList.toggle('toggleSearch');

	if(!components.search) {
    let popup = addElement('div', { class: 'search-window' }, '', app);
    let form = new Form({ class: 'search-form' }, popup).form;
    searchInput = new RichInput({ class: 'controls', id: 'search-input', ignoreInvalid: true }, 'Search for keyword', form).input
    searchInput.select();
		searchInput.addEventListener('keydown', e => {
			if(e.code == 'Escape') toggleSearch();
		});
    searchInput.addEventListener('input', search)
  } else {
    let popup = $('.search-window')[0];
    popup.classList.add('search-window-draw-out');
    searchInput.blur();

    // clear input then clear results
    searchInput.value = '';
    search();

    // delete element
    setTimeout(() => {
      app.removeChild(popup);
    }, 200);

    
  }
  components.search = !components.search;
}


function search() {
	// get input value
	text = searchInput ? searchInput.value.toLowerCase() : '';
	for (i = 0; i < data.cellIndex; i++) {
		try {
			document.querySelector('.row-' + i).classList.add('no-match');
			for (c = 0; c < id.length; c++) {
				// check if searchby is active
				if (searchBy[id[c]]) {
					let cellData = data['cell-' + i][id[c]].toLowerCase();
					if (cellData.includes(text)) {
						document.querySelector('.row-' + i).classList.remove('no-match');
						break;
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	}
}