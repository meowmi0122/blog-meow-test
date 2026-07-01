import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPostById, resolveImageSize } from "@/lib/posts";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/blog/$id")({
  loader: ({ params }) => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) throw notFound();
    const post = getPostById(id);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    const p = loaderData;
    if (!p) return {};
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
        { property: "og:url", content: `/blog/${p.id}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
      ],
      links: [{ rel: "canonical", href: `/blog/${p.id}` }],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[860px] px-5 pt-8 pb-24">
      <Navbar />
      <div className="glass mt-10 rounded-3xl p-10 text-center">
        <h1 className="text-3xl font-bold">文章不存在</h1>
        <p className="mt-3 text-muted-foreground">這篇文章可能還沒被建立。</p>
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
        <h1 className="text-xl font-semibold">載入文章時發生錯誤</h1>
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

function PostPage() {
  const post = Route.useLoaderData();
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
