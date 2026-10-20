let leaving = false;
let timer;
function continueToMemories() {
  if (leaving) return;
  leaving = true;
  clearTimeout(timer);
  document.body.classList.add('is-leaving');
  timer = setTimeout(() => location.replace('media-reel.html'), 300);
}
document.querySelector('.bouquet-turn').addEventListener('animationend', event => {
  if (event.animationName === 'bouquet-turn' && event.target === event.currentTarget) continueToMemories();
});
document.querySelector('.continue-button').addEventListener('click', continueToMemories);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (reducedMotion.matches) timer = setTimeout(continueToMemories, 1600);
reducedMotion.addEventListener('change', event => { if (event.matches) continueToMemories(); });
document.addEventListener('visibilitychange', () => document.body.classList.toggle('is-hidden', document.hidden));
window.addEventListener('pagehide', () => clearTimeout(timer));
