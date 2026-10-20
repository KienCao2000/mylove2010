// The gift pages share an unlock state for this browser tab.
(() => {
  let unlocked = false;
  try { unlocked = sessionStorage.getItem('event2010-unlocked') === 'yes'; } catch {}
  if (!unlocked) {
    document.documentElement.style.visibility = 'hidden';
    window.location.replace('index.html');
  }
})();
