"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function JSAlertsPage() {
  const [result, setResult] = useState<string>("");

  const triggerAlert = () => {
    window.alert("I am a JS Alert");
    setResult("You successfully clicked an alert");
  };

  const triggerConfirm = () => {
    const res = window.confirm("I am a JS Confirm");
    setResult(res ? "You clicked: Ok" : "You clicked: Cancel");
  };

  const triggerPrompt = () => {
    const res = window.prompt("I am a JS prompt");
    setResult(res !== null ? `You entered: ${res}` : "You clicked: Cancel");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">JavaScript Alerts</h1>
        <p className="text-muted-foreground">
          Practice handling browser-native dialogs like Alerts, Confirms, and Prompts.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>JS Alert</CardTitle>
            <CardDescription>A simple alert dialog with an OK button.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={triggerAlert} className="w-full">Click for JS Alert</Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>JS Confirm</CardTitle>
            <CardDescription>A dialog with OK and Cancel buttons.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={triggerConfirm} variant="secondary" className="w-full">Click for JS Confirm</Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>JS Prompt</CardTitle>
            <CardDescription>A dialog that requires text input.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={triggerPrompt} variant="outline" className="w-full">Click for JS Prompt</Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-semibold mb-2 text-foreground">Result:</h3>
        <p id="result" className="text-sm text-emerald-500 font-mono h-5">
          {result}
        </p>
      </div>

      <TipDrawer 
        playwright={`page.on('dialog', dialog => dialog.accept())`}
        java={`driver.switchTo().alert().accept();;`}
        python={`driver.switch_to.alert.accept()`}
        tip={`Native JS alerts stop code execution until dismissed. Playwright auto-dismisses alerts by default unless you attach a 'dialog' event listener. Selenium requires driver.switchTo().alert().`}
      />
    </div>
  );
}
