import * as express from "express"; // export default 가 있다면 as 빼고 적어야함
// tssconfig.json => esmoduleinterop true 라면 * as 를 안해도 됨
import { Application, Request, Response, NextFunction } from "express";

const app = express();
const prod = process.env.NODE_ENV === "production";

app.get("/", (req: Request, res: Response) => {
  res.send("test");
});

app.listen(prod ? process.env.PORT : 3065, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
