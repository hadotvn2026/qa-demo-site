"use client";

import { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TipDrawer } from "@/components/layout/tip-drawer";
import { cn } from "@/lib/utils";

type AgeMode = "adult" | "child";
type Units = "us" | "metric";
type Gender = "male" | "female";

interface BmiResult {
  bmi: number;
  category: string;
  badge: "default" | "secondary" | "destructive";
  healthyMinKg: number;
  healthyMaxKg: number;
  healthyMinLbs: number;
  healthyMaxLbs: number;
  bmiPrime: number;
  ponderalIndex: number;
  heightMeters: number;
  weightKg: number;
}

function classify(bmi: number): Pick<BmiResult, "category" | "badge"> {
  if (bmi < 16) return { category: "Severe thinness", badge: "destructive" };
  if (bmi < 17) return { category: "Moderate thinness", badge: "destructive" };
  if (bmi < 18.5) return { category: "Mild thinness", badge: "secondary" };
  if (bmi < 25) return { category: "Normal", badge: "default" };
  if (bmi < 30) return { category: "Overweight", badge: "secondary" };
  if (bmi < 35) return { category: "Obese Class I", badge: "destructive" };
  if (bmi < 40) return { category: "Obese Class II", badge: "destructive" };
  return { category: "Obese Class III", badge: "destructive" };
}

function compute(
  units: Units,
  feet: string,
  inches: string,
  pounds: string,
  cm: string,
  kg: string,
): { result: BmiResult | null; error: string | null } {
  let heightM = 0;
  let weightKg = 0;

  if (units === "us") {
    const ft = Number(feet);
    const inc = Number(inches);
    const lbs = Number(pounds);
    if (!ft && !inc) return { result: null, error: "Please enter your height." };
    if (!lbs) return { result: null, error: "Please enter your weight." };
    if (ft < 0 || inc < 0 || lbs <= 0) return { result: null, error: "Values must be positive." };
    const totalIn = ft * 12 + inc;
    if (totalIn <= 0) return { result: null, error: "Height must be greater than zero." };
    heightM = totalIn * 0.0254;
    weightKg = lbs * 0.45359237;
  } else {
    const cmNum = Number(cm);
    const kgNum = Number(kg);
    if (!cmNum) return { result: null, error: "Please enter your height in cm." };
    if (!kgNum) return { result: null, error: "Please enter your weight in kg." };
    if (cmNum <= 0 || kgNum <= 0) return { result: null, error: "Values must be positive." };
    heightM = cmNum / 100;
    weightKg = kgNum;
  }

  const bmi = weightKg / (heightM * heightM);
  const { category, badge } = classify(bmi);

  const healthyMinKg = 18.5 * heightM * heightM;
  const healthyMaxKg = 25 * heightM * heightM;

  return {
    result: {
      bmi,
      category,
      badge,
      healthyMinKg,
      healthyMaxKg,
      healthyMinLbs: healthyMinKg / 0.45359237,
      healthyMaxLbs: healthyMaxKg / 0.45359237,
      bmiPrime: bmi / 25,
      ponderalIndex: weightKg / (heightM * heightM * heightM),
      heightMeters: heightM,
      weightKg,
    },
    error: null,
  };
}

export default function BmiPage() {
  const [ageMode, setAgeMode] = useState<AgeMode>("adult");
  const [units, setUnits] = useState<Units>("us");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState<Gender>("male");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("10");
  const [pounds, setPounds] = useState("160");
  const [cm, setCm] = useState("178");
  const [kg, setKg] = useState("72");

  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const ageNum = Number(age);
    if (!ageNum || ageNum < 2 || ageNum > 120) {
      setError("Age must be between 2 and 120.");
      setResult(null);
      return;
    }
    const { result: r, error: e } = compute(units, feet, inches, pounds, cm, kg);
    setResult(r);
    setError(e);
  };

  const handleClear = () => {
    setAge("");
    setFeet("");
    setInches("");
    setPounds("");
    setCm("");
    setKg("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">BMI Calculator</h1>
        <p className="text-muted-foreground">
          Body Mass Index — modeled on{" "}
          <a
            href="https://www.calculator.net/bmi-calculator.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            calculator.net/bmi-calculator
          </a>
          . Native form elements for predictable QA testing.
        </p>
      </div>

      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Calculate your BMI</CardTitle>
          <CardDescription>
            Enter your age, gender, height, and weight. BMI is calculated as kg / m².
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            id="bmi-age-tabs"
            role="tablist"
            aria-label="Age group"
            className="inline-flex rounded-lg border border-border bg-muted/30 p-1"
          >
            {(["adult", "child"] as AgeMode[]).map((mode) => (
              <button
                key={mode}
                role="tab"
                aria-selected={ageMode === mode}
                data-testid={`age-tab-${mode}`}
                onClick={() => setAgeMode(mode)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  ageMode === mode ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {mode === "adult" ? "Adult" : "Child & Teen"}
              </button>
            ))}
          </div>

          {ageMode === "child" ? (
            <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
              For ages 2–19, BMI is interpreted using percentiles against a same-age, same-sex reference
              population. The numbers below still compute, but a clinician should interpret the result.
            </p>
          ) : null}

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Units</legend>
            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="units"
                  value="us"
                  checked={units === "us"}
                  onChange={() => setUnits("us")}
                  className="h-4 w-4 accent-primary"
                />
                US Units (ft, in, lbs)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="units"
                  value="metric"
                  checked={units === "metric"}
                  onChange={() => setUnits("metric")}
                  className="h-4 w-4 accent-primary"
                />
                Metric Units (cm, kg)
              </label>
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bmi-age">Age</Label>
              <Input
                id="bmi-age"
                name="age"
                type="number"
                min={2}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
              />
              <p className="text-xs text-muted-foreground">Ages: 2 – 120</p>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Gender</legend>
              <div className="flex h-10 items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    className="h-4 w-4 accent-primary"
                  />
                  Male
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    className="h-4 w-4 accent-primary"
                  />
                  Female
                </label>
              </div>
            </fieldset>
          </div>

          {units === "us" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Height</Label>
                <div className="flex gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      id="bmi-feet"
                      name="feet"
                      type="number"
                      min={0}
                      max={9}
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      placeholder="5"
                      className="flex-1"
                    />
                    <span className="w-6 shrink-0 text-sm text-muted-foreground">ft</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      id="bmi-inches"
                      name="inches"
                      type="number"
                      min={0}
                      max={11}
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      placeholder="10"
                      className="flex-1"
                    />
                    <span className="w-6 shrink-0 text-sm text-muted-foreground">in</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmi-pounds">Weight</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bmi-pounds"
                    name="pounds"
                    type="number"
                    min={0}
                    value={pounds}
                    onChange={(e) => setPounds(e.target.value)}
                    placeholder="160"
                    className="flex-1"
                  />
                  <span className="w-8 shrink-0 text-sm text-muted-foreground">lbs</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bmi-cm">Height</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bmi-cm"
                    name="cm"
                    type="number"
                    min={0}
                    value={cm}
                    onChange={(e) => setCm(e.target.value)}
                    placeholder="178"
                    className="flex-1"
                  />
                  <span className="w-8 shrink-0 text-sm text-muted-foreground">cm</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmi-kg">Weight</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bmi-kg"
                    name="kg"
                    type="number"
                    min={0}
                    value={kg}
                    onChange={(e) => setKg(e.target.value)}
                    placeholder="72"
                    className="flex-1"
                  />
                  <span className="w-8 shrink-0 text-sm text-muted-foreground">kg</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              id="bmi-calculate"
              type="button"
              onClick={handleCalculate}
              className="min-w-32"
            >
              <Calculator className="h-4 w-4" />
              Calculate
            </Button>
            <Button
              id="bmi-clear"
              type="button"
              variant="outline"
              onClick={handleClear}
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>

          {error ? (
            <p
              id="bmi-error"
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {result ? (
        <Card id="bmi-result" className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Based on a {age}-year-old {gender}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-[auto_1fr]">
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-muted/30 p-6 md:min-w-[14rem]">
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Your BMI</span>
                <span data-testid="bmi-value" className="text-5xl font-bold tabular-nums">
                  {result.bmi.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">kg/m²</span>
                <Badge data-testid="bmi-category" variant={result.badge} className="mt-1">
                  {result.category}
                </Badge>
              </div>

              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <ResultRow
                  label="Healthy BMI range"
                  value="18.5 – 25 kg/m²"
                  testId="result-healthy-bmi"
                />
                <ResultRow
                  label="Healthy weight range"
                  value={
                    units === "us"
                      ? `${result.healthyMinLbs.toFixed(1)} – ${result.healthyMaxLbs.toFixed(1)} lbs`
                      : `${result.healthyMinKg.toFixed(1)} – ${result.healthyMaxKg.toFixed(1)} kg`
                  }
                  testId="result-healthy-weight"
                />
                <ResultRow
                  label="BMI Prime"
                  value={result.bmiPrime.toFixed(2)}
                  testId="result-bmi-prime"
                />
                <ResultRow
                  label="Ponderal Index"
                  value={`${result.ponderalIndex.toFixed(1)} kg/m³`}
                  testId="result-ponderal"
                />
              </dl>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <TipDrawer
        selector={`#bmi-calculate`}
        playwright={`import { test, expect } from '@playwright/test';

test('computes BMI for adult metric inputs', async ({ page }) => {
  await page.goto('/elements/bmi');
  await page.getByLabel('Metric Units (cm, kg)').check();
  await page.getByLabel('Age').fill('25');
  await page.getByLabel('Male').check();
  await page.getByLabel('Height').fill('178');
  await page.getByLabel('Weight').fill('72');
  await page.locator('#bmi-calculate').click();
  await expect(page.getByTestId('bmi-value')).toHaveText('22.7');
  await expect(page.getByTestId('bmi-category')).toHaveText('Normal');
});`}
        pythonPlaywright={`from playwright.sync_api import expect

def test_computes_bmi(page):
    page.goto("/elements/bmi")
    page.get_by_label("Metric Units (cm, kg)").check()
    page.get_by_label("Age").fill("25")
    page.get_by_label("Male").check()
    page.get_by_label("Height").fill("178")
    page.get_by_label("Weight").fill("72")
    page.locator("#bmi-calculate").click()
    expect(page.get_by_test_id("bmi-value")).to_have_text("22.7")
    expect(page.get_by_test_id("bmi-category")).to_have_text("Normal")`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import static org.testng.Assert.assertEquals;

class BmiTest {
    @Test
    void computesBmi() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/bmi");
        driver.findElement(By.cssSelector("input[name='units'][value='metric']")).click();
        driver.findElement(By.id("bmi-age")).sendKeys("25");
        driver.findElement(By.cssSelector("input[name='gender'][value='male']")).click();
        driver.findElement(By.id("bmi-cm")).sendKeys("178");
        driver.findElement(By.id("bmi-kg")).sendKeys("72");
        driver.findElement(By.id("bmi-calculate")).click();
        WebElement value = new WebDriverWait(driver, Duration.ofSeconds(3))
            .until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='bmi-value']")));
        assertEquals(value.getText(), "22.7");
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_computes_bmi():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/bmi")
    driver.find_element(By.CSS_SELECTOR, "input[name='units'][value='metric']").click()
    driver.find_element(By.ID, "bmi-age").send_keys("25")
    driver.find_element(By.CSS_SELECTOR, "input[name='gender'][value='male']").click()
    driver.find_element(By.ID, "bmi-cm").clear()
    driver.find_element(By.ID, "bmi-cm").send_keys("178")
    driver.find_element(By.ID, "bmi-kg").clear()
    driver.find_element(By.ID, "bmi-kg").send_keys("72")
    driver.find_element(By.ID, "bmi-calculate").click()
    value = WebDriverWait(driver, 3).until(
        EC.visibility_of_element_located(
            (By.CSS_SELECTOR, "[data-testid='bmi-value']")))
    assert value.text == "22.7"
    driver.quit()`}
        tip="Inputs default to non-empty values, so .clear() before .send_keys() in Selenium — Playwright's .fill() handles this automatically. The form uses native radios (input[name='units'], input[name='gender']) and ids on every field, so locators don't depend on visible text."
      />
    </div>
  );
}

function ResultRow({ label, value, testId }: { label: string; value: string; testId: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd data-testid={testId} className="mt-1 font-mono text-sm font-semibold tabular-nums">
        {value}
      </dd>
    </div>
  );
}
