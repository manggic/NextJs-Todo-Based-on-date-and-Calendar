import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";
import { connect } from "@/db/config";

connect();
export async function POST(request: NextRequest) {
  try {
    let { year, month, day, eventName, email, eventData } =
      await request.json();

    if (!isNaN(Number(year)) && !isNaN(Number(day)) && isNaN(Number(month))) {
      let user = await User.findOne({ email });

      const field = `calendar.$[year].months.$[month].dates.$[date].${
        eventName == "todo" ? "tasks" : eventName
      }`;
      if (user) {
        const updatedUser = await User.findOneAndUpdate(
          {
            email,
          },
          {
            $push: {
              [field]: eventData,
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

        let monthData = [];
        updatedUser.calendar.map((yearList) => {
          if (yearList.year === year) {
            yearList.months.map((monthList) => {
              if (monthList.name === month) {
                monthData = monthList.dates;
              }
            });
          }
        });

        return NextResponse.json({
          success: true,
          msg: "updated successfully",
          data: { monthData, email: user.email, name: user.name },
        });
      } else {
        return NextResponse.json({ success: false, msg: "User not found" });
      }
    } else {
      return NextResponse.json({
        msg: "Pls provide correct value for year, month and day",
        success: false,
      });
    }
  } catch (error) {
    console.log("ERROR", error);

    return NextResponse.json({ success: false });
  }
}
