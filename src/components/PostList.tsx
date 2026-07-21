import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getAllPosts, resolveImageSize, type Post } from "@/lib/posts";

interface Props {
  title: string;
  /** 是否顯示 Logo 圖示 (首頁 = true，導航頁 = false) */
  showLogo?: boolean;
  /** 可覆寫要顯示的文章清單，預設為全部 public 文章 */
  posts?: Post[];
  /** 文章連結前綴 slug (pagesblog 頁面時傳入 → /{prefix}/{id})，預設無 → /{id} */
  linkPrefix?: string;
}

export function PostList({ title, showLogo = true, posts, linkPrefix }: Props) {
  const all = useMemo(() => posts ?? getAllPosts(), [posts]);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all;
    // 標題、資料夾、文章內文皆搜尋
    return all.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.folder.toLowerCase().includes(s) ||
        p.content.toLowerCase().includes(s),
    );
  }, [all, q]);

  return (
    <>
      <header className="fade-up mt-4 flex flex-col items-center text-center">
        {showLogo && (
          <img
            src="/logo.png"
            alt={`${title} Logo`}
            width={96}
            height={96}
            className="block"
          />
        )}
        <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl ${showLogo ? "mt-4" : ""}`}>
          {title}
        </h1>
      </header>

      <div className="fade-up mt-8 w-full max-w-xl self-center">
        <div className="glass flex items-center gap-3 rounded-full px-5 py-3">
          <Search className="size-5 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜尋標題、資料夾或內文..."
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="搜尋文章"
          />
        </div>
      </div>

      <section className="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => {
          const size = resolveImageSize(p.imageSize);
          return (
            <Link
              key={p.id}
              {...(linkPrefix
                ? { to: "/$slug/$id" as const, params: { slug: linkPrefix, id: String(p.id) } }
                : { to: "/$slug" as const, params: { slug: String(p.id) } })}
              className="fade-up hover-lift glass group flex items-center gap-4 overflow-hidden rounded-2xl p-3 text-left hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {p.imageUrl && (
                <div className="flex shrink-0 items-center justify-center">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    loading="lazy"
                    width={size.width}
                    height={size.height}
                    style={{
                      width: size.width ? `${size.width}px` : undefined,
                      height: size.height ? `${size.height}px` : undefined,
                      maxWidth: "80px",
                      maxHeight: "80px",
                    }}
                    className="rounded-lg object-contain transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center gap-1">
                <h2 className="line-clamp-2 text-base font-semibold tracking-tight">
                  {p.title}
                </h2>
                <time className="text-xs text-muted-foreground">{p.date}</time>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            找不到符合的文章
          </p>
        )}
      </section>
    </>
  );
}
