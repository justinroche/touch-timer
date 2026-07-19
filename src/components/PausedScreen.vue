<script setup>
import { computed } from 'vue';
import { formatDeciseconds } from '../composables/formatClock';

const props = defineProps({
  engine: { type: Object, required: true },
});
const emit = defineEmits(['resume', 'exit']);

const isTimer = computed(() => props.engine.mode === 'timer');
const isThresholdPause = computed(
  () => props.engine.stopReason === 'threshold',
);

const displayTime = computed(() => {
  if (isTimer.value) return formatDeciseconds(props.engine.remainingMs);
  return formatDeciseconds(props.engine.elapsedMs);
});

const heading = computed(() =>
  isThresholdPause.value ? 'Paused' : "Time's up",
);
</script>

<template>
  <div class="paused">
    <div class="mark" :class="{ dim: !isThresholdPause }">
      <svg
        v-if="isThresholdPause"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3ECFB8"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="#B8AF9C"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="8" />
      </svg>
    </div>
    <h2>{{ heading }}</h2>

    <div class="final-time">{{ displayTime }}</div>

    <div class="actions">
      <button
        v-if="isThresholdPause"
        class="resume-btn"
        @click="emit('resume')"
      >
        Resume
      </button>
      <button
        class="exit-btn"
        :class="{ solo: !isThresholdPause }"
        @click="emit('exit')"
      >
        {{ isThresholdPause ? 'Exit' : 'New round' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.paused {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8vw;
}
.mark {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid var(--teal);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 26px;
}
.mark.dim {
  border-color: var(--line);
}
.mark svg {
  width: 26px;
  height: 26px;
}
h2 {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 36px;
  margin: 0 0 8px;
}
.final-time {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: clamp(40px, 12vw, 64px);
  color: var(--bone);
  margin-bottom: 40px;
  letter-spacing: -0.02em;
}
.actions {
  display: flex;
  gap: 14px;
}
.resume-btn {
  padding: 15px 40px;
  border-radius: 999px;
  border: none;
  background: var(--teal);
  color: #0a2420;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.resume-btn:active {
  transform: scale(0.97);
}
.exit-btn {
  padding: 15px 32px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--bone-dim);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
.exit-btn.solo {
  padding: 15px 40px;
  border: 1px solid var(--bone);
  color: var(--bone);
}
.exit-btn:active {
  transform: scale(0.97);
}
</style>
