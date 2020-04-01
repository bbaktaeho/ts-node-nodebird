import * as passport from "passport";
import * as bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import { doesNotMatch } from "assert";
import User from "../models/user";

export default () => {
  passport.use(
    "local",
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
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
