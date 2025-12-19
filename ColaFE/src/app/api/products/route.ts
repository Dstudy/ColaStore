import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "ref", "products.json");
    const fileContents = await readFile(filePath, "utf8");
    const productsData = JSON.parse(fileContents);
    return NextResponse.json(productsData);
  } catch (error) {
    return NextResponse.json(
      { errCode: 1, message: "Failed to fetch products", data: null },
      { status: 500 }
    );
  }
}

