"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/state/ProgressBar";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    // The browser handles the actual download via window.location or <a> tag
    // but we simulate the UX here.
    try {
      const response = await fetch("/api/download?delay=1500");
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Downloaded users.csv successfully.");
    } catch (err) {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">File Download</h1>
        <p className="text-muted-foreground">
          Trigger network downloads and verify file content/headers.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>User Export</CardTitle>
            <CardDescription>
              Export the current user list as a CSV file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {downloading && (
              <div className="space-y-2">
                <ProgressBar label="Preparing export..." />
                <p className="text-[10px] text-muted-foreground text-center italic">
                  Streaming from server...
                </p>
              </div>
            )}
            
            <Button
              data-testid="download-csv"
              className="w-full h-11"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <TipDrawer
        selector={`//button[contains(., 'Download CSV')]`}
        playwright={`import { test, expect } from '@playwright/test';

test('downloads CSV', async ({ page }) => {
  await page.goto('/elements/download');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download CSV/i }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('users.csv');
  await download.saveAs('/tmp/' + download.suggestedFilename());
});`}
        pythonPlaywright={`def test_downloads_csv(page):
    page.goto("/elements/download")
    with page.expect_download() as info:
        page.get_by_role("button", name="Download CSV").click()
    download = info.value
    assert download.suggested_filename == "users.csv"
    download.save_as("/tmp/" + download.suggested_filename)`}
        java={`import java.io.File;
import java.time.Duration;
import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import static org.testng.Assert.assertTrue;

class DownloadTest {
    @Test
    void downloadsCsv() throws Exception {
        ChromeOptions opts = new ChromeOptions();
        opts.addArguments("--headless=new");
        opts.setExperimentalOption("prefs", java.util.Map.of(
            "download.default_directory", "/tmp/dl",
            "download.prompt_for_download", false
        ));
        WebDriver driver = new ChromeDriver(opts);
        driver.get("http://localhost:3000/elements/download");
        driver.findElement(By.xpath("//button[contains(., 'Download CSV')]")).click();
        new WebDriverWait(driver, Duration.ofSeconds(5))
            .until(d -> new File("/tmp/dl/users.csv").exists());
        assertTrue(new File("/tmp/dl/users.csv").exists());
        driver.quit();
    }
}`}
        python={`import os, time
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_downloads_csv():
    opts = webdriver.ChromeOptions()
    opts.add_experimental_option("prefs", {
        "download.default_directory": "/tmp/dl",
        "download.prompt_for_download": False,
    })
    driver = webdriver.Chrome(options=opts)
    driver.get("http://localhost:3000/elements/download")
    driver.find_element(By.XPATH, "//button[contains(., 'Download CSV')]").click()
    deadline = time.time() + 5
    while not os.path.exists("/tmp/dl/users.csv") and time.time() < deadline:
        time.sleep(0.1)
    assert os.path.exists("/tmp/dl/users.csv")
    driver.quit()`}
        tip="Selenium has no built-in download API — configure the browser's download dir, then poll the filesystem. Playwright captures download events directly so you can inspect filename, MIME, and bytes without touching disk."
      />
    </div>
  );
}
