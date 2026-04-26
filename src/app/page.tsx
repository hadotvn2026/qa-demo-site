import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 text-center md:text-left md:items-start">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
          18/18 PASSING · PLAYWRIGHT + SELENIUM
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        Practice the elements that <span className="text-primary">break</span> your tests.
      </h1>

      {/* Subhead */}
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000">
        The 18 you can't fake. With reference tests that don't.
        A modern playground for QA engineers who value taste and stability.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-semibold group">
          <Link href="/elements/table">
            Try the table page
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-border hover:bg-secondary">
          <Link href="https://github.com" target="_blank">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Link>
        </Button>
      </div>

      {/* Terminal Animation Anchor */}
      <div className="w-full max-w-3xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-1000">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
          <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
          <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/40" />
          <span className="ml-2 text-xs font-mono text-muted-foreground">playwright test</span>
        </div>
        <div className="p-6 font-mono text-sm space-y-2">
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 18 }).map((_, i) => (
              <span 
                key={i} 
                className="inline-block h-2 w-2 rounded-full bg-primary opacity-0 animate-[test-dot_0.1s_forwards]"
                style={{ animationDelay: `${0.5 + i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="text-muted-foreground opacity-0 animate-[fade-in_0.5s_forwards] delay-[3s]">
            <p className="mt-4 text-primary font-bold">18 passed in 3.1s</p>
            <p className="mt-1 text-zinc-600">Running against preview: flakelab.dev</p>
          </div>
        </div>
      </div>

      {/* Element Chips */}
      <div className="mt-16 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-6">Explore the elements</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Auth", "Dropdown", "Checkboxes", "Hyperlink", "Table", 
            "Upload", "Download", "Slider", "Scroll", "Lazy Loading", 
            "Drag-Drop", "Hover", "Context Click", "Popup",
            "Date Picker", "JS Alerts", "Nested Frames", "Todo MVC"
          ].map((item) => (
            <div key={item} className="px-3 py-1 rounded-full border border-border bg-secondary/50 text-[11px] font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-default">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
