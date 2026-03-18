/**
 * keyboard.js — Global keyboard shortcuts
 * ArrowRight = step forward, ArrowLeft = step back,
 * Space = play/pause, R = run, Escape = skip tour
 */
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  switch (e.key) {
    case 'ArrowRight':          stepForward();  break;
    case 'ArrowLeft':           stepBack();     break;
    case ' ':  e.preventDefault(); togglePlay(); break;
    case 'r': case 'R':         runSimulation(); break;
    case 'Escape':              tourSkip();     break;
  }
});
