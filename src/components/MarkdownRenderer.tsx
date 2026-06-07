import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import mermaid from "mermaid";

import "highlight.js/styles/github-dark.css";

interface Props {
  content: string;
}

let mermaidInitialized = false;
function initMermaid() {
  if (mermaidInitialized) return;
  mermaidInitialized = true;
  const isDark = document.documentElement.classList.contains("dark");
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? "dark" : "default",
    securityLevel: "loose",
    fontFamily: "inherit",
  });
}

function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mmd-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
    initMermaid();
    let cancelled = false;
    mermaid
      .render(idRef.current, code)
      .then(({ svg }) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      })
      .catch((err) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre class="text-destructive">${String(err)}</pre>`;
        }
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return <div ref={ref} className="my-6 flex justify-center overflow-x-auto" />;
}

const ALERT_TYPES = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"] as const;
type AlertType = (typeof ALERT_TYPES)[number];

function GhAlert({ type, children }: { type: AlertType; children: React.ReactNode }) {
  const config: Record<AlertType, { label: string; cls: string; icon: string }> = {
    NOTE: { label: "Note", cls: "alert-note", icon: "ⓘ" },
    TIP: { label: "Tip", cls: "alert-tip", icon: "💡" },
    IMPORTANT: { label: "Important", cls: "alert-important", icon: "❗" },
    WARNING: { label: "Warning", cls: "alert-warning", icon: "⚠️" },
    CAUTION: { label: "Caution", cls: "alert-caution", icon: "🛑" },
  };
  const c = config[type];
  return (
    <div className={`gh-alert ${c.cls}`}>
      <div className="gh-alert-title">
        <span className="gh-alert-icon">{c.icon}</span>
        {c.label}
      </div>
      <div className="gh-alert-body">{children}</div>
    </div>
  );
}

export function MarkdownRenderer({ content }: Props) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
        components={{
          code(props) {
            const { className, children, ...rest } = props as any;
            const match = /language-(\w+)/.exec(className || "");
            const lang = match?.[1];
            const text = String(children).replace(/\n$/, "");
            if (lang === "mermaid") {
              return <MermaidBlock code={text} />;
            }
            return (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
          blockquote(props) {
            const { children } = props as any;
            // Detect GH Alert syntax: first paragraph starts with [!TYPE]
            const arr = Array.isArray(children) ? children : [children];
            const firstEl = arr.find((c: any) => c && typeof c === "object");
            const firstText: string | undefined =
              firstEl?.props?.children?.[0] &&
              typeof firstEl.props.children[0] === "string"
                ? firstEl.props.children[0]
                : undefined;
            if (firstText) {
              const m = firstText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/);
              if (m) {
                const type = m[1] as AlertType;
                // strip the marker from the rendered children
                const cloned = arr.map((child: any, i: number) => {
                  if (i !== arr.indexOf(firstEl)) return child;
                  const childChildren = child.props.children;
                  const newChildren = Array.isArray(childChildren)
                    ? [
                        (childChildren[0] as string).replace(
                          /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/,
                          "",
                        ),
                        ...childChildren.slice(1),
                      ]
                    : (childChildren as string).replace(
                        /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/,
                        "",
                      );
                  return { ...child, props: { ...child.props, children: newChildren } };
                });
                return <GhAlert type={type}>{cloned}</GhAlert>;
              }
            }
            return <blockquote>{children}</blockquote>;
          },
          img(props) {
            const { src, alt, ...rest } = props as any;
            return (
              <img
                src={src}
                alt={alt || ""}
                loading="lazy"
                className="rounded-xl shadow-sm"
                {...rest}
              />
            );
          },
          a(props) {
            const { href, children, ...rest } = props as any;
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
                {...rest}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
