"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function SliderPage() {
  const [value, setValue] = useState([50]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Horizontal Slider</h1>
        <p className="text-muted-foreground">
          A range slider for testing drag interactions and value synchronization.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Volume Control</CardTitle>
            <CardDescription>Drag the slider to adjust the value (0-100).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 py-10">
            <div className="relative">
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                value={value}
                onValueChange={setValue}
                className="w-full"
              />
              <div 
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex h-8 w-12 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground shadow-lg"
                style={{ left: `${value[0]}%` }}
              >
                {value[0]}
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>MIN: 0</span>
              <span>CURRENT: {value[0]}</span>
              <span>MAX: 100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <TipDrawer 
        playwright={`await page.locator('.slider-thumb').dragTo(target)`}
        java={`await driver.findElement(By.cssSelector(".slider-thumb")).dragTo(target);`}
        python={`await driver.find_element(By.CSS_SELECTOR, ".slider-thumb").dragTo(target)`}
        tip="Sliders are best tested by keyboard interactions (ArrowRight/Left) or by dragging the thumb to a specific bounding box coordinate. verify the 'aria-valuenow' attribute for the most reliable state check."
      />
    </div>
  );
}
