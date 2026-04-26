"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";

export default function HoverPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hover States</h1>
        <p className="text-muted-foreground">
          Elements that reveal content or change state only when hovered by a pointer.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Team Directory</CardTitle>
            <CardDescription>Hover over the avatar to reveal detailed user profiles.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="group cursor-pointer">
                  <div className="h-20 w-20 rounded-full border-2 border-primary/20 p-1 transition-all group-hover:border-primary group-hover:scale-105">
                    <div className="h-full w-full rounded-full bg-secondary flex items-center justify-center font-bold text-xl text-primary">
                      HD
                    </div>
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold group-hover:text-primary transition-colors">Ha Do</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-primary-foreground">
                    HD
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@hadotvn</h4>
                    <p className="text-sm">
                      Senior QE & Automation Lead. Building modern playgrounds for the next generation of testers.
                    </p>
                    <div className="flex items-center pt-2 gap-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3 opacity-70" />
                        Vietnam
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="mr-1 h-3 w-3 opacity-70" />
                        Joined April 2026
                      </div>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardContent>
        </Card>
      </div>

      <TipDrawer 
        playwright={`await page.locator('text=Ha Do').hover()`}
        java={`await driver.findElement(By.cssSelector("text=Ha Do")).hover();`}
        python={`await driver.find_element(By.CSS_SELECTOR, "text=Ha Do").hover()`}
        tip="Testing hover requires accurate mouse positioning. verify that the revealed element is not only present in the DOM but also visible to the user. Some elements may disappear if the mouse moves even slightly away."
      />
    </div>
  );
}
