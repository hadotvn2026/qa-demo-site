"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
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
  MousePointerClick,
  Zap,
  Home,
  Calculator,
  BookOpen,
  UserPlus,
  CreditCard,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const menuItems = [
  { name: "Authentication", href: "/elements/auth", icon: Lock },
  { name: "Registration", href: "/elements/registration", icon: UserPlus },
  { name: "Dropdown", href: "/elements/dropdown", icon: ListFilter },
  { name: "Checkboxes", href: "/elements/checkboxes", icon: CheckSquare },
  { name: "Hyperlink", href: "/elements/hyperlinks", icon: Link2 },
  { name: "Data Table", href: "/elements/table", icon: Table2 },
  { name: "File Upload", href: "/elements/upload", icon: Upload },
  { name: "File Download", href: "/elements/download", icon: Download },
  { name: "Slider", href: "/elements/slider", icon: SlidersHorizontal },
  { name: "Scroll", href: "/elements/scroll", icon: MousePointer2 },
  { name: "Lazy Loading", href: "/elements/lazy-loading", icon: Layers },
  { name: "Drag and Drop", href: "/elements/drag-drop", icon: Move },
  { name: "Hover", href: "/elements/hover", icon: UserCircle },
  { name: "Context Click", href: "/elements/context-click", icon: MousePointerClick },
  { name: "Disappear Element", href: "/elements/disappear", icon: CreditCard },
  { name: "Random Popup", href: "/elements/popup", icon: Zap },
  { name: "BMI Calculator", href: "/elements/bmi", icon: Calculator },
  { name: "Locator Cheatsheet", href: "/cheatsheet", icon: BookOpen },
];

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <p className="text-sm text-muted-foreground fixed bottom-4 right-4 z-40 hidden md:block">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search 15 elements..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Elements">
            {menuItems.map((item) => (
              <CommandItem 
                key={item.href}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="System">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Back to Home</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
