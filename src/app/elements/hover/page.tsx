"use client";

import { useRef, useState } from "react";
import {
  Smartphone,
  Shirt,
  Home,
  BookOpen,
  Dumbbell,
  Gamepad2,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";

interface Category {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
}

const CATALOG: Category[] = [
  { name: "Electronics", icon: Smartphone, items: ["Phones", "Laptops", "Cameras", "Headphones"] },
  { name: "Fashion", icon: Shirt, items: ["Men", "Women", "Kids", "Accessories"] },
  { name: "Home & Garden", icon: Home, items: ["Furniture", "Kitchen", "Decor", "Lighting"] },
  { name: "Books", icon: BookOpen, items: ["Fiction", "Non-fiction", "Comics", "Children"] },
  { name: "Sports", icon: Dumbbell, items: ["Fitness", "Outdoor", "Cycling", "Running"] },
  { name: "Toys & Games", icon: Gamepad2, items: ["Board Games", "Puzzles", "RC", "Plush"] },
];

export default function HoverPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const openMenu = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMenuOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setMenuOpen(false), 150);
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hover States</h1>
        <p className="text-muted-foreground">
          Elements that reveal content or change state only when hovered by a pointer.
        </p>
      </div>

      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Catalog Menu</CardTitle>
          <CardDescription>
            Hover the <code className="text-primary">Catalog</code> menu item to reveal a category panel.
            Disappears when the cursor leaves both trigger and panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <nav
            id="catalog-nav"
            aria-label="Catalog navigation"
            className="relative flex items-center gap-1 border-b border-border pb-3"
          >
            <a
              href="#home"
              className="rounded px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              Home
            </a>

            <div
              className="relative"
              onMouseEnter={openMenu}
              onMouseLeave={scheduleClose}
            >
              <button
                id="catalog-menu-trigger"
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                Catalog
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div
                  id="catalog-mega-panel"
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-2 w-[min(720px,80vw)] rounded-xl border border-border bg-card p-5 shadow-2xl animate-in fade-in slide-in-from-top-1"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Browse categories
                  </p>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {CATALOG.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <li
                          key={cat.name}
                          data-testid={`catalog-${cat.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                          className="rounded-lg p-3 transition-colors hover:bg-secondary"
                        >
                          <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                            <Icon className="h-4 w-4 text-primary" />
                            <a href={`#${cat.name.toLowerCase()}`} className="hover:text-primary">
                              {cat.name}
                            </a>
                          </div>
                          <ul className="space-y-0.5 pl-6 text-xs text-muted-foreground">
                            {cat.items.map((item) => (
                              <li key={item}>
                                <a href={`#${item.toLowerCase()}`} className="hover:text-primary">
                                  {item}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <a
              href="#deals"
              className="rounded px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              Deals
            </a>
            <a
              href="#about"
              className="rounded px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              About
            </a>
          </nav>
          <p className="mt-3 text-xs text-muted-foreground">
            Tip: real selectors live on{" "}
            <code className="text-primary">#catalog-menu-trigger</code> and{" "}
            <code className="text-primary">#catalog-mega-panel</code>.
          </p>
        </CardContent>
      </Card>

      <TipDrawer
        selector={`#catalog-menu-trigger`}
        playwright={`import { test, expect } from '@playwright/test';

test('reveals catalog mega panel', async ({ page }) => {
  await page.goto('/elements/hover');
  await page.locator('#catalog-menu-trigger').hover();
  await expect(page.locator('#catalog-mega-panel')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Electronics' })).toBeVisible();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_reveals_catalog_panel(page):
    page.goto("/elements/hover")
    page.locator("#catalog-menu-trigger").hover()
    expect(page.locator("#catalog-mega-panel")).to_be_visible()
    expect(page.get_by_role("link", name="Electronics")).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

class HoverTest {
    @Test
    void revealsCatalogPanel() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/hover");
        new Actions(driver).moveToElement(
            driver.findElement(By.id("catalog-menu-trigger"))
        ).perform();
        new WebDriverWait(driver, Duration.ofSeconds(3))
            .until(ExpectedConditions.visibilityOfElementLocated(
                By.id("catalog-mega-panel")));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_reveals_catalog_panel():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/hover")
    trigger = driver.find_element(By.ID, "catalog-menu-trigger")
    ActionChains(driver).move_to_element(trigger).perform()
    WebDriverWait(driver, 3).until(
        EC.visibility_of_element_located((By.ID, "catalog-mega-panel"))
    )
    driver.quit()`}
        tip="Selenium hover = ActionChains.move_to_element / Actions.moveToElement. The panel uses a 150ms close-delay so the cursor can cross the gap between trigger and panel — don't move out and back too fast in your assertions. Wait for visibility, not a fixed sleep."
      />
    </div>
  );
}
