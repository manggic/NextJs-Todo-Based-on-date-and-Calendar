import { NextResponse } from "next/server";

import path from "path";
import { promises as fs } from "fs";

export async function POST(request: Request) {
  try {
    const jsonDirectory = path.join(process.cwd() + "/src/", "data.json");

    const data = await request.json();

    // console.log("update data ???", data);

    const res = await fs.writeFile(
      jsonDirectory,
      JSON.stringify(data, null, 2),
      "utf-8"
    );

    return NextResponse.json({ msg: "updating JSON data", success: true });
  } catch (error) {
    return NextResponse.json({ msg: "updating JSON data", success: false });
  }

  return NextResponse.json({ msg: "updating JSON data" });
}
