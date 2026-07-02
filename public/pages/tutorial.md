# 使用教學

歡迎使用 **Blog Meow**！以下是所有可以自訂的檔案。

---

## 1. 全站設定 `public/settings.json`

控制首頁模式、導航列資料夾、網站名稱。

```json
{
  "homeMode": "blog",       // "blog" = 顯示文章列表, "markdown" = 顯示 public/index.md
  "navFolder": "pages",     // 導航列頁面資料夾名 (預設 pages)
  "siteName": "Blog Meow",  // 左上角網站名稱
  "brandName": "Blog Meow"  // 首頁 Logo 下方大標題
}
```

> [!TIP]
> JSON 不支援真正的 `//` 註解,但 Blog Meow 會忽略以 `_comment` 開頭的欄位, 你可以用它們寫說明。

---

## 2. 首頁 Markdown `public/index.md`

當 `homeMode` 設為 `"markdown"` 時,首頁會顯示這個檔案的內容。

---

## 3. 導航列項目 `public/pages/settings.json`

管理右上角導航列的按鈕與對應頁面。

```json
{
  "items": [
    {
      "label": "教學",           // 顯示文字
      "slug": "tutorial",       // 網址 → /tutorial
      "description": "使用教學"  // SEO 描述 (可省略)
    }
  ]
}
```

新增一個項目後,只要在 `public/pages/{slug}.md` 建立同名 Markdown 檔即可,例如 `public/pages/about.md` → `/about`。

---

## 4. 部落格文章 `public/blog/{資料夾名}/`

每篇文章一個資料夾,內含:

### `setting.json`
```json
{
  "id": 1,                      // 網址編號 → /1 (數字)
  "title": "Markdown大全",      // 文章標題
  "date": "2026/06/06",         // 發布日期
  "visibility": "public",       // "public" = 公開, "private" = 只能透過網址存取
  "imageSize": 64               // 封面顯示大小 (單一數字 = 正方形; 或 { "width": 120, "height": 80 })
}
```

### `index.md`
文章內容,支援完整 GitHub Flavored Markdown、GitHub Alerts、Mermaid 流程圖。

### 封面圖片
任意檔名以 `cover.` 開頭即可自動偵測,例如:
- `cover.png`
- `cover.jpg`
- `cover.webp`
- `cover.svg`

若不放圖片,首頁與文章頁就不會顯示縮圖。

---

## 5. 網址規則

- 首頁: `/`
- 文章: `/{id}` (例如 `/1`、`/2`)
- 導航頁: `/{slug}` (例如 `/tutorial`、`/about`)
- 私人文章: 不會出現在首頁列表,但可以透過 `/{id}` 直接訪問

---

## 6. Logo 與 PWA 圖示

替換 `public/logo.png` 即可更換 Logo。若要更新 PWA 安裝圖示,編輯 `public/manifest.webmanifest`。

---

祝寫作愉快 🐾
