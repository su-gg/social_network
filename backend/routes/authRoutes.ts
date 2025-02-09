import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'inscription" });
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
