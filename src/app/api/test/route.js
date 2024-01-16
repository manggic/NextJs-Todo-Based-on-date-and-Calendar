import { generateDefaultCalendarData } from "@/constant";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";

import { connect } from "@/db/config";

connect()
export async function GET() {
  try {
    const users = await User.find({}); // Adjust the limit as needed

    const response = generateDefaultCalendarData()?.[0]
    await Promise.all(users.map(async (user) => {
      try {
        if (!user.calendar.some(({ year }) => year === response.year)) {
          user.calendar = [...user.calendar, response];
          await user.save(); // Save each user
        }
      } catch (error) {
        console.error(`Error saving user: ${user._id}`, error);
        // Handle the error as needed (e.g., log it, retry, etc.)
      }
    }));

    return NextResponse.json({'msg':"testing"})

  } catch (error) {
    console.log("ERROR", error);

    return NextResponse.json({ success: false });
  }
}
