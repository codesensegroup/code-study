<script setup lang="ts">
import busuanzi from "busuanzi.pure.js";
import rt from "reading-time";

const { page } = useContent();
const readTime = reactive({
  time: 0,
  words: 0,
  minutes: 0,
});
const contributors = reactive<string[]>([]);
const title = ref("");

onMounted(() => {
  title.value = page.value && page.value.pageTitle ? page.value.pageTitle : "";

  if (Array.isArray(page.value.contributors)) {
    contributors.push(...page.value.contributors);
  }

  const contentArray = Array.isArray(page.value.body.children)
    ? page.value.body.children
    : [page.value.body.children];

  const content = contentArray.reduce((content: string, item: any) => {
    if (item.children && item.children.length > 0) {
      // 對每個 children 進行迭代
      item.children.forEach((child: any) => {
        if (child.type === "text" && child.value) {
          content += child.value;
        }
      });
    }
    return content;
  }, "");
  const { time, words, minutes } = rt(content);
  readTime.time = time;
  readTime.words = words;
  readTime.minutes = minutes;

  busuanzi.fetch();
});
</script>

<template>
  <div class="flex flex-col">
    <div v-if="title" class="mb-4">
      <h1>
        {{ title }}
      </h1>
    </div>
    <div class="my-1">
      <span class="text-xs md:text-sm">
        字數總計：{{ readTime.words }} 個
      </span>
      <span class="mx-1">|</span>
      <span class="text-xs md:text-sm">
        閱讀時長：{{ Math.ceil(readTime.minutes) }} 分鐘
      </span>
      <span class="mx-1">|</span>
      <span class="text-xs md:text-sm" id="busuanzi_container_page_pv">
        <span>閱讀次數：</span>
        <span id="busuanzi_value_page_pv"></span>
        次
      </span>
    </div>
    <div v-if="contributors" class="mt-1 z-10">
      <AppGithubLink
        v-for="(contributor, index) of contributors"
        :key="index"
        :contributor="contributor"
        class="mr-2"
      />
    </div>
  </div>
</template>
