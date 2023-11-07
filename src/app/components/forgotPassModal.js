import React, { useState } from "react";
// import './Modal.css';

import toast, { Toaster } from "react-hot-toast";

const ForgotPassModal = ({ setShowForgotPassModal }) => {
  const [email, setEmail] = useState("");

  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const handleEmailChange = (event) => {
    setEmail(event.target.value.trim());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setDisableSubmitBtn(true);
      if (!email) {
        setDisableSubmitBtn(false);
        toast.error("pls provide email");
        return;
      }

      const res = await fetch("/api/forgotpasswordemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setDisableSubmitBtn(false);

      const resJson = await res.json();

      if (resJson.success) {
        toast.success(resJson.msg);
      } else {
        toast.error(resJson.msg);
      }

      console.log(resJson);
    } catch (error) {
      setDisableSubmitBtn(false);
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
        <p className="text-lg font-semibold text-center capitalize">Reset password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="mb-3"
          />
          <button disabled={disableSubmitBtn} className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassModal;
