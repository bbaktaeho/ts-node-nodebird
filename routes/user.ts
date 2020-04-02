import * as express from "express";
import { Request, Response, NextFunction } from "express";
const router = express.Router();
import User from "../models/user";
import * as bcrypt from "bcrypt";
import { isLoggedIn } from "./middleware";

router.get("/", isLoggedIn, (req, res) => {
  // 패스포트가 만들어준 녀석이 req.user
  // 기존 익스프레스를 확장 시켰음
  // 패스포트에서 Request 를 보면 user를 빈 객체로 해둠
  const user = req.user!.toJSON() as User;
  delete user.password;
  return res.json(user);
});
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exUser = await User.findOne({
      where: { userId: req.body.userId }
    });
    if (exUser) return res.status(403).send("이미 사용중인 아이디입니다.");
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword
    });
    return res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});
