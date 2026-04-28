"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function NestedFramesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Nested Frames</h1>
        <p className="text-muted-foreground">
          Practice navigating through nested iframe contexts to locate and interact with elements.
        </p>
      </div>

      <Card className="flex-1 border-border bg-card/50 flex flex-col min-h-[500px]">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Nested Frames Target</CardTitle>
          <CardDescription>An iframe containing other iframes. Find the text in the MIDDLE frame.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden relative min-h-[400px]">
          <iframe 
            src="/frames/nested.html" 
            title="nested frames"
            className="absolute inset-0 w-full h-full rounded-b-xl border-t border-border"
          />
        </CardContent>
      </Card>

      <div className="flex-shrink-0">
        <TipDrawer
        selector={`iframe[title="nested frames"]`}
        playwright={`import { test, expect } from '@playwright/test';

test('reads text from nested iframe', async ({ page }) => {
  await page.goto('/elements/nested-frames');
  const middle = page
    .frameLocator('iframe[title="nested frames"]')
    .frameLocator('[name="frame-middle"]');
  await expect(middle.locator('#content')).toBeVisible();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_reads_nested_iframe(page):
    page.goto("/elements/nested-frames")
    middle = (page
        .frame_locator('iframe[title="nested frames"]')
        .frame_locator('[name="frame-middle"]'))
    expect(middle.locator("#content")).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertTrue;

class NestedFramesTest {
    @Test
    void readsNestedIframe() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/nested-frames");
        driver.switchTo().frame(driver.findElement(
            By.cssSelector("iframe[title='nested frames']")));
        driver.switchTo().frame(driver.findElement(
            By.cssSelector("[name='frame-middle']")));
        assertTrue(driver.findElement(By.id("content")).isDisplayed());
        driver.switchTo().defaultContent();
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_reads_nested_iframe():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/nested-frames")
    driver.switch_to.frame(
        driver.find_element(By.CSS_SELECTOR, "iframe[title='nested frames']"))
    driver.switch_to.frame(
        driver.find_element(By.CSS_SELECTOR, "[name='frame-middle']"))
    assert driver.find_element(By.ID, "content").is_displayed()
    driver.switch_to.default_content()
    driver.quit()`}
        tip="Playwright's frameLocator() chains transparently and avoids context switches. Selenium needs an explicit switchTo().frame() per level — and switchTo().defaultContent() to escape. Forget the escape and your next selector mysteriously fails."
        />
      </div>
    </div>
  );
}
