<template>
  <div class="package-info">
    <div class="package-info__header">
      <span class="package-info__icon">{{ icon }}</span>
      <h3 class="package-info__title">{{ name }}</h3>
      <span class="package-info__version">v{{ version }}</span>
      <span :class="['badge', `badge--${status}`]">{{ status }}</span>
    </div>
    <div class="package-info__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  icon: string;
  version: string;
  status: 'stable' | 'beta' | 'deprecated';
}

defineProps<Props>();
</script>
