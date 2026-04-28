"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { Copy, Crosshair, Camera, Sparkles, Search, Code } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocatorBotProps {
  selector: string;
  targetName: string;
  description?: string;
  tip?: string;
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

function escapeLocatorValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function getLocatorHints(selector: string) {
  const hints = [] as Array<{ label: string; code: string; language: string }>;
  const escaped = escapeLocatorValue(selector);
  const isXPath = selector.startsWith("/") || selector.startsWith("(");

  if (isXPath) {
    hints.push({
      label: "Playwright (XPath)",
      code: `await page.locator('xpath=${selector}').click();`,
      language: "typescript",
    });
    hints.push({
      label: "Selenium (Java XPath)",
      code: `WebElement element = driver.findElement(By.xpath("${escaped}"));`,
      language: "java",
    });
    hints.push({
      label: "Selenium (Py XPath)",
      code: `element = driver.find_element(By.XPATH, "${escaped}")`,
      language: "python",
    });
  } else {
    hints.push({
      label: "Playwright (CSS)",
      code: `await page.locator("${escaped}").click();`,
      language: "typescript",
    });
    hints.push({
      label: "Selenium (Java CSS)",
      code: `WebElement element = driver.findElement(By.cssSelector("${escaped}"));`,
      language: "java",
    });
    hints.push({
      label: "Selenium (Py CSS)",
      code: `element = driver.find_element(By.CSS_SELECTOR, "${escaped}")`,
      language: "python",
    });
  }

  return hints;
}

export function LocatorBot({ selector, targetName, description, tip }: LocatorBotProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [customSelector, setCustomSelector] = useState("");

  const currentSelector = customSelector || selector;
  const hints = useMemo(() => getLocatorHints(currentSelector), [currentSelector]);

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
      } catch (error) {
        console.error(error);
        setError("Failed to capture element HTML.");
      } finally {
        element.classList.remove(HIGHLIGHT_CLASS);
        setLoading(false);
      }
    }

    capture();
  }, [currentSelector]);

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
    <div className="rounded-3xl border border-border bg-card p-6 shadow-lg space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">LocatorBot</p>
          <h2 className="mt-2 text-xl font-bold">{targetName}</h2>
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <Button variant="outline" size="sm" onClick={handleTrySelector} className="shrink-0">
          <Crosshair className="h-4 w-4" />
          Try selector
        </Button>
      </div>

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

      <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
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

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-slate-950/40 p-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Recommended locators</p>
            <div className="space-y-3">
              {hints.map((hint) => (
                <div key={hint.label} className="rounded-2xl border border-border bg-background/70 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {hint.label}
                    </span>
                    <Button
                      variant={copied === hint.code ? "secondary" : "outline"}
                      size="icon"
                      onClick={() => handleCopy(hint.code)}
                      aria-label={`Copy ${hint.label} code`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-xs text-foreground">{hint.code}</pre>
                </div>
              ))}
            </div>
          </div>

          {tip ? (
            <div className="rounded-2xl border border-border bg-slate-950/40 p-4">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Tip</p>
              <p className="text-sm text-foreground">{tip}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
