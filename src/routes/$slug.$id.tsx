// 動態路由: /{pageSlug}/{id}
// 當導航列頁面設為 pagesblog=true 時,其列表中的文章連結會是 /{pageSlug}/{id}
// 例如 /tutorial/1 → 顯示 id=1 的文章 (前提是 tutorial.json 的 pagesblog=true)
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef } from "react";
import { navItems } from "@/lib/pages";
import { getPostById, resolveImageSize, type Post } from "@/lib/posts";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Navbar } from "@/components/Navbar";
import { ArticleSearch } from "@/components/ArticleSearch";

export const Route = createFileRoute("/$slug/$id")({
  loader: ({ params }) => {
    const nav = navItems.find((i) => i.slug === params.slug);
    if (!nav || nav.pagesblog !== true) throw notFound();
    if (!/^\d+$/.test(params.id)) throw notFound();
    const post = getPostById(Number(params.id));
    if (!post) throw notFound();
    return { post, nav };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
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
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
      ],
    };
  },
  component: PostView,
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

function PostView() {
  const { post } = Route.useLoaderData() as { post: Post };
  const size = resolveImageSize(post.imageSize);
  const contentRef = useRef<HTMLDivElement>(null);
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
        <ArticleSearch containerRef={contentRef} contentKey={String(post.id)} />
        <div ref={contentRef} className="glass mt-4 rounded-2xl p-6 sm:p-10">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </main>
  );
}
