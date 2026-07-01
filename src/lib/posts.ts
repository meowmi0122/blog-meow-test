// Auto-scan all posts in public/blog/*/
// Uses Vite import.meta.glob at build time.

export type Visibility = "public" | "private";

export type ImageSize =
  | number
  | { width?: number; height?: number };

export interface PostSetting {
  id: number;
  title: string;
  date: string;
  image?: string;
  visibility?: Visibility;
  imageSize?: ImageSize;
}

export interface Post extends PostSetting {
  folder: string;
  imageUrl: string;
  content: string;
  visibility: Visibility;
  imageSize?: ImageSize;
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

// Any cover.* file (cover.png, cover.jpg, cover.webp, cover.svg, cover.gif...)
const coverModules = import.meta.glob(
  "../../public/blog/*/cover.*",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

function folderFromPath(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 2];
}

function findCoverForFolder(folder: string): string | undefined {
  for (const key of Object.keys(coverModules)) {
    const parts = key.split("/");
    const f = parts[parts.length - 2];
    if (f === folder) return coverModules[key];
  }
  return undefined;
}

const posts: Post[] = Object.entries(settingModules)
  .map(([path, setting]) => {
    const folder = folderFromPath(path);
    const mdPath = path.replace("/setting.json", "/index.md");
    const content = markdownModules[mdPath] ?? "";
    const visibility: Visibility =
      setting.visibility === "private" ? "private" : "public";

    // Resolve image: explicit filename OR auto-detect cover.*
    let imageUrl = "";
    if (setting.image) {
      imageUrl = `/blog/${folder}/${setting.image}`;
    } else {
      imageUrl = findCoverForFolder(folder) ?? "";
    }

    return {
      ...setting,
      folder,
      imageUrl,
      content,
      visibility,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const byId = new Map<number, Post>();
posts.forEach((p) => byId.set(p.id, p));

export function getAllPosts(): Post[] {
  // Listings only show public posts
  return posts.filter((p) => p.visibility === "public");
}

/** Private posts remain accessible via direct URL. */
export function getPostById(id: number): Post | undefined {
  return byId.get(id);
}

export function resolveImageSize(size?: ImageSize): {
  width?: number;
  height?: number;
} {
  if (size === undefined) return {};
  if (typeof size === "number") return { width: size, height: size };
  return { width: size.width, height: size.height };
}
