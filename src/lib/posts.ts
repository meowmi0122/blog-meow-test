// Auto-scan all posts in public/blog/*/
// Uses Vite import.meta.glob at build time.

export interface PostSetting {
  id: number;
  title: string;
  date: string;
  image: string;
}

export interface Post extends PostSetting {
  folder: string;
  imageUrl: string;
  content: string;
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
  // path like ../../public/blog/markdown-guide/setting.json
  const parts = path.split("/");
  return parts[parts.length - 2];
}

const posts: Post[] = Object.entries(settingModules)
  .map(([path, setting]) => {
    const folder = folderFromPath(path);
    const mdPath = path.replace("/setting.json", "/index.md");
    const content = markdownModules[mdPath] ?? "";
    return {
      ...setting,
      folder,
      imageUrl: `/blog/${folder}/${setting.image}`,
      content,
    };
  })
  .sort((a, b) => {
    // newest first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

const byId = new Map<number, Post>();
posts.forEach((p) => byId.set(p.id, p));

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostById(id: number): Post | undefined {
  return byId.get(id);
}
