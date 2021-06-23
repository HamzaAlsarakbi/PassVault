function addSection(text, id, parent) {
  let section = addElement('div', { class: 'section', id: id + '-section' }, undefined, parent);
  let sectionHeader = addElement('div', { class: 'section-header', id: id + '-section-header' }, text, section);

  let sectionBody = addElement('div', { class: 'section-body', id: id + '-section-body' }, undefined, section);


    
  return { head: sectionHeader, body: sectionBody, section: section }; 
}