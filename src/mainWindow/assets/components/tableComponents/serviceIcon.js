function fetchInternalIcons() {
	let defaultList = [];
	// pull default icons
	try {
		fs.readdirSync(path.join(__dirname, '../assets/img/icons')).forEach((file) => {
			defaultList.push(file);
		});
	} catch (err) {
		console.error(err);
	}
	serviceIcons.internalIcons = defaultList;
}

function fetchExternalIcons() {
	// pull external icons
	let list = [];
	try {
		fs.readdirSync(path.join(parentDir, '/Data/icons')).forEach((file) => {
			list.push(file);
		});
	} catch (err) {
		console.log('Icons folder does not exist. Creating directory.');
		fs.mkdirSync(path.join(parentDir, '/Data/icons'));
	}
	serviceIcons.externalIcons = list;
}
let serviceIcons = {
	internalIcons: [],
	externalIcons: []
}

// fetch icons
function fetchAllIcons() {
	fetchInternalIcons();
	fetchExternalIcons();
}
fetchAllIcons();


function iconChecker(parent, text) {
	let cellClass = parent.classList[0];
	try {
		parent.removeChild($(`.${cellClass}#service-icon`));
	} catch (err) { }
	text = text.toLowerCase();
	let defaultList = serviceIcons.internalIcons;
	let list = serviceIcons.externalIcons;

	// if there are custom icons
	if (list.length > 0) {
		for (let i = 0; i < list.length; i++) {
			if (text.includes(list[i].substring(0, list[i].length - 4))) {
				console.log('Using custom icon');
				addElement('img', { class: cellClass, id: 'service-icon', src: path.join(parentDir, `/Data/icons/${list[i]}`) }, '', parent);
			} else {
				defaultAdd();
			}
		}
	} else {
		defaultAdd();
		return;
	}

	function defaultAdd() {
		for (let i = 0; i < defaultList.length; i++) {
			if (text.includes(defaultList[i].substring(0, defaultList[i].length - 4))) {
				addElement('img', { class: cellClass, id: 'service-icon', src: path.join(__dirname, `../assets/img/icons/${defaultList[i]}`) }, '', parent);
			}
		}
	}
}
