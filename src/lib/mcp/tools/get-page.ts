import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getPageBySlug } from "@/lib/pages";

export default defineTool({
  name: "get_page",
  title: "Get page",
  description: "依 slug 取得單一導航頁的 Markdown 內容。",
  inputSchema: {
    slug: z.string().min(1).describe("頁面 slug,例如 tutorial"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const page = getPageBySlug(slug);
    if (!page) {
      return {
        content: [{ type: "text", text: `找不到 slug=${slug} 的頁面` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: page.content }],
      structuredContent: {
        slug: page.item.slug,
        label: page.item.label,
        content: page.content,
      },
    };
  },
});
