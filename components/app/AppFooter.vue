<template>
  <footer
    class="
      h-20
      relative
      w-full
      border-t
      dark:border-gray-800
      bg-white
      dark:bg-gray-900
      z-20
      text-center
      flex flex-col
      items-center
      justify-center
    "
  >
    <div class="font-light">© 2022 Code Sense</div>
    <div class="busuanzi flex">
      <span class="flex" id="busuanzi_container_site_uv">
        <IconUser class="mt-1 mr-1 w-4 h-4" />
        <span class="site-uv" title="訪客總數">
          <span id="busuanzi_value_site_uv"></span>
        </span>
      </span>
      <span class="mx-2">|</span>
      <span class="flex" id="busuanzi_container_site_pv">
        <IconEye class="mt-1 mr-1 w-4 h-4" />
        <span class="site-pv" title="總瀏覽次數">
          <span id="busuanzi_value_site_pv"></span>
        </span>
      </span>
    </div>
  </footer>
</template>

<script>
import busuanzi from "busuanzi.pure.js";

export default {   
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        busuanzi.fetch();
      }
    },
  }
};
</script>

<style scoped>
#busuanzi_container_site_uv,
#busuanzi_container_site_pv {
  display: contents !important;
}
</style>