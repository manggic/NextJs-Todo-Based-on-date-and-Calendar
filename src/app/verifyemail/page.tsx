"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const VerifyPage = () => {
  const [token, setToken] = useState<string>("");
  const [verified, setVerified] = useState(false);

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    setToken(decodeURIComponent(window.location.search.split("=")[1]));
    return () => {};
  }, []);

  useEffect(() => {
    if (token) {
      callVerityToken();
    }
    return () => {};
  }, [token]);

  const callVerityToken = async () => {
    const res = await fetch("/api/verifyemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const resJson = await res.json();

    if (resJson.success) {
      setStatus("Your email has been successfully verified!");
    } else {
      setStatus(`Something went wrong!- ${resJson.msg}`);
    }
  };

  return (
    <div className="flex flex-col  items-center min-h-screen py-2">
      <div className="mt-16">
        <p className="">{status}</p>
        <Link href="/login">{status == "verified" ? "Login" : ""}</Link>
      </div>
      {/* {error && (
        <div>
          <h2 className="text-xl my-5 bg-red-500 text-black">Error</h2>
        </div>
      )} */}
    </div>
  );
};

export default VerifyPage;

// verify?token=121313wasdasdsadsd
