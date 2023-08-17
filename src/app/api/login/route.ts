import { NextResponse } from "next/server";

import User from "@/models/UserModel";

import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { connect } from "@/db/config";
connect()
export async function POST(request: Request) {
  try {
    const res = await request.json();

    const { email, password } = res || {};

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

    const token = await jwt.sign({ email }, "thisismytoken", {
      expiresIn: "1d",
    });

    const response = NextResponse.json({ success: true, msg: "login done" });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {

    console.log('ERROR', error);
    
    return NextResponse.json({ success: false, msg: "login failed" });
  }
}
