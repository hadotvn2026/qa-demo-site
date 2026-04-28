"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function SliderPage() {
  const [value, setValue] = useState([50]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Horizontal Slider</h1>
        <p className="text-muted-foreground">
          A range slider for testing drag interactions and value synchronization.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Volume Control</CardTitle>
            <CardDescription>Drag the slider to adjust the value (0-100).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 py-10">
            <div className="relative">
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                value={value}
                onValueChange={setValue}
                className="w-full"
              />
              <div 
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex h-8 w-12 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground shadow-lg"
                style={{ left: `${value[0]}%` }}
              >
                {value[0]}
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>MIN: 0</span>
              <span>CURRENT: {value[0]}</span>
              <span>MAX: 100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <TipDrawer
        selector={`[role="slider"]`}
        playwright={`import { test, expect } from '@playwright/test';

test('moves slider via keyboard', async ({ page }) => {
  await page.goto('/elements/slider');
  const thumb = page.getByRole('slider');
  await thumb.focus();
  // Each ArrowRight increments by 1 (step=1).
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
  await expect(thumb).toHaveAttribute('aria-valuenow', '60');
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_moves_slider(page):
    page.goto("/elements/slider")
    thumb = page.get_by_role("slider")
    thumb.focus()
    for _ in range(10):
        page.keyboard.press("ArrowRight")
    expect(thumb).to_have_attribute("aria-valuenow", "60")`}
        java={`import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.junit.jupiter.api.Assertions.assertEquals;

class SliderTest {
    @Test
    void movesSlider() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/slider");
        WebElement thumb = driver.findElement(By.cssSelector("[role='slider']"));
        for (int i = 0; i < 10; i++) thumb.sendKeys(Keys.ARROW_RIGHT);
        assertEquals("60", thumb.getAttribute("aria-valuenow"));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

def test_moves_slider():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/slider")
    thumb = driver.find_element(By.CSS_SELECTOR, "[role='slider']")
    for _ in range(10):
        thumb.send_keys(Keys.ARROW_RIGHT)
    assert thumb.get_attribute("aria-valuenow") == "60"
    driver.quit()`}
        tip="Keyboard control is the most reliable way to drive a slider — drag math depends on bounding-box geometry that breaks on resize. Always assert aria-valuenow, not a sibling DOM label that's just rendering the same state."
      />
    </div>
  );
}
