"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { ErrorState } from "@/components/state/ErrorState";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (values.username === "tomsmith" && values.password === "SuperSecretPassword!") {
      toast.success("Successfully signed in.");
      router.push("/elements/dropdown");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setError("Account locked. Too many failed attempts.");
      } else {
        setError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
      }
      toast.error("Authentication failed.");
    }
    
    setIsLoading(false);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Authentication</h1>
        <p className="text-muted-foreground">
          Stateless login form with server-side validation and lockout logic.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access the element list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <ErrorState 
                severity={attempts >= 3 ? "error" : "warning"} 
                message={error} 
                recovery={attempts >= 3 ? { label: "Reset Attempts", onClick: () => { setAttempts(0); setError(null); } } : undefined}
                className="mb-4"
              />
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="tomsmith" className="pl-9" {...field} disabled={attempts >= 3} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-9" {...field} disabled={attempts >= 3} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-11" disabled={isLoading || attempts >= 3}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-xs text-muted-foreground text-center w-full">
              Credentials: <code className="text-primary">tomsmith</code> / <code className="text-primary">SuperSecretPassword!</code>
            </div>
          </CardFooter>
        </Card>
      </div>

      <TipDrawer
        selector={`input[name="username"]`}
        playwright={`import { test, expect } from '@playwright/test';

test('rejects invalid creds', async ({ page }) => {
  await page.goto('/elements/auth');
  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('wrongpass');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText(/Invalid credentials/i)).toBeVisible();
});`}
        pythonPlaywright={`import re
from playwright.sync_api import expect

def test_rejects_invalid_creds(page):
    page.goto("/elements/auth")
    page.get_by_label("Username").fill("tomsmith")
    page.get_by_label("Password").fill("wrongpass")
    page.get_by_role("button", name="Sign In").click()
    expect(page.get_by_text(re.compile("Invalid credentials", re.I))).to_be_visible()`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertTrue;

class AuthTest {
    @Test
    void rejectsInvalidCreds() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/auth");
        driver.findElement(By.cssSelector("input[name='username']"))
              .sendKeys("tomsmith");
        driver.findElement(By.cssSelector("input[name='password']"))
              .sendKeys("wrongpass");
        driver.findElement(By.xpath("//button[normalize-space()='Sign In']"))
              .click();
        String body = driver.findElement(By.tagName("body")).getText();
        assertTrue(body.contains("Invalid credentials"));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_rejects_invalid_creds():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/auth")
    driver.find_element(By.CSS_SELECTOR, "input[name='username']").send_keys("tomsmith")
    driver.find_element(By.CSS_SELECTOR, "input[name='password']").send_keys("wrongpass")
    driver.find_element(By.XPATH, "//button[normalize-space()='Sign In']").click()
    assert "Invalid credentials" in driver.find_element(By.TAG_NAME, "body").text
    driver.quit()`}
        tip="Prefer ARIA roles and labels over CSS classes — they survive design refactors and read like the user's intent. The valid credentials on this page are tomsmith / SuperSecretPassword!"
      />
    </div>
  );
}
