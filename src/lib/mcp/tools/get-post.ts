import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPostById } from "@/lib/posts";

export default defineTool({
  name: "get_post",
  title: "Get post",
  description: "依 id 取得單篇文章的 Markdown 內容與 metadata。",
  inputSchema: {
    id: z.number().int().describe("文章 id (public/blog/*/setting.json 內的 id)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const post = getPostById(id);
    if (!post) {
      return {
        content: [{ type: "text", text: `找不到 id=${id} 的文章` }],
        isError: true,
      };
    }
    const data = {
      id: post.id,
      title: post.title,
      date: post.date,
      visibility: post.visibility,
      content: post.content,
    };
    return {
      content: [
        { type: "text", text: `# ${post.title}\n\n${post.content}` },
      ],
      structuredContent: data,
    };
  },
});
