import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";

export async function PUT(request: NextRequest) {
  try {
    const { year, month, day, newTodo, previousTodo, email } =
      await request.json();
    const user = await User.findOne({ email });

    console.log({ newTodo });
    console.log({ previousTodo });

    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        {
          email,
        },
        {
          $set: {
            "calendar.$[year].months.$[month].dates.$[date].tasks.$[task].name":
              newTodo.name,
            "calendar.$[year].months.$[month].dates.$[date].tasks.$[task].status":
              newTodo.status,
          },
        },
        {
          arrayFilters: [
            { "year.year": year },
            { "month.name": month },
            { "date.day": parseInt(day) },
            { "task.name": previousTodo.name },
          ],
          new: true,
        }
      );

      return NextResponse.json({
        success: true,
        msg: "Todo updated successfully",
        data: updatedUser,
      });
    } else {
      return NextResponse.json({ success: false, msg: "User not found" });
    }
  } catch (error) {
    console.log("ERROR", error);

    return NextResponse.json({ success: false, msg: "ERROR" });
  }
}
