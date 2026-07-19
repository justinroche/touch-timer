<script setup>
import { computed, ref } from 'vue';
import { formatDeciseconds } from '../composables/formatClock';

const props = defineProps({
  engine: { type: Object, required: true },
});
const emit = defineEmits(['cancel']);

const zone = ref(null);

const displayTime = computed(() => {
  if (props.engine.mode === 'timer')
    return formatDeciseconds(props.engine.remainingMs);
  return formatDeciseconds(props.engine.elapsedMs);
});

function onPointerDown(e) {
  if (!props.engine.running) return;
  e.preventDefault();
  zone.value.setPointerCapture(e.pointerId);
  props.engine.addPointer(e.pointerId, e.clientX, e.clientY);
}
function onPointerMove(e) {
  props.engine.movePointer(e.pointerId, e.clientX, e.clientY);
}
function onPointerUp(e) {
  props.engine.removePointer(e.pointerId);
}
</script>

<template>
  <div
    ref="zone"
    class="touch-zone"
    :class="{ pausing: engine.pausing }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu.prevent
  >
    <div class="topbar">
      <template v-if="engine.running || engine.pausing">
        <div class="count-pill">
          <b>{{ engine.pointers.length }}</b
          >&nbsp;of {{ engine.requiredFingers }} fingers down
        </div>
      </template>
    </div>

    <div class="center-readout">
      <transition name="countdown-pop" mode="out-in">
        <div
          v-if="engine.counting"
          class="countdown-num"
          :key="'count-' + engine.countdownValue"
        >
          {{ engine.countdownValue }}
        </div>
        <div v-else class="time-text" key="clock">{{ displayTime }}</div>
      </transition>
    </div>

    <transition-group name="mark" tag="div">
      <div
        v-for="p in engine.pointers"
        :key="p.id"
        class="finger-mark"
        :class="{ locked: engine.pausing }"
        :style="{ left: p.x + 'px', top: p.y + 'px' }"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.touch-zone {
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: none;
  overflow: hidden;
}

.topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  justify-content: center;
  padding-top: max(22px, env(safe-area-inset-top));
  pointer-events: none;
}
.count-pill {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.06em;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(29, 26, 20, 0.7);
  color: var(--bone-dim);
}
.count-pill b {
  color: var(--bone);
  font-weight: 600;
}

.center-readout {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.time-text {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: clamp(52px, 16vw, 100px);
  letter-spacing: -0.02em;
  color: var(--bone);
  transition: color 0.25s ease;
}
.countdown-num {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: clamp(70px, 22vw, 140px);
  letter-spacing: -0.02em;
  color: var(--amber);
  line-height: 1;
}
.countdown-pop-enter-active.countdown-num {
  transition:
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.2s ease;
}
.countdown-pop-leave-active.countdown-num {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}
.countdown-pop-enter-from.countdown-num {
  transform: scale(0.6);
  opacity: 0;
}
.countdown-pop-leave-to.countdown-num {
  transform: scale(1.15);
  opacity: 0;
}

.countdown-pop-enter-active.time-text {
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease,
    filter 0.2s ease;
}
.countdown-pop-leave-active.time-text {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}
.countdown-pop-enter-from.time-text {
  transform: scale(1.4);
  opacity: 0;
  filter: blur(8px);
}
.countdown-pop-leave-to.time-text {
  transform: scale(0.9);
  opacity: 0;
}

.touch-zone.pausing .time-text,
.touch-zone.pausing .state-text {
  color: var(--teal);
}

.finger-mark {
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--amber);
  pointer-events: none;
  z-index: 3;
  transform: translate(-50%, -50%) scale(1);
  box-shadow:
    0 0 0 3px var(--amber),
    0 0 0 9px transparent,
    0 0 0 12px rgba(255, 182, 61, 0.35),
    0 0 0 18px transparent,
    0 0 0 21px rgba(255, 182, 61, 0.16);
  transition:
    box-shadow 0.25s ease,
    background 0.25s ease;
}
.finger-mark.locked {
  background: var(--teal);
  box-shadow:
    0 0 0 3px var(--teal),
    0 0 0 9px transparent,
    0 0 0 12px rgba(62, 207, 184, 0.35),
    0 0 0 18px transparent,
    0 0 0 21px rgba(62, 207, 184, 0.16);
}
.mark-enter-from {
  transform: translate(-50%, -50%) scale(0);
}
.mark-enter-active {
  transition: transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mark-leave-active {
  transition: transform 0.12s ease;
}
.mark-leave-to {
  transform: translate(-50%, -50%) scale(0);
}
</style>
