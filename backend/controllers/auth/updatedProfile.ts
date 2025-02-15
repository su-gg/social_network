
import User from "../../models/user";

export const updateProfile = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;  
    if (!userId) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const { firstName, lastName, username, birthDate, gender, displayNameType, isProfilePublic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, username, birthDate, gender, displayNameType, isProfilePublic },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
  }
};