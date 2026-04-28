"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { toast } from "sonner";
import { Copy, Edit, Trash, Share } from "lucide-react";

export default function ContextClickPage() {
  const handleAction = (action: string) => {
    toast.success(`${action} action triggered.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Context Click</h1>
        <p className="text-muted-foreground">
          Right-click interactions to reveal custom context menus and shortcuts.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[300px] w-full max-w-md flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 transition-colors hover:bg-secondary/30">
            <div className="text-center space-y-2">
              <p className="text-lg font-bold">Right click here</p>
              <p className="text-xs text-muted-foreground">To see the custom context menu</p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem onClick={() => handleAction("Copy")}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy</span>
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleAction("Edit")}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("Share")}>
              <Share className="mr-2 h-4 w-4" />
              <span>Share</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("Delete")} className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
              <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      <TipDrawer
        selector={`//*[contains(text(), 'Right click here')]`}
        playwright={`import { test, expect } from '@playwright/test';

test('opens context menu on right click', async ({ page }) => {
  await page.goto('/elements/context-click');
  await page.getByText('Right click here').click({ button: 'right' });
  await expect(page.getByRole('menuitem', { name: 'Copy' })).toBeVisible();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_opens_context_menu(page):
    page.goto("/elements/context-click")
    page.get_by_text("Right click here").click(button="right")
    expect(page.get_by_role("menuitem", name="Copy")).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import static org.testng.Assert.assertTrue;

class ContextClickTest {
    @Test
    void opensContextMenu() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/context-click");
        new Actions(driver)
            .contextClick(driver.findElement(
                By.xpath("//*[contains(text(), 'Right click here')]")))
            .perform();
        assertTrue(driver.findElement(
            By.xpath("//*[@role='menuitem' and normalize-space()='Copy']")
        ).isDisplayed());
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

def test_opens_context_menu():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/context-click")
    target = driver.find_element(By.XPATH, "//*[contains(text(), 'Right click here')]")
    ActionChains(driver).context_click(target).perform()
    item = driver.find_element(
        By.XPATH, "//*[@role='menuitem' and normalize-space()='Copy']"
    )
    assert item.is_displayed()
    driver.quit()`}
        tip="Selenium can't right-click via .click() — use the Actions API (Java) or ActionChains (Python). Playwright takes a button option directly. Custom context menus are positioned absolutely — assert role='menuitem', not the trigger's children."
      />
    </div>
  );
}
