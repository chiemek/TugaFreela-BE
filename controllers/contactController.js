const Contact = require("../models/contact");
const transporter = require("../configs/nodmailer");

exports.submitContactForm = async (req, res) => {
  // contact form logic...
  // Contact Us POST endpoint
  app.post("/ContactUs", async (req, res) => {
    const { name, email, number, message } = req.body;

    try {
      // Step 1: Save the contact information to the database
      const newContact = new Contact({
        name,
        email,
        number,
        message,
      });
      await newContact.save();

      // Step 2: Create a Nodemailer transporter
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Step 3: Set up email data
      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: "New Contact Form Submission",
        text: `Name: ${name}\nEmail: ${email}\nNumber: ${number}\nMessage: ${message}`,
      };

      // Step 4: Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Error sending email" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json({
            message: "Email sent successfully and contact saved to database",
          });
        }
      });
    } catch (error) {
      console.error("Error saving contact to the database:", error);
      return res.status(500).json({ error: "Error processing your request" });
    }
  });
};
