import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

import User from "@/models/UserModel";
import { connect } from "@/db/config";


connect()
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token").value;


    const dataFromToken = await jwt.verify(token, "thisismytoken");

    const user = await User.findOne({ email: dataFromToken.email });


    if(!user){
        return NextResponse.json({ msg: "User not found OR invalid token" });
    }

    return NextResponse.json({
      success: true,
      msg: "get user successfully",
      data: user,
    });
  } catch (error) {
    console.log({ error });

    return NextResponse.json({ msg: "ERROR" });
  }
}
