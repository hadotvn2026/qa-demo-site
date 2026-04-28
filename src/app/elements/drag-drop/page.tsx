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
        selector={`#item-1`}
        playwright={`import { test, expect } from '@playwright/test';

test('reorders items by drag and drop', async ({ page }) => {
  await page.goto('/elements/drag-drop');
  const list = page.locator('[id^="item-"]');
  await expect(list.first()).toHaveText(/Fix flaky test/);
  await list.first().dragTo(list.nth(2));
  await expect(list.first()).not.toHaveText(/Fix flaky test/);
});`}
        pythonPlaywright={`import re
from playwright.sync_api import expect

def test_reorders_items(page):
    page.goto("/elements/drag-drop")
    list_ = page.locator('[id^="item-"]')
    expect(list_.first).to_have_text(re.compile("Fix flaky test"))
    list_.first.drag_to(list_.nth(2))
    expect(list_.first).not_to_have_text(re.compile("Fix flaky test"))`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import static org.testng.Assert.assertNotEquals;

class DragDropTest {
    @Test
    void reordersItems() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/drag-drop");
        WebElement first = driver.findElement(By.id("item-1"));
        WebElement third = driver.findElement(By.id("item-3"));
        String before = driver.findElements(By.cssSelector("[id^='item-']"))
            .get(0).getText();
        new Actions(driver).clickAndHold(first).moveToElement(third)
            .release().perform();
        String after = driver.findElements(By.cssSelector("[id^='item-']"))
            .get(0).getText();
        assertNotEquals(before, after);
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

def test_reorders_items():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/drag-drop")
    first = driver.find_element(By.ID, "item-1")
    third = driver.find_element(By.ID, "item-3")
    before = driver.find_elements(By.CSS_SELECTOR, "[id^='item-']")[0].text
    ActionChains(driver).click_and_hold(first).move_to_element(third).release().perform()
    after = driver.find_elements(By.CSS_SELECTOR, "[id^='item-']")[0].text
    assert before != after
    driver.quit()`}
        tip="HTML5 drag events confuse most automation tools. Playwright's dragTo() works for native draggable=true; many React libs (dnd-kit, react-dnd) listen to pointer events instead — use mouse down → move → up. Always assert post-DOM ordering, not the drag fired."
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
