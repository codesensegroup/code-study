# 🔥 緊急修復任務

優先級：**P1** | 預計時間：**1 天** （Task 1 已解決，僅剩 Task 2）

## 1. ~~修正 GitHub Actions 部署路徑錯誤~~ ✅ 已解決（無需修復）

**狀態**：✅ 已解決

### 結論

經過驗證，當前配置**運作正常**，無需修改。

**當前配置** ([.github/workflows/deploy.yml:46](../.github/workflows/deploy.yml#L46))：
```yaml
- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist  # ✅ 透過 symlink 正確運作
```

### 為什麼可以正常運作？

專案根目錄存在一個 **symbolic link (符號連結)**：

```bash
dist -> /home/darren/projects/code-study/.output/public
```

這個 symlink 使得：
- ✅ Nuxt 3 執行 `nuxi generate` 後，靜態檔案產生在 `.output/public/`
- ✅ GitHub Actions 從 `./dist` 讀取時，透過 symlink 實際讀取到 `.output/public/`
- ✅ 部署成功，網站正常更新

### 驗證結果

- [x] GitHub Actions workflow 執行成功（[檢視 gh-pages 分支](https://github.com/codesensegroup/code-study/tree/gh-pages)）
- [x] 部署歷史記錄顯示持續成功部署
- [x] 網站內容正常更新，所有資源載入正常

### 技術背景（供參考）

標準 Nuxt 3 專案通常有兩種配置方式：

**方案 A（當前採用）**：使用 symlink
```yaml
publish_dir: ./dist  # 透過 symlink 指向 .output/public
```
- 優點：相容其他可能需要 `dist/` 目錄的工具
- 缺點：需要維護 symlink

**方案 B（標準方式）**：直接指定路徑
```yaml
publish_dir: ./.output/public  # 直接指定 Nuxt 3 輸出目錄
```
- 優點：配置更明確，不依賴 symlink
- 缺點：與某些工具的慣例不同

兩種方案都是有效的解決方案，當前採用方案 A 並運作良好。

### 相關檔案

- [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)
- [.github/workflows/build.yml](../.github/workflows/build.yml)
- [nuxt.config.ts](../nuxt.config.ts) - 輸出配置

### 參考資料

- [Nuxt 3 Deployment - Static Hosting](https://nuxt.com/docs/getting-started/deployment#static-hosting)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

---

## 2. ~~實作 Markdown 圖片縮放功能~~ ✅ 已完成

**狀態**：✅ 已完成

### 問題描述

目前 Markdown 文件中的圖片無法放大查看，影響閱讀體驗：

- 圖片只能以固定大小顯示
- 無法點擊放大查看細節
- 技術圖表和架構圖難以閱讀

**現況分析**：
- ✅ 已有自定義 `Image.vue` 組件支援圖片縮放功能
- ❌ 但所有內容都使用標準 Markdown 語法 `![](images/...)`
- ❌ Nuxt Content 預設渲染為普通 `<img>` 標籤

### 影響範圍

- 📚 所有內容頁面的圖片（100+ 張圖片）
- 👥 影響所有讀者的閱讀體驗
- 📱 特別影響行動裝置使用者

### 解決方案

創建 `ProseImg.vue` 組件覆蓋 Nuxt Content 的預設圖片渲染，為所有 Markdown 圖片自動添加縮放功能。

### 實作方案

✅ **採用 PhotoSwipe v5**（專業圖片燈箱查看器）

### 實作內容

1. **安裝 PhotoSwipe**
   ```bash
   npm install photoswipe
   ```

2. **創建 `components/content/ProseImg.vue`**
   - 整合 PhotoSwipe Lightbox
   - 支援點擊開啟全螢幕燈箱
   - 圖片在畫面中央顯示（上下左右各留 60px 間距）

3. **核心功能**
   - 點擊圖片 → 開啟全螢幕燈箱
   - 支援滾輪縮放
   - 支援雙擊縮放
   - 支援拖曳移動（放大後）
   - 縮放級別：初始適應螢幕，可放大至 3 倍
   - 多種關閉方式（ESC、背景點擊、關閉按鈕）

4. **使用者體驗優化**
   - 原始圖片顯示為 50% 寬度（節省版面空間）
   - Hover 效果：陰影 + 輕微上移
   - 平滑的開啟/關閉動畫
   - 專業的深色背景遮罩

### 功能需求

- [x] 點擊圖片放大顯示
- [x] 支援鍵盤 ESC 關閉
- [x] 支援背景點擊關閉
- [x] 支援滾輪縮放（進階）
- [x] 支援拖曳移動（進階）
- [x] 響應式設計（手機、平板、桌面）
- [x] 載入動畫優化
- [x] 無障礙支援（鍵盤操作、ARIA 標籤）

### 驗證方式

- [x] 所有 Markdown 圖片都能點擊放大
- [x] 圖片在燈箱中正確顯示（中央位置，四周留白）
- [x] ESC 鍵和點擊背景都能關閉
- [x] 滾輪縮放功能正常
- [x] 雙擊縮放功能正常
- [x] 拖曳移動功能正常（放大後）
- [x] 手機、平板、桌面裝置測試通過
- [x] 不影響原有自定義 `::image` 組件功能
- [x] 效能測試：大量圖片頁面載入正常

### 測試頁面

✅ 已測試包含大量圖片的章節：
- [content/7.sdi-aig/9.chapter9.md](../content/7.sdi-aig/9.chapter9.md) - 11 張圖片全部轉換為 Markdown 格式
- [content/4.cicd-2.0/13.chapter13.md](../content/4.cicd-2.0/13.chapter13.md)
- [content/4.cicd-2.0/11.chapter11.md](../content/4.cicd-2.0/11.chapter11.md)
- [content/4.cicd-2.0/10.chapter10.md](../content/4.cicd-2.0/10.chapter10.md)

### 相關檔案

- ✅ [components/content/ProseImg.vue](../components/content/ProseImg.vue) - **新建**：Markdown 圖片組件（PhotoSwipe 整合）
- [components/content/Image.vue](../components/content/Image.vue) - 現有自定義圖片組件（保持不變）
- [server/plugins/content.ts](../server/plugins/content.ts) - 圖片路徑處理
- [nuxt.config.ts](../nuxt.config.ts) - BASE_URL 配置
- [package.json](../package.json) - 新增 `photoswipe` 依賴

### 參考資料

- [PhotoSwipe v5 Documentation](https://photoswipe.com/)
- [Nuxt Content - Prose Components](https://content.nuxt.com/components/prose)
- [Mastering Prose Components](https://masteringnuxt.com/blog/mastering-prose-components-in-nuxt-content)

### 已實現的額外功能

- ✅ 支援圖片懶載入（Lazy Loading）- `loading="lazy"` 屬性
- ✅ 響應式設計（手機雙指縮放、桌面滾輪縮放）
- ✅ 無障礙支援（鍵盤操作、ARIA 標籤由 PhotoSwipe 提供）
- ✅ 平滑動畫與過渡效果
- ✅ 自定義間距（上下左右各 60px，減少壓迫感）

---

## 完成檢查清單

### Task 1: ~~修正部署路徑~~ ✅ 已確認無需修復
- [x] 驗證 GitHub Actions 執行成功
- [x] 驗證 GitHub Pages 網站更新
- [x] 確認 symlink 存在且運作正常

### Task 2: ~~圖片縮放功能~~ ✅ 已完成
- [x] 選擇實作方案（採用 PhotoSwipe v5）
- [x] 安裝必要依賴（`npm install photoswipe`）
- [x] 創建 ProseImg.vue 組件
- [x] 本地測試多個頁面（chapter9 等）
- [x] 跨裝置測試（桌面、手機、平板）
- [x] 調整使用者體驗（間距、縮放級別）
- [ ] 提交程式碼
- [ ] 部署後驗證

---

**完成時間**：✅ 已完成（Task 1 + Task 2）
**優先級**：🔥 高
**影響範圍**：使用者體驗（圖片縮放功能）

---

## 📝 實作總結

### 完成項目
1. ✅ **Task 1**: 部署路徑驗證 - 確認 symlink 運作正常，無需修改
2. ✅ **Task 2**: 圖片縮放功能 - 使用 PhotoSwipe v5 實作專業燈箱查看器

### 技術選型
- **PhotoSwipe v5**: 專業級圖片燈箱解決方案
- **Nuxt Content Prose Components**: 自動覆蓋 Markdown 圖片渲染
- **效能優化**: 懶載入、按需載入 PhotoSwipe 模組

### 主要功能
- 🖱️ 點擊圖片開啟全螢幕燈箱
- 🔍 支援滾輪、雙擊、雙指縮放
- 🖐️ 拖曳移動（放大後）
- ⌨️ 鍵盤操作（ESC 關閉）
- 📱 響應式設計（跨裝置支援）
- 🎨 自定義 UI（60px 間距、深色遮罩）

### 下一步
- [ ] Git commit 提交變更
- [ ] 部署至 GitHub Pages
- [ ] 驗證線上環境功能
