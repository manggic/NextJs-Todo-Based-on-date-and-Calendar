"use client";

import React, { useEffect, useState } from "react";

const Page = () => {


  const [data, setData] = useState('')  

  async function callAPI() {
   const data = await fetch("https://randomuser.me/api/");
   let finalData = await data.json()

    setData(finalData)
   
  }

  useEffect(() => {

    setTimeout(()=> {
        callAPI();

    }, 3000)
    
    return () => {};
  }, []);

  return <div>
    {data?.results?.length?'data is there' :"loading ......"}
  </div>;
};

export default Page;



// API LAYOUT

// import { NextRequest, NextResponse } from "next/server";

// export async function DELETE() {
//   try {
//     return NextResponse.json({ success: true, msg: "SUCCESSFULL" });
//   } catch (error) {
//     console.log("ERROR", error);

//     return NextResponse.json({ success: false, msg: "ERROR" });
//   }
// }
