import { NextRequest, NextResponse } from "next/server";

import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  const jsonDirectory = path.join(process.cwd() + "/src/", "data.json");

  // Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory, "utf8");

  return NextResponse.json({ success: true, data: JSON.parse(fileContents) });
}
