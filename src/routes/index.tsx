import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getAllPosts } from "@/lib/posts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blog Meow — 現代化部落格" },
      {
        name: "description",
        content: "Blog Meow 首頁，瀏覽所有最新文章。",
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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-5 pt-16 pb-24 sm:pt-24">
      <header className="fade-up flex flex-col items-center text-center">
        <img
          src="/logo.png"
          alt="Blog Meow Logo"
          width={88}
          height={88}
          className="rounded-2xl shadow-md"
        />
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Blog Meow
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          一個 Apple 風格、毛玻璃質感的現代化部落格 ✨
        </p>
      </header>

      <div className="fade-up mt-10 w-full max-w-xl">
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

      <section className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <Link
            key={p.id}
            to="/blog/$id"
            params={{ id: String(p.id) }}
            className="fade-up hover-lift glass group flex flex-col overflow-hidden rounded-3xl text-left hover:-translate-y-1 hover:shadow-xl"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.title}
                loading="lazy"
                className="size-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h2 className="text-lg font-semibold tracking-tight">
                {p.title}
              </h2>
              <time className="text-sm text-muted-foreground">{p.date}</time>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            找不到符合的文章 🐾
          </p>
        )}
      </section>
    </main>
  );
}
