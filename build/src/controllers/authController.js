"use strict";
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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const config_1 = __importDefault(require("../config"));
const userModel_1 = require("../models/userModel");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, branch } = req.body;
    // console.log('req.body', req.body);
    const existing = yield userModel_1.UserModel.findOne({ email });
    if (existing) {
        return res.status(400).json({ message: "Email already registered" });
    }
    const encryptedPassword = crypto_js_1.default.AES.encrypt(password, config_1.default.secretKey).toString();
    const user = yield userModel_1.UserModel.create({
        name,
        email,
        password: encryptedPassword,
        role,
        branch,
    });
    res.status(201).json(user);
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.UserModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    // Decrypt stored password
    const bytes = crypto_js_1.default.AES.decrypt(user.password, config_1.default.secretKey);
    const originalPassword = bytes.toString(crypto_js_1.default.enc.Utf8);
    if (originalPassword !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id.toString(), role: user.role }, config_1.default.jwtSecret, { expiresIn: config_1.default.jwtExpiresIn });
    res.json({ message: "Login successful",
        token,
    });
});
exports.login = login;
