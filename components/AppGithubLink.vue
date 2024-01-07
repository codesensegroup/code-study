<script setup lang="ts">
defineProps<{
  contributor: string;
}>();
</script>

<template>
  <a
    :href="`https://github.com/${contributor}`"
    target="_blank"
    class="inline-flex mb-2 mr-2 overflow-hidden transition-colors ease-linear border rounded border-light-border"
  >
    <img
      :alt="contributor"
      :src="`https://github.com/${contributor}.png?size=32`"
      :srcset="`https://github.com/${contributor}.png?size=32 1x, https://github.com/${contributor}.png?size=64 2x`"
      class="h-8 github-icon"
      loading="lazy"
    />
    <span class="inline-block px-2 leading-loose">
      {{ contributor }}
    </span>
  </a>
</template>

<style scoped>
.github-icon {
  margin-top: 0rem !important;
  margin-bottom: 0rem !important;
}

.dark-mode .dark\:prose-dark a {
  color: rgba(255, 255, 255, var(--tw-text-opacity));
}

.prose a {
  color: rgba(74, 85, 104, var(--tw-text-opacity));
  text-decoration: none;
}

.prose a:hover {
  background-color: rgba(212, 212, 212);
}

.dark-mode .dark\:prose-dark a:hover {
  background-color: rgb(0, 0, 0);
}
</style>
