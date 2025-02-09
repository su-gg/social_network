import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_pour_signer_les_tokens';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extraire le token des en-têtes Authorization

  if (!token) {
    return res.status(403).send('Token manquant');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send('Token invalide');
    }
    req.user = decoded; 
  });
};
