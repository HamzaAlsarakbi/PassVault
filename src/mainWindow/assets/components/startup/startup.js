document.body.style.overflow = 'hidden';
function loaded() {
  console.log('loaded');
  setTimeout(function() {
    // loading overlay draw-out animation
    console.log('%c NOTICE: content loaded.', 'color: lime');
    document.querySelector('.loading-overlay').classList.add('loading-overlay-draw-out');
    // update icon
    document.querySelector('#loading-backdrop').src = path.join(__dirname, '../assets/img/icon-backdrop-green.png');
    
    
    // container animation
    app.classList.remove('container-draw-in');
    parse();
    setTimeout(function() {
      document.body.removeChild(document.querySelector('.loading-overlay'));
      document.body.style.overflow = '';
  }, 1000);
  }, 1000);
}

document.addEventListener('DOMContentLoaded', loaded, false);