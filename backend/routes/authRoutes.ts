import express from "express";

import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

import User from "../models/user";
import * as authControllers from "../controllers/auth";

dotenv.config();
const router = express.Router();

const createTransporter = (email: string) => {
  let transporterConfig;

  if (email.endsWith("@hotmail.com") || email.endsWith("@outlook.com") || email.endsWith("@live.com") || email.endsWith("@hotmail.fr")) {
    transporterConfig = {
      host: process.env.EMAIL_HOST_HOTMAIL,
      port: Number(process.env.EMAIL_PORT_HOTMAIL),
      secure: process.env.EMAIL_SECURE_HOTMAIL === "false",
      auth: { user: process.env.EMAIL_USER_HOTMAIL, pass: process.env.EMAIL_PASS_HOTMAIL },
      tls: { ciphers: "SSLv3" },
    };
  } else if (email.endsWith("@gmail.com")) {
    transporterConfig = {
      service: process.env.EMAIL_SERVICE_GMAIL,
      auth: { user: process.env.EMAIL_USER_GMAIL, pass: process.env.EMAIL_PASS_GMAIL },
    };
  } else if (email.endsWith("@yahoo.com") || email.endsWith("@yahoo.fr")) {
    transporterConfig = {
      host: "smtp.mail.yahoo.com",
      port: 465,
      auth: { user: process.env.EMAIL_USER_YAHOO, pass: process.env.EMAIL_PASS_YAHOO },
    };
  } else if (email.endsWith("@zoho.com")) {
    transporterConfig = {
      host: "smtp.zoho.com",
      port: 465,
      auth: { user: process.env.EMAIL_USER_ZOHO, pass: process.env.EMAIL_PASS_ZOHO },
    };
  } else {
    return null;
  }

  return nodemailer.createTransport(transporterConfig);
};

router.post("/login", authControllers.login);
router.get("/refresh-token", authControllers.refreshToken);

// 📌 Route d'inscription avec envoi d'email de confirmation
router.post("/register", authControllers.register) 

// 📌 Route pour demander une réinitialisation de mot de passe
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    const transporter = createTransporter(email);
    if (!transporter) {
      return res.status(400).json({ message: "Fournisseur email non supporté" });
    }

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Réinitialisation de votre mot de passe",
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : http://localhost:3000/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "📩 Email de réinitialisation envoyé !" });
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation :", error);
    res.status(500).json({ message: "Erreur lors de la réinitialisation" });
  }
});

export default router;