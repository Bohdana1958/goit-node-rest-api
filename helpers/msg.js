import pug from "pug";
import sgMail from "@sendgrid/mail";
import { convert } from "html-to-text";
import path from "path";

export const msg = (name, verificationToken, email) => {
  const html = pug.renderFile(
    path.join(process.cwd(), "confirmEmail", "confirmEmail.pug"),
    {
      name,
      verificationToken,
    }
  );

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "catealea12@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: convert(html),
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};
