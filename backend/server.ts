import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Un utilisateur s'est connecté via WebSocket");

  socket.on("message", (data) => {
    console.log("📩 Message reçu :", data);
    io.emit("message", data); 
  });

  socket.on("disconnect", () => {
    console.log("❌ Un utilisateur s'est déconnecté");
  });
});

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
server.listen(PORT, () => console.log(`🚀 Serveur (HTTP + WebSocket) lancé sur le port ${PORT}`));
