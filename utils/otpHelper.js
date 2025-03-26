import nodemailer from 'nodemailer';
import crypto from 'crypto';

// generating 6-digit random OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // SSL
    secure: true, // Required for SSL
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP for verification is: ${otp}. This OTP is valid for 10 minutes`,
  };

  await transporter.sendMail(mailOptions);
};

// export helper funcitons
export { generateOTP, sendOTP };
