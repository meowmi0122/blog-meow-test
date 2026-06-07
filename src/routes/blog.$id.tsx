import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getPostById } from "@/lib/posts";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

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
        { property: "og:image", content: p.imageUrl },
        { property: "og:url", content: `/blog/${p.id}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:image", content: p.imageUrl },
      ],
      links: [{ rel: "canonical", href: `/blog/${p.id}` }],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
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

  return (
    <main className="mx-auto w-full max-w-[900px] px-5 pt-10 pb-24 sm:pt-16">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        返回首頁
      </Link>

      <article className="fade-up mt-6">
        <header className="glass overflow-hidden rounded-3xl">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="aspect-[16/8] w-full object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <time className="mt-3 block text-sm text-muted-foreground">
              {post.date}
            </time>
          </div>
        </header>

        <div className="glass mt-8 rounded-3xl p-6 sm:p-10">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </main>
  );
}
