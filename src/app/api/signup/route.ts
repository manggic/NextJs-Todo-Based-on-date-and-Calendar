import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";

import { connect } from "@/db/config";

import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { generateDefaultCalendarData } from "@/constant";

connect();


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
