import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Bitte alle Felder ausfüllen" });
  }

  // Настроим SMTP через Nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",       // твой SMTP сервер
    port: 587,                      // 587 или 465
    secure: false,                  // true для 465
    auth: {
      user: process.env.SMTP_USER,  // положи сюда email в ENV
      pass: process.env.SMTP_PASS,  // пароль или App Password
    },
  });

  try {
    await transporter.sendMail({
      from: `"Website Kontakt" <${process.env.SMTP_USER}>`,
      to: "nuraldin.almiarravi@gmail.com",
      subject: "Neue Kontaktanfrage",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    res.status(200).json({ message: "Gesendet!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Senden" });
  }
}
