"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Code2, Copy, Check, Crosshair } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TipDrawerProps {
  playwright: string;
  pythonPlaywright: string;
  java: string;
  python: string;
  /** CSS selector or XPath (auto-detected; XPath if it starts with `/` or `(/`) used by the "Try selector" button. */
  selector?: string;
  tip: string;
}

type TabType = "playwright" | "pythonPlaywright" | "java" | "python";

const TABS: {
  id: TabType;
  label: string;
  filename: string;
  language: string;
  activeClass: string;
  accentText: string;
}[] = [
  {
    id: "playwright",
    label: "Playwright (TS)",
    filename: "test.spec.ts",
    language: "typescript",
    activeClass: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
    accentText: "text-emerald-400",
  },
  {
    id: "pythonPlaywright",
    label: "Playwright (Py)",
    filename: "test_example.py",
    language: "python",
    activeClass: "border-sky-500 bg-sky-500/10 text-sky-400",
    accentText: "text-sky-400",
  },
  {
    id: "java",
    label: "Selenium (Java/TestNG)",
    filename: "ExampleTest.java",
    language: "java",
    activeClass: "border-orange-500 bg-orange-500/10 text-orange-400",
    accentText: "text-orange-400",
  },
  {
    id: "python",
    label: "Selenium (Py/pytest)",
    filename: "test_example.py",
    language: "python",
    activeClass: "border-amber-400 bg-amber-400/10 text-amber-300",
    accentText: "text-amber-300",
  },
];

const HIGHLIGHT_CLASS = "tip-drawer-selector-highlight";
const HIGHLIGHT_STYLE_ID = "tip-drawer-highlight-style";

function ensureHighlightStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = HIGHLIGHT_STYLE_ID;
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: 2px solid #f59e0b !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.25) !important;
      transition: outline 0.2s, box-shadow 0.2s;
    }
  `;
  document.head.appendChild(style);
}

function clearHighlights() {
  if (typeof document === "undefined") return;
  document.querySelectorAll("." + HIGHLIGHT_CLASS).forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS);
  });
}

function trySelector(selector: string): { matched: number; isXPath: boolean } {
  if (typeof document === "undefined") return { matched: 0, isXPath: false };
  ensureHighlightStyle();
  clearHighlights();

  const isXPath = selector.startsWith("/") || selector.startsWith("(");
  let matched = 0;

  if (isXPath) {
    try {
      const result = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0; i < result.snapshotLength; i++) {
        const node = result.snapshotItem(i);
        if (node instanceof Element) {
          node.classList.add(HIGHLIGHT_CLASS);
          if (matched === 0) node.scrollIntoView({ behavior: "smooth", block: "center" });
          matched++;
        }
      }
    } catch {
      return { matched: 0, isXPath: true };
    }
  } else {
    try {
      const els = document.querySelectorAll(selector);
      els.forEach((el, i) => {
        el.classList.add(HIGHLIGHT_CLASS);
        if (i === 0) el.scrollIntoView({ behavior: "smooth", block: "center" });
        matched++;
      });
    } catch {
      return { matched: 0, isXPath: false };
    }
  }

  if (matched > 0) {
    window.setTimeout(clearHighlights, 2500);
  }
  return { matched, isXPath };
}

export function TipDrawer({
  playwright,
  pythonPlaywright,
  java,
  python,
  selector,
  tip,
}: TipDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("playwright");
  const [copied, setCopied] = useState(false);

  const codeMap: Record<TabType, string> = {
    playwright,
    pythonPlaywright,
    java,
    python,
  };

  const activeTabMeta = TABS.find((t) => t.id === activeTab)!;
  const code = codeMap[activeTab];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleTrySelector = () => {
    if (!selector) return;
    const { matched, isXPath } = trySelector(selector);
    if (matched > 0) {
      toast.success(
        `Matched ${matched} element${matched === 1 ? "" : "s"} via ${isXPath ? "XPath" : "CSS"}`
      );
    } else {
      toast.error(`No elements match this ${isXPath ? "XPath" : "CSS"} on the current page`);
    }
  };

  return (
    <div
      className={cn(
        "fixed right-0 top-1/2 z-50 flex -translate-y-1/2 transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-[calc(100%-2rem)]"
      )}
    >
      {/* Trigger Tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-32 w-8 items-center justify-center rounded-l-xl border-y border-l border-border bg-card text-muted-foreground hover:text-primary transition-colors"
      >
        <div className="flex -rotate-90 items-center gap-2 whitespace-nowrap text-xs font-bold tracking-widest uppercase">
          {isOpen ? <ChevronRight className="h-4 w-4 rotate-90" /> : <ChevronLeft className="h-4 w-4 rotate-90" />}
          Tips
        </div>
      </button>

      {/* Content Panel */}
      <div className="w-[28rem] border-l border-border bg-card p-6 shadow-2xl overflow-y-auto max-h-screen">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <Code2 className="h-5 w-5" />
          <h4 className="font-bold tracking-tight">Automation Tip</h4>
        </div>

        <div className="space-y-5">
          {/* Tabs */}
          <div className="flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded border-l-2 text-left transition-colors",
                  activeTab === tab.id
                    ? tab.activeClass
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="rounded-md border border-border bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              <span className={cn("text-[10px] font-mono", activeTabMeta.accentText)}>
                {activeTabMeta.filename}
              </span>
              <button
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy snippet"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <SyntaxHighlighter
              language={activeTabMeta.language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "0.75rem",
                background: "#1e1e1e",
                fontSize: "11px",
                lineHeight: "1.5",
              }}
              wrapLongLines
            >
              {code}
            </SyntaxHighlighter>
          </div>

          {/* Try selector */}
          {selector && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-2"
              onClick={handleTrySelector}
            >
              <Crosshair className="h-3.5 w-3.5" />
              Try selector on this page
            </Button>
          )}

          {/* Pro note */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Pro Note
            </p>
            <p className="text-sm text-foreground leading-relaxed">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
