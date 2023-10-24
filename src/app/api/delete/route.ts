import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";

import { connect } from "@/db/config";

connect();
export async function DELETE(request: NextRequest) {
  try {
    let { year, month, day, eventName, email, eventData } =
      await request.json();

    let user = await User.findOne({ email });
    const field = `calendar.$[year].months.$[month].dates.$[date].${
      eventName == "todo" ? "tasks" : eventName
    }`;

    const update =
      eventName == "expenses"
        ? {
            $pull: {
              [field]: {
                name: eventData.name,
              },
            },
            $inc: {
              "calendar.$[year].months.$[month].dates.$[date].totalExpense":
                -eventData.price,
              "calendar.$[year].months.$[month].totalExpense":
                -eventData.price
            },
          }
        : {
          $pull: {
            [field]: {
              name: eventData.name,
            },
          },
          };
    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        {
          email,
        },
        update,
        {
          arrayFilters: [
            { "year.year": year },
            { "month.name": month },
            { "date.day": parseInt(day) },
          ],
          new: true,
        }
      );

      let monthData: [] = [];
      let monthExpense:Number = 0
      updatedUser.calendar.map((yearList: any) => {
        if (yearList.year === year) {
          yearList.months.map((monthList: any) => {
            if (monthList.name === month) {
              monthData = monthList.dates;
              monthExpense = monthList.totalExpense
            }
          });
        }
      });

      return NextResponse.json({
        success: true,
        msg: "Todo deleted successfully",
        data: { monthData, email: user.email, name: user.name, monthExpense },
      });
    }
  } catch (error) {
    console.log("ERROR", error);

    return NextResponse.json({ success: false });
  }
}
