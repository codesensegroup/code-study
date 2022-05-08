<template>
  <div class="flex flex-col">
    <div v-if="document.subtitle">
      <p class="text-gray-600 dark:text-gray-400">{{ document.subtitle }}</p>
    </div>
    <div>
      <span class="text-xs md:text-sm">
        字數總計：{{ document.readingStats.words }} 個
      </span>
      <span class="mx-1">|</span>
      <span class="text-xs md:text-sm">
        閱讀時長：{{ Math.ceil(document.readingStats.minutes) }} 分鐘
      </span>
      <span class="mx-1">|</span>
      <span class="text-xs md:text-sm" id="busuanzi_container_page_pv">
        <span>閱讀次數：</span>
        <span id="busuanzi_value_page_pv"></span>
        次
      </span>
    </div>
    <div class="mt-1 z-10" v-if="contributors">
      <AppGithubLink
        class="mr-2"
        v-for="(contributor, index) of contributors"
        :key="index"
        :contributor="contributor"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      contributors: [],
    };
  },
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  async created() {
    this.contributors = await this.getGithubContributors();
  },
  methods: {
    async getGithubContributors() {
      // use custom document.contributors
      if (this.document.contributors) {
        return this.document.contributors;
      }

      // get contributors with github api
      try {
        const commitPath = `${this.githubUrls.api.repo}/commits?path=content${this.document.path}${this.document.extension}`;
        const response = await fetch(commitPath);
        const data = await response.json();
        return data
          .sort((a, b) => {
            const aDateTime = new Date(b.commit.author.date);
            const bDateTime = new Date(a.commit.author.date);
            return bDateTime - aDateTime;
          })
          .map((v) => v.author.login)
          .filter((value, index, array) => {
            return array.indexOf(value) === index;
          });
      } catch (err) {
        console.log(err);
        return [];
      }
    },
  },
  computed: {
    ...mapGetters(["githubUrls"]),
  },
};
</script>
