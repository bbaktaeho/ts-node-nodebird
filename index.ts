import * as expres from "express";
const app = express();

const prod = process.env.NODE_ENV === "production";

app.get("/", (req, res) => {
  res.send("정상 동작");
});

app.listen(prod ? process.env.PORT : 3065, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
