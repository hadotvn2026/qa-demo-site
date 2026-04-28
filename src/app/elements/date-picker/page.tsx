"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function DatePickerPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [nativeDate, setNativeDate] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Date Picker</h1>
        <p className="text-muted-foreground">
          Native date inputs and complex custom calendar widgets for testing date selection workflows.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Native Date Picker */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Native Date Input</CardTitle>
            <CardDescription>A standard HTML5 input type=&quot;date&quot;.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="native-date">Select a Date</Label>
              <input
                type="date"
                id="native-date"
                value={nativeDate}
                onChange={(e) => setNativeDate(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {nativeDate && (
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{nativeDate}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Shadcn UI Custom Date Picker */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Custom Calendar Widget</CardTitle>
            <CardDescription>A complex DOM-based calendar built with Radix UI and date-fns.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col space-y-2">
              <Label>Select a Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {date && (
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{format(date, "yyyy-MM-dd")}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <TipDrawer
        selector={`//button[contains(., 'Pick a date')]`}
        playwright={`import { test, expect } from '@playwright/test';

test('picks a date from the calendar', async ({ page }) => {
  await page.goto('/elements/date-picker');
  await page.getByRole('button', { name: 'Pick a date' }).click();
  // Calendar grid uses role=gridcell with the day name as accessible text.
  await page.getByRole('gridcell', { name: '15' }).first().click();
  await expect(
    page.getByRole('button').filter({ hasText: /\\b15\\b/ })
  ).toBeVisible();
});`}
        pythonPlaywright={`import re
from playwright.sync_api import expect

def test_picks_a_date(page):
    page.goto("/elements/date-picker")
    page.get_by_role("button", name="Pick a date").click()
    page.get_by_role("gridcell", name="15").first.click()
    expect(page.get_by_role("button").filter(has_text=re.compile(r"\\b15\\b"))).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertTrue;

class DatePickerTest {
    @Test
    void picksDateFromCalendar() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/date-picker");
        driver.findElement(
            By.xpath("//button[contains(., 'Pick a date')]")
        ).click();
        driver.findElement(
            By.xpath("(//*[@role='gridcell' and normalize-space()='15'])[1]")
        ).click();
        String label = driver.findElement(
            By.xpath("//button[contains(., 'Pick a date') or contains(., '15')]")
        ).getText();
        assertTrue(label.contains("15"));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_picks_a_date():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/date-picker")
    driver.find_element(By.XPATH, "//button[contains(., 'Pick a date')]").click()
    driver.find_element(
        By.XPATH, "(//*[@role='gridcell' and normalize-space()='15'])[1]"
    ).click()
    button = driver.find_element(
        By.XPATH, "//button[contains(., 'Pick a date') or contains(., '15')]"
    )
    assert "15" in button.text
    driver.quit()`}
        tip={`Native <input type="date"> can usually be set with .fill('2026-10-31'). Custom calendars need a click-to-open then a click on a gridcell — assert against role='gridcell' to stay resilient to layout changes.`}
      />
    </div>
  );
}
