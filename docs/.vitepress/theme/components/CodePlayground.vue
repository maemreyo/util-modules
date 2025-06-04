<template>
  <div class="code-playground">
    <div class="code-playground__header">
      <span class="code-playground__title">{{ title }}</span>
      <div class="code-playground__actions">
        <button @click="runCode" class="code-playground__button">
          ▶️ Run
        </button>
        <button @click="resetCode" class="code-playground__button">
          🔄 Reset
        </button>
        <button @click="copyCode" class="code-playground__button">
          📋 Copy
        </button>
      </div>
    </div>
    <div class="code-playground__editor">
      <slot />
    </div>
    <div v-if="output" class="code-playground__output">
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title: string;
  code: string;
}

const props = defineProps<Props>();
const output = ref('');

const runCode = () => {
  // Simulate code execution
  output.value = 'Code executed successfully!\nOutput would appear here...';
};

const resetCode = () => {
  output.value = '';
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    alert('Code copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>
