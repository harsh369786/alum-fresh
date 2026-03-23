import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "discounts.json");

export async function GET() {
  try {
    const fileData = await fs.readFile(dataFilePath, "utf8");
    const discounts = JSON.parse(fileData);
    return NextResponse.json(discounts);
  } catch (error) {
    // Fallback if file doesn't exist or is invalid
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  try {
    const newDiscounts = await req.json();
    // Validate it's an object of key: number
    if (typeof newDiscounts !== 'object' || newDiscounts === null) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }
    await fs.writeFile(dataFilePath, JSON.stringify(newDiscounts, null, 2), "utf8");
    return NextResponse.json({ success: true, discounts: newDiscounts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save discounts" }, { status: 500 });
  }
}
