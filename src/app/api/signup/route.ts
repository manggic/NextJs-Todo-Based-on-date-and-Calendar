import { NextRequest, NextResponse } from "next/server";

import User from "@/models/UserModel";

import { connect } from "@/db/config";



import bcrypt from 'bcryptjs'


connect();
export async function POST(request: NextRequest) {
  try {

     // fetch name, email and password from POST request
    const { name, email, password } = await request.json();


      console.log('name ???', name);
      console.log('email ???', email);
      console.log('password ???', password);
    

    // checking if user already present or not
    const user = await User.findOne({email});


    // if user already present throw respective msg
    if (user) {
      return NextResponse.json({ success: false, msg: "user already exist" });
    }


    const salt = await bcrypt.genSalt(10);

    console.log('salt ???????',salt, password);
    
    const hashPassword = await bcrypt.hash(password, salt)

    console.log('hashPassword ???????',hashPassword);



    const savedUser = new User({name, email, password:hashPassword})

    await savedUser.save()
    



    return NextResponse.json({ success: true, msg: "sign up done", data:savedUser });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json({ success: false, msg: 'sign up failed' });
  }
}
