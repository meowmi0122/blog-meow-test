import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import mermaid from "mermaid";
import {
  Info,
  Lightbulb,
  MessageSquareWarning,
  AlertTriangle,
  OctagonAlert,
  Copy,
  Check,
  Download,
} from "lucide-react";

interface Props {
  content: string;
}

function getMermaidTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "default";
}

function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mmd-${Math.random().toString(36).slice(2, 10)}`);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isDark = document.documentElement.classList.contains("dark");
    mermaid.initialize({
      startOnLoad: false,
      theme: getMermaidTheme(),
      securityLevel: "loose",
      fontFamily: "inherit",
      themeVariables: {
        background: "transparent",
        primaryColor: isDark ? "#1f1f1f" : "#ffffff",
        primaryTextColor: isDark ? "#f5f5f5" : "#1a1a1a",
        primaryBorderColor: isDark ? "#444" : "#ccc",
        lineColor: isDark ? "#888" : "#666",
        secondaryColor: isDark ? "#2a2a2a" : "#f5f5f5",
        tertiaryColor: isDark ? "#1a1a1a" : "#fafafa",
        textColor: isDark ? "#f5f5f5" : "#1a1a1a",
      },
    });
    const id = `${idRef.current}-${tick}`;
    mermaid
      .render(id, code)
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
  }, [code, tick]);

  return (
    <div
      ref={ref}
      className="mermaid-block my-6 flex justify-center overflow-x-auto"
    />
  );
}

function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const text = String(Array.isArray(children) ? children.join("") : children).replace(/\n$/, "");
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };
  return (
    <div className="code-block">
      <button
        type="button"
        onClick={onCopy}
        className="copy-btn"
        aria-label="複製程式碼"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "已複製" : "複製"}
      </button>
      <pre>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function DownloadBlock({ code }: { code: string }) {
  // Parse simple key: value lines
  const data: Record<string, string> = {};
  for (const line of code.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (m) data[m[1].toLowerCase()] = m[2].trim();
  }
  const rawPath = data.path ?? "";
  const size = data.size ?? "";
  // Strip leading "public/" so /public/files/foo.pdf becomes /files/foo.pdf
  const href = rawPath.replace(/^\/?public\//, "/");
  // Display only the file name
  const displayName = rawPath.split(/[\\/]/).filter(Boolean).pop() ?? rawPath;
  if (!rawPath) return null;
  return (
    <a
      href={href}
      download={displayName}
      className="download-card"
      aria-label={`下載 ${displayName}`}
    >
      <span className="download-card-icon">
        <Download className="size-5" />
      </span>
      <span className="download-card-meta">
        <span className="download-card-name">{displayName}</span>
        {size && <span className="download-card-size">{size}</span>}
      </span>
    </a>
  );
}

function InlineCode({ className, children, ...rest }: any) {
  const [copied, setCopied] = useState(false);
  const text = String(Array.isArray(children) ? children.join("") : children ?? "");
  const onCopy = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* noop */
    }
  };
  return (
    <span className="inline-code-wrap">
      <code
        className={`inline-code${copied ? " inline-code-copied" : ""}${className ? ` ${className}` : ""}`}
        onClick={onCopy}
        title={copied ? "已複製" : "點擊複製"}
        {...rest}
      >
        {children}
      </code>
      <button
        type="button"
        onClick={onCopy}
        className="inline-copy-btn"
        aria-label={copied ? "已複製" : "複製"}
        tabIndex={-1}
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </button>
    </span>
  );
}

const ALERT_TYPES = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"] as const;
type AlertType = (typeof ALERT_TYPES)[number];

function AlertIcon({ type }: { type: AlertType }) {
  const cls = "size-[1.1em]";
  switch (type) {
    case "NOTE": return <Info className={cls} />;
    case "TIP": return <Lightbulb className={cls} />;
    case "IMPORTANT": return <MessageSquareWarning className={cls} />;
    case "WARNING": return <AlertTriangle className={cls} />;
    case "CAUTION": return <OctagonAlert className={cls} />;
  }
}

function GhAlert({ type, children }: { type: AlertType; children: React.ReactNode }) {
  const labels: Record<AlertType, string> = {
    NOTE: "Note",
    TIP: "Tip",
    IMPORTANT: "Important",
    WARNING: "Warning",
    CAUTION: "Caution",
  };
  return (
    <div className={`gh-alert alert-${type.toLowerCase()}`}>
      <div className="gh-alert-title">
        <span className="gh-alert-icon"><AlertIcon type={type} /></span>
        {labels[type]}
      </div>
      <div className="gh-alert-body">{children}</div>
    </div>
  );
}

export function MarkdownRenderer({ content }: Props) {
  // re-mount highlighter & mermaid on theme change for proper colors
  const [, setTick] = useState(0);
  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <div className="markdown-body">
      {/* Load hljs theme dynamically per mode */}
      <link
        rel="stylesheet"
        href={
          isDark
            ? "https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github-dark.min.css"
            : "https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css"
        }
      />
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
        components={{
          pre(props: any) {
            // Replace <pre><code> with our CodeBlock that adds copy button
            const child = props.children;
            if (child && child.props) {
              const codeProps = child.props;
              const text = codeProps.children;
              const className: string = codeProps.className || "";
              const lang = /language-(\w+)/.exec(className)?.[1];
              const codeStr = String(Array.isArray(text) ? text.join("") : text).replace(/\n$/, "");
              if (lang === "mermaid") {
                return <MermaidBlock code={codeStr} />;
              }
              if (lang === "download") {
                return <DownloadBlock code={codeStr} />;
              }
              return <CodeBlock className={className}>{text}</CodeBlock>;
            }
            return <pre {...props} />;
          },
          code(props: any) {
            const { className, children, ...rest } = props;
            return (
              <InlineCode className={className} {...rest}>
                {children}
              </InlineCode>
            );
          },
          blockquote(props: any) {
            const { children } = props;
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
                const cloned = arr.map((child: any, i: number) => {
                  if (i !== arr.indexOf(firstEl)) return child;
                  const childChildren = child.props.children;
                  const newChildren = Array.isArray(childChildren)
                    ? (() => {
                        const rest = [
                          (childChildren[0] as string).replace(
                            /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/,
                            "",
                          ),
                          ...childChildren.slice(1),
                        ];
                        // Drop leading empty strings and a leading <br> that
                        // remark-breaks inserts for the newline after [!NOTE].
                        while (
                          rest.length &&
                          ((typeof rest[0] === "string" && rest[0] === "") ||
                            (rest[0] &&
                              typeof rest[0] === "object" &&
                              (rest[0] as any).type === "br"))
                        ) {
                          rest.shift();
                        }
                        return rest;
                      })()
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
          img(props: any) {
            const { src, alt, ...rest } = props;
            return (
              <img
                src={src}
                alt={alt || ""}
                loading="lazy"
                {...rest}
              />
            );
          },
          a(props: any) {
            const { href, children, ...rest } = props;
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
