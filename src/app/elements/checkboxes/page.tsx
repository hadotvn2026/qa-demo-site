"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function CheckboxesPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    native: false,
    shadcn: true,
    custom: false,
  });

  const toggle = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Checkboxes</h1>
        <p className="text-muted-foreground">
          Native inputs, ARIA-powered components, and custom-styled divs for testing interaction types.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Native Checkbox */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Native Input</CardTitle>
            <CardDescription>A standard HTML5 checkbox input.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="native-checkbox" 
              checked={checkedItems.native}
              onChange={() => toggle("native")}
              className="h-5 w-5 accent-primary"
            />
            <Label htmlFor="native-checkbox" className="cursor-pointer">Native Checkbox</Label>
          </CardContent>
        </Card>

        {/* Shadcn Checkbox */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Radix UI</CardTitle>
            <CardDescription>The shadcn/ui checkbox component.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Checkbox 
              id="shadcn-checkbox" 
              checked={checkedItems.shadcn}
              onCheckedChange={() => toggle("shadcn")}
            />
            <Label htmlFor="shadcn-checkbox" className="cursor-pointer">Shadcn Checkbox</Label>
          </CardContent>
        </Card>

        {/* Custom Div-based Checkbox */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Custom Div</CardTitle>
            <CardDescription>A styled div that acts like a checkbox but has no input tag.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div 
              id="custom-checkbox"
              onClick={() => toggle("custom")}
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded border transition-colors cursor-pointer",
                checkedItems.custom ? "bg-primary border-primary" : "border-input bg-transparent hover:border-primary/50"
              )}
            >
              {checkedItems.custom && <Check className="h-3.5 w-3.5 text-primary-foreground stroke-[3]" />}
            </div>
            <span onClick={() => toggle("custom")} className="text-sm font-medium leading-none cursor-pointer">Custom Div Checkbox</span>
          </CardContent>
        </Card>
      </div>

      <TipDrawer
        selector={`#custom-checkbox`}
        playwright={`import { test, expect } from '@playwright/test';

test('toggles custom checkbox', async ({ page }) => {
  await page.goto('/elements/checkboxes');
  const box = page.locator('#custom-checkbox');
  await box.click();
  // Custom checkbox: state lives in a CSS class, not the DOM 'checked' prop.
  await expect(box).toHaveAttribute('data-state', 'checked');
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_toggles_custom_checkbox(page):
    page.goto("/elements/checkboxes")
    box = page.locator("#custom-checkbox")
    box.click()
    expect(box).to_have_attribute("data-state", "checked")`}
        java={`import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.junit.jupiter.api.Assertions.assertEquals;

class CheckboxesTest {
    @Test
    void togglesCustomCheckbox() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/checkboxes");
        WebElement box = driver.findElement(By.id("custom-checkbox"));
        box.click();
        assertEquals("checked", box.getAttribute("data-state"));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_toggles_custom_checkbox():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/checkboxes")
    box = driver.find_element(By.ID, "custom-checkbox")
    box.click()
    assert box.get_attribute("data-state") == "checked"
    driver.quit()`}
        tip="Div-based checkboxes won't respond to Playwright's check()/uncheck(). Use click() and assert on the data-state attribute (or a CSS class) — never trust the absence of an <input> to mean 'unchecked'."
      />
    </div>
  );
}
