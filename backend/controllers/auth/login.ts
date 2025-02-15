import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User, { IUser } from "../../models/user";
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_pour_signer_les_tokens';
const JWT_EXPIRES_IN = '1h'; 
const JWT_REFRESH_EXPIRES_IN = '7d'; 

export const generateTokens = (user: IUser) => {
  const token = jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      email: user.email 
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user._id }, 
    JWT_SECRET, 
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { token, refreshToken };
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email }) as IUser | null;
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const { token, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.json({ token, user: { id: user._id.toString(), username: user.username, email: user.email } });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


