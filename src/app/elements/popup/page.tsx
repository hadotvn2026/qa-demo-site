"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { EmptyState } from "@/components/state/EmptyState";
import { Zap, Timer } from "lucide-react";

export default function PopupPage() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const delayParam = searchParams.get("popupDelay");
    const delay = delayParam !== null ? parseInt(delayParam) : Math.floor(Math.random() * 10) + 5;
    
    if (delay === 0) {
      setIsOpen(true);
    } else {
      setCountdown(delay);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsOpen(true);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [searchParams]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Random Popup</h1>
        <p className="text-muted-foreground">
          A modal that appears after a randomized delay to test asynchronous synchronization.
        </p>
      </div>

      <div className="flex justify-center py-12">
        {!isOpen ? (
          <EmptyState 
            icon={Timer}
            title={countdown !== null ? `Popup in ${countdown}s...` : "Waiting for popup..."}
            description="A modal will appear shortly. Use ?popupDelay=0 in the URL to trigger it instantly for deterministic tests."
          />
        ) : (
          <div className="text-center p-8 border border-primary/20 bg-primary/5 rounded-xl animate-in zoom-in duration-500">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-bold">Popup has fired!</p>
            <p className="text-sm text-muted-foreground mt-2">Refresh the page to restart the timer.</p>
            <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
              Restart Timer
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Surprise Modal
            </DialogTitle>
            <DialogDescription>
              This popup appeared after a delay. This is a common scenario in QA automation that causes "flaky" tests if not handled correctly.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              In a real-world test, you would wait for this modal to be visible before interacting with its contents.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Dismiss Popup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TipDrawer 
        playwright={`await page.waitForSelector('text=Surprise Modal', { state: 'visible' })`}
        java={`driver.findElement(By.cssSelector("..."));`}
        python={`driver.find_element(By.CSS_SELECTOR, "...")`}
        tip="Random delays are the primary cause of flakiness. Always use 'waitForSelector' or 'waitForEvent' with a reasonable timeout. Avoid using 'sleep()' or 'pause()' as they slow down the pipeline unnecessarily."
      />
    </div>
  );
}
