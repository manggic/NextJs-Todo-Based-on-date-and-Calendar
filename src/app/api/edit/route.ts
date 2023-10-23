import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";

import { connect } from "@/db/config";

connect();
export async function PUT(request: NextRequest) {
  try {
    const {
      year,
      month,
      day,
      newEventData,
      previousEventData,
      email,
      eventName,
    } = await request.json();

    let diff: Number = 0;
    let incre = {};

    if (eventName === "expenses") {
      if (newEventData.price > previousEventData.price) {
        diff = Number(newEventData.price) - Number(previousEventData.price);
        incre = {
          "calendar.$[year].months.$[month].dates.$[date].totalExpense": diff,
        };
      } else {
        diff = Number(previousEventData.price) - Number(newEventData.price);
        incre = {
          "calendar.$[year].months.$[month].dates.$[date].totalExpense": -diff,
        };
      }
    }

    const user = await User.findOne({ email });

    const field = `calendar.$[year].months.$[month].dates.$[date].${
      eventName == "todo" ? "tasks" : eventName
    }.$[elementName]`;

    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        {
          email,
        },
        {
          $set: {
            [field]: newEventData,
          },
          $inc: incre,
        },
        {
          arrayFilters: [
            { "year.year": year },
            { "month.name": month },
            { "date.day": parseInt(day) },
            { "elementName.name": previousEventData.name },
          ],
          new: true,
        }
      );

      let monthData: [] = [];
      updatedUser.calendar.map((yearList: any) => {
        if (yearList.year === year) {
          yearList.months.map((monthList: any) => {
            if (monthList.name === month) {
              monthData = monthList.dates;
            }
          });
        }
      });

      return NextResponse.json({
        success: true,
        msg: "Todo updated successfully",
        data: { monthData, email: user.email, name: user.name },
      });
    } else {
      return NextResponse.json({ success: false, msg: "User not found" });
    }
  } catch (error) {
    console.log("Edit ERROR", error);

    return NextResponse.json({ success: false, msg: "ERROR" });
  }
}
