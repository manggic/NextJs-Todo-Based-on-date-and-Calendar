import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";

import { connect } from "@/db/config";

import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

function generateDefaultCalendarData() {
  const calendarData = [];

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

  const currentYear = new Date().getFullYear();

  for (const month of months) {
    const daysInMonth = new Date(
      currentYear,
      months.indexOf(month) + 1,
      0
    ).getDate();
    const monthData = {
      name: month,
      dates: Array.from({ length: daysInMonth }, (_, index) => ({
        day: index + 1,
        tasks: [],
      })),
    };
    calendarData.push(monthData);
  }

  return [{ year: currentYear.toString(), months: calendarData }];
}

export async function POST(request: NextRequest) {
  try {
    // fetch name, email and password from POST request
    const { name, email, password } = await request.json();

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
    console.log("sendEmailResp ????", sendEmailResp);

    return NextResponse.json({
      success: true,
      msg: "sign up done",
      data: savedUser,
      sendEmailResponse: sendEmailResp.data,
    });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json({ success: false, msg: "sign up failed" });
  }
}
