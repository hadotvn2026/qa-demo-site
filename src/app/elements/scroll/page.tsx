"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { ArrowDown, MoveDown } from "lucide-react";

export default function ScrollPage() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const nestedRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Scroll Management</h1>
        <p className="text-muted-foreground">
          Practice scrolling the page, specific elements into view, and handling nested overflow containers.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Scroll Into View */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Scroll Into View</CardTitle>
            <CardDescription>Click to jump to the target at the bottom of the page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={scrollToBottom} className="w-full gap-2">
              <ArrowDown className="h-4 w-4" />
              Scroll to Target
            </Button>
          </CardContent>
        </Card>

        {/* Nested Overflow */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Nested Overflow</CardTitle>
            <CardDescription>A container with its own scrollbar. The typical Selenium gotcha.</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              ref={nestedRef}
              className="h-48 w-full overflow-y-auto rounded-md border border-border bg-muted/50 p-4 space-y-4"
            >
              <p className="text-sm text-muted-foreground">Scroll down to find the hidden button...</p>
              <div className="h-64" />
              <Button id="nested-button" variant="secondary" className="w-full">
                Hidden Button Found!
              </Button>
              <div className="h-12" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Long spacer for page scroll */}
      <div className="h-[150vh]" />

      <div ref={bottomRef} className="p-8 rounded-xl border border-primary bg-primary/5 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Target Reached!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          You successfully scrolled this element into the viewport.
        </p>
      </div>

      <TipDrawer
        selector={`#nested-button`}
        playwright={`import { test, expect } from '@playwright/test';

test('clicks button hidden inside scroll container', async ({ page }) => {
  await page.goto('/elements/scroll');
  const btn = page.locator('#nested-button');
  await btn.scrollIntoViewIfNeeded();
  await expect(btn).toBeVisible();
  await btn.click();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_clicks_nested_button(page):
    page.goto("/elements/scroll")
    btn = page.locator("#nested-button")
    btn.scroll_into_view_if_needed()
    expect(btn).to_be_visible()
    btn.click()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertTrue;

class ScrollTest {
    @Test
    void clicksNestedButton() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/scroll");
        WebElement btn = driver.findElement(By.id("nested-button"));
        ((JavascriptExecutor) driver)
            .executeScript("arguments[0].scrollIntoView({block:'center'})", btn);
        assertTrue(btn.isDisplayed());
        btn.click();
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_clicks_nested_button():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/scroll")
    btn = driver.find_element(By.ID, "nested-button")
    driver.execute_script("arguments[0].scrollIntoView({block:'center'})", btn)
    assert btn.is_displayed()
    btn.click()
    driver.quit()`}
        tip="Selenium's WebElement.click() will scroll the *window*, not nested overflow containers — so the button stays clipped. Use JS scrollIntoView on the element itself. Playwright's scrollIntoViewIfNeeded handles both cases automatically."
      />
    </div>
  );
}
