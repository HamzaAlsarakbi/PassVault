function initTheme() {
	var link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('class', 'link-theme');
	link.setAttribute('href', '../global assets/css/' + config.theme + '-theme.css');
	document.head.appendChild(link);
	console.log('%c NOTICE: Theme loaded!', 'color: rgb(50, 200, 50);');
}
initTheme();
