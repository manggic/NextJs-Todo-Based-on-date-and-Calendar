import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";
import { connect } from "@/db/config";

connect();
export async function POST(request: NextRequest) {
  try {
    let { year, month, day, todo, email } = await request.json();

    let user = await User.findOne({ email });

    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        {
          email,
        },
        {
          $push: {
            "calendar.$[year].months.$[month].dates.$[date].tasks": {
              name: todo,
              status: 0,
            },
          },
        },
        {
          arrayFilters: [
            { "year.year": year },
            { "month.name": month },
            { "date.day": parseInt(day) },
          ],
          new: true,
        }
      );

      return NextResponse.json({
        success: true,
        msg: "updated successfully",
        data: updatedUser,
      });
    } else {
      return NextResponse.json({ success: false, msg: "User not found" });
    }
  } catch (error) {
    console.log("ERROR", error);

    return NextResponse.json({ success: false });
  }
}
