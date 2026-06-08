// Auto-scan all posts in public/blog/*/
// Uses Vite import.meta.glob at build time.

export type Visibility = "public" | "private";

export interface PostSetting {
  id: number;
  title: string;
  date: string;
  image: string;
  visibility?: Visibility;
}

export interface Post extends PostSetting {
  folder: string;
  imageUrl: string;
  content: string;
  visibility: Visibility;
}

const settingModules = import.meta.glob("../../public/blog/*/setting.json", {
  eager: true,
  import: "default",
}) as Record<string, PostSetting>;

const markdownModules = import.meta.glob("../../public/blog/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function folderFromPath(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 2];
}

const posts: Post[] = Object.entries(settingModules)
  .map(([path, setting]) => {
    const folder = folderFromPath(path);
    const mdPath = path.replace("/setting.json", "/index.md");
    const content = markdownModules[mdPath] ?? "";
    const visibility: Visibility =
      setting.visibility === "private" ? "private" : "public";
    return {
      ...setting,
      folder,
      imageUrl: `/blog/${folder}/${setting.image}`,
      content,
      visibility,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const byId = new Map<number, Post>();
posts.forEach((p) => byId.set(p.id, p));

export function getAllPosts(): Post[] {
  // Only public posts on listings
  return posts.filter((p) => p.visibility === "public");
}

export function getPostById(id: number): Post | undefined {
  const p = byId.get(id);
  if (!p || p.visibility === "private") return undefined;
  return p;
}

