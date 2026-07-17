// GitHub-raw style: /public/{path} 顯示 public/ 底下文字檔的原始內容
import { createFileRoute, notFound } from "@tanstack/react-router";

const rawFiles = import.meta.glob(
  "../../public/**/*.{md,json,txt,webmanifest,svg,html,css,js,ts}",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

const byPath = new Map<string, string>();
for (const [p, content] of Object.entries(rawFiles)) {
  const rel = p.replace(/^.*?\/public\//, "");
  byPath.set(rel, content);
}

function mimeFor(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "json":
    case "webmanifest":
      return "application/json; charset=utf-8";
    case "svg":
      return "image/svg+xml; charset=utf-8";
    case "html":
      return "text/html; charset=utf-8";
    default:
      return "text/plain; charset=utf-8";
  }
}

export const Route = createFileRoute("/public/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        const content = byPath.get(path);
        if (content === undefined) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(content, {
          headers: {
            "content-type": mimeFor(path),
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
  loader: ({ params }) => {
    const path = params._splat ?? "";
    const content = byPath.get(path);
    if (content === undefined) throw notFound();
    return { path, content };
  },
  component: RawView,
  notFoundComponent: () => (
    <pre style={{ padding: "1rem", margin: 0 }}>404 Not Found</pre>
  ),
});

function RawView() {
  const { content } = Route.useLoaderData();
  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        padding: "1rem",
        margin: 0,
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
        fontSize: "13px",
        lineHeight: 1.5,
      }}
    >
      {content}
    </pre>
  );
}
