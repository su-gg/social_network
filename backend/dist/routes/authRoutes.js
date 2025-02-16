"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
const authControllers = __importStar(require("../controllers/auth"));
const authMiddleware_1 = require("../middleware/authMiddleware"); // Assurez-vous que le middleware est importé
dotenv_1.default.config();
const router = express_1.default.Router();
const createTransporter = (email) => {
    let transporterConfig;
    if (email.endsWith("@hotmail.com") || email.endsWith("@outlook.com") || email.endsWith("@live.com") || email.endsWith("@hotmail.fr")) {
        transporterConfig = {
            host: process.env.EMAIL_HOST_HOTMAIL,
            port: Number(process.env.EMAIL_PORT_HOTMAIL),
            secure: process.env.EMAIL_SECURE_HOTMAIL === "false",
            auth: { user: process.env.EMAIL_USER_HOTMAIL, pass: process.env.EMAIL_PASS_HOTMAIL },
            tls: { rejectUnauthorized: false },
        };
    }
    else if (email.endsWith("@gmail.com")) {
        transporterConfig = {
            service: process.env.EMAIL_SERVICE_GMAIL,
            auth: { user: process.env.EMAIL_USER_GMAIL, pass: process.env.EMAIL_PASS_GMAIL },
        };
    }
    else if (email.endsWith("@yahoo.com") || email.endsWith("@yahoo.fr")) {
        transporterConfig = {
            host: "smtp.mail.yahoo.com",
            port: 465,
            auth: { user: process.env.EMAIL_USER_YAHOO, pass: process.env.EMAIL_PASS_YAHOO },
        };
    }
    else if (email.endsWith("@zoho.com")) {
        transporterConfig = {
            host: "smtp.zoho.com",
            port: 465,
            auth: { user: process.env.EMAIL_USER_ZOHO, pass: process.env.EMAIL_PASS_ZOHO },
        };
    }
    else {
        return null;
    }
    return nodemailer_1.default.createTransport(transporterConfig);
};
router.post("/login", authControllers.login);
router.get("/refresh-token", authControllers.refreshToken);
router.post("/register", authControllers.register);
router.post("/updateProfile", authMiddleware_1.authenticateToken, authControllers.updateProfile);
router.post("/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        yield user.save();
        const transporter = createTransporter(email);
        if (!transporter) {
            return res.status(400).json({ message: "Fournisseur email non supporté" });
        }
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Réinitialisation de votre mot de passe",
            text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : http://localhost:3000/reset-password/${resetToken}`,
        };
        yield transporter.sendMail(mailOptions);
        res.json({ message: "📩 Email de réinitialisation envoyé !" });
    }
    catch (error) {
        console.error("❌ Erreur lors de la réinitialisation :", error);
        res.status(500).json({ message: "Erreur lors de la réinitialisation" });
    }
}));
router.get("/me", authMiddleware_1.authenticateToken, (req, res) => {
    const user = req.user;
    console.log(req.user);
    if (!user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        birthDate: user.birthDate ? user.birthDate.toISOString() : null,
        gender: user.gender,
        displayNameType: user.displayNameType,
        isProfilePublic: user.isProfilePublic,
    });
});
exports.default = router;
