"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TipDrawerProps {
  playwright: string;
  java: string;
  python: string;
  tip: string;
}

type TabType = "playwright" | "java" | "python";

export function TipDrawer({ playwright, java, python, tip }: TipDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("playwright");

  const getCode = () => {
    switch (activeTab) {
      case "java": return java;
      case "python": return python;
      case "playwright": default: return playwright;
    }
  };

  return (
    <div 
      className={cn(
        "fixed right-0 top-1/2 z-50 flex -translate-y-1/2 transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-[calc(100%-2rem)]"
      )}
    >
      {/* Trigger Tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-32 w-8 items-center justify-center rounded-l-xl border-y border-l border-border bg-card text-muted-foreground hover:text-primary transition-colors"
      >
        <div className="flex -rotate-90 items-center gap-2 whitespace-nowrap text-xs font-bold tracking-widest uppercase">
          {isOpen ? <ChevronRight className="h-4 w-4 rotate-90" /> : <ChevronLeft className="h-4 w-4 rotate-90" />}
          Tips
        </div>
      </button>

      {/* Content Panel */}
      <div className="w-96 border-l border-border bg-card p-6 shadow-2xl overflow-y-auto max-h-screen">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <Code2 className="h-5 w-5" />
          <h4 className="font-bold tracking-tight">Automation Tip</h4>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
              <button 
                onClick={() => setActiveTab("playwright")}
                className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-colors", activeTab === "playwright" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                Playwright (TS)
              </button>
              <button 
                onClick={() => setActiveTab("java")}
                className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-colors", activeTab === "java" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                Selenium (Java)
              </button>
              <button 
                onClick={() => setActiveTab("python")}
                className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-colors", activeTab === "python" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                Selenium (Py)
              </button>
            </div>
            <div className="rounded bg-muted p-3 font-mono text-xs text-primary break-all min-h-[60px] flex items-center">
              {getCode()}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Pro Note</p>
            <p className="text-sm text-foreground leading-relaxed">
              {tip}
            </p>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              navigator.clipboard.writeText(getCode());
            }}
          >
            Copy Snippet
          </Button>
        </div>
      </div>
    </div>
  );
}
