"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function JSAlertsPage() {
  const [result, setResult] = useState<string>("");

  const triggerAlert = () => {
    window.alert("I am a JS Alert");
    setResult("You successfully clicked an alert");
  };

  const triggerConfirm = () => {
    const res = window.confirm("I am a JS Confirm");
    setResult(res ? "You clicked: Ok" : "You clicked: Cancel");
  };

  const triggerPrompt = () => {
    const res = window.prompt("I am a JS prompt");
    setResult(res !== null ? `You entered: ${res}` : "You clicked: Cancel");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">JavaScript Alerts</h1>
        <p className="text-muted-foreground">
          Practice handling browser-native dialogs like Alerts, Confirms, and Prompts.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>JS Alert</CardTitle>
            <CardDescription>A simple alert dialog with an OK button.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={triggerAlert} className="w-full">Click for JS Alert</Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>JS Confirm</CardTitle>
            <CardDescription>A dialog with OK and Cancel buttons.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={triggerConfirm} variant="secondary" className="w-full">Click for JS Confirm</Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>JS Prompt</CardTitle>
            <CardDescription>A dialog that requires text input.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={triggerPrompt} variant="outline" className="w-full">Click for JS Prompt</Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-semibold mb-2 text-foreground">Result:</h3>
        <p id="result" className="text-sm text-emerald-500 font-mono h-5">
          {result}
        </p>
      </div>

      <TipDrawer
        selector={`//button[contains(., 'Click for JS Alert')]`}
        playwright={`import { test, expect } from '@playwright/test';

test('accepts JS alert', async ({ page }) => {
  page.on('dialog', d => d.accept());
  await page.goto('/elements/alerts');
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  await expect(page.locator('#result')).toHaveText(
    'You successfully clicked an alert'
  );
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_accepts_alert(page):
    page.on("dialog", lambda d: d.accept())
    page.goto("/elements/alerts")
    page.get_by_role("button", name="Click for JS Alert").click()
    expect(page.locator("#result")).to_have_text(
        "You successfully clicked an alert"
    )`}
        java={`import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.junit.jupiter.api.Assertions.assertEquals;

class AlertsTest {
    @Test
    void acceptsJsAlert() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/alerts");
        driver.findElement(
            By.xpath("//button[contains(., 'Click for JS Alert')]")
        ).click();
        driver.switchTo().alert().accept();
        assertEquals(
            "You successfully clicked an alert",
            driver.findElement(By.id("result")).getText()
        );
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_accepts_alert():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/alerts")
    driver.find_element(
        By.XPATH, "//button[contains(., 'Click for JS Alert')]"
    ).click()
    driver.switch_to.alert.accept()
    assert driver.find_element(By.ID, "result").text == \\
        "You successfully clicked an alert"
    driver.quit()`}
        tip={`Native JS alerts halt JS execution. Playwright auto-dismisses alerts unless you attach a 'dialog' handler BEFORE the click that triggers it. In Selenium, switch into the alert with driver.switchTo().alert() and call accept()/dismiss().`}
      />
    </div>
  );
}
