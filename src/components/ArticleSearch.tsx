import { useEffect, useRef, useState } from "react";
import { Search, ChevronUp, ChevronDown, X } from "lucide-react";

interface Props {
  /** 要搜尋的容器 ref (通常是 MarkdownRenderer 的 wrapper) */
  containerRef: React.RefObject<HTMLElement | null>;
  /** 內容改變時，重新套用高亮 */
  contentKey?: string;
  /** 初始搜尋詞 (例如從 ?q= 帶入) */
  initialTerm?: string;
}

/**
 * 在文章內文即時搜尋，將命中處包成 <mark class="search-hit">，
 * 並顯示命中次數與上/下一個跳轉。
 */
export function ArticleSearch({ containerRef, contentKey, initialTerm = "" }: Props) {
  const [term, setTerm] = useState(initialTerm);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);
  const marksRef = useRef<HTMLElement[]>([]);

  // 清除既有高亮
  const clear = (root: HTMLElement) => {
    const marks = root.querySelectorAll("mark.search-hit");
    marks.forEach((m) => {
      const parent = m.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(m.textContent ?? ""), m);
      parent.normalize();
    });
  };

  // 執行高亮
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    clear(root);
    marksRef.current = [];
    setActive(0);
    if (!term) {
      setCount(0);
      return;
    }
    const needle = term.toLowerCase();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // 跳過 script/style 內文字
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (tag === "SCRIPT" || tag === "STYLE") return NodeFilter.FILTER_REJECT;
        // 跳過 SVG (Mermaid 流程圖) — 在 SVG 內插入 HTML <mark> 會讓文字消失
        if (p.closest("svg")) return NodeFilter.FILTER_REJECT;
        return node.nodeValue && node.nodeValue.length > 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes: Text[] = [];
    let n = walker.nextNode();
    while (n) {
      nodes.push(n as Text);
      n = walker.nextNode();
    }
    const collected: HTMLElement[] = [];
    nodes.forEach((node) => {
      const text = node.nodeValue ?? "";
      const lc = text.toLowerCase();
      let idx = lc.indexOf(needle);
      if (idx === -1) return;
      const frag = document.createDocumentFragment();
      let last = 0;
      while (idx !== -1) {
        if (idx > last) {
          frag.appendChild(document.createTextNode(text.slice(last, idx)));
        }
        const mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = text.slice(idx, idx + term.length);
        frag.appendChild(mark);
        collected.push(mark);
        last = idx + term.length;
        idx = lc.indexOf(needle, last);
      }
      if (last < text.length) {
        frag.appendChild(document.createTextNode(text.slice(last)));
      }
      node.parentNode?.replaceChild(frag, node);
    });
    marksRef.current = collected;
    setCount(collected.length);
    if (collected.length > 0) {
      collected[0].classList.add("search-hit-active");
      collected[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => {
      if (containerRef.current) clear(containerRef.current);
    };
  }, [term, contentKey, containerRef]);

  const jump = (dir: 1 | -1) => {
    const marks = marksRef.current;
    if (marks.length === 0) return;
    const next = (active + dir + marks.length) % marks.length;
    marks[active]?.classList.remove("search-hit-active");
    marks[next].classList.add("search-hit-active");
    marks[next].scrollIntoView({ behavior: "smooth", block: "center" });
    setActive(next);
  };

  return (
    <div className="glass sticky top-4 z-20 mt-4 flex items-center gap-2 rounded-full px-4 py-2">
      <Search className="size-4 text-muted-foreground" aria-hidden />
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="在此篇文章中搜尋..."
        className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        aria-label="文章內搜尋"
      />
      {term && (
        <>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {count === 0 ? "無" : `${active + 1} / ${count}`}
          </span>
          <button
            type="button"
            onClick={() => jump(-1)}
            disabled={count === 0}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
            aria-label="上一個"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => jump(1)}
            disabled={count === 0}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
            aria-label="下一個"
          >
            <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setTerm("")}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="清除搜尋"
          >
            <X className="size-4" />
          </button>
        </>
      )}
    </div>
  );
}
