document.addEventListener('DOMContentLoaded', () => {
  const page = document.getElementById('birthdayPage');
  const unlockScene = document.getElementById('unlockScene');
  const giftBox = document.getElementById('giftBox');
  const cta = document.querySelector('.cta');
  const cards = document.querySelectorAll('.mini-card, .gift-card');
  const wishPopup = document.getElementById('wishPopup');
  const closePopupButton = document.querySelector('.close-popup');
  const videoPlayer = document.querySelector('.video-player');
  const birthdayAudio = document.getElementById('birthdayAudio');

  let tapCount = 0;
  let unlocked = false;
  let audioStarted = false;

  function startBirthdayAudio() {
    if (audioStarted) return;

    if (birthdayAudio) {
      birthdayAudio.volume = 0.7;
      birthdayAudio.currentTime = 0;
      birthdayAudio.play().catch(() => {});
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      audioStarted = true;
      return;
    }

    const audioContext = new AudioContextClass();
    const melody = [392, 523.25, 659.25, 523.25, 587.33, 783.99, 659.25, 587.33];

    melody.forEach((frequency, index) => {
      const startTime = audioContext.currentTime + index * 0.28;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.04, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.26);
    });

    audioStarted = true;
    audioContext.resume().catch(() => {});
  }

  function showWishPopup() {
    wishPopup?.classList.add('show');
  }

  function hideWishPopup() {
    wishPopup?.classList.remove('show');
  }

  function launchConfetti() {
    const confettiLayer = document.querySelector('.confetti-layer');
    const colors = ['#ffbfd8', '#ffd9a8', '#cfe3ff', '#d7d2ff', '#b8f0d6', '#fff2a8'];

    if (!confettiLayer) return;

    confettiLayer.innerHTML = '';

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = `${4 + Math.random() * 3}s`;
      piece.style.animationDelay = `${Math.random() * 0.7}s`;
      piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 220}px`);
      piece.style.transform = `scale(${0.7 + Math.random() * 1.1})`;
      confettiLayer.appendChild(piece);
    }
  }

  function revealBirthdayPage() {
    unlocked = true;
    page?.classList.remove('hidden');
    unlockScene?.classList.add('hidden');
    launchConfetti();
    startBirthdayAudio();

    if (videoPlayer) {
      videoPlayer.muted = false;
      videoPlayer.volume = 1;
      videoPlayer.play().catch(() => {});
    }

    setTimeout(showWishPopup, 250);

    cards.forEach((card, index) => {
      card.style.animation = `floatCard ${3 + index * 0.6}s ease-in-out infinite alternate`;
    });
  }

  function handleGiftTap() {
    if (unlocked) return;

    tapCount += 1;
    giftBox.classList.remove('shake');
    void giftBox.offsetWidth;
    giftBox.classList.add('shake');

    if (tapCount >= 3) {
      giftBox.classList.add('burst');
      setTimeout(() => {
        revealBirthdayPage();
      }, 550);
    }
  }

  unlockScene?.addEventListener('click', handleGiftTap);
  giftBox?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleGiftTap();
    }
  });

  cta?.addEventListener('click', () => {
    const title = document.querySelector('h1');
    title?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  closePopupButton?.addEventListener('click', hideWishPopup);
  wishPopup?.addEventListener('click', (event) => {
    if (event.target === wishPopup) {
      hideWishPopup();
    }
  });
});

const style = document.createElement('style');
style.textContent = `
  @keyframes floatCard {
    0% { transform: translateY(0); }
    100% { transform: translateY(-8px); }
  }
`;
document.head.appendChild(style);
