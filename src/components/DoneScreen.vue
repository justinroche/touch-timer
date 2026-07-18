<script setup>
import { computed } from 'vue';
import { formatDeciseconds } from '../composables/formatClock';

const props = defineProps({
  engine: { type: Object, required: true },
  reason: { type: String, required: true }, // 'stopped' | 'timeUp'
});
const emit = defineEmits(['again']);

const isTimer = computed(() => props.engine.mode === 'timer');

const heading = computed(() => {
  if (props.reason === 'stopped') return 'Locked in';
  if (props.reason === 'timeUp') return "Time's up";
});

const subtext = computed(() => {
  if (props.reason === 'stopped') {
    return 'Everyone got a finger down.';
  }
  if (props.reason === 'timeUp') {
    return 'The clock ran out.';
  }
});

const finalTime = computed(() => {
  if (isTimer.value) return formatDeciseconds(props.engine.remainingMs);
  return formatDeciseconds(props.engine.elapsedMs);
});
</script>

<template>
  <div class="done">
    <div class="mark" :class="{ dim: reason !== 'stopped' }">
      <svg
        v-if="reason === 'stopped'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3ECFB8"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 12l5 5L20 6" />
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
    <p class="sub">{{ subtext }}</p>

    <div class="final-time">{{ finalTime }}</div>

    <button class="again-btn" @click="emit('again')">Play again</button>
  </div>
</template>

<style scoped>
.done {
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
.sub {
  color: var(--bone-dim);
  font-size: 14px;
  margin: 0 0 30px;
  max-width: 300px;
}
.final-time {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: clamp(40px, 12vw, 64px);
  color: var(--bone);
  margin-bottom: 40px;
  letter-spacing: -0.02em;
}
.again-btn {
  padding: 15px 40px;
  border-radius: 999px;
  border: 1px solid var(--bone);
  background: transparent;
  color: var(--bone);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}
</style>
