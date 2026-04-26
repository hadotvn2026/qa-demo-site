"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function CheckboxesPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    native: false,
    shadcn: true,
    custom: false,
  });

  const toggle = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Checkboxes</h1>
        <p className="text-muted-foreground">
          Native inputs, ARIA-powered components, and custom-styled divs for testing interaction types.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Native Checkbox */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Native Input</CardTitle>
            <CardDescription>A standard HTML5 checkbox input.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="native-checkbox" 
              checked={checkedItems.native}
              onChange={() => toggle("native")}
              className="h-5 w-5 accent-primary"
            />
            <Label htmlFor="native-checkbox" className="cursor-pointer">Native Checkbox</Label>
          </CardContent>
        </Card>

        {/* Shadcn Checkbox */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Radix UI</CardTitle>
            <CardDescription>The shadcn/ui checkbox component.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Checkbox 
              id="shadcn-checkbox" 
              checked={checkedItems.shadcn}
              onCheckedChange={() => toggle("shadcn")}
            />
            <Label htmlFor="shadcn-checkbox" className="cursor-pointer">Shadcn Checkbox</Label>
          </CardContent>
        </Card>

        {/* Custom Div-based Checkbox */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Custom Div</CardTitle>
            <CardDescription>A styled div that acts like a checkbox but has no input tag.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div 
              id="custom-checkbox"
              onClick={() => toggle("custom")}
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded border transition-colors cursor-pointer",
                checkedItems.custom ? "bg-primary border-primary" : "border-input bg-transparent hover:border-primary/50"
              )}
            >
              {checkedItems.custom && <Check className="h-3.5 w-3.5 text-primary-foreground stroke-[3]" />}
            </div>
            <span onClick={() => toggle("custom")} className="text-sm font-medium leading-none cursor-pointer">Custom Div Checkbox</span>
          </CardContent>
        </Card>
      </div>

      <TipDrawer 
        playwright={`page.locator('#custom-checkbox').click()`}
        java={`driver.findElement(By.cssSelector("#custom-checkbox")).click();`}
        python={`driver.find_element(By.CSS_SELECTOR, "#custom-checkbox").click()`}
        tip="Custom checkboxes that don't use 'input' tags won't respond to 'check()' or 'uncheck()' commands in Playwright/Selenium. You must use 'click()' and verify the state via CSS classes or other visual indicators."
      />
    </div>
  );
}
