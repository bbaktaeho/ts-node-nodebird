import * as passport from "passport";
import User from "../models/user";
import local from "./local";

export default () => {
  // 시리얼 라이즈는 로그인할 때 한 번 실행되고
  // 디시리얼 라이즈는 모든 라우터, 모든 요청에 대해서 매번 실행됨
  // 제네릭 함수들 -> 타이핑 추론 안되니까 타피핑 해라
  passport.serializeUser<User, number>((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser<User, number>(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id }
      });
      if (!user) return done(new Error("no user"));
      return done(null, user); // req.user
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  local();
};
