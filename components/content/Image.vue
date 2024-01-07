<template>
  <div class="image-container my-1">
    <img
      v-for="(fullPath, index) in fullPaths"
      :key="index"
      :src="fullPath"
      class="image"
      @click="openModal(fullPath)"
    />
  </div>

  <!-- Modal -->
  <div v-if="modalImage" class="modal" @click="closeModal">
    <img :src="modalImage" class="modal-content" />
    <span class="close">&times;</span>
  </div>
</template>

<script setup lang="ts">
import * as path from "path";
const runtimeConfig = useRuntimeConfig();
const myProps = defineProps<{
  paths: string[];
}>();

const fullPaths = computed(() =>
  myProps.paths.map((p) => path.join(runtimeConfig.public.baseURL, p))
);

const modalImage = ref<string | null>(null);

const openModal = (path: string) => {
  modalImage.value = path;
};

const closeModal = () => {
  modalImage.value = null;
};
</script>

<style scoped>
.image-container {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.image {
  width: 100%;
  height: auto;
  cursor: pointer;
}

.modal {
  display: flex; /* 使用 Flexbox 佈局 */
  align-items: center; /* 垂直置中 */
  justify-content: center; /* 水平置中 */
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.9);
}

.modal-content {
  width: 85%; /* 設定寬度為視窗的95% */
  height: 85%; /* 設定高度為視窗的95% */
  object-fit: contain; /* 保持圖片完整顯示 */
}

.close {
  position: absolute;
  top: 1rem; /* 適當調整關閉按鈕的位置 */
  right: 1rem;
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
}

/* 桌面版本的设置 */
@media (min-width: 768px) {
  .image-container {
    /* 默认为一列，只有当子元素超过一张图片时才变为两列 */
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  }
}

/* 手机版本的设置 */
@media (max-width: 767px) {
  .image-container {
    /* 手机版本始终是一列 */
    grid-template-columns: 1fr;
  }
}
</style>
