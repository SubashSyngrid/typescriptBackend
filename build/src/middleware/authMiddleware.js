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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const userModel_1 = require("../models/userModel");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers.authorization;
    if (!(header === null || header === void 0 ? void 0 : header.startsWith('Bearer ')))
        return res.status(401).json({ message: 'Unauthorized' });
    const token = header.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        const user = yield userModel_1.UserModel.findById(payload.id).select('-password');
        if (!user)
            return res.status(401).json({ message: 'User not found' });
        req.user = { _id: user.id, role: user.role, email: user.email, name: user.name };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token', error: err });
    }
});
exports.authenticate = authenticate;
