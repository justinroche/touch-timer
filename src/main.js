import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');

// --- Global gesture hardening -------------------------------------------
// touch-action:none on the touch surface (see GameScreen) stops the browser
// from turning fingers into scroll/pinch gestures on that element. These
// listeners cover the remaining edge cases browsers still intercept
// natively at the document level, regardless of which element is touched.

// Safari's pinch-zoom gesture events (non-standard, iOS only)
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

// Double-tap-to-zoom
let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  },
  { passive: false },
);

// Long-press context menu / callout
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Belt-and-braces scroll/bounce lock. touch-action + overscroll-behavior in
// CSS handle this in every modern browser; this is a fallback for the rare
// case a stray touchmove reaches the document instead of the touch surface.
document.addEventListener(
  'touchmove',
  (e) => {
    if (e.target.closest('[data-scrollable]')) return;
    e.preventDefault();
  },
  { passive: false },
);

// Register the service worker so "add to home screen" is available
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
