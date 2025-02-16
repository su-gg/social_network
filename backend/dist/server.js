"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const posts_1 = __importDefault(require("./routes/posts"));
const authMiddleware_1 = require("./middleware/authMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
console.log("✅ Route /api/auth chargée !");
app.use("/api/auth/posts", authMiddleware_1.authenticateToken, posts_1.default);
console.log("✅ Route /api/posts chargée !");
// Servir les fichiers du frontend en production
app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../frontend/build", "index.html"));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
const server = (0, http_1.createServer)(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
// io.on("connection", (socket) => {
//   console.log("✅ Un utilisateur s'est connecté via WebSocket");
//   socket.on("message", (data) => {
//     console.log("📩 Message reçu :", data);
//     io.emit("message", data);
//   });
//   socket.on("disconnect", () => {
//     console.log("❌ Un utilisateur s'est déconnecté");
//   });
// });
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ Erreur : MONGO_URI n'est pas défini dans le fichier .env");
    process.exit(1);
}
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connecté avec succès"))
    .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB :", err);
    process.exit(1);
});
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => console.log(`🚀 Serveur (HTTP + WebSocket) lancé sur http://localhost:${PORT}`));
