import User from "../../models/user";
import { Response } from "express";

// 커스텀하게 타이핑 해줌
// 글로벌을 어그먼테이션 할 때는 반드시 익스터널 모듈이거나 엠비언트 모듈이어야한다
// 즉 디클레어 글로벌을 쓰려면 아무거나 익스포트 또는 임포트 해야함
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
    payload: any;
  }
  interface Response {
    payload: any;
  }
}
