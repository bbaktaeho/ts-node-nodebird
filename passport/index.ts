import * as passport from "passport";
import User from "../models/user";
import local from "./local";

export default () => {
  // 로그인 할 때만 실행
  // passport 에서 serializeUser 타입 추론을 못하니까 제네릭으로 했었음
  passport.serializeUser<User, number>((user, done) => {
    done(null, user.id);
  });

  // 모든 라우터에서 실행
  passport.deserializeUser<User, number>(async (id, done) => {
    try {
      // 메모리에 저장했던 아이디를 다시 사용자 객체로 바꿔놓는 함수
      const user = await User.findOne({
        where: { id },
      });
      return done(null, user); // req.user
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  local();
};
