/**
 * playback.js — Step-by-step playback controls
 *
 * Reads/writes:   App.simData, App.currentStep, App.isPlaying,
 *                 App.playInterval, App.playSpeed  (via window.App)
 * Calls:          showStep()   from simulator.js
 *                 showToast()  from utils.js
 *
 * All shared state lives in window.App (defined in utils.js).
 * This file only adds functions — no top-level variable conflicts.
 */

function stepForward() {
  if (!App.simData) return;
  stopAutoPlay();
  showStep(Math.min(App.currentStep + 1, App.simData.steps.length - 1));
}

function stepBack() {
  if (!App.simData) return;
  stopAutoPlay();
  showStep(Math.max(App.currentStep - 1, 0));
}

function togglePlay() {
  App.isPlaying ? stopAutoPlay() : startAutoPlay();
}

function startAutoPlay() {
  if (!App.simData) return;
  App.isPlaying = true;
  const btn = document.getElementById('playPauseBtn');
  btn.textContent = '⏸';
  btn.classList.add('active');

  // Restart from beginning if already at the last step
  if (App.currentStep >= App.simData.steps.length - 1) App.currentStep = -1;

  App.playInterval = setInterval(() => {
    if (App.currentStep >= App.simData.steps.length - 1) {
      stopAutoPlay();
      showToast(`✅ Done! ${App.simData.faults} page faults, ${App.simData.hits} hits`);
      return;
    }
    showStep(App.currentStep + 1);
  }, App.playSpeed);
}

function stopAutoPlay() {
  App.isPlaying = false;
  clearInterval(App.playInterval);
  const btn = document.getElementById('playPauseBtn');
  btn.textContent = '▶';
  btn.classList.remove('active');
}

function setSpeed(ms) {
  App.playSpeed = ms;
  document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  const labels = { 2000: '0.5×', 1000: '1×', 400: '2×' };
  document.querySelectorAll('.speed-btn').forEach(b => {
    if (b.textContent === labels[ms]) b.classList.add('active');
  });
  if (App.isPlaying) { stopAutoPlay(); startAutoPlay(); }
}
