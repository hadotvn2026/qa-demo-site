"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { Bot, BookOpen, Brain, Copy, Crosshair, MousePointerClick, Sparkles, Search, Code, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocatorBotProps {
  selector: string;
  targetName: string;
  description?: string;
}

const HIGHLIGHT_CLASS = "locator-bot-highlight";
const HIGHLIGHT_STYLE_ID = "locator-bot-highlight-style";

function ensureHighlightStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = HIGHLIGHT_STYLE_ID;
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: 2px solid #38bdf8 !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 5px rgba(56, 189, 248, 0.3) !important;
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

function highlightSelector(selector: string): { matched: number; isXPath: boolean } {
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

function rateLocator(loc: string): number {
  if (/data-testid|aria-label/i.test(loc)) return 5;
  if (/(@id\s*=|\[id=)/.test(loc)) return 4;
  if (/(^|[^\w-])#[a-z][\w-]*/i.test(loc)) return 4;
  if (/(@name\s*=|\[name=)/.test(loc)) return 4;
  if (/(@role\s*=|\[role=)/.test(loc)) return 4;
  if (/(@(href|for)\s*=|\[(href|for)=)/.test(loc)) return 3;
  if (/(@(type|alt|title|placeholder)\s*=|\[(type|alt|title|placeholder)=)/.test(loc)) return 3;
  if (/(contains\(text\(\)|:contains\(|normalize-space\(\)\s*=|text\(\)\s*=)/.test(loc)) {
    return /^\/\/\*/.test(loc) ? 2 : 3;
  }
  if (/:(disabled|checked|enabled)/.test(loc)) return 3;
  if (/:nth-(of-type|child|last-child|last-of-type)/.test(loc)) return 2;
  if (/^\.[a-z]/i.test(loc) || /^[a-z]+\.[a-z]/i.test(loc)) return 2;
  if (/^\/\/[a-z]+$/.test(loc) || /^[a-z]+$/.test(loc)) return 1;
  return 2;
}

function sortByRating<T>(items: T[], getValue: (t: T) => string): T[] {
  return [...items].sort((a, b) => {
    const diff = rateLocator(getValue(b)) - rateLocator(getValue(a));
    if (diff !== 0) return diff;
    return getValue(a).localeCompare(getValue(b));
  });
}

function generateSelector(el: Element): string {
  if (el.id) return `#${CSS.escape(el.id)}`;

  const name = el.getAttribute("name");
  if (name) return `${el.tagName.toLowerCase()}[name="${name}"]`;

  const testId = el.getAttribute("data-testid");
  if (testId) return `[data-testid="${testId}"]`;

  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur.nodeType === 1 && cur !== document.documentElement) {
    const node: Element = cur;
    if (node.id) {
      parts.unshift(`#${CSS.escape(node.id)}`);
      break;
    }
    let part = node.tagName.toLowerCase();
    const parent: Element | null = node.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === node.tagName,
      );
      if (siblings.length > 1) {
        part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      }
    }
    parts.unshift(part);
    cur = parent;
  }
  return parts.join(" > ");
}

interface ElementAnalysis {
  tag: string;
  text: string;
  attrs: Array<{ name: string; value: string }>;
  cssCandidates: string[];
  xpathCandidates: string[];
  cheatsheetMatches: CheatsheetMatch[];
}

interface CheatsheetMatch {
  recipe: string;
  xpath: string | null;
  css: string | null;
}

const SKIP_ATTRS = new Set(["class", "style"]);
const NOISY_ATTR_VALUES: Record<string, Set<string>> = {
  type: new Set(["text"]),
};

function isMeaningfulAttr(name: string, value: string): boolean {
  if (SKIP_ATTRS.has(name)) return false;
  if (!value) return false;
  if (NOISY_ATTR_VALUES[name]?.has(value)) return false;
  return true;
}

function xpathLiteral(s: string): string {
  if (!s.includes('"')) return `"${s}"`;
  if (!s.includes("'")) return `'${s}'`;
  const parts = s.split('"');
  return (
    "concat(" +
    parts
      .map((p, i) => `"${p}"${i < parts.length - 1 ? `, '"'` : ""}`)
      .join(", ") +
    ")"
  );
}

function buildSelectorCandidates(
  tag: string,
  text: string,
  attrs: Array<{ name: string; value: string }>,
): { css: string[]; xpath: string[] } {
  const css: string[] = [tag];
  const xpath: string[] = [`//${tag}`];

  for (const { name, value } of attrs) {
    if (name === "id") {
      css.push(`#${value}`);
      css.push(`${tag}#${value}`);
      xpath.push(`//${tag}[@id=${xpathLiteral(value)}]`);
      xpath.push(`//*[@id=${xpathLiteral(value)}]`);
    } else {
      const cssVal = JSON.stringify(value);
      css.push(`[${name}=${cssVal}]`);
      css.push(`${tag}[${name}=${cssVal}]`);
      xpath.push(`//${tag}[@${name}=${xpathLiteral(value)}]`);
      xpath.push(`//*[@${name}=${xpathLiteral(value)}]`);
    }
  }

  if (attrs.length >= 2) {
    const cssCombined =
      tag +
      attrs
        .filter((a) => a.name !== "id")
        .map((a) => `[${a.name}=${JSON.stringify(a.value)}]`)
        .join("");
    if (cssCombined !== tag) css.push(cssCombined);
    const xpathConds = attrs
      .map((a) => `@${a.name}=${xpathLiteral(a.value)}`)
      .join(" and ");
    xpath.push(`//${tag}[${xpathConds}]`);
  }

  if (text && text.length <= 80) {
    xpath.push(`//${tag}[normalize-space()=${xpathLiteral(text)}]`);
    xpath.push(`//${tag}[contains(., ${xpathLiteral(text)})]`);
    xpath.push(`//${tag}[text()=${xpathLiteral(text)}]`);
  }

  return {
    css: Array.from(new Set(css)),
    xpath: Array.from(new Set(xpath)),
  };
}

function matchCheatsheetRecipes(el: Element, text: string): CheatsheetMatch[] {
  const tag = el.tagName.toLowerCase();
  const matches: CheatsheetMatch[] = [];
  const cssAttr = (v: string) => JSON.stringify(v);

  const id = el.id || null;
  const name = el.getAttribute("name");
  const cls = (typeof el.className === "string" ? el.className : "").trim();
  const role = el.getAttribute("role");
  const type = el.getAttribute("type");
  const placeholder = el.getAttribute("placeholder");
  const ariaLabel = el.getAttribute("aria-label");
  const href = el.getAttribute("href");
  const testId = el.getAttribute("data-testid");
  const alt = el.getAttribute("alt");
  const title = el.getAttribute("title");
  const isDisabled = el.hasAttribute("disabled");
  const isChecked =
    el.hasAttribute("checked") ||
    (el instanceof HTMLInputElement && el.checked === true);

  matches.push({
    recipe: "Element <E> by relative reference",
    xpath: `//${tag}`,
    css: tag,
  });

  if (tag === "img") {
    matches.push({ recipe: "Image element", xpath: "//img", css: "img" });
  }
  if (tag === "a") {
    matches.push({ recipe: "Link element", xpath: "//a", css: "a" });
  }

  if (id) {
    matches.push({
      recipe: "Element with id I",
      xpath: `//*[@id=${xpathLiteral(id)}]`,
      css: `#${CSS.escape(id)}`,
    });
    matches.push({
      recipe: "Element <E> with id I",
      xpath: `//${tag}[@id=${xpathLiteral(id)}]`,
      css: `${tag}#${CSS.escape(id)}`,
    });
  }

  if (name) {
    matches.push({
      recipe: "Element with name N",
      xpath: `//*[@name=${xpathLiteral(name)}]`,
      css: `[name=${cssAttr(name)}]`,
    });
    matches.push({
      recipe: "Element <E> with name N",
      xpath: `//${tag}[@name=${xpathLiteral(name)}]`,
      css: `${tag}[name=${cssAttr(name)}]`,
    });
  }

  if (cls) {
    const firstClass = cls.split(/\s+/).filter(Boolean)[0];
    if (firstClass) {
      matches.push({
        recipe: "Element with a class C",
        xpath: `//*[contains(concat(' ', @class, ' '), ' ${firstClass} ')]`,
        css: `.${CSS.escape(firstClass)}`,
      });
      matches.push({
        recipe: "Element <E> with a class C",
        xpath: `//${tag}[contains(concat(' ', @class, ' '), ' ${firstClass} ')]`,
        css: `${tag}.${CSS.escape(firstClass)}`,
      });
    }
  }

  const labeledAttrs: Array<[string, string | null]> = [
    ["type", type],
    ["placeholder", placeholder],
    ["aria-label", ariaLabel],
    ["role", role],
    ["data-testid", testId],
    ["alt", alt],
    ["title", title],
  ];
  for (const [a, v] of labeledAttrs) {
    if (!v) continue;
    matches.push({
      recipe: `Element <E> with attribute @${a} = '${v}' exactly`,
      xpath: `//${tag}[@${a}=${xpathLiteral(v)}]`,
      css: `${tag}[${a}=${cssAttr(v)}]`,
    });
  }

  if (tag === "a" && href) {
    matches.push({
      recipe: "<a> with target link 'url'",
      xpath: `//a[@href=${xpathLiteral(href)}]`,
      css: `a[href=${cssAttr(href)}]`,
    });
  }

  if (text) {
    matches.push({
      recipe: "Element containing text 't' exactly",
      xpath: `//*[normalize-space()=${xpathLiteral(text)}]`,
      css: null,
    });
    matches.push({
      recipe: "Element <E> containing text 't'",
      xpath: `//${tag}[contains(text(),${xpathLiteral(text)})]`,
      css: `${tag}:contains(${cssAttr(text)})`,
    });
    if (tag === "a") {
      matches.push({
        recipe: "<a> containing text 't' exactly",
        xpath: `//a[.=${xpathLiteral(text)}]`,
        css: null,
      });
    }
  }

  if (isDisabled) {
    matches.push({
      recipe: "User interface element <E> that is disabled",
      xpath: `//${tag}[@disabled]`,
      css: `${tag}:disabled`,
    });
  }

  if (isChecked) {
    matches.push({
      recipe: "Checkbox (or radio button) that is checked",
      xpath: "//*[@checked]",
      css: "*:checked",
    });
  }

  return matches;
}

function analyzeElement(el: Element): ElementAnalysis {
  const tag = el.tagName.toLowerCase();
  const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);

  const attrs: Array<{ name: string; value: string }> = [];
  for (const attr of Array.from(el.attributes)) {
    if (isMeaningfulAttr(attr.name, attr.value)) {
      attrs.push({ name: attr.name, value: attr.value });
    }
  }

  const { css, xpath } = buildSelectorCandidates(tag, text, attrs);
  const cheatsheetMatches = matchCheatsheetRecipes(el, text);
  return {
    tag,
    text,
    attrs,
    cssCandidates: css,
    xpathCandidates: xpath,
    cheatsheetMatches,
  };
}

export function LocatorBot({ selector, targetName, description }: LocatorBotProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [customSelector, setCustomSelector] = useState("");
  const [picking, setPicking] = useState(false);
  const [analysis, setAnalysis] = useState<ElementAnalysis | null>(null);
  const [thinkStage, setThinkStage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSelector = customSelector || selector;

  useEffect(() => {
    if (!picking) return;

    let lastHovered: Element | null = null;
    const isInBot = (el: Element | null) =>
      !!el && !!containerRef.current && containerRef.current.contains(el);

    const clearHover = () => {
      if (lastHovered) {
        lastHovered.classList.remove(HIGHLIGHT_CLASS);
        lastHovered = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || isInBot(target)) {
        clearHover();
        return;
      }
      if (lastHovered === target) return;
      clearHover();
      target.classList.add(HIGHLIGHT_CLASS);
      lastHovered = target;
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || isInBot(target)) return;
      e.preventDefault();
      e.stopPropagation();
      const sel = generateSelector(target);
      clearHover();
      setCustomSelector(sel);
      setPicking(false);
      toast.success(`Picked: ${sel}`);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearHover();
        setPicking(false);
      }
    };

    ensureHighlightStyle();
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";

    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      document.body.style.cursor = prevCursor;
      clearHover();
    };
  }, [picking]);

  useEffect(() => {
    async function capture() {
      if (typeof document === "undefined") return;
      const element = document.querySelector(currentSelector);
      if (!element) {
        setError("Could not find the target element.");
        setHtmlContent(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        ensureHighlightStyle();
        element.classList.add(HIGHLIGHT_CLASS);

        // Get the outer HTML of the element
        const html = element.outerHTML;
        setHtmlContent(html);
        setAnalysis(analyzeElement(element));
      } catch (error) {
        console.error(error);
        setError("Failed to capture element HTML.");
        setAnalysis(null);
      } finally {
        element.classList.remove(HIGHLIGHT_CLASS);
        setLoading(false);
      }
    }

    capture();
  }, [currentSelector]);

  useEffect(() => {
    if (!analysis) {
      const reset = window.setTimeout(() => setThinkStage(0), 0);
      return () => window.clearTimeout(reset);
    }
    const delays = [0, 350, 700, 1050, 1500, 1950, 2350];
    const timers = delays.map((d, i) =>
      window.setTimeout(() => setThinkStage(i), d),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [analysis]);

  const handleTrySelector = () => {
    const { matched, isXPath } = highlightSelector(currentSelector);
    if (matched > 0) {
      toast.success(`Matched ${matched} element${matched === 1 ? "" : "s"} via ${isXPath ? "XPath" : "CSS"}`);
    } else {
      toast.error(`No elements match this ${isXPath ? "XPath" : "CSS"} on the current page`);
    }
  };

  const handleInspectCustom = () => {
    if (!customSelector.trim()) {
      toast.error("Please enter a selector to inspect");
      return;
    }
    handleTrySelector();
  };

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div ref={containerRef} className="rounded-3xl border border-border bg-card p-6 shadow-lg space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Bot className="h-6 w-6 text-sky-400" aria-label="LocatorBot" />
          <h2 className="mt-2 text-xl font-bold">{targetName}</h2>
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant={picking ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPicking((p) => !p)}
            aria-pressed={picking}
          >
            <MousePointerClick className="h-4 w-4" />
            {picking ? "Cancel pick (Esc)" : "Pick element"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleTrySelector}>
            <Crosshair className="h-4 w-4" />
            Try selector
          </Button>
        </div>
      </div>
      {picking ? (
        <p className="-mt-3 text-xs text-sky-400">
          Click any element on the page to capture its locator. Press Esc to cancel.
        </p>
      ) : null}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Inspect custom locator</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter CSS selector or XPath (e.g., #username, //input[@name='email'])"
            value={customSelector}
            onChange={(e) => setCustomSelector(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleInspectCustom}
            disabled={!customSelector.trim()}
          >
            <Crosshair className="h-4 w-4" />
            Inspect
          </Button>
        </div>
        {customSelector && (
          <p className="text-xs text-muted-foreground">
            Current selector: <code className="bg-muted px-1 py-0.5 rounded text-xs">{currentSelector}</code>
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-slate-950/40 p-3 min-h-[12rem] flex flex-col">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
          <Code className="h-4 w-4" aria-hidden="true" />
          <span>Element HTML</span>
        </div>
        <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-black/40">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Capturing element HTML...</div>
          ) : htmlContent ? (
            <div className="h-full overflow-auto p-4">
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                {htmlContent}
              </pre>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
              <Sparkles className="h-5 w-5" />
              <p>{error ?? "No element HTML available."}</p>
            </div>
          )}
        </div>
      </div>

      <BrainstormPanel
        analysis={analysis}
        stage={thinkStage}
        copied={copied}
        onCopy={handleCopy}
      />

      <CheatsheetPanel
        matches={analysis?.cheatsheetMatches ?? null}
        copied={copied}
        onCopy={handleCopy}
      />
    </div>
  );
}

interface BrainstormPanelProps {
  analysis: ElementAnalysis | null;
  stage: number;
  copied: string | null;
  onCopy: (code: string) => void;
}

function BrainstormPanel({ analysis, stage, copied, onCopy }: BrainstormPanelProps) {
  const thinking = analysis !== null && stage < 6;

  return (
    <div className="rounded-2xl border border-border bg-slate-950/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Brain
          className={`h-4 w-4 text-purple-400 ${thinking ? "animate-pulse" : ""}`}
          aria-hidden="true"
        />
        <span className="text-sm font-semibold">Brainstorm</span>
        <span className="text-xs text-muted-foreground">
          {analysis === null
            ? "Waiting for an element…"
            : thinking
              ? "Reasoning about this element…"
              : "Reasoning complete."}
        </span>
      </div>

      {analysis === null ? (
        <p className="text-xs text-muted-foreground italic">
          Pick or query an element to see candidate locators.
        </p>
      ) : (
        <div className="space-y-2 font-mono text-sm">
          <ThinkingLine show={stage >= 1}>
            <span className="text-muted-foreground">→ tagName:</span>{" "}
            <code className="text-sky-400">{analysis.tag}</code>
          </ThinkingLine>

          <ThinkingLine show={stage >= 2}>
            <span className="text-muted-foreground">→ Distinctive attributes:</span>{" "}
            {analysis.attrs.length === 0 ? (
              <span className="italic text-muted-foreground">none worth using</span>
            ) : (
              <span className="inline-flex flex-wrap gap-1 align-middle">
                {analysis.attrs.map((a) => (
                  <code
                    key={a.name}
                    className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-300"
                  >
                    {a.name}=&quot;{a.value}&quot;
                  </code>
                ))}
              </span>
            )}
          </ThinkingLine>

          <ThinkingLine show={stage >= 3}>
            <span className="text-muted-foreground">→ Text content:</span>{" "}
            {analysis.text ? (
              <code className="text-amber-300">&quot;{analysis.text}&quot;</code>
            ) : (
              <span className="italic text-muted-foreground">(empty)</span>
            )}
          </ThinkingLine>

          {stage >= 4 && (
            <CandidateList
              label="Possible CSS selectors"
              accent="text-cyan-300"
              items={analysis.cssCandidates}
              copied={copied}
              onCopy={onCopy}
            />
          )}

          {stage >= 5 && (
            <CandidateList
              label="Possible XPath selectors"
              accent="text-violet-300"
              items={analysis.xpathCandidates}
              copied={copied}
              onCopy={onCopy}
            />
          )}

          {stage >= 6 && (
            <p className="mt-3 animate-in fade-in text-xs italic text-muted-foreground">
              ✓ Reasoning complete — pick the locator that best survives a UI refactor.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ThinkingLine({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
      {children}
    </div>
  );
}

interface CandidateListProps {
  label: string;
  accent: string;
  items: string[];
  copied: string | null;
  onCopy: (code: string) => void;
}

function CandidateList({ label, accent, items, copied, onCopy }: CandidateListProps) {
  const sorted = sortByRating(items, (s) => s);
  return (
    <div className="mt-3 space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="text-muted-foreground">→ {label}:</div>
      <div className="ml-4 space-y-1">
        {sorted.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <StarRating value={rateLocator(s)} />
            <code className={`flex-1 break-all text-xs ${accent}`}>{s}</code>
            <Button
              variant={copied === s ? "secondary" : "ghost"}
              size="icon"
              onClick={() => onCopy(s)}
              className="h-6 w-6 shrink-0"
              aria-label={`Copy ${s}`}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, value));
  return (
    <span
      className="inline-flex shrink-0 items-center gap-0.5"
      aria-label={`Recommendation: ${clamped} out of 5`}
      title={`${clamped} / 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < clamped ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  );
}

interface CheatsheetPanelProps {
  matches: CheatsheetMatch[] | null;
  copied: string | null;
  onCopy: (code: string) => void;
}

function CheatsheetPanel({ matches, copied, onCopy }: CheatsheetPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-slate-950/40 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-300" aria-hidden="true" />
          <span className="text-sm font-semibold">Cheatsheet matches</span>
          <span className="text-xs text-muted-foreground">
            Named recipes from the Rosetta Stone, instantiated for this element.
          </span>
        </div>
        <Link
          href="/cheatsheet"
          className="inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
        >
          View full cheatsheet
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {!matches || matches.length === 0 ? (
        <p className="text-xs italic text-muted-foreground">
          Pick or query an element to surface matching recipes.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-2 py-2 font-medium">Score</th>
                <th className="px-2 py-2 font-medium">Recipe</th>
                <th className="px-2 py-2 font-medium text-emerald-300">XPath</th>
                <th className="px-2 py-2 font-medium text-sky-300">CSS</th>
              </tr>
            </thead>
            <tbody>
              {[...matches]
                .map((m) => ({
                  ...m,
                  score: Math.max(
                    m.xpath ? rateLocator(m.xpath) : 0,
                    m.css ? rateLocator(m.css) : 0,
                  ),
                }))
                .sort((a, b) => b.score - a.score)
                .map((m, i) => (
                  <tr
                    key={`${m.recipe}-${i}`}
                    className="border-t border-border/60 align-top hover:bg-muted/10"
                  >
                    <td className="px-2 py-2">
                      <StarRating value={m.score} />
                    </td>
                    <td className="px-2 py-2 font-medium text-foreground">{m.recipe}</td>
                    <td className="px-2 py-2">
                      <CheatsheetCell
                        value={m.xpath}
                        accent="text-emerald-300"
                        copied={copied === m.xpath}
                        onCopy={onCopy}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <CheatsheetCell
                        value={m.css}
                        accent="text-sky-300"
                        copied={copied === m.css}
                        onCopy={onCopy}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CheatsheetCell({
  value,
  accent,
  copied,
  onCopy,
}: {
  value: string | null;
  accent: string;
  copied: boolean;
  onCopy: (code: string) => void;
}) {
  if (!value) {
    return <span className="italic text-muted-foreground/60">NA</span>;
  }
  return (
    <div className="flex items-start gap-1.5">
      <code className={`flex-1 break-all font-mono ${accent}`}>{value}</code>
      <Button
        variant={copied ? "secondary" : "ghost"}
        size="icon"
        onClick={() => onCopy(value)}
        className="h-5 w-5 shrink-0"
        aria-label={`Copy ${value}`}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
}
