<script setup>
import { reactive, ref, watch } from 'vue';
import { useHoldEngine } from './composables/useHoldEngine';
import SetupScreen from './components/SetupScreen.vue';
import GameScreen from './components/GameScreen.vue';
import PausedScreen from './components/PausedScreen.vue';

const engine = reactive(useHoldEngine());
const screen = ref('setup'); // 'setup' | 'game' | 'paused'

watch(
  () => engine.paused,
  (isPaused) => {
    if (isPaused) screen.value = 'paused';
  },
);

function handleStart(settings) {
  engine.start(settings);
  screen.value = 'game';
}

function handleCancel() {
  engine.reset();
  screen.value = 'setup';
}

function handleResume() {
  engine.resume();
  screen.value = 'game';
}

function handleExit() {
  engine.exit();
  screen.value = 'setup';
}
</script>

<template>
  <div class="app-shell">
    <transition name="fade" mode="out-in">
      <SetupScreen v-if="screen === 'setup'" key="setup" @start="handleStart" />
      <GameScreen
        v-else-if="screen === 'game'"
        key="game"
        :engine="engine"
        @cancel="handleCancel"
      />
      <PausedScreen
        v-else
        key="paused"
        :engine="engine"
        @resume="handleResume"
        @exit="handleExit"
      />
    </transition>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  width: 100%;
  height: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
