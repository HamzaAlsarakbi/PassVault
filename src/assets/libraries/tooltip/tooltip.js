let tooltip;
function addTooltip(e, text, control) {
	// add tooltip
	if(!components.tooltip) tooltip = addElement('div', { class: 'tooltip', id: e.id + '-tooltip' }, text, e);
	if(control) tooltip.classList.add('control-tooltip');
	
	e.onmouseleave = () => removeTooltip(e, tooltip);
	components.tooltip = true;
}


function removeTooltip(p, e) {
	p.removeChild(e);
	components.tooltip = false;
}