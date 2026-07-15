import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { PostList } from "@/components/PostList";
import { homeSettings, homeMarkdown } from "@/lib/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${homeSettings.brandName} — 現代化部落格` },
      {
        name: "description",
        content: `${homeSettings.brandName} 首頁,瀏覽所有最新文章。`,
      },
      { property: "og:title", content: homeSettings.brandName },
      { property: "og:description", content: `${homeSettings.brandName} 首頁。` },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  if (homeSettings.homeMode === "markdown") {
    return (
      <main className="mx-auto w-full max-w-[860px] px-5 pt-8 pb-24 sm:pt-10">
        <Navbar />
        <header className="fade-up mt-6 flex flex-col items-center text-center">
          <img
            src="/logo.png"
            alt={`${homeSettings.brandName} Logo`}
            width={96}
            height={96}
            className="block"
          />
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {homeSettings.brandName}
          </h1>
        </header>
        <article className="fade-up glass mt-8 rounded-2xl p-6 sm:p-10">
          <MarkdownRenderer content={homeMarkdown} />
        </article>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 pt-8 pb-24 sm:pt-10">
      <Navbar />
      <PostList title={homeSettings.brandName} showLogo />
    </main>
  );
}
