---
name: publish-notes-to-code-study
description: Migrate one or more local markdown notes (typically from C:\Users\USER\workspace\study-group\ or any other drafting folder) into the Nuxt-based reading-group documentation site at C:\Users\USER\workspace\code-study\, handling frontmatter injection, image asset relocation under public/images/, and image-path rewriting consistent with the site's Nitro content plugin. Trigger this skill when the user says any of: "把筆記搬到 code-study", "把 X 整併進 code-study / 讀書會 repo", "發布到讀書會站台", "publish my notes to the study site", "把這份 markdown 加入 8.2026-plan / 7.sdi-aig 等章節", or otherwise asks to take drafted markdown and put it on the site.
---

# publish-notes-to-code-study — 把草稿筆記搬上讀書會站台

你的任務：把使用者在本機資料夾（最常見是 `C:\Users\USER\workspace\study-group\`，但可以是任何路徑）寫好的 markdown 草稿，整併進 Nuxt 讀書會站台 `C:\Users\USER\workspace\code-study\`，依站台規範加 frontmatter、搬圖、改圖片路徑。

## 站台硬規範（不要違反）

1. **內容路徑**：`code-study/content/<N.section-slug>/`，目錄與檔名都用 `N.slug` 數字前綴控制側邊欄排序
2. **Frontmatter**（每份內容檔頂端必加）：
   ```yaml
   ---
   title: "短標題（側邊欄用）"
   pageTitle: "完整頁面標題（H1 用）"
   contributors: ["github-id-1", "github-id-2"]
   ---
   ```
3. **H1 處理**：原稿若以 `# 章節標題` 開頭，**移除該行**，由 `pageTitle` 接管，避免重複
4. **圖片資產**：放 `code-study/public/images/<topic>/<sub>/...`，markdown 內以 `images/<topic>/<sub>/foo.png` 引用（**相對路徑、無前導斜線**）
5. **BASE_URL 自動處理**：`code-study/server/plugins/content.ts` 會在 build/runtime 把 `images/...` 開頭的圖片路徑加上 BASE_URL，**不要手動加 `/code-study/`**
6. **既有檔案不亂動**：若新增不會撞號就不要動既有編號；要插入大量內容時優先用「子目錄」方案而不是大規模 renumber
7. **`_dir.yml`**：每個目錄需有，欄位 `title`、`icon`（emoji）、可選 `group: 'current'`

## 工作流程

### 階段 1 — 釐清需求

向使用者確認以下幾項（用 AskUserQuestion 一次問清楚，缺哪幾項問哪幾項）：

1. **來源路徑**：哪個資料夾？哪幾份 `.md`？（預設 `C:\Users\USER\workspace\study-group\`）
2. **目標章節**：要進 `code-study/content/` 下的哪個章節？（列出 `content/` 既有目錄供選擇，或新建）
3. **是否使用子目錄**：把多份筆記收進子目錄（例：`8.2026-plan/section2/`）還是扁平加在章節下？子目錄較不易撞號，是預設首選。
4. **入口頁需求**：要不要產生一份 overview / index 頁？通常多份筆記建議要
5. **frontmatter contributors**：填什麼 GitHub ID？（可保留 `_____` 由使用者後填）
6. **GitHub-style emoji 標題與 icon**：`_dir.yml` 用什麼 icon？

### 階段 2 — 探勘與計畫

1. `ls` 來源資料夾與其 `images/`，確認檔案清單
2. `ls` `code-study/content/` 確認目標章節既有結構
3. 用 Grep 掃描每份原稿的 `images/imageN.png`（或任何圖片引用），建立「原稿 → 引用清單」對照表
4. 找出**未被引用的孤兒圖片**（不要搬）
5. 偵測潛在撞號：若新檔會撞既有編號，提出三種選項給使用者（子目錄／重編既有檔／插在尾端）
6. 把計畫摘要回報給使用者，至少包含：
   - 將建立的目錄與檔案清單
   - 每份原稿的圖片搬移 mapping（哪幾張 → 哪個子目錄）
   - 是否動到既有檔案（**預設零動既有**）

得到使用者確認後再進階段 3。

### 階段 3 — 執行

依以下順序執行（可批次但要依賴關係正確）：

1. **建目錄**：`mkdir -p` 內容子目錄與圖片子目錄
2. **複製圖片**：用 `cp` 把引用到的圖片搬到 `public/images/.../`，**只搬有被引用的**
3. **寫 `_dir.yml`**（若新建子目錄）
4. **生成內容檔**：對每份原稿做以下三件機械變更（用 bash here-doc + tail + sed 批次最快，見下方範例）：
   - 在最頂端注入 frontmatter
   - 移除原稿第一行 `# H1`（若有）以及其後一個空白行 → 用 `tail -n +3`
   - 圖片路徑替換 → 用 `sed 's|images/imageN.png|images/<topic>/<sub>/imageN.png|g'`
5. **生成 overview / index 頁**（若使用者要）：列出分享者、學習目標、子主題連結

#### 一鍵生成範本（bash）

```bash
SRC="C:/path/to/source/folder"
DST="C:/Users/USER/workspace/code-study/content/<chapter>/<sub>"

{
cat <<'EOF'
---
title: "短標題"
pageTitle: "完整標題"
contributors: ["spyua"]
---

EOF
tail -n +3 "$SRC/原檔.md" | sed 's|images/image\([0-9]*\)\.png|images/<topic>/<sub>/image\1.png|g'
} > "$DST/N.slug.md"
```

> ⚠️ 若原稿 H1 不在第一行（例如前面有引言），不要無腦 `tail -n +3`。先用 `head -5` 確認結構。

### 階段 4 — 驗證

1. **靜態檢查**（用 grep 確認沒有殘留錯誤）：
   ```bash
   # 確認沒有任何檔案還用舊圖片路徑
   grep -rn "images/imageN" content/<chapter>/<sub>/
   # 確認 frontmatter 三欄齊全
   grep -L "pageTitle:" content/<chapter>/<sub>/*.md
   ```
2. **dev server**：建議使用者 `cd code-study && npm run dev` 並開啟新增的路由。回報應該訪問的 URL 路徑（注意 BASE_URL 前綴）
3. **build 驗證**：`npm run lint` + `npm run generate` 都要通過
4. **巢狀子目錄首次使用提醒**：若是該 repo 首次出現第二層子目錄，提醒使用者實測側邊欄折疊行為，提供退路（改用扁平命名 + renumber）

## 常見陷阱（看到要主動避免）

- ❌ 把圖片 `src` 寫成 `/code-study/images/...` — 重複加 BASE_URL 會 404
- ❌ 把圖片 `src` 寫成 `./images/...` — content plugin 的 startsWith 判斷會失敗
- ❌ 用 `git mv` 搬原稿 — 預設不要動原稿，新檔等於另存一份
- ❌ 把 H1 留著 + frontmatter 都有 pageTitle — 頁面會出現兩層大標題
- ❌ 連同未引用的孤兒圖片一起搬 — 浪費 repo 空間
- ❌ 為了「整齊」去 renumber 既有檔案 — 會打亂既有連結與 git history，除非使用者明確同意

## 風格與一致性

- 中文敘述、表格、emoji、程式區塊原樣保留，**不要改寫原稿措辭**
- 若使用者沒指定 `contributors`，預設填一個明顯佔位字串如 `["_____"]` 或詢問
- `_dir.yml` 的 `icon` 沒指定就提議一個語意相關 emoji 並讓使用者確認
- overview 頁的格式可參考 `code-study/content/8.2026-plan/section2/1.overview.md`

## 輸出回報

執行完畢的最終訊息要包含：
1. 新建的目錄樹（檔名清單）
2. 圖片搬移統計（搬了 N 張、跳過 M 張孤兒圖）
3. 是否動到既有檔案（預設「無」）
4. 下一步：使用者該跑哪些命令驗證、該開哪些 URL
