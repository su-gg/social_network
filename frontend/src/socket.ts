import { io } from "socket.io-client";

const API_URL = "https://prod-beyondwords-04dd84f0b17e.herokuapp.com/api/auth";

const socket = io(API_URL, {
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
