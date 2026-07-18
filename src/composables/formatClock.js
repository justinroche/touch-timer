function formatClock(ms, { deciseconds = false } = {}) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = deciseconds ? safeMs / 1000 : Math.ceil(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const base = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  if (!deciseconds) return base;
  const tenths = Math.floor((totalSeconds * 10) % 10);
  return `${base}.${tenths}`;
}

export function formatSeconds(ms) {
  return formatClock(ms);
}

export function formatDeciseconds(ms) {
  return formatClock(ms, { deciseconds: true });
}
