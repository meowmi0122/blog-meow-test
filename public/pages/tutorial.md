# 教學

這是一個導航列頁面。

- 在 `public/pages/settings.json` 加入項目 `{ "label": "顯示名稱", "slug": "url-slug" }`
- 在 `public/pages/{slug}.md` 建立對應內容
- 網址會是 `https://你的網站.com/{slug}`

例如：新增 `{ "label": "關於", "slug": "about" }` 並建立 `public/pages/about.md`，即可透過 `/about` 存取。
