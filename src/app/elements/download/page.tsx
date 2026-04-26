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
        playwright={`const download = await Promise.all([ page.waitForEvent('download'), page.click('text=Download CSV') ])`}
        java={`driver.findElement(By.cssSelector("..."));`}
        python={`driver.find_element(By.CSS_SELECTOR, "...")`}
        tip="Verify downloads by capturing the 'download' event. You can then save the file to a temporary path or check its metadata using 'download.suggestedFilename()'."
      />
    </div>
  );
}
