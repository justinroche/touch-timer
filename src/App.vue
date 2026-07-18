<script setup>
import { reactive, ref } from 'vue';
import { useHoldEngine } from './composables/useHoldEngine';
import SetupScreen from './components/SetupScreen.vue';
import GameScreen from './components/GameScreen.vue';
import DoneScreen from './components/DoneScreen.vue';

const engine = reactive(useHoldEngine());
const screen = ref('setup'); // 'setup' | 'game' | 'done'
const finishReason = ref('timeUp');

engine.onFinish((reason) => {
  finishReason.value = reason;
  screen.value = 'done';
});

function handleStart(settings) {
  engine.start(settings);
  screen.value = 'game';
}

function handleCancel() {
  engine.reset();
  screen.value = 'setup';
}

function handleAgain() {
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
      <DoneScreen
        v-else
        key="done"
        :engine="engine"
        :reason="finishReason"
        @again="handleAgain"
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
