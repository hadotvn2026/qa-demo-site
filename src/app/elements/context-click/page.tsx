"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { toast } from "sonner";
import { Copy, Edit, Trash, Share } from "lucide-react";

export default function ContextClickPage() {
  const handleAction = (action: string) => {
    toast.success(`${action} action triggered.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Context Click</h1>
        <p className="text-muted-foreground">
          Right-click interactions to reveal custom context menus and shortcuts.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[300px] w-full max-w-md flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 transition-colors hover:bg-secondary/30">
            <div className="text-center space-y-2">
              <p className="text-lg font-bold">Right click here</p>
              <p className="text-xs text-muted-foreground">To see the custom context menu</p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem onClick={() => handleAction("Copy")}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy</span>
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleAction("Edit")}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("Share")}>
              <Share className="mr-2 h-4 w-4" />
              <span>Share</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("Delete")} className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
              <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      <TipDrawer 
        playwright={`await page.click('.trigger', { button: 'right' })`}
        java={`driver.findElement(By.cssSelector("..."));`}
        python={`driver.find_element(By.CSS_SELECTOR, "...")`}
        tip="Context clicks are triggered by the secondary mouse button. In Playwright, use 'click({ button: 'right' })'. For Selenium, use the 'Actions' class to perform a 'contextClick'."
      />
    </div>
  );
}
