import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from "../models/user";  
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_pour_signer_les_tokens';
const JWT_EXPIRES_IN = '1h'; 
const JWT_REFRESH_EXPIRES_IN = '7d'; 

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('Utilisateur non trouvé');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Mot de passe incorrect');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  res.json({ accessToken, user });
};

export const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).send('Refresh token manquant');
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).send('Refresh token invalide');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.json({ accessToken });
  });
};
