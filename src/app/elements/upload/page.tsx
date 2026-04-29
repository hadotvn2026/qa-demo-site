"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { FileUp, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/state/ProgressBar";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploaded(false);
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setUploading(false);
    setUploaded(true);
    toast.success(`${file.name} uploaded successfully.`);
  };

  const removeFile = () => {
    setFile(null);
    setUploaded(false);
    setProgress(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">File Upload</h1>
        <p className="text-muted-foreground">
          Drag and drop interface with file validation, progress tracking, and echo response.
        </p>
      </div>

      <div className="flex justify-center py-8">
        <Card className="w-full max-w-xl border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Support for PNG, JPG, PDF, and CSV. Max size 10MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <div
                {...getRootProps()}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer",
                  isDragActive 
                    ? "border-primary bg-primary/5 scale-[0.99]" 
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <input {...getInputProps()} />
                <div className={cn(
                  "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-colors",
                  isDragActive && "bg-primary/10"
                )}>
                  <FileUp className={cn("h-8 w-8 text-muted-foreground transition-colors", isDragActive && "text-primary")} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {isDragActive ? "Drop the file here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, PDF, or CSV up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card border border-border text-primary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {!uploading && !uploaded && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {uploaded && <CheckCircle2 className="h-5 w-5 text-primary ml-2" />}
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <ProgressBar value={progress} label="Uploading file..." />
                    <p className="text-[10px] text-muted-foreground text-center animate-pulse italic">
                      Verifying file integrity and echoing response...
                    </p>
                  </div>
                )}

                {!uploaded && !uploading && (
                  <Button data-testid="upload-button" className="w-full h-11" onClick={handleUpload}>
                    Upload File
                  </Button>
                )}

                {uploaded && (
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 text-xs font-mono text-emerald-500">
                    <p className="font-bold mb-2 uppercase tracking-widest text-[9px]">Server Response:</p>
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify({
                        status: "success",
                        filename: file.name,
                        size: file.size,
                        type: file.type,
                        timestamp: new Date().toISOString()
                      }, null, 2)}
                    </pre>
                    <Button variant="outline" className="mt-4 w-full border-emerald-500/30 hover:bg-emerald-500/10" onClick={removeFile}>
                      Upload Another
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TipDrawer
        selector={`input[type=file]`}
        playwright={`import { test, expect } from '@playwright/test';
import path from 'node:path';

test('uploads a file', async ({ page }) => {
  await page.goto('/elements/upload');
  await page.locator('input[type=file]').setInputFiles(
    path.resolve(__dirname, 'fixtures/sample.png')
  );
  await page.getByRole('button', { name: 'Upload File' }).click();
  await expect(page.getByText(/"status": "success"/)).toBeVisible();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_uploads_a_file(page, tmp_path):
    f = tmp_path / "sample.png"
    f.write_bytes(b"\\x89PNG\\r\\n\\x1a\\n")
    page.goto("/elements/upload")
    page.locator("input[type=file]").set_input_files(str(f))
    page.get_by_role("button", name="Upload File").click()
    expect(page.get_by_text('"status": "success"')).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertTrue;

class UploadTest {
    @Test
    void uploadsAFile() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/upload");
        // sendKeys on the file input — works even when hidden by CSS.
        driver.findElement(By.cssSelector("input[type=file]"))
              .sendKeys("/tmp/sample.png");
        driver.findElement(By.xpath("//button[normalize-space()='Upload File']"))
              .click();
        String body = driver.findElement(By.tagName("body")).getText();
        assertTrue(body.contains("\\"status\\": \\"success\\""));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_uploads_a_file(tmp_path):
    f = tmp_path / "sample.png"
    f.write_bytes(b"\\x89PNG\\r\\n\\x1a\\n")
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/upload")
    driver.find_element(By.CSS_SELECTOR, "input[type=file]").send_keys(str(f))
    driver.find_element(By.XPATH, "//button[normalize-space()='Upload File']").click()
    assert '"status": "success"' in driver.find_element(By.TAG_NAME, "body").text
    driver.quit()`}
        tip="Both Playwright (setInputFiles) and Selenium (sendKeys) drive uploads through the hidden <input type=file>, NOT the styled drop zone. The visible button is decorative — find the input and feed it an absolute path. For drag-drop-only zones, you'll need to dispatch a synthetic 'drop' DataTransfer event."
      />

      <TipDrawer
        selector={`[data-testid="upload-button"]`}
        playwright={`import { test, expect } from '@playwright/test';
import path from 'node:path';

test('upload file by test id button', async ({ page }) => {
  await page.goto('/elements/upload');
  const fileInput = page.locator('input[type=file]');
  await fileInput.setInputFiles(path.resolve(__dirname, 'fixtures/sample.png'));
  const uploadBtn = page.getByTestId('upload-button');
  await uploadBtn.click();
  await expect(page.getByText(/'"status": "success"'/)).toBeVisible();
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_upload_file_by_test_id(page, tmp_path):
    f = tmp_path / "sample.png"
    f.write_bytes(b"\\x89PNG\\r\\n\\x1a\\n")
    page.goto("/elements/upload")
    page.locator("input[type=file]").set_input_files(str(f))
    upload_btn = page.get_by_test_id("upload-button")
    upload_btn.click()
    expect(page.get_by_text('"status": "success"')).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertTrue;

class UploadByTestIdTest {
    @Test
    void uploadFileByTestId() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/upload");
        driver.findElement(By.cssSelector("input[type=file]")).sendKeys("/tmp/sample.png");
        driver.findElement(By.cssSelector("[data-testid='upload-button']")).click();
        String body = driver.findElement(By.tagName("body")).getText();
        assertTrue(body.contains("\\\"status\\\": \\\"success\\\""));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_upload_file_by_test_id(tmp_path):
    f = tmp_path / "sample.png"
    f.write_bytes(b"\\x89PNG\\r\\n\\x1a\\n")
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/upload")
    driver.find_element(By.CSS_SELECTOR, "input[type=file]").send_keys(str(f))
    driver.find_element(By.CSS_SELECTOR, "[data-testid='upload-button']").click()
    body = driver.find_element(By.TAG_NAME, "body").text
    assert '\\\"status\\\": \\\"success\\\"' in body
    driver.quit()`}
        tip="Test IDs make it easy to target UI elements reliably. By using data-testid on interactive elements like buttons, you decouple your tests from layout changes or label updates. Query by test ID first — it's stable, explicit, and survives refactoring. Fall back to role/text locators only when test IDs aren't available."
      />
    </div>
  );
}
