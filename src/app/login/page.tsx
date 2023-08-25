"use client";

import React, { useState } from "react";
import "./Login.css"; // You can create a CSS file for styling
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/navigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import ForgotPassModal from "../components/forgotPassModal";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgotPassModal, setShowForgotPassModal] = useState(false);

  const [disSubmitBtn, setDisSubmitBtn] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (email && password) {
        setDisSubmitBtn(true);
        const response = await fetch("api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const resJson = await response.json();

        if (!resJson.success) {
          toast.error(resJson?.msg);
        } else {
          router.push("/");
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
    <div className="login-container">
      {showForgotPassModal && (
        <ForgotPassModal setShowForgotPassModal={setShowForgotPassModal} />
      )}
      <Toaster />
      <div className="login-box">
        <h2 className="text-center login-heading">TODO MANAGER</h2>
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





        <div
          onClick={() => {
            setShowForgotPassModal(true);
          }}
          className="fp-text text-black font-semibold text-sm text-end pb-2 cursor-pointer"
        >
          forgot password ?
        </div>
        <button
          className="login-button"
          disabled={disSubmitBtn}
          onClick={handleLogin}
        >
          Log In
        </button>
        <div className="text-sm text-center font-semibold py-2">
          Not a member ?{" "}
          <a className="text-amber-900" href="/signup">
            Register here
          </a>{" "}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
