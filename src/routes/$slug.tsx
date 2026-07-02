// 動態路由: /{slug}
// 1. 若 slug 是數字 → 顯示對應 ID 的部落格文章 (public/blog/*/setting.json 的 id)
// 2. 否則 → 顯示 public/pages/{slug}.md 導航頁
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPageBySlug } from "@/lib/pages";
import { getPostById, resolveImageSize, type Post } from "@/lib/posts";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Navbar } from "@/components/Navbar";

type LoaderData =
  | { kind: "post"; post: Post }
  | { kind: "page"; item: { label: string; slug: string; description?: string }; content: string };

export const Route = createFileRoute("/$slug")({
  loader: ({ params }): LoaderData => {
    const raw = params.slug;
    // 純數字 → 文章
    if (/^\d+$/.test(raw)) {
      const post = getPostById(Number(raw));
      if (!post) throw notFound();
      return { kind: "post", post };
    }
    const page = getPageBySlug(raw);
    if (!page) throw notFound();
    return { kind: "page", item: page.item, content: page.content };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    if (loaderData.kind === "post") {
      const p = loaderData.post;
      return {
        meta: [
          { title: `${p.title} — Blog Meow` },
          { name: "description", content: `${p.title} — 發佈於 ${p.date}` },
          { property: "og:title", content: p.title },
          { property: "og:description", content: `發佈於 ${p.date}` },
          { property: "og:type", content: "article" },
          ...(p.imageUrl
            ? [
                { property: "og:image", content: p.imageUrl },
                { name: "twitter:image", content: p.imageUrl },
              ]
            : []),
          { property: "og:url", content: `/${p.id}` },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: p.title },
        ],
        links: [{ rel: "canonical", href: `/${p.id}` }],
      };
    }
    const { item } = loaderData;
    return {
      meta: [
        { title: `${item.label} — Blog Meow` },
        { name: "description", content: item.description ?? item.label },
        { property: "og:title", content: item.label },
        { property: "og:description", content: item.description ?? item.label },
      ],
      links: [{ rel: "canonical", href: `/${item.slug}` }],
    };
  },
  component: SlugView,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[860px] px-5 pt-8 pb-24">
      <Navbar />
      <div className="glass mt-10 rounded-3xl p-10 text-center">
        <h1 className="text-3xl font-bold">頁面不存在</h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          回首頁
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-[860px] px-5 pt-8 pb-24">
      <Navbar />
      <div className="glass mt-10 rounded-3xl p-10 text-center">
        <h1 className="text-xl font-semibold">載入時發生錯誤</h1>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          重試
        </button>
      </div>
    </div>
  ),
});

function SlugView() {
  const data = Route.useLoaderData();

  if (data.kind === "post") {
    const post = data.post;
    const size = resolveImageSize(post.imageSize);
    return (
      <main className="mx-auto w-full max-w-[860px] px-5 pt-8 pb-24 sm:pt-10">
        <Navbar />
        <article className="fade-up mt-6">
          <header className="glass rounded-2xl p-6 sm:p-8">
            {post.imageUrl && (
              <div className="mb-6 flex justify-center">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  width={size.width}
                  height={size.height}
                  style={{
                    width: size.width ? `${size.width}px` : undefined,
                    height: size.height ? `${size.height}px` : undefined,
                    maxWidth: "100%",
                    maxHeight: "360px",
                  }}
                  className="rounded-xl object-contain"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <time className="mt-3 block text-sm text-muted-foreground">
              {post.date}
              {post.visibility === "private" && (
                <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-xs">
                  私人
                </span>
              )}
            </time>
          </header>
          <div className="glass mt-6 rounded-2xl p-6 sm:p-10">
            <MarkdownRenderer content={post.content} />
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[860px] px-5 pt-8 pb-24 sm:pt-10">
      <Navbar />
      <article className="fade-up glass mt-6 rounded-2xl p-6 sm:p-10">
        <h1 className="sr-only">{data.item.label}</h1>
        <MarkdownRenderer content={data.content} />
      </article>
    </main>
  );
}
