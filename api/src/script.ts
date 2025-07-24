import { sendMail } from "./lib/nodemailer";

sendMail({
  to: "godswillogbodu30@gmail.com",
  subject: "Hello",
  html: "<h1>Hello</h1>",
  text: "Hello",
});

console.log("Hello");
