import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
