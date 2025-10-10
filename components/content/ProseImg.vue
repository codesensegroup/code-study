<template>
  <img
    ref="imgRef"
    :src="src"
    :alt="alt"
    class="prose-img"
    loading="lazy"
    @click="openLightbox"
  />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const props = defineProps<{
  src: string
  alt?: string
}>()

const imgRef = ref<HTMLImageElement>()
let lightbox: PhotoSwipeLightbox | null = null

const openLightbox = () => {
  if (!imgRef.value) return

  // 創建臨時的 PhotoSwipe 實例
  const pswp = new PhotoSwipeLightbox({
    dataSource: [
      {
        src: props.src,
        width: imgRef.value.naturalWidth || 1920,
        height: imgRef.value.naturalHeight || 1080,
        alt: props.alt || ''
      }
    ],
    pswpModule: () => import('photoswipe'),
    // 啟用縮放控制
    showHideAnimationType: 'fade',
    // 顯示縮放比例
    imageClickAction: 'zoom',
    tapAction: 'zoom',
    doubleTapAction: 'zoom',
    // 啟用滾輪縮放
    wheelToZoom: true,
    // 初始縮放級別
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 1.5,
    maxZoomLevel: 3,
    // 設定圖片與螢幕邊緣的間距（上下左右各留 40px）
    padding: { top: 40, bottom: 40, left: 40, right: 40 },
    // UI 選項
    closeTitle: '關閉 (ESC)',
    zoomTitle: '縮放',
    arrowPrevTitle: '上一張',
    arrowNextTitle: '下一張',
  })

  pswp.init()
  pswp.loadAndOpen(0)
}

onMounted(() => {
  // 預載圖片尺寸
  if (imgRef.value && !imgRef.value.complete) {
    imgRef.value.onload = () => {
      // 圖片載入完成
    }
  }
})

onBeforeUnmount(() => {
  if (lightbox) {
    lightbox.destroy()
    lightbox = null
  }
})
</script>

<style scoped>
.prose-img {
  cursor: zoom-in;
  transition: all 0.3s ease;
  max-width: 50%;
  height: auto;
  display: block;
  margin: 0.75rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.prose-img:hover {
  opacity: 0.9;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
</style>

<style>
/* PhotoSwipe 自定義樣式 */
.pswp__button--zoom {
  display: block !important;
}

.pswp__counter {
  display: none;
}

/* 縮放控制按鈕樣式 */
.pswp__button {
  background-color: rgba(0, 0, 0, 0.5) !important;
  transition: background-color 0.2s ease;
}

.pswp__button:hover {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

/* 添加縮放提示 */
.pswp__zoom-wrap {
  cursor: zoom-in;
}

.pswp__img--zoomed {
  cursor: grab;
}

.pswp__img--zoomed:active {
  cursor: grabbing;
}
</style>
