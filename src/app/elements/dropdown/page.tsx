"use client";

import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { cn } from "@/lib/utils";

export default function DropdownPage() {
  const [standardValue, setStandardValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const customOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dropdown</h1>
        <p className="text-muted-foreground">
          Standard shadcn select and a custom div-based implementation for tricky selector practice.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Standard Select */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Standard Select</CardTitle>
            <CardDescription>Uses Radix UI primitives with proper ARIA roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setStandardValue} value={standardValue}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="svelte">SvelteKit</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
                <SelectItem value="nuxt">Nuxt.js</SelectItem>
              </SelectContent>
            </Select>
            {standardValue && (
              <p className="text-sm text-primary font-medium">Selected: {standardValue}</p>
            )}
          </CardContent>
        </Card>

        {/* Custom Div-based Select */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Custom Select</CardTitle>
            <CardDescription>A div-based dropdown with no native select or ARIA listbox roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div 
                id="custom-select-trigger"
                onClick={() => setIsCustomOpen(!isCustomOpen)}
                className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm hover:bg-secondary/50 cursor-pointer"
              >
                <span>{customValue || "Pick an option"}</span>
                <span className={cn("transition-transform duration-200", isCustomOpen && "rotate-180")}>▼</span>
              </div>

              {isCustomOpen && (
                <div className="absolute top-12 left-0 z-50 w-full rounded-md border border-border bg-card py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
                  {customOptions.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setCustomValue(opt);
                        setIsCustomOpen(false);
                      }}
                      className="px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {customValue && (
              <p className="text-sm text-primary font-medium">Selected: {customValue}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <TipDrawer 
        playwright={`page.locator('#custom-select-trigger').click()`}
        java={`driver.findElement(By.cssSelector("#custom-select-trigger")).click();`}
        python={`driver.find_element(By.CSS_SELECTOR, "#custom-select-trigger").click()`}
        tip="Custom dropdowns often require manual clicks on div elements since they don't respond to standard 'select' commands. Use text-based locators to find options within the expanded menu."
      />
    </div>
  );
}
