"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { Image as ImageIcon, Loader2 } from "lucide-react";

export default function LazyLoadingPage() {
  // Fix 1: initialize directly in useState — no need for a useEffect just to set initial state
  const [items, setItems] = useState<number[]>([1, 2, 3, 4]);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  // Fix 2: declare loadMore before the useEffect that uses it, wrapped in useCallback
  // so the dependency array stays stable and we don't recreate it every render
  const loadMore = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setItems((prev) => [
      ...prev,
      ...Array.from({ length: 4 }, (_, i) => prev.length + i + 1),
    ]);
    setLoading(false);
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
  }, [loading, loadMore]);

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
        selector={`//*[contains(text(), 'Loaded via IntersectionObserver')]`}
        playwright={`import { test, expect } from '@playwright/test';

test('lazy loads more items on scroll', async ({ page }) => {
  await page.goto('/elements/lazy-loading');
  await expect(page.getByText('Item #1')).toBeVisible();
  // Scroll the trigger into view to fire the IntersectionObserver
  await page.getByText(/Scroll down to load more/).scrollIntoViewIfNeeded();
  await expect(page.getByText('Item #6')).toBeVisible({ timeout: 5000 });
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_lazy_loads_more(page):
    page.goto("/elements/lazy-loading")
    expect(page.get_by_text("Item #1")).to_be_visible()
    page.get_by_text("Scroll down to load more").scroll_into_view_if_needed()
    expect(page.get_by_text("Item #6")).to_be_visible(timeout=5000)`}
        java={`import java.time.Duration;
import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

class LazyLoadingTest {
    @Test
    void lazyLoadsMore() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/lazy-loading");
        WebElement trigger = driver.findElement(
            By.xpath("//*[contains(., 'Scroll down to load more')]"));
        ((JavascriptExecutor) driver)
            .executeScript("arguments[0].scrollIntoView({block:'center'})", trigger);
        new WebDriverWait(driver, Duration.ofSeconds(5))
            .until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(), 'Item #6')]")));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_lazy_loads_more():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/lazy-loading")
    trigger = driver.find_element(
        By.XPATH, "//*[contains(., 'Scroll down to load more')]")
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})", trigger)
    WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Item #6')]"))
    )
    driver.quit()`}
        tip="IntersectionObserver fires when an element enters the viewport — but only if the test actually scrolls. scrollIntoView the sentinel, not the items. Always wait on the new content's visibility, never sleep for a fixed duration."
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
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        Image #{id}
      </span>
    </div>
  );
}
