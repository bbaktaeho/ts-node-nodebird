import * as express from "express"; // export default 가 있다면 as 빼고 적어야함
// tssconfig.json => esmoduleinterop true 라면 * as 를 안해도 됨
import { Application, Request, Response, NextFunction } from "express";
import * as morgan from "morgan";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import * as expressSession from "express-session";
import * as dotenv from "dotenv";
import * as passport from "passport";
import * as hpp from "hpp";
import * as helmet from "helmet";
import { sequelize } from "./models";
dotenv.config();

const app: Application = express();
const prod = process.env.NODE_ENV === "production";

app.set("port", prod ? process.env.PORT : 3065);

// force 가 true 이면 서버 재시작마다 테이블을 초기화시킴
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch((err: Error) => {
    console.log("db 연결 에러 : ", err);
  });

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(cors({ origin: "/nodebird.com$", credentials: true }));
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
}
app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: prod ? ".nodebird.com" : undefined
    },
    name: "rnbck"
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.send("test");
});

app.listen(app.get("port"), () => {
  console.log(`server is running on ${app.get("port")}`);
});
