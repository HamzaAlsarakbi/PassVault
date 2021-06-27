document.body.style.overflow = 'hidden';
function loaded() {
  console.log('Document loaded!');
  setTimeout(function () {
    // loading overlay draw-out animation
    console.log('%cNOTICE: content loaded', 'color: lime');
    $('.loading-overlay').classList.add('loading-overlay-draw-out');
    // update icon
    $('#loading-backdrop').src = path.join(__dirname, '../assets/img/icon-backdrop-green.png');


    // container animation
    app.classList.remove('container-draw-in');
    parse();
    setTimeout(function () {
      document.body.removeChild($('.loading-overlay'));
      document.body.style.overflow = '';
    }, 1000);
  }, 1000);
}

document.addEventListener('DOMContentLoaded', loaded, false);