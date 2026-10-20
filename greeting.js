// Đổi lời chúc riêng cho từng video tại đây.
const greetings = {
  left: {
    title: 'Luôn rạng rỡ nhé em!',
    message: 'Chúc em một ngày 20/10 thật nhiều niềm vui và những điều bất ngờ dễ thương. Mong em luôn giữ nụ cười rạng rỡ ấy, luôn tự tin và hạnh phúc theo cách của riêng mình.\n\nVới anh, em luôn là bông hoa đẹp nhất.',
  },
  right: {
    title: 'Gửi em những dịu dàng',
    message: 'Nhân ngày Phụ nữ Việt Nam, chúc em luôn được yêu thương, bình an và gặp thật nhiều may mắn. Mong những điều em ấp ủ đều sẽ thành hiện thực.\n\nCảm ơn em đã mang đến những khoảnh khắc thật đẹp. Anh mong chúng mình sẽ có thêm thật nhiều kỷ niệm bên nhau.',
  },
  third: {
    title: 'Thương những điều bé nhỏ',
    message: 'Chúc em luôn bình an, tự tin và vui với những điều nhỏ bé mỗi ngày. Mong những ước mơ em đang ấp ủ đều dần trở thành hiện thực.\n\nCảm ơn em đã làm những ngày bình thường trở nên đáng nhớ hơn.',
  },
  fourth: {
    title: 'Cười thật nhiều nhé em!',
    message: 'Chúc nụ cười của em luôn rạng rỡ như thế. Mong mỗi ngày đều mang đến cho em một lý do để vui, một điều để mong chờ và thật nhiều yêu thương.\n\nAnh mong được cùng em giữ lại thêm nhiều khoảnh khắc đẹp như thế này.',
  },
  letter: {
    title: 'Chúc mừng ngày 20/10',
    message: 'Gửi em,\n\nHôm nay là ngày của em. Anh chúc em thật nhiều niềm vui, hạnh phúc và may mắn. Chúc em luôn xinh đẹp, tự tin và tươi cười mỗi ngày.\n\nEm luôn là bông hoa đẹp nhất trong lòng anh. Mong rằng chúng ta sẽ có thật nhiều kỷ niệm đẹp và hạnh phúc bên nhau.\n\nAnh yêu em, và mỗi ngày lại yêu em nhiều hơn nữa!',
  },
};

const dialog = document.querySelector('#greeting-dialog');
const dialogVideo = dialog.querySelector('.dialog-video');
const dialogTitle = document.querySelector('#greeting-title');
const typedMessage = dialog.querySelector('.message-typed');
const messageLayout = dialog.querySelector('.message-layout');
const accessibleMessage = dialog.querySelector('.message-accessible');
const revealButton = dialog.querySelector('.reveal-message');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let typingTimer;
let fullMessage = '';
let lastTrigger;

function stopTyping() {
  clearTimeout(typingTimer);
  typingTimer = undefined;
  dialog.classList.remove('is-typing');
}

function revealAll() {
  if (!dialog.classList.contains('is-typing')) return;
  stopTyping();
  typedMessage.textContent = fullMessage;
  // Keep the hint's space so completing the text does not shift the letter.
  dialog.classList.add('is-complete');
  if (document.activeElement === revealButton) {
    dialog.querySelector('.dialog-close').focus({ preventScroll: true });
  }
}

function startTyping(message) {
  stopTyping();
  fullMessage = message;
  messageLayout.textContent = message;
  accessibleMessage.textContent = message;
  dialog.classList.remove('is-complete');
  revealButton.hidden = reducedMotion.matches;
  if (reducedMotion.matches) {
    typedMessage.textContent = message;
    return;
  }

  // Keep Vietnamese accents and emoji together when revealing each character.
  const characters = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter('vi', { granularity: 'grapheme' }).segment(message), part => part.segment)
    : Array.from(message);
  let index = 0;
  const visibleText = document.createTextNode('');
  typedMessage.replaceChildren(visibleText);
  dialog.classList.add('is-typing');

  function typeNext() {
    if (!dialog.open || !dialog.classList.contains('is-typing')) return;
    const character = characters[index++];
    visibleText.appendData(character);
    if (index >= characters.length) {
      revealAll();
      return;
    }
    const delay = character === '\n' ? 260 : /[.!?]/.test(character) ? 240 : /[,;:]/.test(character) ? 120 : 32;
    typingTimer = setTimeout(typeNext, delay);
  }
  typeNext();
}

function openGreeting(key, trigger) {
  const greeting = greetings[key];
  lastTrigger = trigger;
  dialogTitle.textContent = greeting.title;
  const video = trigger.querySelector('video');
  dialogVideo.pause();
  dialogVideo.hidden = !video;
  if (video) {
    dialogVideo.src = video.currentSrc || video.src;
    dialogVideo.poster = video.poster;
    dialogVideo.muted = true;
  } else {
    dialogVideo.removeAttribute('src');
    dialogVideo.removeAttribute('poster');
    dialogVideo.load();
  }
  dialog.showModal();
  dialog.scrollTop = 0;
  startTyping(greeting.message);
  syncPreviews();
  if (video && !reducedMotion.matches) dialogVideo.play().catch(() => {});
}

document.querySelectorAll('[data-greeting]').forEach(trigger => {
  trigger.addEventListener('click', () => openGreeting(trigger.dataset.greeting, trigger));
});
function closeGreeting() {
  dialogVideo.pause();
  dialog.close();
}
dialog.querySelector('.dialog-close').addEventListener('click', closeGreeting);
dialog.addEventListener('cancel', () => dialogVideo.pause());
dialog.querySelector('.dialog-content').addEventListener('click', event => {
  if (event.target.closest('video')) return;
  if (!window.getSelection()?.isCollapsed) return;
  revealAll();
});
// Native button also supports Enter/Space and assistive technology activation.
revealButton.addEventListener('click', revealAll);
reducedMotion.addEventListener('change', event => {
  if (event.matches) { revealAll(); dialogVideo.pause(); }
  syncPreviews();
});
// Chỉ đóng khi cả thao tác nhấn và thả đều ở ngoài thiệp.
let pressedBackdrop = false;
function isOutsideDialog(event) {
  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
}
dialog.addEventListener('pointerdown', event => { pressedBackdrop = isOutsideDialog(event); });
dialog.addEventListener('click', event => {
  if (pressedBackdrop && isOutsideDialog(event)) closeGreeting();
  pressedBackdrop = false;
});
dialog.addEventListener('close', () => {
  if (dialog.open) return;
  stopTyping();
  dialogVideo.pause();
  syncPreviews();
  lastTrigger?.focus({ preventScroll: true });
});

const previewVideos = [...document.querySelectorAll('.video-card video')];
const visiblePreviews = new Set();
function syncPreviews() {
  previewVideos.forEach(video => {
    if (!document.hidden && !dialog.open && !reducedMotion.matches && visiblePreviews.has(video)) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visiblePreviews.add(entry.target) : visiblePreviews.delete(entry.target));
    syncPreviews();
  }, { threshold: .15 });
  previewVideos.forEach(video => { video.muted = true; observer.observe(video); });
} else {
  previewVideos.forEach(video => { video.muted = true; visiblePreviews.add(video); });
  syncPreviews();
}
document.addEventListener('visibilitychange', () => {
  syncPreviews();
  if (document.hidden) dialogVideo.pause();
});
window.addEventListener('pagehide', () => {
  previewVideos.forEach(video => video.pause());
  dialogVideo.pause();
  stopTyping();
});

