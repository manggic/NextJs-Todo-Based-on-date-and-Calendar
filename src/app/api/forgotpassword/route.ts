import { connect } from "@/db/config";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

import bcryptjs from "bcryptjs";

connect();
export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmpassword } = await request.json();

    if (password !== confirmpassword) {
      return NextResponse.json({
        success: false,
        msg: "password and confirm password are not same",
      });
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        msg: "Token is invalid",
      });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    user.password = hashPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      msg: "password reset successful",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error });
  }
}
