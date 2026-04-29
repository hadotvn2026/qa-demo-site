"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { ExternalLink, Mail, Hash, AlertTriangle, Home } from "lucide-react";

export default function HyperlinksPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hyperlinks</h1>
        <p className="text-muted-foreground">
          Different link behaviors to test tab management, response codes, and deep linking.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Same Tab */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              Internal Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link data-testid="link-internal" href="/" className="text-sm text-primary hover:underline font-medium">
              Back to Home
            </Link>
          </CardContent>
        </Card>

        {/* New Tab */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              New Tab Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              data-testid="link-new-tab"
              href="https://playwright.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              Open Playwright Docs
            </a>
          </CardContent>
        </Card>

        {/* Mailto */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Mailto Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a data-testid="link-mailto" href="mailto:support@flakelab.dev" className="text-sm text-primary hover:underline font-medium">
              Contact Support
            </a>
          </CardContent>
        </Card>

        {/* Broken Link */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Broken Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a data-testid="link-broken" href="/this-page-does-not-exist" className="text-sm text-destructive hover:underline font-medium">
              Go to 404 Page
            </a>
          </CardContent>
        </Card>

        {/* Anchor Jump */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              Anchor Jump
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a data-testid="link-anchor" href="#footer-target" className="text-sm text-primary hover:underline font-medium">
              Jump to Footer
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="h-[100vh] flex flex-col justify-end pb-8">
        <div id="footer-target" className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
          <p className="text-sm font-medium">⚓ You reached the anchor target!</p>
        </div>
      </div>

      <TipDrawer
        selector={`//a[normalize-space()='Open Playwright Docs']`}
        playwright={`import { test, expect } from '@playwright/test';

test('captures new tab', async ({ context, page }) => {
  await page.goto('/elements/hyperlinks');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Open Playwright Docs' }).click(),
  ]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/playwright\\.dev/);
});`}
        pythonPlaywright={`import re
from playwright.sync_api import expect

def test_captures_new_tab(page, context):
    page.goto("/elements/hyperlinks")
    with context.expect_page() as info:
        page.get_by_role("link", name="Open Playwright Docs").click()
    new_page = info.value
    new_page.wait_for_load_state()
    expect(new_page).to_have_url(re.compile(r"playwright\\.dev"))`}
        java={`import java.util.ArrayList;
import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertTrue;

class HyperlinksTest {
    @Test
    void capturesNewTab() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/hyperlinks");
        String original = driver.getWindowHandle();
        driver.findElement(
            By.xpath("//a[normalize-space()='Open Playwright Docs']")
        ).click();
        var handles = new ArrayList<>(driver.getWindowHandles());
        handles.remove(original);
        driver.switchTo().window(handles.get(0));
        assertTrue(driver.getCurrentUrl().contains("playwright.dev"));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_captures_new_tab():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/hyperlinks")
    original = driver.current_window_handle
    driver.find_element(
        By.XPATH, "//a[normalize-space()='Open Playwright Docs']"
    ).click()
    new_handle = next(h for h in driver.window_handles if h != original)
    driver.switch_to.window(new_handle)
    assert "playwright.dev" in driver.current_url
    driver.quit()`}
        tip="target='_blank' opens a new browser context. In Playwright wait for context.waitForEvent('page'); in Selenium track window_handles before/after the click and switchTo() the new one. For broken-link checks, intercept the network response code, not the visible text."
      />
    </div>
  );
}
