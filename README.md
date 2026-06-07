# 🐾 Blog Meow

一個 Apple 風格、毛玻璃質感的現代化部落格，使用 TanStack Start + React + Tailwind v4 + react-markdown 打造。

## 特色

- ✨ Apple 風格 / 毛玻璃效果 / 圓角卡片
- 🌗 深色 / 淺色模式自動跟隨系統
- 📱 手機優先 RWD
- 🔍 即時搜尋（標題 + 資料夾名稱）
- 📝 完整支援 GitHub Flavored Markdown
  - H1~H6、粗體 / 斜體 / 刪除線、引用、巢狀引用
  - 無序 / 有序 / Task List
  - 行內程式碼、程式碼區塊（語法高亮）
  - 表格、對齊表格
  - HTML 混用、`<details>`、`<kbd>`、`<sub>`、`<sup>`
  - GitHub Alerts（NOTE / TIP / IMPORTANT / WARNING / CAUTION）
  - Mermaid 流程圖
- ⚡ Lazy load 圖片 / SEO（OG、Twitter Card）

## 新增一篇文章

於 `public/blog/` 下建立資料夾，例如 `public/blog/my-post/` ，內含：

```
public/blog/my-post/
├── setting.json
├── index.md
└── cover.png
```

`setting.json` 範例：

```json
{
  "id": 2,
  "title": "我的新文章",
  "date": "2026/07/01",
  "image": "cover.png"
}
```

> 文章網址由 `id` 決定，例如 `id: 2` → `/blog/2` 。

新增後重新啟動 dev server 即可生效。

## 開發

```bash
bun install
bun dev
```

## 建置 & 部署

```bash
bun run build
```

可部署至 Vercel / Cloudflare Pages / Netlify 等支援 Node / Edge 的 SSR 平台。
（純靜態平台如 GitHub Pages 需先匯出靜態 HTML。）
