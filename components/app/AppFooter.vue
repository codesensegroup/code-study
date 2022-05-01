<template>
  <footer class="h-16 relative w-full border-t dark:border-gray-800 bg-white dark:bg-gray-900 z-20 text-center flex items-center justify-center">
      <div class="font-light">Code Sense</div>
  </footer>
</template>

<script>

export default {
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
  },
};
</script>
