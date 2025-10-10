# 📈 SEO 與內容改善任務

優先級：**P2** | 預計時間：**3-5 天**

## 1. 補充 SEO meta tags 和 sitemap

**狀態**：⏳ 待處理

### 問題描述

目前網站 SEO 配置不完整：

- ❌ 缺少完整的 meta tags（description, keywords, og tags 等）
- ❌ 沒有自動生成 sitemap.xml
- ❌ 缺少結構化資料（JSON-LD）
- ❌ 沒有 robots.txt 配置
- ❌ 缺少 canonical URL 設定

**現況**：
```typescript
// app.config.ts - 只有基本配置
{
  title: "摳Sense讀書會筆記",
  description: "The best place to start your documentation.",
  image: "..."
}
```

### 影響範圍

- 🔍 **搜尋引擎排名**：無法被有效索引
- 📱 **社交分享**：缺少 Open Graph 預覽
- 👥 **流量**：搜尋流量少
- 📊 **可發現性**：內容難以被找到

### 解決方案

1. 完善 SEO meta tags 配置
2. 安裝 sitemap 模組自動生成 sitemap.xml
3. 加入結構化資料
4. 配置 robots.txt

### 實作步驟

#### 1. 安裝 SEO 相關模組

```bash
pnpm add -D @nuxtjs/sitemap @nuxtjs/robots
```

#### 2. 更新 nuxt.config.ts

```typescript
export default defineNuxtConfig({
  // ... 現有配置

  modules: [
    '@nuxt-themes/docus',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  // SEO 配置
  site: {
    url: 'https://codesensegroup.github.io/code-study',
    name: '摳Sense讀書會筆記'
  },

  // Sitemap 配置
  sitemap: {
    strictNuxtContentPaths: true,
    exclude: [
      '/api/**'
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.7
    }
  },

  // Robots.txt 配置
  robots: {
    UserAgent: '*',
    Disallow: '/api',
    Sitemap: 'https://codesensegroup.github.io/code-study/sitemap.xml'
  },

  // 全域 SEO 設定
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-TW'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'referrer', content: 'no-referrer-when-downgrade' },

        // 基本 SEO
        { name: 'author', content: 'Code Sense Study Group' },
        { name: 'keywords', content: '讀書會,技術分享,Clean Architecture,DDIA,CI/CD,軟體工程,高雄,程式設計' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '摳Sense讀書會筆記' },
        { property: 'og:locale', content: 'zh_TW' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@codesense' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
```

#### 3. 為內容頁面加入 SEO meta

創建 `composables/useSEO.ts`：

```typescript
export const useSEO = (options: {
  title: string
  description?: string
  image?: string
  article?: boolean
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
}) => {
  const config = useRuntimeConfig()
  const route = useRoute()

  const baseUrl = config.public.baseURL || 'https://codesensegroup.github.io/code-study'
  const fullUrl = `${baseUrl}${route.path}`

  const defaultDescription = '高雄 Code Sense 讀書會的技術學習筆記，涵蓋 Clean Architecture、DDIA、CI/CD 等主題'
  const defaultImage = `${baseUrl}/images/og-default.png`

  const seoTitle = options.title ? `${options.title} - 摳Sense讀書會筆記` : '摳Sense讀書會筆記'
  const seoDescription = options.description || defaultDescription
  const seoImage = options.image || defaultImage

  useHead({
    title: seoTitle,
    meta: [
      // 基本 meta
      { name: 'description', content: seoDescription },

      // Open Graph
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:image', content: seoImage },
      { property: 'og:url', content: fullUrl },
      { property: 'og:type', content: options.article ? 'article' : 'website' },

      // Twitter Card
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: seoImage },

      // Article meta
      ...(options.article ? [
        { property: 'article:published_time', content: options.publishedTime },
        { property: 'article:modified_time', content: options.modifiedTime },
        ...(options.authors?.map(author => ({ property: 'article:author', content: author })) || []),
        ...(options.tags?.map(tag => ({ property: 'article:tag', content: tag })) || [])
      ] : [])
    ],
    link: [
      { rel: 'canonical', href: fullUrl }
    ]
  })

  // 結構化資料
  if (options.article) {
    useSchemaOrg([
      defineArticle({
        headline: options.title,
        description: seoDescription,
        image: seoImage,
        datePublished: options.publishedTime,
        dateModified: options.modifiedTime,
        author: options.authors?.map(name => ({
          '@type': 'Person',
          name
        }))
      })
    ])
  }
}
```

#### 4. 在內容頁面使用

創建 `pages/[...slug].vue`（如果不存在）：

```vue
<template>
  <ContentDoc>
    <template #default="{ doc }">
      <article>
        <h1>{{ doc.title }}</h1>
        <ContentRenderer :value="doc" />
      </article>
    </template>
  </ContentDoc>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne()
)

if (page.value) {
  useSEO({
    title: page.value.title,
    description: page.value.description,
    article: true,
    publishedTime: page.value.publishedAt,
    modifiedTime: page.value.updatedAt,
    authors: page.value.contributors || ['Code Sense Study Group'],
    tags: page.value.tags
  })
}
</script>
```

#### 5. 創建 OG 圖片（可選但建議）

在 `public/images/` 創建：
- `og-default.png` - 預設 OG 圖片（1200x630px）
- `og-clean-arch.png` - Clean Architecture 系列
- `og-ddia.png` - DDIA 系列
- `og-cicd.png` - CI/CD 系列

或使用動態 OG 圖片生成：

```typescript
// server/api/og-image.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const title = query.title as string

  // 使用 @vercel/og 或類似服務生成圖片
  // 返回動態生成的 OG 圖片
})
```

#### 6. 加入結構化資料

在 `app.vue` 或佈局中加入網站級別的結構化資料：

```vue
<script setup lang="ts">
useSchemaOrg([
  defineWebSite({
    name: '摳Sense讀書會筆記',
    description: '高雄技術讀書會的學習筆記分享',
    url: 'https://codesensegroup.github.io/code-study'
  }),
  defineOrganization({
    name: 'Code Sense Study Group',
    logo: '/images/logo.png',
    url: 'https://codesensegroup.github.io/code-study',
    sameAs: [
      'https://github.com/codesensegroup'
    ]
  })
])
</script>
```

### SEO Checklist

#### 基本 SEO
- [ ] 所有頁面有唯一的 title
- [ ] 所有頁面有 meta description
- [ ] 使用語意化 HTML 標籤
- [ ] 圖片有 alt 屬性
- [ ] 有 robots.txt
- [ ] 有 sitemap.xml

#### Open Graph
- [ ] og:title
- [ ] og:description
- [ ] og:image（1200x630px）
- [ ] og:url
- [ ] og:type
- [ ] og:site_name
- [ ] og:locale

#### Twitter Card
- [ ] twitter:card
- [ ] twitter:title
- [ ] twitter:description
- [ ] twitter:image

#### 技術 SEO
- [ ] Canonical URL
- [ ] 語言設定（lang="zh-TW"）
- [ ] 結構化資料（JSON-LD）
- [ ] 移動裝置友善
- [ ] HTTPS
- [ ] 載入速度優化

### 驗證方式

#### 1. SEO 檢查工具

```bash
# 安裝 SEO 檢查工具
pnpm add -D @nuxtjs/seo-kit

# 本地檢查
pnpm run generate
pnpm run preview

# 使用線上工具檢查
```

**線上工具**：
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

#### 2. Lighthouse SEO 分數

```bash
# 安裝 Lighthouse CI
pnpm add -D @lhci/cli

# 執行 Lighthouse
pnpm dlx @lhci/cli@0.12.x autorun
```

目標分數：
- **SEO**: > 90
- **Performance**: > 85
- **Accessibility**: > 90
- **Best Practices**: > 90

#### 3. 檢查清單

- [ ] `sitemap.xml` 可存取
- [ ] `robots.txt` 可存取
- [ ] Meta tags 正確顯示
- [ ] OG 預覽正常（Facebook、Twitter、LinkedIn）
- [ ] 結構化資料通過驗證
- [ ] Google Search Console 索引正常

### 測試步驟

1. **本地測試**
   ```bash
   pnpm run generate
   pnpm run preview
   # 訪問 http://localhost:3000/sitemap.xml
   # 訪問 http://localhost:3000/robots.txt
   ```

2. **Meta Tags 檢查**
   - 開啟瀏覽器開發者工具
   - 檢查 `<head>` 中的 meta tags
   - 確認所有 meta 標籤正確

3. **社交分享測試**
   - 使用 Facebook Debugger 測試
   - 使用 Twitter Card Validator 測試
   - 確認預覽圖片和文字正確

4. **Sitemap 驗證**
   - 訪問 `/sitemap.xml`
   - 確認所有頁面都包含
   - 檢查 URL 格式正確

### 相關檔案

- [nuxt.config.ts](../nuxt.config.ts) - SEO 主要配置
- [composables/useSEO.ts](../composables/useSEO.ts) - SEO composable（新建）
- [app.vue](../app.vue) - 全域結構化資料
- [public/robots.txt](../public/robots.txt) - 自動生成
- [public/sitemap.xml](../public/sitemap.xml) - 自動生成

### 參考資料

- [@nuxtjs/sitemap](https://nuxtseo.com/sitemap/getting-started)
- [@nuxtjs/robots](https://nuxtseo.com/robots/getting-started)
- [Nuxt SEO](https://nuxtseo.com/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)

---

## 2. 改善內容 metadata

**狀態**：⏳ 待處理

### 問題描述

目前內容文件的 frontmatter metadata 不完整：

**現況**：
```markdown
---
title: "01 什麼是設計與結構"
pageTitle: "Chapter 1 什麼是設計與結構"
contributors: ["changemyminds"]
---
```

**缺少的資訊**：
- ❌ 內容描述（description）
- ❌ 標籤分類（tags）
- ❌ 發布日期（publishedAt）
- ❌ 更新日期（updatedAt）
- ❌ 閱讀時間（readingTime）
- ❌ 難度等級（level）
- ❌ 系列資訊（series）

### 影響範圍

- 🔍 **SEO**：缺少 meta description
- 🏷️ **分類**：無法按標籤篩選
- 📊 **內容管理**：難以組織和檢索
- 👥 **使用者體驗**：缺少內容預覽資訊

### 解決方案

1. 定義標準的 frontmatter schema
2. 為現有內容補充 metadata
3. 創建內容索引和標籤系統
4. 實作標籤篩選功能

### 實作步驟

#### 1. 定義 Frontmatter Schema

創建 `types/content.ts`：

```typescript
export interface ArticleMeta {
  title: string
  description: string
  pageTitle?: string

  // 作者資訊
  contributors: string[]

  // 分類標籤
  tags: string[]
  category: 'book' | 'workshop' | 'article'

  // 系列資訊
  series?: string
  seriesOrder?: number

  // 時間資訊
  publishedAt: string
  updatedAt?: string

  // 難度等級
  level?: 'beginner' | 'intermediate' | 'advanced'

  // 閱讀時間（分鐘）
  readingTime?: number

  // SEO
  keywords?: string[]
  image?: string

  // 其他
  draft?: boolean
  featured?: boolean
}
```

#### 2. 標準 Frontmatter 範本

```yaml
---
# 基本資訊
title: "章節標題"
description: "這一章節主要介紹..."
pageTitle: "完整標題 - 系列名稱"

# 作者
contributors:
  - changemyminds
  - spyua

# 分類
category: book
tags:
  - Clean Architecture
  - 軟體設計
  - 程式架構

# 系列
series: "Clean Architecture 讀書筆記"
seriesOrder: 1

# 時間
publishedAt: 2024-01-15
updatedAt: 2024-03-20

# 難度
level: intermediate

# SEO
keywords:
  - 軟體架構
  - 系統設計
  - Clean Code
image: /images/clean-arch/chapter1-og.png

# 狀態
draft: false
featured: true
---
```

#### 3. 批次更新現有內容

創建腳本 `scripts/update-frontmatter.ts`：

```typescript
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

const contentDir = './content'

// 類別對應
const categoryMap: Record<string, { category: string; series: string; tags: string[] }> = {
  '6.clean-arch': {
    category: 'book',
    series: 'Clean Architecture 讀書筆記',
    tags: ['Clean Architecture', '軟體架構', '程式設計']
  },
  '5.ddia': {
    category: 'book',
    series: 'DDIA 讀書筆記',
    tags: ['DDIA', '資料密集型應用', '系統設計']
  },
  '4.cicd-2.0': {
    category: 'book',
    series: 'CI/CD 2.0 讀書筆記',
    tags: ['CI/CD', 'DevOps', '持續交付']
  },
  '2.workshop': {
    category: 'workshop',
    series: '技術分享',
    tags: ['技術分享', '實作']
  }
}

async function updateFrontmatter(filePath: string, dirName: string) {
  const content = await readFile(filePath, 'utf-8')
  const { data, content: body } = matter(content)

  const dirConfig = categoryMap[dirName]
  const match = filePath.match(/(\d+)\.chapter(\d+)\.md/)
  const chapterNum = match ? parseInt(match[2]) : undefined

  // 補充缺少的欄位
  const updatedData = {
    ...data,
    description: data.description || `${dirConfig.series} 第 ${chapterNum} 章學習筆記`,
    category: data.category || dirConfig.category,
    tags: data.tags || dirConfig.tags,
    series: data.series || dirConfig.series,
    seriesOrder: data.seriesOrder || chapterNum,
    publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
    level: data.level || 'intermediate',
    draft: data.draft ?? false
  }

  const newContent = matter.stringify(body, updatedData)
  await writeFile(filePath, newContent, 'utf-8')
}

// 執行更新
async function main() {
  for (const [dirName, config] of Object.entries(categoryMap)) {
    const dirPath = join(contentDir, dirName)
    const files = await readdir(dirPath)

    for (const file of files) {
      if (file.endsWith('.md') && !file.startsWith('_')) {
        await updateFrontmatter(join(dirPath, file), dirName)
        console.log(`✅ Updated: ${dirName}/${file}`)
      }
    }
  }
}

main()
```

執行腳本：
```bash
pnpm add -D gray-matter
pnpm tsx scripts/update-frontmatter.ts
```

#### 4. 實作標籤系統

創建 `pages/tags/index.vue`：

```vue
<template>
  <div class="tags-page">
    <h1>所有標籤</h1>
    <div class="tags-cloud">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.name"
        :to="`/tags/${tag.slug}`"
        class="tag-item"
        :style="{ fontSize: `${tag.size}rem` }"
      >
        {{ tag.name }} ({{ tag.count }})
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData('all-articles', () =>
  queryContent().find()
)

const tags = computed(() => {
  const tagMap = new Map<string, number>()

  articles.value?.forEach(article => {
    article.tags?.forEach((tag: string) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count,
      size: Math.min(1 + count * 0.2, 3) // 字體大小基於出現次數
    }))
    .sort((a, b) => b.count - a.count)
})
</script>
```

創建 `pages/tags/[tag].vue`：

```vue
<template>
  <div class="tag-page">
    <h1>標籤: {{ tag }}</h1>
    <div class="articles-list">
      <ArticleCard
        v-for="article in articles"
        :key="article._path"
        :article="article"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tag = route.params.tag as string

const { data: articles } = await useAsyncData(`tag-${tag}`, () =>
  queryContent()
    .where({ tags: { $contains: tag } })
    .sort({ publishedAt: -1 })
    .find()
)
</script>
```

#### 5. 創建文章卡片組件

創建 `components/ArticleCard.vue`：

```vue
<template>
  <article class="article-card">
    <NuxtLink :to="article._path" class="card-link">
      <NuxtImg
        v-if="article.image"
        :src="article.image"
        :alt="article.title"
        class="card-image"
      />

      <div class="card-content">
        <div class="card-meta">
          <span class="category">{{ article.category }}</span>
          <span v-if="article.readingTime" class="reading-time">
            📖 {{ article.readingTime }} 分鐘
          </span>
        </div>

        <h3 class="card-title">{{ article.title }}</h3>
        <p class="card-description">{{ article.description }}</p>

        <div class="card-footer">
          <div class="tags">
            <span
              v-for="tag in article.tags?.slice(0, 3)"
              :key="tag"
              class="tag"
            >
              #{{ tag }}
            </span>
          </div>

          <time class="date">{{ formatDate(article.publishedAt) }}</time>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  article: any
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
```

#### 6. 加入閱讀時間計算

在 `server/plugins/content.ts` 中加入：

```typescript
import readingTime from 'reading-time'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:afterParse', (file: any) => {
    if (file._id.endsWith('.md')) {
      // 現有的圖片路徑處理
      visit(file.body, (n: any) => n.tag === 'img', (node) => {
        if (node.props && node.props.src.startsWith('images/')) {
          node.props.src = path.join(baseUrl, node.props.src)
        }
      })

      // 計算閱讀時間
      if (!file.readingTime) {
        const stats = readingTime(file.body.children.map((n: any) =>
          n.type === 'text' ? n.value : ''
        ).join(' '))

        file.readingTime = Math.ceil(stats.minutes)
      }
    }
  })
})
```

### 內容組織架構

#### 建議的標籤分類

**技術分類**：
- Clean Architecture
- DDIA
- CI/CD
- Web API
- 系統設計
- 軟體架構

**主題分類**：
- 程式設計
- DevOps
- 資料庫
- 分散式系統
- 測試
- 重構

**難度分類**：
- 入門 (beginner)
- 中級 (intermediate)
- 進階 (advanced)

### 驗證方式

- [ ] 所有文章都有 description
- [ ] 所有文章都有適當的 tags
- [ ] 標籤頁面正常運作
- [ ] 文章卡片顯示完整資訊
- [ ] 閱讀時間計算正確
- [ ] 可以按標籤篩選文章
- [ ] SEO meta 正確生成

### 相關檔案

- [types/content.ts](../types/content.ts) - Content schema（新建）
- [scripts/update-frontmatter.ts](../scripts/update-frontmatter.ts) - 批次更新腳本（新建）
- [pages/tags/index.vue](../pages/tags/index.vue) - 標籤列表頁（新建）
- [pages/tags/[tag].vue](../pages/tags/[tag].vue) - 標籤詳情頁（新建）
- [components/ArticleCard.vue](../components/ArticleCard.vue) - 文章卡片（新建）
- [server/plugins/content.ts](../server/plugins/content.ts) - 內容處理（修改）

### 參考資料

- [Nuxt Content - Front Matter](https://content.nuxt.com/usage/markdown#front-matter)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [reading-time](https://github.com/ngryman/reading-time)

---

## 完成檢查清單

### Task 1: SEO 和 Sitemap
- [ ] 安裝 @nuxtjs/sitemap 和 @nuxtjs/robots
- [ ] 更新 nuxt.config.ts SEO 配置
- [ ] 創建 useSEO composable
- [ ] 更新內容頁面使用 SEO
- [ ] 創建 OG 圖片
- [ ] 加入結構化資料
- [ ] 測試 sitemap.xml 和 robots.txt
- [ ] 驗證 meta tags
- [ ] 社交分享測試
- [ ] Lighthouse SEO 測試
- [ ] 提交變更

### Task 2: 內容 Metadata
- [ ] 定義 Frontmatter Schema
- [ ] 創建標準範本
- [ ] 安裝 gray-matter
- [ ] 創建批次更新腳本
- [ ] 執行腳本更新內容
- [ ] 實作標籤系統頁面
- [ ] 創建文章卡片組件
- [ ] 加入閱讀時間計算
- [ ] 測試標籤篩選功能
- [ ] 驗證所有 metadata
- [ ] 提交變更

---

**預計完成時間**：3-5 個工作天
**優先級**：📈 中
**影響範圍**：SEO + 內容組織 + 使用者體驗
