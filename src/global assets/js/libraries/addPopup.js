function addPopup(id, title, icon) {
  // create overlay
  let overlay = addElement('overlay', {id: id + '-overlay' }, '', document.body);

  // create window
  let window = addElement('div', { class: 'popup window', id: id + '-window' }, '', overlay);

  console.log(window);
  // create titlebar
  let titlebar = addElement('div', { class: 'title-bar', id: id + '-title-bar' }, '', window);

  // create info section
  let info = addElement('div', { class: 'title-bar-item title-bar-info' }, '', titlebar);

  // create icon and text
  let img = addElement('img', { clas: 'window-icon icon', id: id + '-window-icon', src: icon.src }, '', info);
  if(icon.rotate) img.classList.add('rotate');
  addElement('div', { class: 'window-title', id: id + '-window-title' }, title, info);

  // create controls
  let controls = addElement('div', { class: 'window-controls controls', id: id + '-window-controls', onclick: `destroyPopup('${id}')` }, '', titlebar);
  addElement('img', { class: 'window-controls-item window-close', id: id + '-window-close', src: '../../src/global assets/img/window_icons/close.png' }, '', controls);

  // create window body
  let body = addElement('div', { class: 'window-body', id: id + '-window-body' }, '', window);
  return {overlay: overlay, body: body}
}
function destroyPopup(id) {
  document.querySelector('#' + id + '-window').classList.add('popup-draw-out');
  document.querySelector('#' + id + '-overlay').classList.add('popup-draw-out');
  setTimeout(() => {
    document.body.removeChild(document.querySelector('#' + id + '-overlay'));
  }, 200);
}