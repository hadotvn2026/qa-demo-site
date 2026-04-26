"use client";

import { Sidebar } from "./sidebar";
import { CommandMenu } from "./command-menu";
import { Toaster } from "sonner";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
          {children}
        </div>
      </div>
      <CommandMenu />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
