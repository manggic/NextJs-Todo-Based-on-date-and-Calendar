import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";

import { connect } from "@/db/config";

import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

function generateDefaultCalendarData() {
  const calendarData = [];

  // month list
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // get current year (2023)
  const currentYear = new Date().getFullYear();

  // looping through month
  for (const month of months) {
    // get days in a month
    const daysInMonth = new Date(
      currentYear,
      months.indexOf(month) + 1,
      0
    ).getDate();

    // creating obj for single month with name and dates property
    // { name:"january", dates: [ { day:1, tasks:[] }, { day:2, tasks:[] }]  }
    const monthData = {
      name: month,
      dates: Array.from({ length: daysInMonth }, (_, index) => ({
        day: index + 1,
        tasks: [],
        expense:[],
        totalExpense:0
      })),
      totalExpense:0
    };
    calendarData.push(monthData);
  }

  return [{ year: currentYear.toString(), months: calendarData }];
}

export async function POST(request: NextRequest) {
  try {
    // fetch name, email and password from POST request
    const { name, email, password } = await request.json();

    // check's if all required data is provided or not
    if (!(name && email && password)) {
      return NextResponse.json({
        success: false,
        msg: "Pls provide all the required fields",
      });
    }

    // checking if user already present or not
    const user = await User.findOne({ email });

    // if user already present throw respective msg
    if (user) {
      return NextResponse.json({ success: false, msg: "user already exist" });
    }

    // Generate default calendar data
    const defaultCalendarData = generateDefaultCalendarData();

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const savedUser = new User({
      name,
      email,
      password: hashPassword,
      calendar: defaultCalendarData,
    });

    await savedUser.save();

    const sendEmailResp = await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json({
      success: true,
      msg: "sign up done",
      sendEmailResponse: sendEmailResp.data,
      timeAddingVerifyTokenInDB: sendEmailResp.currentTime,
    });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json({ success: false, msg: "sign up failed" });
  }
}
