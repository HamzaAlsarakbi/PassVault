function panelTitle(action) {
  elements.panel.controls.text.classList[action]('menu-down');
  setTimeout(() => {
    elements.panel.controls.icon.classList[action]('menu-down');
  }, 200);
}