"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function NestedFramesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col gap-2 flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Nested Frames</h1>
        <p className="text-muted-foreground">
          Practice navigating through nested iframe contexts to locate and interact with elements.
        </p>
      </div>

      <Card className="flex-1 border-border bg-card/50 flex flex-col min-h-[500px]">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Nested Frames Target</CardTitle>
          <CardDescription>An iframe containing other iframes. Find the text in the MIDDLE frame.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden relative min-h-[400px]">
          <iframe 
            src="/frames/nested.html" 
            title="nested frames"
            className="absolute inset-0 w-full h-full rounded-b-xl border-t border-border"
          />
        </CardContent>
      </Card>

      <div className="flex-shrink-0">
        <TipDrawer 
        playwright={`page.frameLocator('[name="frame-top"]').frameLocator('[name="frame-middle"]').locator('#content')`}
        java={`driver.switchTo().frame(driver.findElement(By.cssSelector("[name="frame-top"]"))).frameLocator('[name="frame-middle"]').locator('#content');`}
        python={`driver.switch_to.frame(driver.find_element(By.CSS_SELECTOR, "[name="frame-top"]")).frameLocator('[name="frame-middle"]').locator('#content')`}
        tip="In Playwright, use frameLocator() to pierce through iframes. You can chain them for nested frames. In Selenium, you must use driver.switchTo().frame() sequentially."
        />
      </div>
    </div>
  );
}
