document.querySelector('body').style.overflow = 'hidden';
let startupText;
function startupTextAnimation() {
  let i = 1;
  startupText = setInterval(() => {
    document.querySelector('.loading-msg').textContent = 'Loading' + '.'.repeat(i);
    

    // increment i and restart if above 3
    i++;
    if(i > 3) i = 1;
  }, 250);
  
}
startupTextAnimation();

function loaded() {
  console.log('loaded');
  setTimeout(function() {
    // loading overlay draw-out animation
    console.log('%c NOTICE: content loaded.', greenColor);
    document.querySelector('.loading-overlay').classList.add('loading-overlay-draw-out');
    // update icon
    document.querySelector('#loading-backdrop').src = path.join(__dirname, '../global assets/img/icon-backdrop-green.png');
    // update text
    clearInterval(startupText);
    document.querySelector('.loading-msg').textContent = 'Loaded';
    
  
  // container animation
    document.querySelector('.container').classList.remove('container-draw-in');
  setTimeout(function() {
    document.querySelector('body').removeChild(document.querySelector('.loading-overlay'));
  }, 1000);
  }, 1000);
}

document.addEventListener('DOMContentLoaded', loaded, false);