import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({'msg':"testing"})

  } catch (error) {
    console.log("ERROR", error);

    return NextResponse.json({ success: false });
  }
}
