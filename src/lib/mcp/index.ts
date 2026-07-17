import { defineMcp } from "@lovable.dev/mcp-js";
import listPosts from "./tools/list-posts";
import getPost from "./tools/get-post";
import listPages from "./tools/list-pages";
import getPage from "./tools/get-page";

// 公開 MCP 伺服器 — 這是一個公開部落格,所有內容本就公開可讀。
// 任何連上這個 MCP 端點的用戶端 (ChatGPT / Claude / Cursor 等) 都可以
// 讀取文章與頁面內容,不需要登入。
export default defineMcp({
  name: "blog-meow-mcp",
  title: "Blog Meow",
  version: "0.1.0",
  instructions:
    "Blog Meow 的公開內容工具。以 list_posts / list_pages 瀏覽,再用 get_post / get_page 讀取指定內容。",
  tools: [listPosts, getPost, listPages, getPage],
});
