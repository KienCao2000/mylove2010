const track = document.querySelector('.reel-track');
const viewport = document.querySelector('.reel-viewport');
const pauseButton = document.querySelector('.pause-reel');
const cards = [...document.querySelectorAll('.reel-card')];
const videos = [...track.querySelectorAll('video')];
const visibleVideos = new Set();
const dots = [...document.querySelectorAll('.reel-progress span')];
const status = document.querySelector('#reel-status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const music = document.querySelector('#reel-music');
const musicButton = document.querySelector('.music-reel');
let musicEnabled = true;
let musicBlocked = false;
let musicPending = false;
let userPaused = false;
let leaving = false;
let navigationTimer;

const flowerLayer = document.querySelector('.falling-flowers');
for (let index = 0; index < 16; index++) {
  const flower = document.createElement('span');
  flower.className = 'falling-flower';
  flower.style.cssText = `--flower-left:${(index * 37 + 5) % 98}%;--flower-size:${16 + index % 4 * 5}px;--fall-duration:${10 + index % 5 * 1.5}s;--fall-delay:${-index * 1.7}s`;
  const color = ['#e9a6bc', '#f5c3cf', '#d986a5', '#fffaf0'][index % 4];
  flower.innerHTML = `<svg viewBox="0 0 40 40" fill="${color}" xmlns="http://www.w3.org/2000/svg">${Array.from({ length: 5 }, (_, petal) => `<ellipse cx="20" cy="11" rx="6.5" ry="10" transform="rotate(${petal * 72} 20 20)"/>`).join('')}<circle cx="20" cy="20" r="4" fill="#e7bb68"/></svg>`;
  flowerLayer.append(flower);
}

function updateMusicButton() {
  const playing = !music.paused && !musicBlocked;
  musicButton.textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
  musicButton.setAttribute('aria-pressed', String(playing));
}

function syncMusic() {
  if (!musicEnabled || userPaused || document.hidden || leaving) {
    music.pause();
    if (leaving) music.currentTime = 0;
    updateMusicButton();
    return;
  }
  if (music.paused && !musicBlocked && !musicPending) {
    musicPending = true;
    music.play().then(() => {
      // A pending play request may finish after the user pauses or leaves.
      if (!musicEnabled || userPaused || document.hidden || leaving) music.pause();
    }).catch(() => { musicBlocked = true; }).finally(() => {
      musicPending = false;
      updateMusicButton();
    });
  }
  updateMusicButton();
}
music.volume = .65;
musicButton.addEventListener('click', () => {
  musicEnabled = music.paused;
  musicBlocked = false;
  syncMusic();
});

function syncPlayback() {
  const paused = userPaused || document.hidden || leaving;
  document.body.classList.toggle('is-paused', paused);
  videos.forEach(video => {
    if (!paused && !reducedMotion.matches && visibleVideos.has(video)) video.play().catch(() => {});
    else video.pause();
    video.controls = reducedMotion.matches;
  });
  pauseButton.setAttribute('aria-pressed', String(userPaused));
  pauseButton.textContent = userPaused ? 'Tiếp tục xem' : 'Tạm dừng';
  syncMusic();
}

function updateDuration() {
  const animation = track.getAnimations().find(a => a.animationName === 'memories-rise');
  const oldDuration = animation?.effect.getTiming().duration;
  const fraction = animation && typeof oldDuration === 'number' ? Number(animation.currentTime || 0) / oldDuration : 0;
  const duration = Math.min(42000, Math.max(26000, (track.scrollHeight + viewport.clientHeight) / 120 * 1000));
  track.style.setProperty('--reel-duration', `${duration}ms`);
  if (animation) animation.currentTime = fraction * duration;
}

function continueToIntro() {
  if (leaving) return;
  leaving = true;
  syncPlayback();
  document.body.classList.add('is-leaving');
  navigationTimer = setTimeout(() => location.replace('matrix-pro.html'), 300);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target.querySelector('video');
    const visible = entry.isIntersecting && entry.intersectionRatio >= .2;
    if (video) {
      if (visible) visibleVideos.add(video);
      else visibleVideos.delete(video);
    }
    if (visible) {
      const index = Number(entry.target.dataset.memory) - 1;
      dots.slice(0, index + 1).forEach(dot => dot.classList.add('seen'));
      status.textContent = `Kỷ niệm ${index + 1} trên ${cards.length}`;
    }
  });
  syncPlayback();
}, { root: viewport, threshold: [0, .2, .5] });
cards.forEach(card => observer.observe(card));
pauseButton.addEventListener('click', () => { userPaused = !userPaused; syncPlayback(); });
document.querySelector('.continue-reel').addEventListener('click', continueToIntro);
track.addEventListener('animationend', event => {
  if (event.target === track && event.animationName === 'memories-rise') continueToIntro();
});
document.addEventListener('visibilitychange', syncPlayback);
window.addEventListener('resize', updateDuration);
reducedMotion.addEventListener('change', () => { updateDuration(); syncPlayback(); });
window.addEventListener('pagehide', () => {
  clearTimeout(navigationTimer);
  music.pause();
  music.currentTime = 0;
  videos.forEach(video => video.pause());
  observer.disconnect();
});
updateDuration();
syncPlayback();
