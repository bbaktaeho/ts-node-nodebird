import * as express from "express";
import * as bcrypt from "bcrypt";
import { isLoggedIn, isNotLoggedIn } from "./middleware";
import User from "../models/user";
import * as passport from "passport";
import Post from "../models/post";
const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  // req.user 가 있는지 없는지 모르겠다..!
  // 타입스크립트가 타입 추론은 해줄순 있지만 로직에 대한 이해는 못함
  // toJSON 은 리턴이 오브젝트이므로 우리가 강제로 형변환을 해야함 as <타입>
  const user = req.user!.toJSON() as User;
  delete user.password;
  return res.json(user);
});

// 회원가입
router.post("/", async (req, res, next) => {
  try {
    // 가입 되어 있는지 확인 (중복 체크)
    const exUser = await User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    // 가입이 안되어 있을 때
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    return res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate(
    "local",
    (err: Error, user: User, info: { message: string }) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.message);
      }
      return req.login(user, async (loginErr: Error) => {
        try {
          if (loginErr) {
            return next(loginErr);
          }
          const fullUser = await User.findOne({
            where: { id: user.id },
            include: [
              {
                // 유저가 쓴 게시글
                model: Post,
                as: "Posts",
                attributes: ["id"],
              },
              {
                // 유저가 팔로우하는 유저들
                model: User,
                as: "Followings",
                attributes: ["id"],
              },
              {
                // 유저를 팔로우하는 유저들
                model: User,
                as: "Followers",
                attributes: ["id"],
              },
            ],
            attributes: {
              // 비밀번호만 지우고 가져오라
              exclude: ["password"],
            },
          });
          return res.json(fullUser);
        } catch (err) {
          console.error(err);
          return next(err);
        }
      });
    }
  )(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session!.destroy((err) => {
    res.send("logout 성공");
  });
});
