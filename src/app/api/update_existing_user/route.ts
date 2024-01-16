import { connect } from "@/db/config";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Iterate through each user
    for (const user of users) {
      // Iterate through each month in the user's calendar
      for (const month of user.calendar[0].months) {
        // Calculate total expenses for the month
        const totalExpenseForMonth = month.dates.reduce(
          (acc: number, date: any) => acc + date.totalExpense,
          0
        );

        // Update the totalExpense for the month
        month.totalExpense = totalExpenseForMonth;
      }

      // Calculate total expenses for the user's calendar
      user.calendar[0].totalExpense = user.calendar[0].months.reduce(
        (acc: number, month: any) => acc + month.totalExpense,
        0
      );

      // Save the updated user document in the database
      await user.save();
    }

    // Return a success response if the documents are updated successfully
    return NextResponse.json({
      message: "Updated documents successfully",
      success: true,
    });
  } catch (error: any) {
    // Handle errors during the update process and log the details
    console.error("ERROR >>>", error);

    // Return an error response if updating documents fails
    return NextResponse.json({
      success: false,
      msg: `Error updating documents: ${error}`,
    });
  }
}

// Update documents where 'totalExpense' is missing or null (currently commented out)
// const result = await User.updateMany(
//   { 'calendar': { $exists: true }, 'calendar.months.dates.totalExpense': { $exists: false } },
//   { $set: { 'calendar.$[].months.$[].dates.$[].totalExpense': 0 } }
// );
