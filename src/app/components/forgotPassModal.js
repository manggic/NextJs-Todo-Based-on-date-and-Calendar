import React, { useState } from "react";
// import './Modal.css';

import toast, { Toaster } from "react-hot-toast";

const ForgotPassModal = ({ setShowForgotPassModal }) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // toast.success("check your email");

    try {
      const res = await fetch("/api/forgotpasswordemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const resJson = await res.json();

      if (resJson.success) {
        toast.success(resJson.msg);
      } else {
        toast.error(resJson.msg);
      }

      console.log(resJson);
    } catch (error) {
      console.log("ERROR on email submit");
    }
    // Perform your email validation or submission logic here
    // You can also close the modal here if needed
  };

  return (
    <div className="modal-overlay">
      <Toaster />

      <div className="modal-content">
        <span
          className="close-button"
          onClick={() => setShowForgotPassModal(false)}
        >
          &times;
        </span>
        <p className="text-sm">Enter your email to reset your password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      <style jsx global>
        {`
          .submit-btn {
            display: block;
            width: 100%;
            background-color: steelblue;
            color: #fff;
            border: none;
            padding: 10px;
            border-radius: 3px;
            cursor: pointer;
          }

          .submit-btn:hover {
            background-color: #575b5f;
          }
        `}
      </style>
    </div>
  );
};

export default ForgotPassModal;
