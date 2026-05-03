"use client";

import { useState, useCallback } from "react";
import { Trash2, CreditCard, RefreshCw, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { LocatorBot } from "@/components/layout/locator-bot";
import { cn } from "@/lib/utils";

interface Card {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  expiry: string;
  gradient: string;
  brandColor: string;
  chipColor: string;
}

const INITIAL_CARDS: Card[] = [
  {
    id: "card-visa",
    brand: "VISA",
    last4: "4242",
    holder: "Ha Do",
    expiry: "08/28",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    brandColor: "text-blue-200",
    chipColor: "bg-yellow-400/80",
  },
  {
    id: "card-mc",
    brand: "Mastercard",
    last4: "5555",
    holder: "Ha Do",
    expiry: "03/27",
    gradient: "from-orange-500 via-red-500 to-rose-700",
    brandColor: "text-orange-200",
    chipColor: "bg-yellow-300/80",
  },
  {
    id: "card-amex",
    brand: "AMEX",
    last4: "3782",
    holder: "Ha Do",
    expiry: "11/29",
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
    brandColor: "text-emerald-200",
    chipColor: "bg-yellow-400/70",
  },
];

export default function DisappearPage() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const handleRemove = useCallback(
    (card: Card) => {
      if (removing.has(card.id)) return;

      // Mark as removing — triggers CSS transition
      setRemoving((prev) => new Set(prev).add(card.id));

      // After animation, fully remove from DOM
      setTimeout(() => {
        setCards((prev) => prev.filter((c) => c.id !== card.id));
        setRemoving((prev) => {
          const next = new Set(prev);
          next.delete(card.id);
          return next;
        });
        toast.success(`${card.brand} •••• ${card.last4} removed`, {
          description: "Card has been deleted from your wallet.",
          duration: 3000,
        });
      }, 350);
    },
    [removing]
  );

  const handleReset = useCallback(() => {
    setCards(INITIAL_CARDS);
    setRemoving(new Set());
    toast.info("Wallet restored", { description: "All 3 cards have been re-added." });
  }, []);

  const hasRemovedAny = cards.length < INITIAL_CARDS.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Disappear Element</h1>
        <p className="text-muted-foreground">
          Remove payment cards from the wallet. Verify the element is fully removed from the DOM —
          not just hidden with CSS.
        </p>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Payment methods</span>
          <Badge
            variant="outline"
            data-testid="disappear-card-count"
            className="font-mono tabular-nums"
          >
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </Badge>
        </div>

        {hasRemovedAny && (
          <Button
            variant="ghost"
            size="sm"
            data-testid="disappear-reset"
            onClick={handleReset}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset wallet
          </Button>
        )}
      </div>

      {/* Card Wallet */}
      <div
        data-testid="disappear-wallet"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cards.map((card) => {
          const isRemoving = removing.has(card.id);
          return (
            <div
              key={card.id}
              data-testid={`disappear-card-${card.id}`}
              className={cn(
                "relative rounded-2xl p-6 shadow-2xl select-none overflow-hidden",
                "bg-gradient-to-br",
                card.gradient,
                "transition-all duration-350 ease-in-out",
                isRemoving
                  ? "opacity-0 scale-90 translate-y-3 pointer-events-none"
                  : "opacity-100 scale-100 translate-y-0"
              )}
            >
              {/* Decorative glow circles */}
              <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/5 blur-xl" />
              <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-black/10 blur-xl" />

              {/* Remove button */}
              <button
                data-testid={`disappear-remove-${card.id}`}
                onClick={() => handleRemove(card)}
                aria-label={`Remove ${card.brand} card ending in ${card.last4}`}
                className={cn(
                  "absolute top-4 right-4 z-10",
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  "bg-white/10 hover:bg-red-500/80 text-white/70 hover:text-white",
                  "transition-all duration-200 hover:scale-110",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                )}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              {/* Card icon */}
              <div className="mb-8">
                <CreditCard className="h-9 w-9 text-white/80" />
              </div>

              {/* EMV chip */}
              <div
                className={cn(
                  "mb-5 h-7 w-10 rounded-md border border-white/20",
                  card.chipColor,
                  "flex items-center justify-center"
                )}
              >
                <div className="grid grid-cols-2 gap-0.5 opacity-60">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-1 w-1.5 rounded-sm bg-yellow-900/60" />
                  ))}
                </div>
              </div>

              {/* Card number */}
              <p className="font-mono text-white text-lg tracking-[0.25em] mb-5 drop-shadow">
                •••• •••• •••• {card.last4}
              </p>

              {/* Holder + Expiry + Brand */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5">
                    Card holder
                  </p>
                  <p className="text-sm font-semibold text-white tracking-wide">{card.holder}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-xs font-bold tracking-widest uppercase mb-1", card.brandColor)}>
                    {card.brand}
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5">
                    Expires
                  </p>
                  <p className="text-sm font-semibold text-white font-mono">{card.expiry}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state — only rendered when all cards are gone */}
      {cards.length === 0 && (
        <div
          data-testid="disappear-empty-state"
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/30 py-20 text-center animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <WalletCards className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">No payment methods</p>
            <p className="text-sm text-muted-foreground">
              Your wallet is empty. Reset to restore the cards.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-testid="disappear-reset"
            onClick={handleReset}
            className="mt-2 gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset wallet
          </Button>
        </div>
      )}

      {/* Teaching Aids */}
      <TipDrawer
        selector={`[data-testid^="disappear-card-"]`}
        playwright={`import { test, expect } from '@playwright/test';

test('removes card from DOM', async ({ page }) => {
  await page.goto('/elements/disappear');

  // Confirm all 3 cards are present before acting
  await expect(page.locator('[data-testid^="disappear-card-"]')).toHaveCount(3);

  const card = page.locator('[data-testid="disappear-card-card-visa"]');
  await expect(card).toBeVisible();

  // Click remove
  await page.click('[data-testid="disappear-remove-card-visa"]');

  // WRONG: toBeVisible() may still pass if element is just CSS-hidden
  // CORRECT: assert node is fully detached from the DOM
  await expect(card).not.toBeAttached();

  // Verify count decremented
  await expect(page.locator('[data-testid^="disappear-card-"]')).toHaveCount(2);
});

test('empty state appears after all cards removed', async ({ page }) => {
  await page.goto('/elements/disappear');
  for (const id of ['card-visa', 'card-mc', 'card-amex']) {
    await page.click(\`[data-testid="disappear-remove-\${id}"]\`);
    await expect(page.locator(\`[data-testid="disappear-card-\${id}"]\`)).not.toBeAttached();
  }
  await expect(page.locator('[data-testid="disappear-empty-state"]')).toBeVisible();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_removes_card_from_dom(page):
    page.goto("/elements/disappear")

    # Confirm 3 cards rendered
    expect(page.locator('[data-testid^="disappear-card-"]')).to_have_count(3)

    card = page.locator('[data-testid="disappear-card-card-visa"]')
    expect(card).to_be_visible()

    page.click('[data-testid="disappear-remove-card-visa"]')

    # Assert true DOM removal — not CSS hide
    expect(card).not_to_be_attached()
    expect(page.locator('[data-testid^="disappear-card-"]')).to_have_count(2)

def test_empty_state_after_all_removed(page):
    page.goto("/elements/disappear")
    for card_id in ["card-visa", "card-mc", "card-amex"]:
        page.click(f'[data-testid="disappear-remove-{card_id}"]')
        expect(page.locator(f'[data-testid="disappear-card-{card_id}"]')).not_to_be_attached()
    expect(page.locator('[data-testid="disappear-empty-state"]')).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;
import java.util.List;
import static org.testng.Assert.assertEquals;

class DisappearElementTest {

    @Test
    void removesCardFromDOM() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/disappear");

        // Get a reference BEFORE clicking remove
        WebElement card = driver.findElement(
            By.cssSelector("[data-testid='disappear-card-card-visa']"));

        driver.findElement(
            By.cssSelector("[data-testid='disappear-remove-card-visa']")).click();

        // WRONG: isDisplayed() — element may still be in DOM but hidden
        // CORRECT: stalenessOf waits for node removal
        new WebDriverWait(driver, Duration.ofSeconds(5))
            .until(ExpectedConditions.stalenessOf(card));

        List<WebElement> remaining = driver.findElements(
            By.cssSelector("[data-testid^='disappear-card-']"));
        assertEquals(remaining.size(), 2);
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_removes_card_from_dom():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/disappear")

    # Capture reference before deletion
    card = driver.find_element(
        By.CSS_SELECTOR, "[data-testid='disappear-card-card-visa']")

    driver.find_element(
        By.CSS_SELECTOR, "[data-testid='disappear-remove-card-visa']").click()

    # staleness_of = node removed from DOM (not just hidden)
    WebDriverWait(driver, 5).until(EC.staleness_of(card))

    remaining = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid^='disappear-card-']")
    assert len(remaining) == 2
    driver.quit()`}
        tip="toBeVisible() / isDisplayed() can lie — an element hidden via opacity:0 or display:none still passes. Use not.toBeAttached() (Playwright) or staleness_of() (Selenium) to assert true DOM removal. Always capture the element reference BEFORE the delete action, then check staleness after."
      />

      <LocatorBot
        selector={`[data-testid^="disappear-card-"]`}
        targetName="payment card"
      />
    </div>
  );
}
