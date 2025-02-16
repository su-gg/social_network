import { io } from "socket.io-client";

const socket = io("http://localhost:3010", {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Connecté au serveur WebSocket");

  const userId = localStorage.getItem("userId");;
  console.log("🔍 Utilisateur connecté :", userId);
  console.log(localStorage.getItem("userId"));

  if (userId) {
    socket.emit("userConnected", userId);
  }
});

socket.on("disconnect", () => {
  console.log("❌ Déconnecté du serveur WebSocket");
});

socket.on("message", (data) => {
  console.log("📩 Nouveau message reçu :", data);
});

export default socket;
