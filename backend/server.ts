import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/posts";
import { authenticateToken } from "./middleware/authMiddleware";
import messageRoutes from "./routes/messages"
import path from "path";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const onlineUsers = new Map<string, string>(); 

// Sert le front en static
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
console.log("✅ Route /api/auth chargée !");
app.use("/api/auth/posts", authenticateToken, postRoutes);
console.log("✅ Route /api/posts chargée !");
app.use("/api/auth/friends", authenticateToken, authRoutes);
console.log("✅ Route /api/auth/friends chargée !");
app.use("/api/messages", messageRoutes);


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

  socket.on("userConnected", (userId) => {
    if (!userId) {
      console.warn("⚠️ Tentative de connexion avec un userId null !");
      return;
    }

    onlineUsers.set(userId, socket.id);
    console.log(`📌 Utilisateur en ligne : ${userId} | Socket ID: ${socket.id}`);
    console.log("👥 Utilisateurs en ligne :", [...onlineUsers.keys()]);


    const onlineFriends = Array.from(onlineUsers.values());
    io.emit("onlineFriends", onlineFriends);
  });

  socket.on("userDisconnected", (userId) => {
    onlineUsers.delete(userId);
    console.log(`❌ Utilisateur déconnecté : ${userId}`);
    io.emit("onlineUsers", [...onlineUsers.keys()]);
  });

  socket.on("disconnect", () => {
    const userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
    if (userId) {
      onlineUsers.delete(userId);
      console.log(`🔴 Utilisateur ${userId} déconnecté`);
      io.emit("onlineUsers", [...onlineUsers.keys()]);
    }
  });

  socket.on("message", (data) => {
    console.log("📩 Message reçu :", data);
    io.emit("message", data);
  });
});

const MONGO_URI = process.env.MONGO_PROD;
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
