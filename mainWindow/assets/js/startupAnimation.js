document.querySelector('body').style.overflow = 'hidden';
let i = 1;
document.querySelector('.loading-msg').textContent = 'Loading';
let textanim = setInterval(() => {
  document.querySelector('.loading-msg').textContent = 'Loading' + '.'.repeat(i);
  i++;
  if(i > 3) i = 1;
}, 200);


function loaded() {
  setTimeout(() => {
    // switch backdrop to green
    document.querySelector('#loading-backdrop').src = '../global assets/img/icon-backdrop-green.png';

    // clear textanimation
    clearInterval(textanim);
    
    // loading overlay draw-out animation
    console.log('%c NOTICE: content loaded.', greenColor);
    document.querySelector('.loading-overlay').classList.add('loading-overlay-draw-out');
  
    
    // container animation
    document.querySelector('.container').classList.remove('container-draw-in');
    setTimeout(() => {
      document.querySelector('body').removeChild(document.querySelector('.loading-overlay'));
    }, 1000);
  }, 1000);
}

// call loaded function after document is loaded
document.addEventListener('DOMContentLoaded', loaded, false);