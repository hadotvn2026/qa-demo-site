"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, User, Mail, Lock } from "lucide-react";

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
import { LocatorBot } from "@/components/layout/locator-bot";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Account created successfully!");
    
    setIsLoading(false);
  }

  const isFormValid = form.formState.isValid;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Registration Form</h1>
        <p className="text-muted-foreground">
          Form with conditional button enabling based on validation state.
        </p>
      </div>

      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Fill in all required fields to enable the sign up button.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="John Doe" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="john@example.com" type="email" className="pl-10" {...field} />
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
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="••••••••" type="password" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="••••••••" type="password" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <TipDrawer
        playwright={`await page.fill('input[placeholder="John Doe"]', 'John Doe');
await page.fill('input[type="email"]', 'john@example.com');
await page.fill('input[type="password"]', 'password123');
await page.fill('input[placeholder*="Confirm"]', 'password123');
await page.click('button:has-text("Sign Up")');`}
        pythonPlaywright={`page.fill('input[placeholder="John Doe"]', 'John Doe')
page.fill('input[type="email"]', 'john@example.com')
page.fill('input[type="password"]', 'password123')
page.fill('input[placeholder*="Confirm"]', 'password123')
page.click('button:has-text("Sign Up")')`}
        java={`WebElement nameField = driver.findElement(By.cssSelector("input[placeholder='John Doe']"));
nameField.sendKeys("John Doe");
WebElement emailField = driver.findElement(By.cssSelector("input[type='email']"));
emailField.sendKeys("john@example.com");
WebElement passwordField = driver.findElement(By.xpath("//input[@type='password'][1]"));
passwordField.sendKeys("password123");
WebElement confirmField = driver.findElement(By.xpath("//input[@type='password'][2]"));
confirmField.sendKeys("password123");
WebElement signUpButton = driver.findElement(By.xpath("//button[text()='Sign Up']"));
signUpButton.click();`}
        python={`name_field = driver.find_element(By.CSS_SELECTOR, "input[placeholder='John Doe']")
name_field.send_keys("John Doe")
email_field = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
email_field.send_keys("john@example.com")
password_field = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")[0]
password_field.send_keys("password123")
confirm_field = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")[1]
confirm_field.send_keys("password123")
sign_up_button = driver.find_element(By.XPATH, "//button[text()='Sign Up']")
sign_up_button.click()`}
        tip="The sign up button is disabled until all required fields are valid. Test both valid and invalid states."
        selector="button:has-text('Sign Up')"
      />

      <LocatorBot selector="button:has-text('Sign Up')" targetName="sign up button" />
    </div>
  );
}