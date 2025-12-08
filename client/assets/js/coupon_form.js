import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message } = req.body;

  // Настроим SMTP через Nodemailer
  let transporter = nodemailer.createTransport({
    host: "smtp.example.com", // твой SMTP
    port: 587,
    auth: {
      user: "your@email.com",
      pass: "password",
    },
  });

  try {
    await transporter.sendMail({
      from: `"Website Kontakt" <your@email.com>`,
      to: "твоя@почта.com",
      subject: "Neue Kontaktanfrage",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    res.status(200).json({ message: "✅ Gesendet!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Fehler beim Senden" });
  }
}
