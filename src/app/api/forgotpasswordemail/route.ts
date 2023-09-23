import { connect } from "@/db/config";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

connect();
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if(!email){
      return NextResponse.json({ success: false, msg: 'pls provide email' })
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        msg: "Email is not registered",
      });
    }

    if (!user.isVerified) {
      return NextResponse.json({
        success: false,
        msg: "Email is not verified",
      });
    }

    const sendEmailRes = await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id,
    });

    return NextResponse.json({
      success: true,
      msg: "Check your email",
      data: sendEmailRes,
    });
  } catch (error) {
    return NextResponse.json({ success: false, msg: error });
  }
}

/*
steps
1) verify if email exist in my DB or not

2) generate token add token in Db and send an email with url - <domain>/forgotpassword?token=<generatedToken>

3) this url <domain>/forgotpassword?token=<generatedToken> will ask user to enter new password
and on submit it will pass password, new password and token to POST api

4) api will verify the token from the DB and will change the password 


*/
