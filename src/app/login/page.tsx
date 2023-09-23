"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/navigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import ForgotPassModal from "../components/forgotPassModal";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgotPassModal, setShowForgotPassModal] = useState(false);

  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (email && password) {
        setDisableSubmitBtn(true);
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, rememberMe }),
        });

        const resJson = await response.json();

        if (!resJson.success) {
          toast.error(resJson?.msg);
        } else {
          router.push("/");
        }
        setDisableSubmitBtn(false);
      } else {
        toast.error("Please enter all the details");
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="form-container">
      {showForgotPassModal && (
        <ForgotPassModal setShowForgotPassModal={setShowForgotPassModal} />
      )}
      <Toaster />
      <div className="form-box">
        <h2 className="form-heading">LOGIN</h2>
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

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            {" "}
            <input
              type="checkbox"
              id="remember_me"
              name="remember_me"
              // value="Bike"
              className="w-3 mr-1"
              checked={rememberMe}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="remember_me" className="text-sm text-[#3c384dc4]">
              Remember me
            </label>{" "}
          </div>

          <div
            onClick={() => {
              setShowForgotPassModal(true);
            }}
            className="text-[#3c384dc4] text-sm text-end cursor-pointer"
          >
            forgot password ?
          </div>
        </div>

        <button
          className="submit-button"
          disabled={disableSubmitBtn}
          onClick={handleLogin}
        >
         SUBMIT
        </button>
        <div className="text-sm text-center font-semibold pt-4">
          Not a member ?{" "}
          <a className="text-[#1d7f7f]" href="/signup">
            Register here
          </a>{" "}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
