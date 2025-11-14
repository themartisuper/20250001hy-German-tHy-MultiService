import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Bitte alle Felder ausfüllen" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Website Kontakt" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // сюда придёт письмо
      subject: "Neue Kontaktanfrage",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Gesendet!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Senden" });
  }
}
