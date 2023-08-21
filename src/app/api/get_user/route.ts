import { NextRequest, NextResponse } from "next/server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from 'next/headers'

import User from "@/models/UserModel";
import { connect } from "@/db/config";

connect();

export const dynamic = 'force-dynamic'

export async function GET(request:NextRequest) {
  try {
    // const cookieStore = cookies()
    // const token = cookieStore.get('token')?.value
    const token = request.cookies.get("token")?.value;
    

    console.log('token ???', token);
    
    if (!token) {
      return NextResponse.json({
        success: false,
        msg: `token is not available`,
        reqCookiesLog:request.cookies.get("token")
      });
    }

    const dataFromToken = await jwt.verify(token as string, "thisismytoken");

    const user = await User.findOne({
      email: (dataFromToken as JwtPayload).email,
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found OR invalid token" });
    }

    return NextResponse.json({
      success: true,
      msg: "get user successfully",
      data: user,
    });
  } catch (error) {
    console.log({ error });

    return NextResponse.json({ success: false, msg: `ERROR ${error}` });
  }
}
