function loadTheme() {
	addElement('link', { rel: 'stylesheet', class: 'link-theme', href: `../assets/components/themeLoader/themes/${config.theme}-theme.css` }, '', document.head);
	console.log('%cNOTICE: Theme loaded!', 'color: lime');
}
loadTheme();