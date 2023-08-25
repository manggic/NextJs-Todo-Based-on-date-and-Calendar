import nodemailer from "nodemailer";

import bcryptjs from "bcryptjs";

import User from "@/models/UserModel";
import { connect } from "@/db/config";

connect();

const {
  MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD,
  MAILTRAP_PORT,
  MAILTRAP_HOST,
  HOST,
  PORT_NO,
  USER_EMAIL,
  USER_PASS,
  DOMAIN,
} = process.env;

type inputParams = {
  email: string;
  emailType: string;
  userId: string;
};

export const sendEmail = async ({ email, emailType, userId }: inputParams) => {
  try {
    const hashedToken = await bcryptjs.hash(email, 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findOneAndUpdate(
        { email },
        {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        }
      );
    }

    const transport = nodemailer.createTransport({
      host: HOST as string,
      port: parseInt(PORT_NO as string),
      secure: true,
      auth: {
        user: USER_EMAIL as string,
        pass: USER_PASS as string,
      },
    });

    const mailOptions = {
      from: "mangh1998@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      text: "",
      html: `<p>click<a href="${DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "forgotpassword"
      }?token=${hashedToken}"> here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }</p>`,
    };

    transport.sendMail(mailOptions, async (error: any, info: any) => {
      if (error) {
        console.error("Email sending error:", error);
        return { success: false, msg: "Sent Email failed" };
      } else {
        console.log("Email sent:", info.response);
        return {
          success: true,
          msg: "successfully sent email",
          data: info.response,
        };
      }
    });

    return { success: true, msg: "successfully sent email" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
