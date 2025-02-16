import User from "../../models/user";
import FriendsRequest from "../../models/friendsRequest" 

export const respondToFriendRequest = async (req: any, res: any) => {
  const { requestId, action } = req.body;
  const userId = req.user._id;

  try {
    const friendRequest = await FriendsRequest.findById(requestId);

    if (!friendRequest || friendRequest.receiver.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Demande non trouvée." });
    }

    if (action === "accept") {
      const sender = await User.findById(friendRequest.sender);
      const receiver = await User.findById(friendRequest.receiver);

      if (!sender || !receiver) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      sender.friends.push(receiver._id);
      receiver.friends.push(sender._id);

      await sender.save();
      await receiver.save();

      friendRequest.status = "accepted";
      await friendRequest.save();

      return res.json({ message: "Ami ajouté avec succès." });
    } else if (action === "decline") {
      friendRequest.status = "declined";
      await friendRequest.save();
      return res.json({ message: "Invitation refusée." });
    } else {
      return res.status(400).json({ message: "Action invalide." });
    }
  } catch (error) {
    console.error("Erreur lors de la gestion de l'invitation :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};