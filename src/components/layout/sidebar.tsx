"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Lock, 
  ListFilter, 
  CheckSquare, 
  Link2, 
  Table2, 
  Upload, 
  Download, 
  SlidersHorizontal, 
  MousePointer2, 
  Layers, 
  Move, 
  UserCircle, 
  MoreVertical, 
  Zap,
  Menu,
  X,
  CalendarDays,
  MessageSquareWarning,
  LayoutTemplate,
  ListTodo,
  Calculator,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Landing Page", href: "/", icon: LayoutDashboard },
  { name: "Authentication", href: "/elements/auth", icon: Lock },
  { name: "Dropdown", href: "/elements/dropdown", icon: ListFilter },
  { name: "Checkboxes", href: "/elements/checkboxes", icon: CheckSquare },
  { name: "Hyperlink", href: "/elements/hyperlinks", icon: Link2 },
  { name: "Data Table", href: "/elements/table", icon: Table2 },
  { name: "File Upload", href: "/elements/upload", icon: Upload },
  { name: "File Download", href: "/elements/download", icon: Download },
  { name: "Date Picker", href: "/elements/date-picker", icon: CalendarDays },
  { name: "Slider", href: "/elements/slider", icon: SlidersHorizontal },
  { name: "Scroll", href: "/elements/scroll", icon: MousePointer2 },
  { name: "Lazy Loading", href: "/elements/lazy-loading", icon: Layers },
  { name: "Drag and Drop", href: "/elements/drag-drop", icon: Move },
  { name: "Hover", href: "/elements/hover", icon: UserCircle },
  { name: "Context Click", href: "/elements/context-click", icon: MoreVertical },
  { name: "JS Alerts", href: "/elements/alerts", icon: MessageSquareWarning },
  { name: "Nested Frames", href: "/elements/nested-frames", icon: LayoutTemplate },
  { name: "Todo MVC", href: "/elements/todo-mvc", icon: ListTodo },
  { name: "Random Popup", href: "/elements/popup", icon: Zap },
  { name: "BMI Calculator", href: "/elements/bmi", icon: Calculator },
  { name: "Locator Cheatsheet", href: "/cheatsheet", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
          <div className="mb-8 px-2 py-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight">TVNAutomationLab</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-secondary",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-foreground"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-border pt-4 px-2">
            <div className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              18/18 PASSING
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
