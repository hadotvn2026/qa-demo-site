"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { Image as ImageIcon, Loader2 } from "lucide-react";

export default function LazyLoadingPage() {
  const [items, setItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    // Initial items
    setItems([1, 2, 3, 4]);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, items]);

  const loadMore = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setItems((prev) => [...prev, ...Array.from({ length: 4 }, (_, i) => prev.length + i + 1)]);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Lazy Loading</h1>
        <p className="text-muted-foreground">
          Infinite scroll and lazy image loading to test asynchronous content rendering.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((id) => (
          <Card key={id} className="overflow-hidden border-border bg-card/50">
            <div className="aspect-video bg-muted flex items-center justify-center relative">
              <LazyImage id={id} />
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-bold">Item #{id}</p>
              <p className="text-xs text-muted-foreground">Loaded via IntersectionObserver</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div ref={observerTarget} className="py-12 flex flex-col items-center justify-center gap-4">
        {loading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading more content...</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">Scroll down to load more</p>
        )}
      </div>

      <TipDrawer 
        playwright={`await page.waitForSelector('.item-6')`}
        java={`driver.findElement(By.cssSelector("..."));`}
        python={`driver.find_element(By.CSS_SELECTOR, "...")`}
        tip="Tests for lazy loading should avoid hard sleeps. Use 'waitForSelector' or check for the absence of a loading spinner. Ensure the page scrolls enough to trigger the intersection event."
      />
    </div>
  );
}

function LazyImage({ id }: { id: number }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) return <Skeleton className="h-full w-full" />;

  return (
    <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500">
      <ImageIcon className="h-12 w-12 text-primary/20" />
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Image #{id}</span>
    </div>
  );
}
