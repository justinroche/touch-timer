import { reactive, ref } from 'vue';

export function useHoldEngine() {
  const pointers = reactive([]); // [{ id, x, y }]

  const mode = ref('timer'); // 'timer' | 'stopwatch'
  const requiredFingers = ref(4);
  const durationMs = ref(60000);
  const countdownEnabled = ref(true);

  const remainingMs = ref(durationMs.value);
  const elapsedMs = ref(0);

  const running = ref(false);
  const paused = ref(false);
  const pausing = ref(false);
  const stopReason = ref(null); // 'threshold' | 'timeUp'
  const counting = ref(false); // true = showing the 3-2-1 countdown
  const countdownValue = ref(0);

  let lastTs = null;
  let rafId = null;
  let countdownIntervalId = null;
  let lockTimeoutId = null;

  // Small pause between hitting the threshold and actually leaving the game screen
  const LOCK_DELAY_MS = 300;

  function fingerCount() {
    return pointers.length;
  }

  function addPointer(id, x, y) {
    if (!running.value || paused.value || pausing.value) return;
    pointers.push({ id, x, y });
    if (fingerCount() >= requiredFingers.value) {
      pauseFor('threshold');
    }
  }

  function movePointer(id, x, y) {
    if (paused.value || pausing.value) return;
    const p = pointers.find((p) => p.id === id);
    if (p) {
      p.x = x;
      p.y = y;
    }
  }

  function removePointer(id) {
    if (paused.value || pausing.value) return;
    const idx = pointers.findIndex((p) => p.id === id);
    if (idx > -1) pointers.splice(idx, 1);
  }

  function clearPointers() {
    pointers.splice(0, pointers.length);
  }

  function clearCountdown() {
    if (countdownIntervalId) clearInterval(countdownIntervalId);
    countdownIntervalId = null;
    counting.value = false;
  }

  function clearRaf() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function clearLockTimeout() {
    if (lockTimeoutId) clearTimeout(lockTimeoutId);
    lockTimeoutId = null;
    pausing.value = false;
  }

  function pauseFor(reason) {
    if (paused.value || pausing.value) return;
    running.value = false;
    clearRaf();

    if (reason === 'threshold') {
      pausing.value = true;
      stopReason.value = reason;
      lockTimeoutId = setTimeout(() => {
        pausing.value = false;
        lockTimeoutId = null;
        paused.value = true;
        clearPointers();
      }, LOCK_DELAY_MS);
    } else {
      stopReason.value = reason;
      paused.value = true;
      clearPointers();
    }
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
        pauseFor('timeUp');
        return;
      }
    } else {
      elapsedMs.value += dt;
    }

    rafId = requestAnimationFrame(tick);
  }

  // Used for both the initial start and for resume
  function beginRun(onDone) {
    clearPointers();
    if (!countdownEnabled.value) {
      onDone();
      return;
    }
    counting.value = true;
    countdownValue.value = 3;
    countdownIntervalId = setInterval(() => {
      countdownValue.value -= 1;
      if (countdownValue.value <= 0) {
        clearCountdown();
        onDone();
      }
    }, 750);
  }

  function launchClock() {
    running.value = true;
    lastTs = null;
    rafId = requestAnimationFrame(tick);
  }

  function stopAll() {
    running.value = false;
    paused.value = false;
    stopReason.value = null;
    clearRaf();
    clearCountdown();
    clearLockTimeout();
    clearPointers();
  }

  function start({
    mode: m,
    requiredFingers: rf,
    durationMs: dur,
    countdownEnabled: cd,
  }) {
    mode.value = m;
    requiredFingers.value = rf;
    durationMs.value = dur || 60000;
    countdownEnabled.value = cd ?? true;
    remainingMs.value = durationMs.value;
    elapsedMs.value = 0;
    stopAll();
    beginRun(launchClock);
  }

  function resume() {
    if (!paused.value || stopReason.value !== 'threshold') return;
    paused.value = false;
    stopReason.value = null;
    beginRun(launchClock);
  }

  function exit() {
    stopAll();
  }

  function reset() {
    stopAll();
  }

  return {
    pointers,
    mode,
    requiredFingers,
    durationMs,
    countdownEnabled,
    remainingMs,
    elapsedMs,
    running,
    paused,
    pausing,
    stopReason,
    counting,
    countdownValue,
    addPointer,
    movePointer,
    removePointer,
    clearPointers,
    start,
    resume,
    exit,
    reset,
  };
}
