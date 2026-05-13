# Section 3 — Hooks & SDK 工作守則

本目錄是 **2026 讀書計畫 Part 3 · Section 1: Hooks & SDK** 的筆記區。
分享者 / 維護者：王以謙（GitHub: [yulin0629](https://github.com/yulin0629)）。

## 來源素材

- 課程：[Anthropic Courses — Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action)
- 章節：Part 3 · Section 1 — Hooks & SDK
- 原始素材位於 `./downloads/anthropic-claude-code-in-action-hooks-and-sdk/pages/`
- `downloads/` 目錄已被 `.gitignore` 排除（內含 mp4 / srt / jpg），**不要 commit**

涵蓋 7 個 lesson（皆有對應的 `.md` 在 downloads 內）：

| Lesson ID | 主題 |
|---|---|
| 312000 | Introducing hooks |
| 312002 | Defining hooks |
| 312003 | Implementing a hook |
| 312004 | Useful hooks |
| 312423 | Gotchas around hooks |
| 312427 | Another useful hook |
| 312001 | The Claude Code SDK |

## 寫作原則

1. **以 downloads 內的 markdown 為事實來源** — 任何摘要、條列、引用都要能對得回原文。不要憑印象或目錄名稱推測內容。
2. **不要編造學習目標、章節介紹或 lesson 摘要** — 若要寫，請先 Read 原文後再下筆；不確定就留空（`_____`）或 `TBD`。
3. **格式與 section1 / section2 一致** — 參考 `../section1/1.overview.md`、`../section2/1.overview.md` 的 frontmatter 與段落結構。
4. **檔案命名沿用既有規則** — 數字前綴控制排序（`1.overview.md`、`2.xxx.md`…），檔名用 kebab-case。
5. **頁面 frontmatter** 至少含 `title`、`pageTitle`、`contributors`。

## 圖片處理

- 真正寫進筆記的圖片，**從 `downloads/.../images/` 複製到 `public/images/8.2026-plan/section3/<lesson-slug>/`**。
- Markdown 內以 `images/8.2026-plan/section3/<lesson-slug>/xxx.png` 形式引用（不要寫絕對路徑或前綴 `/`）。
- `server/plugins/content.ts` 會在 build time 為 `images/` 開頭的路徑自動補上 `BASE_URL`，因此本地與 GitHub Pages 都會解析正確。
- 不要直接從 `downloads/` 引用圖片 — 那個目錄不會被 deploy。

## Commit 規範

- 遵守專案根目錄 `AGENT.md` 的 Conventional Commits 規範（header ≤ 150 字、body line ≤ 200 字）。
- scope 建議使用 `8.2026-plan` 或 `section3`。
- 範例：
  - `✨ feat(section3): add introducing-hooks note`
  - `📝 docs(section3): refine overview learning objectives`

## 不要做的事

- **不要修改 `downloads/`** — 那是課程原始素材的本地快照。
- **不要把 mp4 / srt / 大圖一起 commit** — 確認 `.gitignore` 仍排除 `content/8.2026-plan/section3/downloads/`。
- **不要替使用者填上「分享者」、「contributors」以外的個資**。
- **不要跨 section 改動** — 此 AGENTS.md 範圍僅限 `section3/`。
