import nodemailer from "nodemailer"

export const sendEmail = async (to: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.PORT!),
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS
    }
  });

  const mailOptions = {
    from: 'luca.pettenella@itcubeconsulting.it',
    to,
    subject: 'Test Email',
    text,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}