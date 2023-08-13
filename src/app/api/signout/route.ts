import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest){


    try {

        const response = await NextResponse.json({
            msg: "Logout successful",
            success: true,
          });
         response.cookies.set('token','',{ httpOnly: true })

        return response
    } catch (error) {
        return NextResponse.json({success:false})
    }
}