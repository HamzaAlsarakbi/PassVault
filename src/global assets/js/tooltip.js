let tooltip;
function addTooltip(e, text) {
	// add tooltip
	if(!components.tooltip) tooltip = addElement('div', { class: 'tooltip', id: e.id + '-tooltip' }, text, e);
	e.onmouseleave = () => removeTooltip(e, tooltip);
	components.tooltip = true;
}


function removeTooltip(p, e) {
	p.removeChild(e);
	components.tooltip = false;
}