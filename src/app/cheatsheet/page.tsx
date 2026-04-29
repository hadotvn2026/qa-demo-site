"use client";

import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { CHEATSHEET, type LocatorRecipe } from "./data";

const COLUMNS: Array<{
  key: keyof Pick<LocatorRecipe, "xpath" | "css" | "dom" | "selenium">;
  label: string;
  accent: string;
}> = [
  { key: "xpath", label: "XPath (1.0 – 2.0)", accent: "text-emerald-300" },
  { key: "css", label: "CSS (1 – 3)", accent: "text-sky-300" },
  { key: "dom", label: "DOM", accent: "text-amber-300" },
  { key: "selenium", label: "Selenium", accent: "text-violet-300" },
];

function recipeMatchesQuery(recipe: LocatorRecipe, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return [recipe.recipe, recipe.xpath, recipe.css, recipe.dom, recipe.selenium]
    .filter((v): v is string => Boolean(v))
    .some((v) => v.toLowerCase().includes(needle));
}

export default function CheatsheetPage() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query) return CHEATSHEET;
    return CHEATSHEET.map((cat) => ({
      ...cat,
      recipes: cat.recipes.filter((r) => recipeMatchesQuery(r, query)),
    })).filter((cat) => cat.recipes.length > 0);
  }, [query]);

  const totalRecipes = CHEATSHEET.reduce((sum, c) => sum + c.recipes.length, 0);
  const visibleRecipes = filtered.reduce((sum, c) => sum + c.recipes.length, 0);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      toast.success("Copied to clipboard");
      window.setTimeout(() => setCopied((v) => (v === value ? null : v)), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Locator Cheatsheet</h1>
        <p className="text-muted-foreground">
          XPath / CSS / DOM / Selenium Rosetta Stone — every recipe from Michael Sorens&apos;{" "}
          <a
            href="https://www.cheat-sheets.org/saved-copy/Locators_table_1_0_2.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline hover:text-primary"
          >
            v1.0.2 chart
            <ExternalLink className="h-3 w-3" />
          </a>
          . Click any pattern to copy.
        </p>
      </div>

      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="space-y-4 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cheatsheet-filter"
              placeholder="Filter recipes (e.g. nth-child, contains, starts-with, attribute)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>
              Showing <span className="font-semibold text-foreground">{visibleRecipes}</span> of{" "}
              {totalRecipes} recipes
            </span>
            <Legend swatch="bg-emerald-500/20 text-emerald-300" label="XPath" />
            <Legend swatch="bg-sky-500/20 text-sky-300" label="CSS" />
            <Legend swatch="bg-amber-500/20 text-amber-300" label="DOM" />
            <Legend swatch="bg-violet-500/20 text-violet-300" label="Selenium" />
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono">⌦</span>
            <span>= not supported by Selenium</span>
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono">{`{Se: …}`}</span>
            <span>= Selenium-only variation</span>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="border-border bg-card/50">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No recipes match <code className="text-foreground">{query}</code>.
          </CardContent>
        </Card>
      ) : (
        filtered.map((cat) => (
          <Card key={cat.name} className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">{cat.name}</CardTitle>
              <Badge variant="outline">{cat.recipes.length} recipe{cat.recipes.length === 1 ? "" : "s"}</Badge>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Recipe</th>
                    {COLUMNS.map((col) => (
                      <th key={col.key} className={cn("px-4 py-3 font-medium", col.accent)}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.recipes.map((r, i) => (
                    <tr
                      key={`${cat.name}-${i}`}
                      className="border-t border-border align-top hover:bg-muted/20"
                    >
                      <td className="w-[18rem] px-4 py-3 font-medium">
                        {r.recipe}
                      </td>
                      {COLUMNS.map((col) => {
                        const value = r[col.key];
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <PatternCell
                              value={value}
                              accent={col.accent}
                              onCopy={handleCopy}
                              copied={copied === value}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("inline-block h-2.5 w-2.5 rounded-sm", swatch.split(" ")[0])} />
      {label}
    </span>
  );
}

interface PatternCellProps {
  value: string | null;
  accent: string;
  copied: boolean;
  onCopy: (value: string) => void;
}

function PatternCell({ value, accent, copied, onCopy }: PatternCellProps) {
  if (!value) {
    return <span className="text-xs italic text-muted-foreground/60">NA</span>;
  }
  return (
    <div className="group/cell flex items-start gap-2">
      <code
        className={cn(
          "flex-1 break-all font-mono text-xs leading-relaxed",
          accent,
        )}
      >
        {value}
      </code>
      <Button
        variant={copied ? "secondary" : "ghost"}
        size="icon"
        onClick={() => onCopy(value)}
        className="h-7 w-7 shrink-0 opacity-60 transition-opacity group-hover/cell:opacity-100"
        aria-label={copied ? "Copied" : "Copy pattern"}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}
