<template>
  <section class="home-hero">
    <div class="hero-grid">
      <!-- Left: Content -->
      <div class="hero-content">
        <h1 class="hero-title">
          Kaohsiung<br>
          <span class="hero-highlight">Code Sense</span><br>
          Study Group
        </h1>
        <div class="hero-accent" />
        <p class="hero-description">
          我們是一群居住在高雄的技術狂熱者，每月舉辦 2 至 3 次的技術研討會。
          成員來自半導體、系統設計、電腦製造及金融等不同領域，對技術有著無比的熱情與執著。
          歡迎與我們一起探索技術的無限可能。
        </p>
        <div class="hero-actions">
          <NuxtLink to="/clean-arch/chapter1" class="btn-primary">
            讀書會歷程文章記錄
          </NuxtLink>
          <a
            href="https://trello.com/b/WgsNsCpq/%E6%91%B3sense%E8%AE%80%E6%9B%B8%E6%9C%83%E7%89%88"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary"
          >
            Our Trello
            <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </a>
        </div>
      </div>

      <!-- Right: Carousel (client-only to avoid SSR hydration mismatch) -->
      <ClientOnly>
        <div class="hero-visual">
          <div class="carousel-glow" />
          <div class="carousel-frame">
            <Swiper
              :modules="modules"
              :slides-per-view="1"
              :space-between="0"
              :loop="true"
              :autoplay="{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }"
              :grab-cursor="true"
              class="hero-swiper"
              @swiper="onSwiper"
              @slide-change="onSlideChange"
            >
              <SwiperSlide v-for="(photo, index) in photos" :key="index">
                <img
                  :src="photo.src"
                  :alt="photo.alt"
                  class="slide-image"
                >
              </SwiperSlide>
            </Swiper>
            <div class="slide-overlay" />
            <div class="slide-bottom">
              <div class="slide-caption">
                <p class="caption-title">
                  {{ photos[activeIndex]?.caption }}
                </p>
                <p class="caption-sub">
                  Code Sense 讀書會
                </p>
              </div>
              <div class="slide-nav">
                <button class="nav-btn" aria-label="Previous" @click="goPrev">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button class="nav-btn" aria-label="Next" @click="goNext">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <template #fallback>
          <div class="hero-visual">
            <div class="carousel-frame">
              <img :src="photos[0]?.src" :alt="photos[0]?.alt" class="slide-image" style="width:100%;height:340px;object-fit:cover;display:block;">
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const runtimeConfig = useRuntimeConfig()
const modules = [Autoplay]

const baseURL = (runtimeConfig.public.baseURL as string).replace(/\/$/, '')

const imageFiles = [
  { file: 'group-dinner.jpg', alt: '讀書會聚餐合照', caption: '年度聚餐' },
  { file: 'elk-session-1.jpg', alt: 'ELK 分享會', caption: 'ELK 技術分享會' },
  { file: 'elk-session-2.jpg', alt: 'ELK 分享會聽眾', caption: '技術交流現場' },
  { file: 'esp8266-workshop.jpg', alt: 'ESP8266 工作坊', caption: 'ESP8266 實作工坊' },
  { file: 'cafe-discussion-1.jpg', alt: '咖啡廳小組討論', caption: '咖啡廳技術討論' },
  { file: 'cafe-discussion-2.jpg', alt: '咖啡廳討論', caption: '小組讀書交流' },
  { file: 'cafe-discussion-3.jpg', alt: '咖啡廳分享', caption: '知識分享時光' },
]

const photos = computed(() =>
  imageFiles.map((img) => ({
    src: `${baseURL}/images/carousel/${img.file}`,
    alt: img.alt,
    caption: img.caption,
  }))
)

const activeIndex = ref(0)
const swiperRef = ref<any>(null)

const onSwiper = (swiper: any) => {
  swiperRef.value = swiper
}

const onSlideChange = (swiper: any) => {
  activeIndex.value = swiper.realIndex
}

const goPrev = () => swiperRef.value?.slidePrev()
const goNext = () => swiperRef.value?.slideNext()
</script>

<style scoped>
.home-hero {
  position: relative;
  z-index: 1;
  padding: 2rem 0 3rem;
}

/* ── Grid Layout ── */
.hero-grid {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

/* ── Left: Content ── */
.hero-content {
  text-align: center;
}

@media (min-width: 1024px) {
  .hero-content {
    text-align: left;
  }
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.15;
  color: var(--color-gray-900, #0f172a);
  margin: 0 0 1rem;
}

@media (min-width: 640px) {
  .hero-title {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.25rem;
  }
}

.hero-highlight {
  background: linear-gradient(135deg, var(--color-primary-500, #00dc82), var(--color-primary-400, #34d399));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-accent {
  width: 4rem;
  height: 4px;
  border-radius: 9999px;
  background: var(--color-primary-500, #00dc82);
  margin: 0 auto 1.5rem;
}

@media (min-width: 1024px) {
  .hero-accent {
    margin: 0 0 1.5rem;
  }
}

.hero-description {
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--color-gray-500, #64748b);
  max-width: 540px;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  .hero-description {
    margin: 0 0 2rem;
  }
}

/* ── Buttons ── */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 1024px) {
  .hero-actions {
    justify-content: flex-start;
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: var(--color-primary-500, #00dc82);
  color: #fff;
  font-weight: 700;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: var(--color-gray-100, #f1f5f9);
  color: var(--color-gray-600, #475569);
  font-weight: 700;
  border-radius: 0.75rem;
  border: 1px solid var(--color-gray-200, #e2e8f0);
  text-decoration: none;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--color-gray-200, #e2e8f0);
}

.external-icon {
  width: 16px;
  height: 16px;
  opacity: 0.5;
}

/* ── Right: Carousel ── */
.hero-visual {
  position: relative;
  min-width: 0;
  width: 100%;
}

.carousel-glow {
  position: absolute;
  inset: -6px;
  background: linear-gradient(135deg, var(--color-primary-500, #00dc82), var(--color-primary-300, #6ee7b7));
  border-radius: 1.25rem;
  filter: blur(24px);
  opacity: 0.2;
  transition: opacity 0.6s;
  pointer-events: none;
}

.hero-visual:hover .carousel-glow {
  opacity: 0.35;
}

.carousel-frame {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--color-gray-200, #e2e8f0);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* ── Overlay + Bottom Bar ── */
.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%);
  pointer-events: none;
  z-index: 5;
}

.slide-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 10;
}

.caption-title {
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.caption-sub {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin: 0.15rem 0 0;
}

.slide-nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn svg {
  width: 18px;
  height: 18px;
}

/* ── Mobile adjustments ── */
@media (max-width: 1023px) {
  .hero-visual {
    max-width: 520px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .slide-bottom {
    padding: 0.75rem;
  }

  .caption-title {
    font-size: 0.9rem;
  }

  .nav-btn {
    width: 32px;
    height: 32px;
  }
}
</style>

<!-- Unscoped: Swiper internals + dark mode -->
<style>
/* ── Swiper image sizing (unscoped to reach Swiper internals) ── */
.hero-swiper .swiper-slide img {
  width: 100%;
  height: 340px;
  object-fit: cover;
  display: block;
}

@media (min-width: 1024px) {
  .hero-swiper .swiper-slide img {
    height: 380px;
  }
}

@media (max-width: 639px) {
  .hero-swiper .swiper-slide img {
    height: 240px;
  }
}

/* ── Dark mode ── */
html.dark .hero-title {
  color: #f1f5f9;
}

html.dark .hero-description {
  color: #94a3b8;
}

html.dark .btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

html.dark .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

html.dark .carousel-frame {
  border-color: rgba(255, 255, 255, 0.1);
}

html.dark .carousel-glow {
  opacity: 0.25;
}

html.dark .hero-visual:hover .carousel-glow {
  opacity: 0.4;
}
</style>
