"use client";

import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { cn } from "@/lib/utils";

export default function DropdownPage() {
  const [standardValue, setStandardValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [nativeValue, setNativeValue] = useState("");
  const [multipleValues, setMultipleValues] = useState<string[]>([]);

  const customOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dropdown</h1>
        <p className="text-muted-foreground">
          Standard shadcn select and a custom div-based implementation for tricky selector practice.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Standard Select */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Standard Select</CardTitle>
            <CardDescription>Uses Radix UI primitives with proper ARIA roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setStandardValue} value={standardValue}>
              <SelectTrigger data-testid="dropdown-shadcn-trigger" className="w-full h-11">
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="svelte">SvelteKit</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
                <SelectItem value="nuxt">Nuxt.js</SelectItem>
              </SelectContent>
            </Select>
            {standardValue && (
              <p className="text-sm text-primary font-medium">Selected: {standardValue}</p>
            )}
          </CardContent>
        </Card>

        {/* Custom Div-based Select */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Custom Select</CardTitle>
            <CardDescription>A div-based dropdown with no native select or ARIA listbox roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div
                id="custom-select-trigger"
                data-testid="dropdown-custom-trigger"
                onClick={() => setIsCustomOpen(!isCustomOpen)}
                className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm hover:bg-secondary/50 cursor-pointer"
              >
                <span>{customValue || "Pick an option"}</span>
                <span className={cn("transition-transform duration-200", isCustomOpen && "rotate-180")}>▼</span>
              </div>

              {isCustomOpen && (
                <div className="absolute top-12 left-0 z-50 w-full rounded-md border border-border bg-card py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
                  {customOptions.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setCustomValue(opt);
                        setIsCustomOpen(false);
                      }}
                      className="px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {customValue && (
              <p className="text-sm text-primary font-medium">Selected: {customValue}</p>
            )}
          </CardContent>
        </Card>

        {/* Native Select (single) */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Native Select</CardTitle>
            <CardDescription>
              Real <code className="text-primary">&lt;select&gt;</code> with{" "}
              <code className="text-primary">&lt;option&gt;</code> children — works with Selenium&apos;s{" "}
              <code className="text-primary">Select</code> helper.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              id="native-framework"
              name="framework"
              data-testid="dropdown-native"
              value={nativeValue}
              onChange={(e) => setNativeValue(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a framework</option>
              <option value="next">Next.js</option>
              <option value="svelte">SvelteKit</option>
              <option value="astro">Astro</option>
              <option value="nuxt">Nuxt.js</option>
              <option value="remix" disabled>
                Remix (disabled)
              </option>
            </select>
            {nativeValue && (
              <p className="text-sm font-medium text-primary">Selected: {nativeValue}</p>
            )}
          </CardContent>
        </Card>

        {/* Native Multi-Select */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Multiple Select</CardTitle>
            <CardDescription>
              <code className="text-primary">&lt;select multiple&gt;</code> — hold ⌘/Ctrl to select more than one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              id="native-languages"
              name="languages"
              data-testid="dropdown-multiple"
              multiple
              value={multipleValues}
              onChange={(e) =>
                setMultipleValues(
                  Array.from(e.target.selectedOptions, (o) => o.value),
                )
              }
              className="h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ts">TypeScript</option>
              <option value="py">Python</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="kotlin">Kotlin</option>
            </select>
            {multipleValues.length > 0 && (
              <p className="text-sm font-medium text-primary">
                Selected: {multipleValues.join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <TipDrawer
        selector={`#custom-select-trigger`}
        playwright={`import { test, expect } from '@playwright/test';

test('selects option from custom dropdown', async ({ page }) => {
  await page.goto('/elements/dropdown');
  await page.locator('#custom-select-trigger').click();
  await page.getByText('Option 2').click();
  await expect(page.locator('#custom-select-trigger')).toContainText('Option 2');
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_selects_option(page):
    page.goto("/elements/dropdown")
    page.locator("#custom-select-trigger").click()
    page.get_by_text("Option 2").click()
    expect(page.locator("#custom-select-trigger")).to_contain_text("Option 2")`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertTrue;

class DropdownTest {
    @Test
    void selectsOption() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/dropdown");
        WebElement trigger = driver.findElement(By.id("custom-select-trigger"));
        trigger.click();
        driver.findElement(By.xpath("//*[normalize-space()='Option 2']")).click();
        assertTrue(trigger.getText().contains("Option 2"));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_selects_option():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/dropdown")
    trigger = driver.find_element(By.ID, "custom-select-trigger")
    trigger.click()
    driver.find_element(By.XPATH, "//*[normalize-space()='Option 2']").click()
    assert "Option 2" in trigger.text
    driver.quit()`}
        tip="Custom div-based dropdowns ignore the native <select> Selenium APIs. Click the trigger, then click an option found by visible text. Watch for portal-rendered menus that escape the trigger's parent — they're still in the DOM, just elsewhere."
      />
    </div>
  );
}
