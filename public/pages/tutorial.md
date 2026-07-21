# 使用教學

歡迎使用 **Blog Meow**！以下是所有可以自訂的檔案。

---

## 1. 全站設定 `public/settings.json`

控制首頁模式、導航列資料夾、網站名稱。

```json
{
  "homeMode": "blog",
  "navFolder": "pages",
  "siteName": "Blog Meow",
  "brandName": "Blog Meow"
}
```

> [!TIP]
> JSON 不支援真正的 `//` 註解,但 Blog Meow 會忽略以 `_comment` 開頭的欄位, 你可以用它們寫說明。

---

## 2. 首頁 Markdown `public/index.md`

當 `homeMode` 設為 `"markdown"` 時,首頁會顯示這個檔案的內容。

---

## 3. 導航列項目 `public/pages/{slug}.json`

每一個導航項目對應一個獨立的 JSON:

```json
{
  "label": "教學",
  "description": "使用教學",
  "pagesblog": false
}
```

- `pagesblog: false` (預設) → 顯示同名的 `public/pages/{slug}.md`
- `pagesblog: true` → 顯示與首頁相同的文章列表 (以 label 當標題)

新增頁面就在 `public/pages/` 裡新建 `{slug}.json`,同時 (若非 pagesblog) 建立 `{slug}.md`。

---

## 4. 部落格文章 `public/blog/{資料夾名}/`

每篇文章一個資料夾,內含:

### `setting.json`
```json
{
  "id": 1,
  "title": "Markdown大全",
  "date": "2026/06/06",
  "visibility": "public",
  "imageSize": 64
}
```

- `visibility`: `"public"` 公開 / `"private"` 只能透過網址存取
- `imageSize`: 數字 = 正方形; 或 `{ "width": 120, "height": 80 }`

### `index.md`
文章內容,支援完整 GitHub Flavored Markdown、GitHub Alerts、Mermaid 流程圖。

### 封面圖片
任意檔名以 `cover.` 開頭即可自動偵測 (`cover.png`、`cover.jpg`、`cover.webp`、`cover.svg`…)。

---

## 5. 網址規則

- 首頁: `/`
- 文章: `/{id}` (例如 `/1`、`/2`)
- 導航頁: `/{slug}` (例如 `/tutorial`)
- 私人文章: 不會出現在首頁,但可以透過 `/{id}` 直接訪問
- **原始檔**: `/public/{相對路徑}` 會像 GitHub raw 一樣以純文字顯示

---

## 6. 下載區塊

在任何 Markdown 內用 ` ```download ` 程式碼區塊即可產生下載卡片:

````markdown
```download
path: public/blog/markdown-guide/index.md
size: 12 KB
```
````

- `path`: 檔案位置。若以 `public/` 開頭會自動去掉,顯示時只留檔名。
- `size`: 自由填 (KB / MB / GB…),純文字顯示。

效果:

```download
path: public/blog/markdown-guide/index.md
size: 12 KB
```

---

## 7. MCP (Model Context Protocol)

Blog Meow 內建公開的 MCP 伺服器,可連到 ChatGPT / Claude / Cursor 等支援 MCP 的用戶端,讓 AI 直接讀取你的文章:

- 端點: `https://<你的網域>/mcp`
- 認證: 無 (所有內容本就公開)
- 工具: `list_posts`、`get_post`、`list_pages`、`get_page`

在 Claude Desktop 或 ChatGPT 的「連接器 / Connectors」加入上方 URL 即可使用。

---

## 8. Logo 與 PWA 圖示

替換 `public/logo.png` 即可更換 Logo。PWA 圖示則編輯 `public/manifest.webmanifest`。

---

## 📦 原始碼

想直接看檔案原文?點下方連結 (GitHub raw 風格,純文字顯示):

- [`public/settings.json`](/public/settings.json)
- [`public/index.md`](/public/index.md)
- [`public/pages/tutorial.json`](/public/pages/tutorial.json)
- [`public/pages/tutorial.md`](/public/pages/tutorial.md)
- [`public/blog/markdown-guide/setting.json`](/public/blog/markdown-guide/setting.json)
- [`public/blog/markdown-guide/index.md`](/public/blog/markdown-guide/index.md)

祝寫作愉快 🐾

---

# Markdown 大全

以下是完整的 Markdown 範例,展示本站支援的所有語法。

---

## 標題 H1 ~ H6

# H1 標題
## H2 標題
### H3 標題
#### H4 標題
##### H5 標題
###### H6 標題

---

## 文字樣式

**粗體** ,*斜體* ,***粗斜體*** ,~~刪除線~~ ,<u>底線</u> 。

行內程式碼: `const meow = "Blog Meow"`

按鍵: <kbd>⌘</kbd> + <kbd>K</kbd> 開啟搜尋。

下標 H<sub>2</sub>O ,上標 E = mc<sup>2</sup> 。

Escape 字元: \*這不是斜體\* 、\`不是程式碼\` 。

---

## 引用

> 這是一段引用文字。
>
> 可以包含多行。

### 巢狀引用

> 第一層引用
>
> > 第二層引用
> >
> > > 第三層引用

---

## 清單

### 無序清單

- 蘋果
- 香蕉
  - 巴西蕉
  - 芭蕉
- 櫻桃

### 有序清單

1. 起床
2. 喝咖啡
3. 寫程式
   1. 開啟編輯器
   2. 開始打字

### Task List

- [x] 建立專案
- [x] 設計首頁
- [ ] 撰寫文章
- [ ] 部署上線

---

## 程式碼區塊

### JavaScript

```javascript
// Fibonacci
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(10));
```

### Python

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("Meow"))
```

### HTML

```html
<div class="card">
  <h1>Hello</h1>
  <p>World</p>
</div>
```

---

## 分隔線

---

## 連結與圖片

[Lovable 官方網站](https://lovable.dev)

自動連結: https://github.com

### HTML 控制圖片大小

<img src="/logo.png" alt="小圖" width="120" />

---

## 表格

| 名稱 | 年齡 | 職業 |
| ---- | ---- | ---- |
| 小明 | 25   | 工程師 |
| 小華 | 30   | 設計師 |
| 小美 | 28   | PM |

### 對齊表格

| 左對齊 | 置中 | 右對齊 |
| :----- | :--: | -----: |
| A      |  B   |      C |
| 蘋果   | 香蕉 |   櫻桃 |

---

## HTML 混用

<div align="center">
  <strong>這是一段置中的 HTML 區塊</strong>
</div>

---

## Details 摺疊區塊

<details>
<summary>點擊展開更多內容</summary>

這是隱藏的內容,可以包含 **Markdown** 語法。

- 項目 1
- 項目 2

</details>

---

## GitHub Alerts

> [!NOTE]
> 這是一段筆記,提供額外資訊。

> [!TIP]
> 一個小技巧,能讓你的工作更有效率。

> [!IMPORTANT]
> 重要訊息,請務必閱讀。

> [!WARNING]
> 警告:操作前請備份資料。

> [!CAUTION]
> 危險操作,請格外小心。

---

## Mermaid 流程圖

```mermaid
graph TD
A[開始] --> B{是否登入?}
B -- 是 --> C[進入首頁]
B -- 否 --> D[前往登入頁]
D --> C
C --> E[結束]
```

```mermaid
sequenceDiagram
participant U as 使用者
participant B as 瀏覽器
participant S as 伺服器
U->>B: 點擊文章
B->>S: GET /blog/1
S-->>B: 返回 Markdown
B-->>U: 渲染完成
```

