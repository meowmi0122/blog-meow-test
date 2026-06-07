import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { ThemeToggle } from "@/components/ThemeAutoSync";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blog Meow — 現代化部落格" },
      {
        name: "description",
        content: "Blog Meow 首頁,瀏覽所有最新文章。",
      },
      { property: "og:title", content: "Blog Meow" },
      { property: "og:description", content: "Blog Meow 首頁。" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const posts = useMemo(() => getAllPosts(), []);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.folder.toLowerCase().includes(s),
    );
  }, [posts, q]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 pt-10 pb-24 sm:pt-14">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <header className="fade-up mt-2 flex flex-col items-center text-center">
        <img
          src="/logo.png"
          alt="Blog Meow Logo"
          width={96}
          height={96}
          className="block"
        />
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Blog Meow
        </h1>
      </header>

      <div className="fade-up mt-8 w-full max-w-xl self-center">
        <div className="glass flex items-center gap-3 rounded-full px-5 py-3">
          <Search className="size-5 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜尋文章標題或資料夾..."
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="搜尋文章"
          />
        </div>
      </div>

      <section className="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <Link
            key={p.id}
            to="/blog/$id"
            params={{ id: String(p.id) }}
            className="fade-up hover-lift glass group flex gap-4 overflow-hidden rounded-2xl p-3 text-left hover:-translate-y-0.5 hover:shadow-md"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="aspect-square size-20 shrink-0 overflow-hidden rounded-xl">
              <img
                src={p.imageUrl}
                alt={p.title}
                loading="lazy"
                className="size-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1">
              <h2 className="line-clamp-2 text-base font-semibold tracking-tight">
                {p.title}
              </h2>
              <time className="text-xs text-muted-foreground">{p.date}</time>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            找不到符合的文章
          </p>
        )}
      </section>
    </main>
  );
}
