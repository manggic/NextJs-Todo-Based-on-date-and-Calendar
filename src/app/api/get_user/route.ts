import { NextRequest, NextResponse } from "next/server";

import jwt, { JwtPayload } from "jsonwebtoken";

import User from "@/models/UserModel";
import { connect } from "@/db/config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { month, year } = await request.json();
    await connect();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        msg: `token is not available`,
        reqCookiesLog: request.cookies.get("token"),
      });
    }

    const dataFromToken = await jwt.verify(token as string, "thisismytoken");

    const user = await User.findOne({
      email: (dataFromToken as JwtPayload).email,
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found OR invalid token" });
    }

    let monthData:[] = [];
    let monthExpense:Number = 0
    user.calendar.map((yearList:any) => {
      if (yearList.year === year) {
        yearList.months.map((monthList:any) => {
          if (monthList.name === month) {
            monthData = monthList.dates;
            monthExpense = monthList.totalExpense
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      msg: "get user successfully",
      data: { monthData, email: user.email, name:user.name, monthExpense },
    });
  } catch (error) {
    console.log({ error });

    return NextResponse.json({ success: false, msg: `${error}` });
  }
}
