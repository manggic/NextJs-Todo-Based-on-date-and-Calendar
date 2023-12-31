import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";
import { connect } from "@/db/config";

connect();
export async function DELETE(request: NextRequest) {
  try {
    let { year, month, day, email, eventName, expense } = await request.json();
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
          $set: {
            [field]: [],
            'calendar.$[year].months.$[month].dates.$[date].totalExpense':0,
          },
          $inc:{
              "calendar.$[year].months.$[month].totalExpense":
             -expense
        }
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

      let monthData:[] = [];
      let monthExpense:Number = 0

      updatedUser.calendar.map((yearList:any) => {
        if (yearList.year === year) {
          yearList.months.map((monthList:any) => {
            if (monthList.name === month) {
              monthData = monthList.dates;
              monthExpense = monthList.totalExpense
            }
          });
        }
      })

      return NextResponse.json({
        success: true,
        msg: "Todo deleted successfully",
        data: { monthData, email: user.email, name:user.name, monthExpense },
      });
    }

    return NextResponse.json({ success: true, msg: "SUCCESSFULL" });
  } catch (error) {
    console.log("ERROR", error);

    return NextResponse.json({ success: false, msg: "ERROR" });
  }
}
