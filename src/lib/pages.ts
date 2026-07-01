import navSettingsRaw from "../../public/pages/settings.json";

export interface NavItem {
  label: string;
  slug: string;
  description?: string;
}

const raw = navSettingsRaw as { items?: NavItem[] };
export const navItems: NavItem[] = Array.isArray(raw.items) ? raw.items : [];

const pageMarkdown = import.meta.glob("../../public/pages/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const bySlug = new Map<string, string>();
for (const [path, content] of Object.entries(pageMarkdown)) {
  const file = path.split("/").pop()!;
  const slug = file.replace(/\.md$/, "");
  bySlug.set(slug, content);
}

export function getPageBySlug(slug: string):
  | { item: NavItem; content: string }
  | undefined {
  const content = bySlug.get(slug);
  if (content === undefined) return undefined;
  const item =
    navItems.find((i) => i.slug === slug) ?? { label: slug, slug };
  return { item, content };
}
