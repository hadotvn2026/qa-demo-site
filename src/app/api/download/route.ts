import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const delay = parseInt(searchParams.get("delay") || "0");

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const csvContent = [
    "id,name,email,role",
    "1,Ha Do,hado@flakelab.dev,Senior QE",
    "2,Alice Smith,alice@example.com,Developer",
    "3,Bob Johnson,bob@test.com,QA Engineer",
    "4,Charlie Brown,charlie@hq.com,Manager",
  ].join("\n");

  const response = new NextResponse(csvContent);
  response.headers.set("Content-Type", "text/csv");
  response.headers.set("Content-Disposition", "attachment; filename=users.csv");

  return response;
}
