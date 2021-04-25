function loadTheme() {
	addElement('link', { rel: 'stylesheet', class: 'link-theme', href: `../assets/components/themeLoader/themes/${config.theme}-theme.css` }, '', document.head);
	console.log('%c NOTICE: Theme loaded!', 'color: rgb(50, 200, 50);');
}
loadTheme();