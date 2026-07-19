<script setup>
import { ref, computed } from 'vue';
import { formatSeconds } from '../composables/formatClock';

const emit = defineEmits(['start']);

const mode = ref('timer');
const requiredFingers = ref(4);
const durationSec = ref(60);
const countdownEnabled = ref(true);

const durationLabel = computed(() => formatSeconds(durationSec.value * 1000));

function decFingers() {
  requiredFingers.value = Math.max(1, requiredFingers.value - 1);
}
function incFingers() {
  requiredFingers.value = Math.min(10, requiredFingers.value + 1);
}
function decDuration() {
  durationSec.value = Math.max(15, durationSec.value - 15);
}
function incDuration() {
  durationSec.value = Math.min(600, durationSec.value + 15);
}

function start() {
  emit('start', {
    mode: mode.value,
    requiredFingers: requiredFingers.value,
    durationMs: durationSec.value * 1000,
    countdownEnabled: countdownEnabled.value,
  });
}
</script>

<template>
  <div class="setup">
    <div class="field">
      <div class="field-label">Mode</div>
      <div class="segmented">
        <button :class="{ active: mode === 'timer' }" @click="mode = 'timer'">
          Timer
        </button>
        <button
          :class="{ active: mode === 'stopwatch' }"
          @click="mode = 'stopwatch'"
        >
          Stopwatch
        </button>
      </div>
    </div>

    <div class="field">
      <div class="field-label">Fingers needed</div>
      <div class="stepper">
        <button @click="decFingers">&minus;</button>
        <div class="stepper-value">{{ requiredFingers }}</div>
        <button @click="incFingers">&plus;</button>
      </div>
    </div>

    <div class="field" v-if="mode === 'timer'">
      <div class="field-label">Starting time</div>
      <div class="stepper">
        <button @click="decDuration">&minus;</button>
        <div class="stepper-value">{{ durationLabel }}</div>
        <button @click="incDuration">&plus;</button>
      </div>
    </div>

    <div class="field">
      <label class="checkbox-row">
        <input type="checkbox" v-model="countdownEnabled" />
        <span>Countdown</span>
      </label>
    </div>

    <button class="start-btn" @click="start">Start</button>
  </div>
</template>

<style scoped>
.setup {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8vh 8vw;
  text-align: center;
}
h1 {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: clamp(30px, 8.5vw, 50px);
  margin: 0 0 6px;
  line-height: 1.03;
  letter-spacing: -0.01em;
}
.field {
  width: 100%;
  max-width: 320px;
  margin-bottom: 28px;
}
.field-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bone-dim);
  margin-bottom: 14px;
}
.segmented {
  display: flex;
  border: 1px solid var(--line);
  border-radius: 999px;
  overflow: hidden;
}
.segmented button {
  flex: 1;
  border: none;
  background: var(--ink-2);
  color: var(--bone-dim);
  font-size: 14px;
  font-weight: 500;
  padding: 12px 0;
  cursor: pointer;
}
.segmented button.active {
  background: var(--amber);
  color: #241802;
}
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
}
.stepper button {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--ink-2);
  color: var(--bone);
  font-size: 20px;
  font-family: 'IBM Plex Mono', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.stepper button:active {
  background: #26221a;
  transform: scale(0.94);
}
.stepper-value {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: 30px;
  min-width: 96px;
  color: var(--amber);
}
.checkbox-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.03em;
  color: var(--bone-dim);
}
.checkbox-row input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--amber);
  cursor: pointer;
}
.start-btn {
  margin-top: 10px;
  padding: 16px 46px;
  border-radius: 999px;
  border: none;
  background: var(--amber);
  color: #241802;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.02em;
  cursor: pointer;
}
.start-btn:active {
  transform: scale(0.97);
}
</style>
