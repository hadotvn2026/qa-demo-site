"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { EmptyState } from "@/components/state/EmptyState";
import { Zap, Timer } from "lucide-react";

export default function PopupPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const delayParam = searchParams.get("popupDelay");
    const delay = delayParam !== null ? parseInt(delayParam) : 5;

    if (delay === 0) {
      setTimeout(() => setIsOpen(true), 0);
      return;
    }

    const initTimer = setTimeout(() => setCountdown(delay), 0);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setIsOpen(true);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Random Popup</h1>
        <p className="text-muted-foreground">
          A modal that appears after a randomized delay to test asynchronous synchronization.
        </p>
      </div>

      <div className="flex justify-center py-12">
        {!isOpen ? (
          <EmptyState 
            icon={Timer}
            title={countdown !== null ? `Popup in ${countdown}s...` : "Waiting for popup..."}
            description="A modal will appear shortly. Use ?popupDelay=0 in the URL to trigger it instantly for deterministic tests."
          />
        ) : (
          <div className="text-center p-8 border border-primary/20 bg-primary/5 rounded-xl animate-in zoom-in duration-500">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-bold">Popup has fired!</p>
            <p className="text-sm text-muted-foreground mt-2">Refresh the page to restart the timer.</p>
            <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
              Restart Timer
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Surprise Modal
            </DialogTitle>
            <DialogDescription>
              This popup appeared after a delay. This is a common scenario in QA automation that causes &quot;flaky&quot; tests if not handled correctly.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              In a real-world test, you would wait for this modal to be visible before interacting with its contents.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Dismiss Popup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TipDrawer
        selector={`//*[contains(text(), 'Waiting for popup') or contains(text(), 'Popup in')]`}
        playwright={`import { test, expect } from '@playwright/test';

test('handles delayed popup', async ({ page }) => {
  // ?popupDelay=0 makes the modal deterministic for tests
  await page.goto('/elements/popup?popupDelay=0');
  await expect(page.getByRole('heading', { name: 'Surprise Modal' }))
    .toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Dismiss Popup' }).click();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_handles_delayed_popup(page):
    page.goto("/elements/popup?popupDelay=0")
    expect(page.get_by_role("heading", name="Surprise Modal")).to_be_visible(timeout=10000)
    page.get_by_role("button", name="Dismiss Popup").click()`}
        java={`import java.time.Duration;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

class PopupTest {
    @Test
    void handlesDelayedPopup() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/popup?popupDelay=0");
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[normalize-space()='Surprise Modal']")));
        driver.findElement(By.xpath("//button[normalize-space()='Dismiss Popup']"))
              .click();
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_handles_delayed_popup():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/popup?popupDelay=0")
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located(
        (By.XPATH, "//*[normalize-space()='Surprise Modal']")))
    driver.find_element(By.XPATH, "//button[normalize-space()='Dismiss Popup']").click()
    driver.quit()`}
        tip="Random delays are the #1 cause of flake. Either wait on a real signal (waitForSelector / WebDriverWait) or push determinism into the page itself — this one accepts ?popupDelay=0 to fire instantly. Never sleep() to 'paper over' a missing wait."
      />
    </div>
  );
}
