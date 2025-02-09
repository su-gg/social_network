import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";


import User from "../models/user";
import { login, refreshToken } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.get('/refresh-token', refreshToken);

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, email, password: hashedPassword });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: "tonemail@gmail.com", pass: "motdepasse" },
    });

    const mailOptions = {
      to: email,
      from: "tonemail@gmail.com",
      subject: "Bienvenue sur notre réseau social !",
      text: `Bonjour ${name},

Merci de vous être inscrit sur notre plateforme !`
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Utilisateur créé et email envoyé !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

 
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: "tonemail@gmail.com", pass: "motdepasse" },
    });

    const mailOptions = {
      to: user.email,
      from: "tonemail@gmail.com",
      subject: "Réinitialisation de votre mot de passe",
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : http://localhost:3000/reset-password/${resetToken}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email de réinitialisation envoyé !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la réinitialisation" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id, name: user.name, username: user.username, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

export default router;
