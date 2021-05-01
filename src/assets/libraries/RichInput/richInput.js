class RichInput {
  constructor(attributes, placeholder, parent) {


    if(attributes.form) {
      this.container = addElement('form', { onkeypress:'return event.keyCode != 13', novalidate: '', class: 'rich-input-container ' + attributes.class, id: attributes.id + '-rich-input-container' }, '', parent);
    } else {    
      this.container = addElement('div', { class: 'rich-input-container ' + attributes.class, id: attributes.id + '-rich-input-container' }, '', parent);
    }

    
    if(attributes.hidden) {
      this.input = addElement('input', { class: 'rich-input hidden-rich-input', id: attributes.id + '-rich-input', required: '', type: 'password' }, '', this.container);
    } else {
      this.input = addElement('input', { class: 'rich-input', id: attributes.id + '-rich-input', required: '' }, '', this.container);
    }
    
    this.label = addElement('label', { class: 'rich-input-label', id: attributes.id + '-rich-input-label' }, '', this.container);
    this.placeholder = addElement('span', { class: 'rich-input-placeholder', id: attributes.id + '-rich-input-placeholder' }, placeholder, this.label);
    


    // label needs to be added before this because of the CSS selector
    if(attributes.hidden) {
      // create password hide/show switch
      this.hideShow = addElement('div', { class: 'hide-show', id: attributes.id + '-hide-show', onclick: 'hideShowRichInput(this)' }, '', this.container);
      addElement('img', { class: 'eye-icon', id: attributes.id + '-eye-icon', src: icons.eye.eye }, '', this.hideShow);
    }


    // make text red if empty
    if(!attributes.ignoreInvalid) this.input.addEventListener('keydown', checkRichInputValidity);
    if(!attributes.ignoreInvalid) this.input.addEventListener('input', checkRichInputValidity);
  }
}

function hideShowRichInput(e) {
  let input = document.querySelector(`input#${e.id.replace('-hide-show', '')}-rich-input`);
  let icon = document.querySelector(`#${e.id} img`);
  if(input.type == 'password') {
    input.type = 'text';
    icon.src = icons.eye.crossed;
  } else {
    input.type = 'password';
    icon.src = icons.eye.eye;
  }
}

function inputInvalid(input, action) {
  let commonID = input.id.replace('-rich-input', '');
  document.querySelector(`#${commonID}-rich-input-label`).classList[action]('invalid');
  document.querySelector(`#${commonID}-rich-input-placeholder`).classList[action]('invalid');
}

function checkRichInputValidity(e) {
  if(e.target.value == '' && e.key != 'Shift' && e.key != 'CapsLock') {
		inputInvalid(e.target, 'add');
	} else {
		inputInvalid(e.target, 'remove');
	}
}


// forms
class Form {
  constructor(attributes, parent) {
    this.form = addElement('form', { novalidate: '', onkeypress: 'return event.keyCode != 13', class: attributes.class, id: attributes.id }, '', parent);
  }
}