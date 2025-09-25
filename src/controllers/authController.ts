import { Request, Response } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import config from "../config";
import { UserModel } from "../models/userModel";



export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, branch } = req.body;
  // console.log('req.body', req.body);
  const existing = await UserModel.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

 
  const encryptedPassword = CryptoJS.AES.encrypt(password, config.secretKey).toString();

  const user = await UserModel.create({
    name,
    email,
    password: encryptedPassword,
    role,
    branch,
  });

  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Decrypt stored password
  const bytes = CryptoJS.AES.decrypt(user.password, config.secretKey);
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

  if (originalPassword !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

const token = jwt.sign(
  { id: user.id.toString(), role: user.role } as JwtPayload,
  config.jwtSecret,
  { expiresIn: config.jwtExpiresIn } as SignOptions
);

  res.json({message: "Login successful",
    token,
    
  });
};
