import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPageBySlug } from "@/lib/pages";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const page = getPageBySlug(params.slug);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { item } = loaderData;
    return {
      meta: [
        { title: `${item.label} — Blog Meow` },
        {
          name: "description",
          content: item.description ?? item.label,
        },
        { property: "og:title", content: item.label },
        {
          property: "og:description",
          content: item.description ?? item.label,
        },
      ],
      links: [{ rel: "canonical", href: `/${item.slug}` }],
    };
  },
  component: PageView,
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
});

function PageView() {
  const { item, content } = Route.useLoaderData();
  return (
    <main className="mx-auto w-full max-w-[860px] px-5 pt-8 pb-24 sm:pt-10">
      <Navbar />
      <article className="fade-up glass mt-6 rounded-2xl p-6 sm:p-10">
        <h1 className="sr-only">{item.label}</h1>
        <MarkdownRenderer content={content} />
      </article>
    </main>
  );
}
