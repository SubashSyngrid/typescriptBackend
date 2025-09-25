import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

router.get('/', function(req, res, next) {
    console.log("hello world");
    
  res.send('respond with a resource');
});

router.post("/register", register);
router.post("/login", login);

export default router;