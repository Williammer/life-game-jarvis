const official = 'https://www.rockstargames.com/VI';
const artwork = `${official}/_next/static/media/desktop.0iky3x6.hl8fo.jpg`;
const skyline = `${official}/_next/static/media/desktop.00.5pzu2sm-z4.jpg`;
const dialog = document.querySelector('.detail-dialog');
const content = document.querySelector('#dialog-content');
const externalLink = (label, url = official) => `<a class="button primary dialog-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}<svg class="icon"><use href="#arrow"></use></svg></a>`;
const panels = {
  story: ['A partnership worth everything.', 'Jason and Lucia have always known the deck is stacked against them. An easy score goes wrong, drawing them into a criminal conspiracy across Leonida. Their best shot at making it out alive? Each other.', artwork],
  characters: ['Jason & Lucia', 'Two lives. One dangerous new beginning. Meet the duo at the heart of this Vice City story on the official character pages.', artwork],
  gameplay: ['A whole new world of trouble.', 'From Vice City streets to the far reaches of Leonida, get a glimpse of the world in the official trailers. This concept does not include a playable game or unannounced gameplay features.', skyline],
  media: ['The darkest side of paradise.', 'Explore the official trailers, screenshots, and artwork from the world of Grand Theft Auto VI.', skyline],
  news: ['A closer look at Leonida.', 'Follow Rockstar Games for official announcements and a deeper look at Jason, Lucia, and the world around them.', skyline],
  release: ['The countdown is on.', 'Grand Theft Auto VI is listed on the official reveal website for November 19, 2026. Visit Rockstar Games for the latest release information.'],
  platforms: ['Built for the next chapter.', 'PlayStation 5 and Xbox Series X|S. Check the official website for current platform and edition details.'],
  play: ['Your next obsession is on the horizon.', 'This is a design concept, not a playable game. Grand Theft Auto VI is listed for November 19, 2026. Head to Rockstar Games for official availability.'],
};
function openPanel(name) {
  if (name === 'preorder') {
    content.innerHTML = `<p class="dialog-kicker">Choose your platform</p><h2>Paradise has a price.</h2><p>Select a platform, then explore availability on the official Rockstar Games website.</p><div class="platform-choice"><button aria-pressed="true">PlayStation 5</button><button aria-pressed="false">Xbox Series X|S</button></div>${externalLink('Visit official website')}<p class="dialog-note">Unofficial concept. No orders or payments are taken here.</p>`;
    content.querySelectorAll('.platform-choice button').forEach(button => {
      button.addEventListener('click', () => content.querySelectorAll('.platform-choice button').forEach(option => option.setAttribute('aria-pressed', String(option === button))));
    });
  } else if (name === 'trailer') {
    content.innerHTML = `<p class="dialog-kicker">Official trailer 02</p><h2>One city. Endless possibilities.</h2><img class="dialog-image" src="${artwork}" alt="Jason and Lucia beside a sports car on the waterfront"><p>Watch the official trailer on Rockstar Games' YouTube channel.</p>${externalLink('Watch on YouTube', 'https://www.youtube.com/watch?v=tJbzMqJGH4k')}`;
  } else {
    const panel = panels[name];
    if (!panel) return;
    content.innerHTML = `<p class="dialog-kicker">Grand Theft Auto VI</p><h2>${panel[0]}</h2>${panel[2] ? `<img class="dialog-image" src="${panel[2]}" alt="Official Grand Theft Auto VI promotional artwork">` : ''}<p>${panel[1]}</p>${externalLink('Explore at Rockstar Games')}<p class="dialog-note">Unofficial fan-made website concept.</p>`;
  }
  dialog.showModal();
}
document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => {
  closeMenu();
  openPanel(button.dataset.panel);
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
const menu = document.querySelector('.navigation');
const menuButton = document.querySelector('.menu-toggle');
function closeMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
menu.querySelector('a').addEventListener('click', closeMenu);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelectorAll('.scene img').forEach(image => {
  const reportError = () => { document.querySelector('.asset-error').hidden = false; };
  image.addEventListener('error', reportError);
  if (image.complete && !image.naturalWidth) reportError();
});

// Original synthesized ambience: no third-party recording or autoplay.
let audio, gain, interval;
let voices = [];
let playing = false;
let muted = false;
let elapsed = 0;
let track = 0;
const tracks = [
  { name: 'After Hours', notes: [130.81, 155.56, 196, 261.63] },
  { name: 'Ocean Drive', notes: [146.83, 174.61, 220, 293.66] },
  { name: 'Neon Paradise', notes: [164.81, 196, 246.94, 329.63] },
];
const playButton = document.querySelector('.music-play');
const volumeButton = document.querySelector('.volume-button');
const progress = document.querySelector('.track-progress');
function paintProgress() {
  document.querySelector('#elapsed').textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
  progress.setAttribute('aria-valuenow', String(elapsed));
  progress.querySelector('span').style.width = `${elapsed / 180 * 100}%`;
}
function createVoices() {
  voices.forEach(voice => { voice.stop(); voice.disconnect(); });
  voices = tracks[track].notes.map((frequency, index) => {
    const oscillator = audio.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index % 2 ? 4 : -4;
    oscillator.connect(gain);
    oscillator.start();
    return oscillator;
  });
}
function nextTrack() {
  track = (track + 1) % tracks.length;
  elapsed = 0;
  document.querySelector('#track-name').textContent = tracks[track].name;
  if (audio) createVoices();
  paintProgress();
}
playButton.addEventListener('click', async () => {
  try {
    if (!audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('Audio playback is not supported by this browser.');
      audio = new AudioContext();
      gain = audio.createGain();
      gain.gain.value = 0;
      gain.connect(audio.destination);
      createVoices();
    }
    await audio.resume();
    playing = !playing;
    gain.gain.setTargetAtTime(playing && !muted ? .035 : 0, audio.currentTime, .3);
    clearInterval(interval);
    if (playing) interval = setInterval(() => {
      elapsed += 1;
      if (elapsed >= 180) nextTrack();
      paintProgress();
    }, 1000);
    playButton.setAttribute('aria-pressed', String(playing));
    playButton.setAttribute('aria-label', playing ? 'Pause ambient music' : 'Play ambient music');
    playButton.querySelector('use').setAttribute('href', playing ? '#pause' : '#play');
  } catch (error) {
    console.error('Ambient playback failed:', error);
    const toast = document.querySelector('.toast');
    toast.textContent = `Unable to play music. ${error.message}`;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 5000);
  }
});
volumeButton.addEventListener('click', () => {
  muted = !muted;
  volumeButton.setAttribute('aria-pressed', String(muted));
  volumeButton.setAttribute('aria-label', muted ? 'Unmute music' : 'Mute music');
  if (gain) gain.gain.setTargetAtTime(playing && !muted ? .035 : 0, audio.currentTime, .1);
});
document.querySelector('.music-next').addEventListener('click', nextTrack);
