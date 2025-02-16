import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user'; 

const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_pour_signer_les_tokens';

interface JwtPayload {
  id: string;
}

declare module "express" {
  export interface Request {
    user?: JwtPayload;  
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  console.log("Token reçu:", token);
  
  if (!token) {
    return res.status(403).send('Token manquant');
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).send('Token invalide');
    }

    try {
      const user = await User.findById((decoded as JwtPayload).id);
      
      if (!user) {
        return res.status(404).send('Utilisateur non trouvé');
      }

      req.user = {
        id: user._id.toString(),  
        ...user.toObject(),  
      };      
      next();
    } catch (dbError) {
      console.error('Erreur de récupération de l\'utilisateur :', dbError);
      return res.status(500).send('Erreur interne du serveur');
    }
  });
};
