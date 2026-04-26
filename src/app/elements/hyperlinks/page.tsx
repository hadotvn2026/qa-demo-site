"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { ExternalLink, Mail, Hash, AlertTriangle, Home } from "lucide-react";

export default function HyperlinksPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hyperlinks</h1>
        <p className="text-muted-foreground">
          Different link behaviors to test tab management, response codes, and deep linking.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Same Tab */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              Internal Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/" className="text-sm text-primary hover:underline font-medium">
              Back to Home
            </Link>
          </CardContent>
        </Card>

        {/* New Tab */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              New Tab Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href="https://playwright.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              Open Playwright Docs
            </a>
          </CardContent>
        </Card>

        {/* Mailto */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Mailto Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a href="mailto:support@flakelab.dev" className="text-sm text-primary hover:underline font-medium">
              Contact Support
            </a>
          </CardContent>
        </Card>

        {/* Broken Link */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Broken Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a href="/this-page-does-not-exist" className="text-sm text-destructive hover:underline font-medium">
              Go to 404 Page
            </a>
          </CardContent>
        </Card>

        {/* Anchor Jump */}
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              Anchor Jump
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a href="#footer-target" className="text-sm text-primary hover:underline font-medium">
              Jump to Footer
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="h-[100vh] flex flex-col justify-end pb-8">
        <div id="footer-target" className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
          <p className="text-sm font-medium">⚓ You reached the anchor target!</p>
        </div>
      </div>

      <TipDrawer 
        playwright={`const [newPage] = await Promise.all([ context.waitForEvent('page'), page.click('text=Open Playwright Docs') ])`}
        java={`driver.findElement(By.cssSelector("..."));`}
        python={`driver.find_element(By.CSS_SELECTOR, "...")`}
        tip="For links opening in new tabs, use the 'waitForEvent('page')' pattern in Playwright to capture the new browser context. Checking response codes for broken links often requires intercepting network requests."
      />
    </div>
  );
}
