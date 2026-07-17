import { defineTool } from "@lovable.dev/mcp-js";
import { navItems } from "@/lib/pages";

export default defineTool({
  name: "list_pages",
  title: "List pages",
  description: "列出所有導航列頁面 (slug、label)。",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const pages = navItems.map((i) => ({
      slug: i.slug,
      label: i.label,
      description: i.description,
      pagesblog: !!i.pagesblog,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(pages, null, 2) }],
      structuredContent: { pages },
    };
  },
});
