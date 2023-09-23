"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import "./forgotpassword.css";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (password && confirmpassword) {
        if (password === confirmpassword) {
          const res = await fetch("/api/forgotpassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: decodeURIComponent(window.location.search.split("=")[1]),
              password,
              confirmpassword,
            }),
          });

          const resJson = await res.json();

          if (resJson.success) {
            toast.success("Password updated");
            router.push("login");
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.error("Both password does not match");
        }
      } else {
        toast.error("Pls enter complete details");
      }
    } catch (error: any) {
      console.log("ERROR", error);
    }
  };

  return (
    <div className="form-container">
      <Toaster />

      <div className="form-box">
      <h2 className="form-heading">Forgot Password</h2>

      <input
        className="text-black outline-[#2f363b]"
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="text-black outline-[#2f363b]"
        type="password"
        name="confirmpassword"
        id="confirmpassword"
        placeholder="Confirm password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleSubmit} className="submit-button mt-5 w-3/12">
        Submit
      </button>
      </div>
    
    </div>
  );
};

export default ForgotPasswordPage;
