"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { cn } from "@/lib/utils";

const initialItems = [
  { id: "1", text: "Fix flaky test in Login suite" },
  { id: "2", text: "Refactor Page Object Model" },
  { id: "3", text: "Increase coverage on Table element" },
  { id: "4", text: "Update Playwright dependencies" },
];

export default function DragDropPage() {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Drag and Drop</h1>
        <p className="text-muted-foreground">
          Sortable lists and drag interactions to test complex mouse/pointer events.
        </p>
      </div>

      <div className="flex justify-center py-8">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Priority List</CardTitle>
            <CardDescription>Drag items to reorder the task priority.</CardDescription>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {items.map((item) => (
                    <SortableItem key={item.id} id={item.id} text={item.text} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>

      <TipDrawer 
        playwright={`await page.locator('#item-1').dragTo(page.locator('#item-3'))`}
        java={`await driver.findElement(By.cssSelector("#item-1")).dragTo(driver.findElement(By.cssSelector("#item-3")));`}
        python={`await driver.find_element(By.CSS_SELECTOR, "#item-1").dragTo(driver.find_element(By.CSS_SELECTOR, "#item-3"))`}
        tip="Drag and drop is notoriously difficult in Selenium/Playwright. Using 'dragTo' is the most stable approach, but for some libraries, you may need to perform a sequence: hover -> mouse.down -> mouse.move -> mouse.up."
      />
    </div>
  );
}

function SortableItem({ id, text }: { id: string; text: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`item-${id}`}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-shadow",
        isDragging ? "shadow-2xl ring-2 ring-primary/20 z-50 opacity-80" : "hover:border-primary/30"
      )}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
