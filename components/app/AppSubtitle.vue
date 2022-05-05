<template>
  <div class="flex flex-col">
    <div v-if="document.subtitle">
      <p class="text-gray-600 dark:text-gray-400">{{ document.subtitle }} </p>
    </div>
    <div>
      <span class="text-sm">字數總計：{{ document.readingStats.words }} 個</span>
      <span class="mx-1">|</span>
      <span class="text-sm">
        閱讀時長：{{ Math.ceil(document.readingStats.minutes) }} 分鐘
      </span>
      <span class="mx-1">|</span>
      <span class="text-sm" id="busuanzi_container_page_pv">
        <span>閱讀次數：</span>
        <span id="busuanzi_value_page_pv"></span>
        次
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
};
</script>
