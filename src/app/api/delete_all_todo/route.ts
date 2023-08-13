import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";

export async function DELETE(request: NextRequest) {
  try {
    let { year, month, day, email } = await request.json();
    let user = await User.findOne({ email });

    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        {
          email,
        },
        {
          $set: {
            "calendar.$[year].months.$[month].dates.$[date].tasks": [],
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
        msg: "Todo deleted successfully",
        data: updatedUser,
      });
    }

    return NextResponse.json({ success: true, msg: "SUCCESSFULL" });
  } catch (error) {
    console.log("ERROR", error);

    return NextResponse.json({ success: false, msg: "ERROR" });
  }
}
