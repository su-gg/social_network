import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Erreur: MONGO_URI n'est pas défini dans le fichier .env");
  process.exit(1); 
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté avec succès"))
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB :", err);
    process.exit(1); 
  });


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
