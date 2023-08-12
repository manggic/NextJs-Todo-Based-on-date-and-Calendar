"use client";

import React, { useState } from "react";
import "./Login.css"; // You can create a CSS file for styling
import toast, { Toaster } from "react-hot-toast";

import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (email && password) {
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
      } else {
        toast.error("Please enter all the details");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="login-container">
      <Toaster />
      <div className="login-box">
        <h2 className="text-center">Login</h2>
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
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-xs text-center font-semibold pb-2">
          Not a member ?{" "}
          <a className="text-amber-900" href="/signup">
            Register here
          </a>{" "}
        </div>
        <button className="login-button" onClick={handleLogin}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
