import User from "../../models/user";
import bcrypt from "bcryptjs";

export const register = async (req: any, res: any) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, username, email, password: hashedPassword });

    console.log("coucou")
    await newUser.save();

    //const transporter = createTransporter(email);
    //if (!transporter) {
    //  return res.status(400).json({ message: "Fournisseur email non supporté" });
    //}

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Bienvenue sur notre réseau social !",
      text: `Bonjour ${firstName},\n\nMerci de vous être inscrit sur notre plateforme !`,
    };

    //await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Utilisateur créé et email envoyé !" });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};