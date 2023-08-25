"use client";

import React, { useState } from "react";
import "./SignUp.css"; // You can create a CSS file for styling
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disSubmitBtn, setDisSubmitBtn] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      // Add your sign-up logic here

      if (email && name && password) {
        setDisSubmitBtn(true);

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
        setDisSubmitBtn(false);
      } else {
        toast.error("Please enter all the details");
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="signup-container">
      <Toaster />
      <div className="signup-box">
        <h2 className="text-center signup-heading">TODO MANAGER</h2>
        <div className="input-group">
          <label htmlFor="email">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
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
        <div className="text-sm text-center font-semibold py-2">
          Already registered ?{" "}
          <a className="text-amber-900" href="/login">
            Login here
          </a>{" "}
        </div>

        <button
          className="signup-button"
          onClick={handleSignUp}
          disabled={disSubmitBtn}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
