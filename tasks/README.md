# 專案改進任務清單

本資料夾包含了 code-study 專案的所有改進任務，按照優先級和類別進行組織。

## 📋 任務概覽

| 類別 | 文件 | 任務數 | 優先級 | 狀態 |
|------|------|--------|--------|------|
| 🔥 緊急修復 | [01-urgent-fixes.md](01-urgent-fixes.md) | 2 | P0 | 待處理 |
| ⚠️ 重要更新 | [02-important-updates.md](02-important-updates.md) | 2 | P1 | 待處理 |
| 🛠️ 開發體驗 | [03-dev-experience.md](03-dev-experience.md) | 3 | P2 | 待處理 |
| 📈 SEO與內容 | [04-seo-content.md](04-seo-content.md) | 2 | P2 | 待處理 |
| 🔄 未來評估 | [05-future-evaluation.md](05-future-evaluation.md) | 3 | P3 | 待處理 |
| 📖 閱讀體驗 | [06-reading-mode.md](06-reading-mode.md) | 1 | P2 | ✅ 已完成 |

## 🎯 建議執行順序

### 第一階段：立即修復（1-2 天）
優先處理會影響網站正常運作的緊急問題：
1. ✅ [修正 GitHub Actions 部署路徑錯誤](01-urgent-fixes.md#1-修正-github-actions-部署路徑錯誤)
2. ✅ [實作 Markdown 圖片縮放功能](01-urgent-fixes.md#2-實作-markdown-圖片縮放功能)

### 第二階段：安全更新（2-3 天）
更新依賴套件，確保安全性和穩定性：
1. ✅ [更新小版本依賴套件](02-important-updates.md#1-更新小版本依賴套件)
2. ✅ [安裝並配置圖片優化模組](02-important-updates.md#2-安裝並配置-nuxtimage-模組)

### 第三階段：改善開發流程（3-5 天）
提升團隊開發效率和程式碼品質：
1. ✅ [加入 Prettier 格式化工具](03-dev-experience.md#1-加入-prettier-格式化工具)
2. ✅ [設置 pre-commit hooks](03-dev-experience.md#2-設置-pre-commit-hooks)
3. ✅ [優化 GitHub Actions CI/CD](03-dev-experience.md#3-優化-github-actions-cicd)

### 第四階段：優化使用體驗（3-5 天）
改善 SEO 和內容組織：
1. ✅ [補充 SEO 和 sitemap](04-seo-content.md#1-補充-seo-meta-tags-和-sitemap)
2. ✅ [改善內容 metadata](04-seo-content.md#2-改善內容-metadata)

### 第五階段:閱讀體驗優化(1-2 天)
提升筆記閱讀體驗:
1. ✅ [專注閱讀模式](06-reading-mode.md) - ✅ **已完成**


### 第六階段：長期規劃評估（需要規劃）
評估主要版本升級和新功能：
1. ✅ [評估 ESLint 升級](05-future-evaluation.md#1-評估升級-eslint-到-v9)
2. ✅ [評估主版本更新](05-future-evaluation.md#2-評估主版本更新)
3. ✅ [考慮 PWA 支援](05-future-evaluation.md#3-考慮加入-pwa-支援)

## 📝 任務狀態說明

- **待處理** (⏳) - 尚未開始
- **進行中** (🔄) - 正在執行
- **已完成** (✅) - 已完成並驗證
- **已擱置** (⏸️) - 暫時擱置
- **已取消** (❌) - 決定不執行

## 🔍 快速連結

### 緊急問題
- [修正部署路徑錯誤](01-urgent-fixes.md#1-修正-github-actions-部署路徑錯誤) - 導致 GitHub Pages 部署失敗
- [圖片無法縮放](01-urgent-fixes.md#2-實作-markdown-圖片縮放功能) - 影響閱讀體驗

### 安全更新
- [依賴套件過時](02-important-updates.md#1-更新小版本依賴套件) - 存在安全風險
- [圖片未優化](02-important-updates.md#2-安裝並配置-nuxtimage-模組) - 影響載入速度

### 開發改善
- [缺少格式化工具](03-dev-experience.md#1-加入-prettier-格式化工具) - 程式碼風格不一致
- [缺少 Git hooks](03-dev-experience.md#2-設置-pre-commit-hooks) - 無法自動檢查程式碼品質
- [CI/CD 效能差](03-dev-experience.md#3-優化-github-actions-cicd) - 建置時間過長

## 📊 進度追蹤

更新日期：2025-10-06

- 總任務數：**12**
- 已完成：**0**
- 進行中：**0**
- 待處理：**12**

## 💡 使用說明

1. **查看任務詳情**：點擊對應的 Markdown 文件查看完整說明
2. **更新任務狀態**：完成任務後，在對應文件中更新狀態
3. **新增任務**：在對應類別的文件中新增任務，並更新此 README
4. **追蹤進度**：定期更新進度追蹤區塊

## 🔗 相關資源

- [專案 README](../README.md)
- [CLAUDE.md - AI 開發指南](../CLAUDE.md)
- [Nuxt 3 文檔](https://nuxt.com)
- [Docus 主題文檔](https://docus.dev)
