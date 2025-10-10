# 🔄 未來評估項目

優先級：**P3** | 預計時間：**需要規劃**

這些任務需要更多評估和測試，建議在完成前面的任務後再考慮實施。

---

## 1. 評估升級 ESLint 到 v9

**狀態**：⏳ 待評估

### 問題描述

目前專案使用 ESLint 8.50.0，最新版本為 9.37.0：

- ESLint 9 引入了全新的 **Flat Config** 系統
- 與舊的 `.eslintrc.*` 配置不相容
- 需要重寫配置文件
- 部分插件可能尚未支援

### 影響範圍

- 🔧 **配置檔案**：需要完全重寫
- 📦 **插件相容性**：需確認所有插件支援
- 👥 **團隊學習成本**：新配置格式
- 🐛 **潛在問題**：升級風險

### 評估要點

#### 1. ESLint 9 的主要變更

**Flat Config 格式**：

```javascript
// eslint.config.js (新格式)
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      prettier
    },
    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'warn'
    }
  }
]
```

**vs 舊格式**：

```javascript
// .eslintrc.cjs (舊格式)
module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
    'plugin:prettier/recommended'
  ],
  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': 'warn'
  }
}
```

#### 2. 相容性檢查

需要確認的套件：

| 套件 | ESLint 9 支援 | 說明 |
|------|---------------|------|
| @nuxt/eslint-config | ✅ v1.0+ | 需升級到最新版 |
| eslint-plugin-vue | ✅ v9.0+ | 需升級 |
| eslint-plugin-prettier | ✅ v5.0+ | 需升級 |
| @typescript-eslint | ✅ v6.0+ | 需升級 |

#### 3. 遷移步驟（如果決定升級）

**Step 1: 檢查相容性**

```bash
# 檢查所有 ESLint 相關套件版本
npm ls eslint
npm ls eslint-plugin-*
```

**Step 2: 升級套件**

```bash
# 升級 ESLint 9
pnpm add -D eslint@^9.0.0

# 升級相關插件
pnpm add -D @nuxt/eslint-config@latest
pnpm add -D eslint-plugin-vue@^9.0.0
pnpm add -D eslint-plugin-prettier@^5.0.0
pnpm add -D @typescript-eslint/eslint-plugin@^6.0.0
pnpm add -D @typescript-eslint/parser@^6.0.0
```

**Step 3: 創建新配置**

創建 `eslint.config.js`：

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,

  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': 'warn'
  },

  ignores: [
    '.nuxt',
    '.output',
    'dist',
    'node_modules'
  ]
})
```

**Step 4: 移除舊配置**

```bash
rm .eslintrc.cjs .eslintignore
```

**Step 5: 測試**

```bash
pnpm run lint
pnpm run lint:fix
```

### 優缺點分析

#### 優點 ✅
- 🚀 更好的效能
- 📦 更簡潔的配置
- 🔧 更好的 TypeScript 支援
- 🎯 更精確的檔案匹配
- 📚 更好的 IDE 整合

#### 缺點 ❌
- 🔄 需要重寫所有配置
- 📦 部分插件可能不相容
- 📖 團隊需要學習新格式
- ⚠️ 可能引入不可預期的問題
- ⏱️ 遷移需要時間

### 建議

**暫緩升級，原因：**

1. **穩定性優先**
   - 目前 ESLint 8 運作正常
   - 升級風險大於收益
   - 團隊熟悉現有配置

2. **等待生態系成熟**
   - ESLint 9 相對較新（2024 年）
   - 部分插件可能仍在適配
   - 社群最佳實踐尚未完全形成

3. **時機選擇**
   - 建議等待 Nuxt 4 穩定後再一起升級
   - 或在完成其他重要任務後再評估

**如果決定升級，建議：**
- 在獨立分支測試
- 確保所有插件相容
- 完整測試所有檔案
- 準備回退方案

### 相關資料

- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [@antfu/eslint-config](https://github.com/antfu/eslint-config)

---

## 2. 評估主版本更新

**狀態**：⏳ 待評估

### 問題描述

多個核心套件有主版本更新：

| 套件 | 當前版本 | 最新版本 | 變更程度 |
|------|----------|----------|----------|
| nuxt | 3.7.4 | 4.1.2 | 🔴 Major |
| @nuxt/content | 2.9.0 | 3.7.1 | 🔴 Major |
| eslint | 8.50.0 | 9.37.0 | 🔴 Major |
| mermaid | 10.9.1 | 11.12.0 | 🔴 Major |
| @vueuse/core | 10.6.0 | 13.9.0 | 🔴 Major |
| zod | 3.22.4 | 4.1.11 | 🔴 Major |

### 評估重點

#### 1. Nuxt 3 → Nuxt 4

**主要變更**：
- Vue 3.5+ 要求
- 新的 Nitro 引擎
- 改進的 TypeScript 支援
- 更好的 ESM 支援
- 可能的 Breaking Changes

**影響評估**：
- 🟡 中等風險
- 需要完整測試
- 可能需要調整配置
- 插件相容性需確認

**遷移指南**：
- [Nuxt 4 Upgrade Guide](https://nuxt.com/docs/getting-started/upgrade#nuxt-4)

#### 2. @nuxt/content 2 → 3

**主要變更**：
- 全新的內容引擎
- 改進的 Markdown 處理
- 更好的效能
- API 可能有變更

**影響評估**：
- 🟡 中等風險
- 需檢查 API 變更
- 測試所有內容頁面
- 自訂組件可能需調整

#### 3. ESLint 8 → 9

參見上一個任務。

#### 4. Mermaid 10 → 11

**主要變更**：
- 新的圖表類型
- 改進的渲染引擎
- 可能的語法變更

**影響評估**：
- 🟢 低風險
- 主要是新功能
- 向後相容性好
- 需測試現有圖表

#### 5. @vueuse/core 10 → 13

**主要變更**：
- Vue 3.3+ 要求
- 新的 composables
- 部分 API 改進

**影響評估**：
- 🟡 中等風險
- 需確認使用的 API
- TypeScript 類型可能變更

#### 6. Zod 3 → 4

**主要變更**：
- 新的驗證 API
- 效能改進
- Breaking changes

**影響評估**：
- 🟡 中等風險
- 需檢查所有 schema
- 錯誤訊息格式可能改變

### 升級策略

#### 分階段升級（推薦）

**第一階段：低風險套件**
```bash
pnpm add mermaid@^11.0.0
pnpm add reading-time@latest
```

**第二階段：中等風險套件**
```bash
pnpm add @vueuse/core@^13.0.0
pnpm add zod@^4.0.0
```

**第三階段：核心框架（謹慎）**
```bash
pnpm add nuxt@^4.0.0
pnpm add @nuxt/content@^3.0.0
```

#### 測試檢查清單

每次升級後都需要完整測試：

- [ ] `pnpm install` 成功
- [ ] `pnpm run dev` 啟動正常
- [ ] 所有頁面載入正常
- [ ] 內容渲染正確
- [ ] 圖片顯示正常
- [ ] Mermaid 圖表渲染
- [ ] 數學公式渲染
- [ ] 搜尋功能
- [ ] 導航功能
- [ ] `pnpm run build` 建置成功
- [ ] `pnpm run generate` 生成成功
- [ ] GitHub Actions 通過

### 建議時程

**建議等待以下條件滿足後再升級：**

1. **完成前期任務**
   - ✅ 緊急修復完成
   - ✅ 小版本更新完成
   - ✅ 開發流程優化完成

2. **技術成熟度**
   - Nuxt 4 穩定版發布（目前可能還在 RC）
   - @nuxt/content 3 社群回饋良好
   - 主要插件都支援新版本

3. **團隊準備**
   - 有充足時間測試
   - 可以處理可能的問題
   - 有回退計畫

### 回退方案

升級前務必：

```bash
# 創建升級分支
git checkout -b upgrade/major-versions

# 備份 package.json
cp package.json package.json.backup

# 升級並測試
pnpm add <package>@latest

# 如果有問題，快速回退
git checkout package.json package-lock.json
pnpm install
```

### 相關資料

- [Nuxt 4 Roadmap](https://nuxt.com/docs/getting-started/upgrade)
- [@nuxt/content v3](https://content.nuxt.com/)
- [VueUse Migration Guide](https://vueuse.org/guide/)
- [Zod v4 Changes](https://github.com/colinhacks/zod/releases)

---

## 3. 考慮加入 PWA 支援

**狀態**：⏳ 待評估

### 問題描述

目前網站不支援 Progressive Web App (PWA) 功能：

- ❌ 無法離線瀏覽
- ❌ 無法安裝到桌面/主畫面
- ❌ 缺少 Service Worker
- ❌ 缺少 Web App Manifest

### 可能收益

#### 優點 ✅

1. **離線體驗**
   - 📱 離線也能閱讀已瀏覽過的內容
   - 🚀 更快的載入速度（Service Worker 快取）
   - 📶 弱網環境下更好的體驗

2. **使用者體驗**
   - 🏠 可安裝到主畫面（類 App 體驗）
   - 🔔 支援推送通知（可選）
   - 📲 更接近原生 App 的使用體驗

3. **SEO 優勢**
   - 🔍 Google 偏好 PWA 網站
   - ⚡ Lighthouse 分數提升
   - 📊 更好的用戶留存率

#### 缺點 ❌

1. **技術複雜度**
   - 🔧 Service Worker 配置複雜
   - 🐛 快取策略需要仔細設計
   - 📝 更新機制需要處理

2. **維護成本**
   - ⚙️ 需要維護 Service Worker
   - 🔄 內容更新需要考慮快取
   - 🧪 測試成本增加

3. **對靜態網站的必要性**
   - ❓ 內容更新不頻繁，離線意義有限
   - ❓ 是否真的需要安裝到主畫面
   - ❓ 推送通知可能用不到

### 實作評估

#### 方案：使用 @vite-pwa/nuxt

```bash
pnpm add -D @vite-pwa/nuxt
```

**配置範例**：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@vite-pwa/nuxt'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '摳Sense讀書會筆記',
      short_name: 'Code Sense',
      description: '高雄技術讀書會學習筆記',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 年
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 天
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
```

### 建議決策流程

#### 問自己這些問題：

1. **使用者需求**
   - 👥 使用者是否常在弱網環境下訪問？
   - 📱 使用者是否希望安裝到主畫面？
   - 📖 離線閱讀是否是重要需求？

2. **內容特性**
   - 📚 內容更新頻率如何？
   - 📄 內容量是否適合快取？
   - 🔄 即時性要求高嗎？

3. **技術資源**
   - 👨‍💻 團隊是否有 PWA 經驗？
   - ⏱️ 是否有時間維護 Service Worker？
   - 🧪 是否有資源測試 PWA 功能？

### 初步建議

**暫時不實作 PWA，原因：**

1. **優先級較低**
   - 內容網站，即時性不是核心需求
   - 使用者主要在有網路環境下閱讀
   - 更緊急的任務待完成

2. **成本效益**
   - 實作和維護成本相對較高
   - 對核心功能提升有限
   - 可以在未來再評估

3. **替代方案**
   - 優先優化載入速度
   - 使用圖片優化減少流量
   - 改善快取策略

**如果未來要實作，建議時機：**
- ✅ 所有核心功能都已完善
- ✅ 網站效能已優化到位
- ✅ 有明確的使用者需求
- ✅ 團隊有足夠資源維護

### 最小化實作（如果決定要做）

只實作最基本的 PWA 功能：

```typescript
pwa: {
  manifest: {
    name: '摳Sense讀書會筆記',
    short_name: 'Code Sense',
    theme_color: '#ffffff'
  },
  workbox: {
    // 只快取靜態資源
    globPatterns: ['**/*.{js,css,html}']
  }
}
```

### 相關資料

- [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt.html)
- [PWA Best Practices](https://web.dev/pwa-checklist/)
- [Workbox](https://developer.chrome.com/docs/workbox/)

---

## 評估總結

### 建議優先順序

1. **暫緩項目**（目前不建議執行）
   - ⏸️ ESLint 9 升級
   - ⏸️ 主版本套件升級
   - ⏸️ PWA 支援

2. **監控項目**（持續關注，條件成熟時執行）
   - 👀 追蹤 Nuxt 4 穩定性
   - 👀 關注 ESLint 9 社群反饋
   - 👀 收集 PWA 需求反饋

3. **替代方案**（優先執行這些）
   - ✅ 完成小版本更新（安全且低風險）
   - ✅ 優化效能（實際改善使用體驗）
   - ✅ 改善 SEO（提升可發現性）
   - ✅ 完善開發流程（提升效率）

### 決策建議

**何時重新評估這些項目：**

- 📅 **3 個月後**：檢查 Nuxt 4 和相關生態系的成熟度
- 📅 **6 個月後**：評估是否需要 PWA 功能
- 📅 **技術債務審查時**：定期檢視是否需要主版本升級

**觸發條件：**
- Nuxt 4 成為 LTS 版本
- 團隊完成所有 P0-P2 任務
- 有明確的業務需求
- 發現安全漏洞需要升級

---

## 完成檢查清單

### 評估任務
- [ ] 閱讀 ESLint 9 遷移指南
- [ ] 檢查所有套件的主版本變更
- [ ] 評估團隊對 PWA 的需求
- [ ] 制定升級路線圖（如決定升級）
- [ ] 定期重新評估（設定提醒）

---

**預計評估時間**：每項 1-2 小時
**優先級**：🔄 低（長期規劃）
**影響範圍**：技術棧現代化 + 長期維護性
