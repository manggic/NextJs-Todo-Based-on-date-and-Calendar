import { NextResponse } from "next/server";

import User from "@/models/UserModel";

import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { connect } from "@/db/config";
connect();
export async function POST(request: Request) {
  try {
    const res = await request.json();

    const { email, password, rememberMe } = res || {};

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, msg: "User not registered" });
    }

    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      return NextResponse.json({
        success: false,
        msg: "Password doesn't match",
      });
    }

    const token = await jwt.sign({ email }, "thisismytoken");

    user.userToken = token;
    user.userTokenExpiry = rememberMe
      ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      : Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();
    const response = NextResponse.json({ success: true, msg: "login done" });

    if (rememberMe) {
      response.cookies.set("token", token, {
        httpOnly: true,
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
    } else {
      response.cookies.set("token", token, {
        httpOnly: true,
      });
    }

    return response;
  } catch (error) {
    console.log("ERROR", error);

    const response = NextResponse.json({ success: false, msg: "login failed" })

    response.cookies.delete('token')

    return response;
    
  }
}
