const strengthTier = ['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'];
function getStrengthOf(text) {
	// strength starts at 0 and goes up to 4.
	if (components.strengthMeterOn) {
		let strength = 0;

		// check for special characters
		let characters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', ',', '.', '/', '?', ';', ':', "'", '"', '`', '~', '[', ']', '{', '}'];
		let includes1Character = false;
		for (let i = 0; i < characters.length; i++) {
			if (!includes1Character && text.includes(characters[i])) {
				strength++;
				includes1Character = true;
			}
		}
		// check for numbers
		if (/\d/.test(text)) strength++;

		// check for uppercase and lowercase characters
		if (text.toLowerCase() != text && text.toUpperCase() != text) strength++;

		// check for character number
		if (text.length >= 8) strength++;

		// css calculations
		let background = 'var(--strength-' + strength + ')';
		let width = (strength + 1) / strengthTier.length * 100 + '%';

		// print summary
		return { strength: strength, tier: strengthTier[strength], bar: { background: background, width: width } };
	}
}


function updateStrength(e) {
	let strength = getStrengthOf(e.target.value);
	let c = e.target.classList[0];
	$(`#strength-text.${c}`).textContent = strength.tier;
	$(`#strength-bar.${c}`).style.background = strength.bar.background;
	$(`#strength-bar.${c}`).style.width = strength.bar.width;
}