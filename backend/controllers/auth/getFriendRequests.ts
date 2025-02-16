import FriendsRequest from "../../models/friendsRequest" 

export const getFriendRequests = async (req: any, res: any) => {
  const userId = req.user._id;

  try {
    const requests = await FriendsRequest.find({ receiver: userId, status: "pending" })
      .populate("sender", "username firstName lastName");

    res.json(requests);
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};