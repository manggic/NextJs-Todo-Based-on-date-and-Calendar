"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

  const handleSubmit = async () => {
    try {
      if (password && confirmpassword) {
        if (password === confirmpassword) {
          setDisableSubmitBtn(true)
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
            router.push("/login");
          } else {
            setDisableSubmitBtn(false)
            toast.error("Something went wrong");
          }
        } else {
          toast.error("Both password does not match");
        }
      } else {
        toast.error("Pls enter complete details");
      }
    } catch (error: any) {
      setDisableSubmitBtn(false)
      console.log("ERROR", error);
    }
  };

  return (
    <div className="form-container">
      <Toaster />

      <div className="form-box">
        <h2 className="form-heading">Forgot Password</h2>

        <input
          className="text-black outline-[#2f363b] mb-3"
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

        <button  disabled={disableSubmitBtn} onClick={handleSubmit} className="submit-button mt-3 w-3/12">
          Submit
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
