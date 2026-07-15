// 導航列項目 & 對應 Markdown 頁面
// 每個項目一個 JSON 檔:  public/pages/{slug}.json
// 對應內容 Markdown:     public/pages/{slug}.md  (pagesblog=false 時必須存在)
//
// {slug}.json 範例:
// {
//   "label": "教學",           // 顯示文字
//   "description": "使用教學", // SEO 說明 (可省略)
//   "pagesblog": false         // true = 顯示與首頁相同的文章列表; false/省略 = 顯示 {slug}.md
// }

export interface NavItem {
  label: string;
  slug: string;
  description?: string;
  pagesblog?: boolean;
}

const pageJson = import.meta.glob("../../public/pages/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const pageMarkdown = import.meta.glob("../../public/pages/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const items: NavItem[] = [];
for (const [path, raw] of Object.entries(pageJson)) {
  const file = path.split("/").pop()!;
  const slug = file.replace(/\.json$/, "");
  // 舊格式 settings.json (含 items 陣列) 已不再使用,跳過避免衝突
  if (slug === "settings") continue;
  const obj = (raw ?? {}) as Partial<NavItem>;
  items.push({
    label: typeof obj.label === "string" ? obj.label : slug,
    slug,
    description:
      typeof obj.description === "string" ? obj.description : undefined,
    pagesblog: obj.pagesblog === true,
  });
}
items.sort((a, b) => a.slug.localeCompare(b.slug));

export const navItems: NavItem[] = items;

const mdBySlug = new Map<string, string>();
for (const [path, content] of Object.entries(pageMarkdown)) {
  const file = path.split("/").pop()!;
  const slug = file.replace(/\.md$/, "");
  mdBySlug.set(slug, content);
}

export function getPageBySlug(slug: string):
  | { item: NavItem; content: string }
  | undefined {
  const content = mdBySlug.get(slug);
  if (content === undefined) return undefined;
  const item =
    navItems.find((i) => i.slug === slug) ?? { label: slug, slug };
  return { item, content };
}
