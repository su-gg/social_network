import User from "../../models/user";
import FriendsRequest from "../../models/friendsRequest" 

export const sendFriendRequest = async (req: any, res: any) => {
  const { friendUsername } = req.body;
  const senderId = req.user._id;

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ username: friendUsername });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (senderId.equals(receiver._id)) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous envoyer une invitation." });
    }

    const existingRequest = await FriendsRequest.findOne({
      sender: senderId,
      receiver: receiver._id,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Une demande est déjà en attente." });
    }

    const friendRequest = new FriendsRequest({
      sender: senderId,
      receiver: receiver._id,
      status: "pending",
    });

    await friendRequest.save();
    res.json({ message: "Invitation envoyée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'invitation :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};