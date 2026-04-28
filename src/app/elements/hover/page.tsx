"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function HoverPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hover States</h1>
        <p className="text-muted-foreground">
          Elements that reveal content or change state only when hovered by a pointer.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Team Directory</CardTitle>
            <CardDescription>Hover over the avatar to reveal detailed user profiles.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="group cursor-pointer">
                  <div className="h-20 w-20 rounded-full border-2 border-primary/20 p-1 transition-all group-hover:border-primary group-hover:scale-105">
                    <div className="h-full w-full rounded-full bg-secondary flex items-center justify-center font-bold text-xl text-primary">
                      HD
                    </div>
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold group-hover:text-primary transition-colors">Ha Do</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-primary-foreground">
                    HD
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@hadotvn</h4>
                    <p className="text-sm">
                      Senior QE & Automation Lead. Building modern playgrounds for the next generation of testers.
                    </p>
                    <div className="flex items-center pt-2 gap-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3 opacity-70" />
                        Vietnam
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="mr-1 h-3 w-3 opacity-70" />
                        Joined April 2026
                      </div>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardContent>
        </Card>
      </div>

      <TipDrawer
        selector={`//*[normalize-space()='Ha Do']`}
        playwright={`import { test, expect } from '@playwright/test';

test('reveals hover card', async ({ page }) => {
  await page.goto('/elements/hover');
  await page.getByText('Ha Do').hover();
  await expect(page.getByText('@hadotvn')).toBeVisible();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_reveals_hover_card(page):
    page.goto("/elements/hover")
    page.get_by_text("Ha Do").hover()
    expect(page.get_by_text("@hadotvn")).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import static org.testng.Assert.assertTrue;

class HoverTest {
    @Test
    void revealsHoverCard() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/hover");
        new Actions(driver).moveToElement(
            driver.findElement(By.xpath("//*[normalize-space()='Ha Do']"))
        ).perform();
        new WebDriverWait(driver, Duration.ofSeconds(3))
            .until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(), '@hadotvn')]")));
        assertTrue(true);
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_reveals_hover_card():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/hover")
    target = driver.find_element(By.XPATH, "//*[normalize-space()='Ha Do']")
    ActionChains(driver).move_to_element(target).perform()
    WebDriverWait(driver, 3).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//*[contains(text(), '@hadotvn')]"))
    )
    driver.quit()`}
        tip="Selenium hover = ActionChains.move_to_element / Actions.moveToElement. Always wait for the revealed content explicitly — hover cards animate in and disappear if the cursor leaves. Don't sleep; assert visibility."
      />
    </div>
  );
}
