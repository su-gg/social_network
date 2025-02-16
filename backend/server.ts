import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/posts";
import { authenticateToken } from "./middleware/authMiddleware";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
console.log("✅ Route /api/auth chargée !");
app.use("/api/auth/posts", authenticateToken, postRoutes);
console.log("✅ Route /api/posts chargée !");
app.use("/api/auth/friends", authenticateToken, authRoutes);
console.log("✅ Route /api/auth/friends chargée !");

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Un utilisateur s'est connecté via WebSocket :", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`📌 L'utilisateur ${userId} a rejoint sa room personnelle`);
  });

  socket.on("message", (data) => {
    console.log("📩 Message reçu :", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Un utilisateur s'est déconnecté");
  });
});

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Erreur : MONGO_URI n'est pas défini dans le fichier .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté avec succès"))
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB :", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3010;
server.listen(PORT, () =>
  console.log(`🚀 Serveur (HTTP + WebSocket) lancé sur http://localhost:${PORT}`)
);

export { io };
