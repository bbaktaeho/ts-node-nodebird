import * as express from "express";
import { Request, Response, NextFunction, Application } from "express";
import * as morgan from "morgan";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import * as expressSession from "express-session";
import * as dotenv from "dotenv";
import * as passport from "passport";
import * as hpp from "hpp";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";

import { sequelize } from "./models";

dotenv.config();

const app: Application = express();

const prod: boolean = process.env.NODE_ENV === "production";

app.set("port", prod ? process.env.PORßT : 3065);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db connected!");
  })
  .catch((err: Error) => {
    console.error(err);
  });

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  // app.use(cors({

  // }))
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}
app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false, // https -> true
      domain: prod ? ".nodebird.com" : undefined,
    },
    name: "rnbck",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.send("정상 동작");
});

app.listen(app.get("port"), () => {
  console.log(`server is running on ${app.get("port")}`);
});
