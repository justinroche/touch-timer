import { reactive, ref } from 'vue';

export function useHoldEngine() {
  const pointers = reactive([]); // [{ id, x, y }]

  const mode = ref('timer'); // 'timer' | 'stopwatch'
  const requiredFingers = ref(4);
  const durationMs = ref(60000);

  const remainingMs = ref(durationMs.value);
  const elapsedMs = ref(0);
  const holding = ref(false); // true = threshold reached
  const running = ref(false);

  let lastTs = null;
  let rafId = null;
  let lockTimeoutId = null;
  let settled = false;
  let finishHandler = null;

  // Small pause between hitting the threshold and actually leaving the game screen
  const LOCK_DELAY_MS = 300;

  function fingerCount() {
    return pointers.length;
  }

  function addPointer(id, x, y) {
    if (!running.value || holding.value) return;
    pointers.push({ id, x, y });
    if (fingerCount() >= requiredFingers.value) {
      lockIn();
    }
  }

  function movePointer(id, x, y) {
    if (holding.value) return;
    const p = pointers.find((p) => p.id === id);
    if (p) {
      p.x = x;
      p.y = y;
    }
  }

  function removePointer(id) {
    if (holding.value) return;
    const idx = pointers.findIndex((p) => p.id === id);
    if (idx > -1) pointers.splice(idx, 1);
  }

  function clearPointers() {
    pointers.splice(0, pointers.length);
  }

  function lockIn() {
    if (holding.value) return;
    holding.value = true;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lockTimeoutId = setTimeout(() => finish('stopped'), LOCK_DELAY_MS);
  }

  function tick(ts) {
    if (!running.value) return;
    if (lastTs === null) lastTs = ts;
    const dt = ts - lastTs;
    lastTs = ts;

    if (mode.value === 'timer') {
      remainingMs.value -= dt;
      if (remainingMs.value <= 0) {
        remainingMs.value = 0;
        finish('timeUp');
        return;
      }
    } else {
      elapsedMs.value += dt;
    }

    rafId = requestAnimationFrame(tick);
  }

  function start({ mode: m, requiredFingers: rf, durationMs: dur }) {
    mode.value = m;
    requiredFingers.value = rf;
    durationMs.value = dur || 60000;
    remainingMs.value = durationMs.value;
    elapsedMs.value = 0;
    holding.value = false;
    lastTs = null;
    settled = false;
    if (lockTimeoutId) clearTimeout(lockTimeoutId);
    lockTimeoutId = null;
    clearPointers();
    running.value = true;
    rafId = requestAnimationFrame(tick);
  }

  function finish(reason) {
    if (settled) return;
    settled = true;
    running.value = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (lockTimeoutId) clearTimeout(lockTimeoutId);
    lockTimeoutId = null;
    clearPointers();
    if (finishHandler) finishHandler(reason);
  }

  function reset() {
    settled = true;
    running.value = false;
    holding.value = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (lockTimeoutId) clearTimeout(lockTimeoutId);
    lockTimeoutId = null;
    clearPointers();
  }

  function onFinish(fn) {
    finishHandler = fn;
  }

  return {
    pointers,
    mode,
    requiredFingers,
    durationMs,
    remainingMs,
    elapsedMs,
    holding,
    running,
    addPointer,
    movePointer,
    removePointer,
    clearPointers,
    start,
    reset,
    onFinish,
  };
}
