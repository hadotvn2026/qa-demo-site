"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TipDrawer } from "@/components/layout/tip-drawer";

export type City = {
  id: string;
  city: string;
  country: string;
  population: number;
  gdpUsdBillions: number;
  continent: "Asia" | "Europe" | "Americas" | "Oceania" | "Africa";
};

const data: City[] = [
  { id: "1", city: "Tokyo", country: "Japan", population: 37_400_000, gdpUsdBillions: 1800, continent: "Asia" },
  { id: "2", city: "New York", country: "United States", population: 19_300_000, gdpUsdBillions: 2050, continent: "Americas" },
  { id: "3", city: "Los Angeles", country: "United States", population: 13_200_000, gdpUsdBillions: 1300, continent: "Americas" },
  { id: "4", city: "London", country: "United Kingdom", population: 9_500_000, gdpUsdBillions: 870, continent: "Europe" },
  { id: "5", city: "Paris", country: "France", population: 11_000_000, gdpUsdBillions: 870, continent: "Europe" },
  { id: "6", city: "Shanghai", country: "China", population: 28_500_000, gdpUsdBillions: 680, continent: "Asia" },
  { id: "7", city: "Seoul", country: "South Korea", population: 25_500_000, gdpUsdBillions: 780, continent: "Asia" },
  { id: "8", city: "Osaka", country: "Japan", population: 19_000_000, gdpUsdBillions: 700, continent: "Asia" },
  { id: "9", city: "Singapore", country: "Singapore", population: 5_900_000, gdpUsdBillions: 470, continent: "Asia" },
  { id: "10", city: "Sydney", country: "Australia", population: 5_300_000, gdpUsdBillions: 420, continent: "Oceania" },
  { id: "11", city: "São Paulo", country: "Brazil", population: 22_000_000, gdpUsdBillions: 430, continent: "Americas" },
  { id: "12", city: "Dubai", country: "United Arab Emirates", population: 3_500_000, gdpUsdBillions: 115, continent: "Asia" },
];

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 1,
});
const numberFormatter = new Intl.NumberFormat("en-US");

function formatGdp(billions: number): string {
  if (billions >= 1000) {
    return `${usdFormatter.format(billions / 1000)}T`;
  }
  return `${usdFormatter.format(billions)}B`;
}

const continentBadgeVariant: Record<City["continent"], "default" | "secondary" | "outline" | "destructive"> = {
  Asia: "default",
  Europe: "secondary",
  Americas: "outline",
  Oceania: "outline",
  Africa: "destructive",
};

const columns: ColumnDef<City>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        City
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("city")}</div>,
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => <div>{row.getValue("country")}</div>,
  },
  {
    accessorKey: "population",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        Population
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="tabular-nums">
        {numberFormatter.format(row.getValue("population"))}
      </div>
    ),
  },
  {
    accessorKey: "gdpUsdBillions",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        GDP (USD)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="tabular-nums font-medium">
        {formatGdp(row.getValue("gdpUsdBillions"))}
      </div>
    ),
  },
  {
    accessorKey: "continent",
    header: "Continent",
    cell: ({ row }) => {
      const continent = row.getValue("continent") as City["continent"];
      return (
        <Badge variant={continentBadgeVariant[continent]} className="capitalize">
          {continent}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const city = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(city.city)}>
              Copy city name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Remove from list</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TablePage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Table</h1>
        <p className="text-muted-foreground">
          Cities of the world with population and GDP in USD — sortable, filterable, paginated.
        </p>
      </div>

      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
          <div className="relative w-full sm:max-w-sm">
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter cities..."
              value={(table.getColumn("city")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("city")?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <TipDrawer
        selector={`//tr[.//*[normalize-space()='Tokyo']]`}
        playwright={`import { test, expect } from '@playwright/test';

test('selects a row by city', async ({ page }) => {
  await page.goto('/elements/table');
  const row = page.getByRole('row', { name: /Tokyo/ });
  await row.getByRole('checkbox').check();
  await expect(row).toHaveAttribute('data-state', 'selected');
});`}
        pythonPlaywright={`import re
from playwright.sync_api import expect

def test_selects_row(page):
    page.goto("/elements/table")
    row = page.get_by_role("row", name=re.compile("Tokyo"))
    row.get_by_role("checkbox").check()
    expect(row).to_have_attribute("data-state", "selected")`}
        java={`import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.assertEquals;

class TableTest {
    @Test
    void selectsRowByCity() {
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:3000/elements/table");
        WebElement row = driver.findElement(
            By.xpath("//tr[.//*[normalize-space()='Tokyo']]"));
        row.findElement(By.cssSelector("[role='checkbox']")).click();
        assertEquals("selected", row.getAttribute("data-state"));
        driver.quit();
    }
}`}
        python={`from selenium import webdriver
from selenium.webdriver.common.by import By

def test_selects_row():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/elements/table")
    row = driver.find_element(
        By.XPATH, "//tr[.//*[normalize-space()='Tokyo']]")
    row.find_element(By.CSS_SELECTOR, "[role='checkbox']").click()
    assert row.get_attribute("data-state") == "selected"
    driver.quit()`}
        tip="Scope row interactions inside the row that contains the unique cell — never index by row number, since sort/filter shuffles them. role='row' + a name regex is the most stable handle in shadcn/Tanstack tables. The GDP column sorts numerically even though it renders formatted text."
      />
    </div>
  );
}
