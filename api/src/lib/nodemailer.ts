import nodemailer from "nodemailer";
import { SMTP_EMAIL, SMTP_PASSWORD } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.log(error);
  }
}

export default transporter;
