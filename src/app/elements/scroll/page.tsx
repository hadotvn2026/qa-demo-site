"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { ArrowDown, MoveDown } from "lucide-react";

export default function ScrollPage() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const nestedRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Scroll Management</h1>
        <p className="text-muted-foreground">
          Practice scrolling the page, specific elements into view, and handling nested overflow containers.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Scroll Into View */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Scroll Into View</CardTitle>
            <CardDescription>Click to jump to the target at the bottom of the page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={scrollToBottom} className="w-full gap-2">
              <ArrowDown className="h-4 w-4" />
              Scroll to Target
            </Button>
          </CardContent>
        </Card>

        {/* Nested Overflow */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Nested Overflow</CardTitle>
            <CardDescription>A container with its own scrollbar. The typical Selenium gotcha.</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              ref={nestedRef}
              className="h-48 w-full overflow-y-auto rounded-md border border-border bg-muted/50 p-4 space-y-4"
            >
              <p className="text-sm text-muted-foreground">Scroll down to find the hidden button...</p>
              <div className="h-64" />
              <Button id="nested-button" variant="secondary" className="w-full">
                Hidden Button Found!
              </Button>
              <div className="h-12" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Long spacer for page scroll */}
      <div className="h-[150vh]" />

      <div ref={bottomRef} className="p-8 rounded-xl border border-primary bg-primary/5 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Target Reached!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          You successfully scrolled this element into the viewport.
        </p>
      </div>

      <TipDrawer 
        playwright={`page.locator('#nested-button').scrollIntoViewIfNeeded()`}
        java={`driver.findElement(By.cssSelector("#nested-button")).scrollIntoViewIfNeeded();`}
        python={`driver.find_element(By.CSS_SELECTOR, "#nested-button").scrollIntoViewIfNeeded()`}
        tip="Nested containers require scrolling the specific element, not the window. Playwright handles this automatically with most actions, but Selenium may require 'executeScript' or 'Actions.moveToElement'."
      />
    </div>
  );
}
