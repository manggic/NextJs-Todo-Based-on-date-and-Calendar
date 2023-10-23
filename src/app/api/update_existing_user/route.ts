import { connect } from "@/db/config";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const users = await User.find();

    for (const user of users) {
      for (const month of user.calendar[0].months) {
        for (const date of month.dates) {
          let totalExpense = 0;

          for (const expense of date.expenses) {
            // Assuming each expense object has a 'price' property
            console.log("expense.price ???", expense.price);

            if (expense.price) {
              totalExpense += expense.price;
            }
          }

          date.totalExpense = totalExpense; // Update totalExpense for this date

        }

        // After updating all dates within a month, set the totalExpense for that month
        month.totalExpense = month.dates.reduce(
          (acc, date) => acc + date.totalExpense,
          0
        );
      }

      // After updating all months within the calendar, set the totalExpense for the user
      user.calendar[0].totalExpense = user.calendar[0].months.reduce(
        (acc, month) => acc + month.totalExpense,
        0
      );

      // Save the updated user document
      await user.save();
    }

    return NextResponse.json({
      message: "Updated documents successfully",
      success: true,
    });
  } catch (error: any) {
    console.log("ERROR >>>", error);

    return NextResponse.json({
      success: false,
      msg: `Error updating documents: : ${error}`,
    });
  }
}

// Update documents where 'totalExpense' is missing or null
// const result = await User.updateMany(
//     { 'calendar': { $exists: true }, 'calendar.months.dates.totalExpense': { $exists: false } },
//     { $set: { 'calendar.$[].months.$[].dates.$[].totalExpense': 0 } }
//   );
