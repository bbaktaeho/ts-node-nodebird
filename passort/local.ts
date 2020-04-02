import * as passport from "passport";
import * as bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import { doesNotMatch } from "assert";
import User from "../models/user";

export default () => {
  passport.use(
    "local",
    // strategy 에서 타이핑이 선언되어 있음
    new Strategy(
      {
        usernameField: "userId",
        passwordField: "password"
      },
      async (userId: string, password: string, done) => {
        try {
          const user = await User.findOne({ where: { userId } });
          if (!user) {
            // done 의 options 자리는 암거나 들어가지면 message 는 꼭 string으로 써줘야함
            return done(null, false, { message: "존재하지 않는 사용자" });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) return done(null, user);
          return done(null, false, { message: "비밀번호 틀림" });
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
