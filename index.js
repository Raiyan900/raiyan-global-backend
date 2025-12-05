import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

app.post("/api/contact", async (req, res) => {
  const { name, businessName, email, contact, productInterest, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Inquiry from ${name}`,
      html: `
         <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">🌿 Fruits and Vegetable Inquiry</h2>
          <p>Dear Team,</p>
          <p>You have received a new inquiry from your website. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Business Name:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${businessName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Contact No:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${contact}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Product Interest:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${productInterest || 'Not Provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${message ? message.replace(/\n/g, '<br>') : 'Not Provided'}</td>
            </tr>
          </table>
          
          <p>We appreciate your interest in our fresh fruits and vegetables. Please respond promptly to provide further details or discuss the inquiry.</p>
          
          <p style="text-align: center; color: #4CAF50;"><strong>🍏 Raiyan Global - Fresh & Organic Produce</strong></p>
          
          <hr>
          <p style="font-size: 12px; text-align: center; color: gray;">
            This message was sent via the contact form on our website. Please do not reply directly to this email.
          </p>
        </div>
      `
    });

    res.json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
