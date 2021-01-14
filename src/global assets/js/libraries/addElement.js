function addElement(element, attributes, text, parent) {
  let e = document.createElement(element);
  for (let attribute in attributes) {
    if(attributes[attribute] != undefined) e.setAttribute(attribute, attributes[attribute]);
  }

  let value = element == 'input' ? 'value': attributes.innerHTML ? 'innerHTML' : 'textContent';
  e[value] = text;
  parent.appendChild(e);
  return e;
}