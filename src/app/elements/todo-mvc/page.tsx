"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

export default function TodoMvcPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Learn Playwright", completed: true },
    { id: "2", text: "Master Selenium", completed: false },
    { id: "3", text: "Build test automation framework", completed: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleAddTodo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: inputValue.trim(), completed: false }
      ]);
      setInputValue("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      commitEdit(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const commitEdit = (id: string) => {
    if (editValue.trim() === "") {
      deleteTodo(id);
    } else {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, text: editValue.trim() } : todo
      ));
    }
    setEditingId(null);
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const toggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(todos.map(todo => ({ ...todo, completed: !allCompleted })));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">todos</h1>
        <p className="text-muted-foreground">
          The classic TodoMVC implementation. Perfect for end-to-end testing workflows.
        </p>
      </div>

      <Card className="border-border bg-card/50 shadow-lg overflow-hidden">
        <div className="flex items-center border-b border-border bg-card">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAll}
            className={cn(
              "ml-2 shrink-0 rounded-full",
              todos.length === 0 && "invisible",
              todos.every(t => t.completed) ? "text-primary" : "text-muted-foreground"
            )}
            title="Toggle all"
          >
            <span className="text-xl leading-none rotate-90">❯</span>
          </Button>
          <input
            className="w-full bg-transparent px-4 py-4 text-xl outline-none placeholder:text-muted-foreground placeholder:italic"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddTodo}
            autoFocus
          />
        </div>

        {todos.length > 0 && (
          <>
            <ul className="todo-list m-0 p-0 list-none">
              {filteredTodos.map(todo => (
                <li 
                  key={todo.id}
                  className={cn(
                    "group relative border-b border-border bg-card flex items-center text-lg transition-all",
                    todo.completed && "text-muted-foreground line-through bg-muted/20"
                  )}
                  onDoubleClick={() => startEditing(todo)}
                >
                  {editingId === todo.id ? (
                    <input
                      ref={editInputRef}
                      className="w-full bg-background px-4 py-3 ml-12 text-lg outline-none border border-primary shadow-[inset_0_-1px_5px_0_rgba(0,0,0,0.2)]"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                      onBlur={() => commitEdit(todo.id)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center px-4 py-3 shrink-0">
                        <Checkbox 
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="h-6 w-6 rounded-full border-muted-foreground"
                        />
                      </div>
                      <label className="flex-1 py-3 px-2 break-all cursor-text select-none">
                        {todo.text}
                      </label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 mr-2 transition-opacity"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground bg-muted/30 border-t border-border">
              <span className="todo-count">
                <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
              </span>
              
              <ul className="flex space-x-2 m-0 p-0 list-none">
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter("all")}
                    className={cn("h-7 px-2 border border-transparent", filter === "all" && "border-primary text-primary")}
                  >
                    All
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter("active")}
                    className={cn("h-7 px-2 border border-transparent", filter === "active" && "border-primary text-primary")}
                  >
                    Active
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter("completed")}
                    className={cn("h-7 px-2 border border-transparent", filter === "completed" && "border-primary text-primary")}
                  >
                    Completed
                  </Button>
                </li>
              </ul>

              {todos.some(t => t.completed) ? (
                <Button variant="ghost" size="sm" onClick={clearCompleted} className="h-7 hover:underline">
                  Clear completed
                </Button>
              ) : (
                <div className="w-[110px]" /> /* Placeholder to keep layout balanced */
              )}
            </div>
          </>
        )}
      </Card>

      <TipDrawer 
        playwright={`page.locator('.todo-list li').filter({ hasText: 'Master Selenium' }).getByRole('checkbox').check()`}
        java={`driver.findElement(By.cssSelector(".todo-list li")).filter({ hasText: 'Master Selenium' }).getByRole('checkbox').check();`}
        python={`driver.find_element(By.CSS_SELECTOR, ".todo-list li").filter({ hasText: 'Master Selenium' }).getByRole('checkbox').check()`}
        tip="TodoMVC is the standard benchmark for testing frameworks. Practice double-clicking to edit, checking boxes, clearing completed, and filtering lists. The DOM structure here mimics standard TodoMVC apps but uses custom React components."
      />
    </div>
  );
}
