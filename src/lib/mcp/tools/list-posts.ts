import { defineTool } from "@lovable.dev/mcp-js";
import { getAllPosts } from "@/lib/posts";

export default defineTool({
  name: "list_posts",
  title: "List posts",
  description: "列出所有公開部落格文章 (id、標題、日期)。私人文章不會出現。",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const posts = getAllPosts().map((p) => ({
      id: p.id,
      title: p.title,
      date: p.date,
      folder: p.folder,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(posts, null, 2) }],
      structuredContent: { posts },
    };
  },
});
