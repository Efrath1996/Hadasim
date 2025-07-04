import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
console.log(process.env.EMAIL_USER)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: `"Grocery Orders" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}
