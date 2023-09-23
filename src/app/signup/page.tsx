"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      // Add your sign-up logic here

      if (email && name && password) {
        setDisableSubmitBtn(true);

        const response = await fetch("api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const resJson = await response.json();

        if (!resJson.success) {
          toast.error(resJson?.msg);
        } else {
          toast.success("check your email for verification");

          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
        setDisableSubmitBtn(false);
      } else {
        toast.error("Please enter all the details");
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="form-container">
      <Toaster />
      <div className="form-box shadow-lg drop-shadow-3xl">
        <h2 className="form-heading">SIGN UP</h2>
        <div className="form-input-group">
          <label htmlFor="email">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-input-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password ? (
            <div
              className="password-eye"
              onClick={() => {
                setShowPass(!showPass);
              }}
            >
              {" "}
              {showPass ? <AiFillEye /> : <AiFillEyeInvisible />}{" "}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="text-sm text-center font-semibold pb-3 pt-1">
          Already registered ?{" "}
          <a className="text-[#1d7f7f]" href="/login">
            Login here
          </a>{" "}
        </div>

        <button
          className="submit-button"
          onClick={handleSignUp}
          disabled={disableSubmitBtn}
        >
         SUBMIT
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
