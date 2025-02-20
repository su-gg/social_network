import express from "express";
import Message from "../models/messages";

const router = express.Router();

router.get("/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des messages" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    if (!sender || !receiver || !text) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    const message = new Message({ sender, receiver, text });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});

export default router;
