const ACCESS_KEY = 'event2010-unlocked';
const PASSCODE = '2409';
const form = document.querySelector('.gate-card');
const input = document.querySelector('#passcode');
const dots = [...document.querySelectorAll('.pin-dots span')];
const status = document.querySelector('#gate-status');
const title = document.querySelector('#gate-title');
const keys = [...document.querySelectorAll('.keypad button')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let phase = 'idle';
let wrongTimer;
let fireworks;
const celebrationTimers = [];

function lockKeys(locked) {
  input.disabled = locked;
  keys.forEach(key => { key.disabled = locked; });
}
function paintDots() {
  dots.forEach((dot, index) => dot.classList.toggle('filled', index < input.value.length));
}
function resetGate() {
  clearTimeout(wrongTimer);
  celebrationTimers.forEach(clearTimeout);
  celebrationTimers.length = 0;
  fireworks?.destroy();
  fireworks = undefined;
  try { sessionStorage.removeItem(ACCESS_KEY); } catch {}
  phase = 'idle';
  input.value = '';
  input.removeAttribute('aria-invalid');
  document.body.classList.remove('is-wrong', 'is-unlocked', 'is-leaving');
  title.textContent = 'Nhập pass nha';
  status.textContent = 'Một bí mật nhỏ, một món quà xinh.';
  form.removeAttribute('aria-busy');
  lockKeys(false);
  paintDots();
}
function celebrate() {
  phase = 'unlocked';
  lockKeys(true);
  input.blur();
  form.setAttribute('aria-busy', 'true');
  document.body.classList.add('is-unlocked');
  title.textContent = 'Đúng rồi nè!';
  status.textContent = 'Bất ngờ đang chờ em…';
  try { sessionStorage.setItem(ACCESS_KEY, 'yes'); } catch {
    status.textContent = 'Không lưu được mã. Hãy mở lại trang và thử nhé.';
    return;
  }
  if (typeof window.FireworksEffect === 'function') {
    fireworks = new window.FireworksEffect();
    fireworks.init('unlock-fireworks', { autoCreate: false, maxFireworks: 6 });
    const burst = (x, y) => fireworks?.createFirework(innerWidth * x, innerHeight * y, {
      particleCount: reduceMotion.matches ? 16 : 48,
      speed: reduceMotion.matches ? 1 : 3,
      size: 7, hue: 340,
    });
    burst(.25, .3);
    if (!reduceMotion.matches) {
      [[220, .75, .28], [500, .5, .18], [800, .18, .55], [1050, .83, .5]].forEach(([delay, x, y]) => {
        celebrationTimers.push(setTimeout(() => burst(x, y), delay));
      });
    }
  }
  const wait = reduceMotion.matches ? 1100 : 2500;
  celebrationTimers.push(setTimeout(() => document.body.classList.add('is-leaving'), wait - 260));
  celebrationTimers.push(setTimeout(() => window.location.replace('bouquet.html'), wait));
}
function checkCode() {
  paintDots();
  if (input.value.length !== 4 || phase !== 'idle') return;
  if (input.value === PASSCODE) { celebrate(); return; }
  phase = 'wrong';
  lockKeys(true);
  document.body.classList.add('is-wrong');
  input.setAttribute('aria-invalid', 'true');
  status.textContent = 'Chưa đúng rồi, thử lại nhé!';
  wrongTimer = setTimeout(() => {
    input.value = '';
    phase = 'idle';
    document.body.classList.remove('is-wrong');
    input.removeAttribute('aria-invalid');
    lockKeys(false);
    paintDots();
  }, 650);
}
function addDigit(digit) {
  if (phase !== 'idle' || input.value.length >= 4) return;
  input.value += digit;
  status.textContent = 'Một bí mật nhỏ, một món quà xinh.';
  checkCode();
}
document.querySelectorAll('[data-digit]').forEach(key => {
  key.addEventListener('click', () => addDigit(key.dataset.digit));
});
document.querySelector('.delete-key').addEventListener('click', () => {
  if (phase !== 'idle') return;
  input.value = input.value.slice(0, -1);
  paintDots();
});
input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '').slice(0, 4);
  status.textContent = 'Một bí mật nhỏ, một món quà xinh.';
  checkCode();
});
document.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.target === input) return;
  if (/^[0-9]$/.test(event.key)) {
    event.preventDefault(); addDigit(event.key);
  } else if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault(); document.querySelector('.delete-key').click();
  } else if (event.key === 'Escape' && phase === 'idle') {
    input.value = ''; paintDots();
  }
});
form.addEventListener('submit', event => { event.preventDefault(); checkCode(); });
window.addEventListener('pageshow', event => { if (event.persisted) resetGate(); });
window.addEventListener('pagehide', () => {
  clearTimeout(wrongTimer);
  celebrationTimers.forEach(clearTimeout);
  fireworks?.destroy();
});
resetGate();
