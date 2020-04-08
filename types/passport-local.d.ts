declare module "passport-local" {
  import { Strategy as PassportStrategy } from "passport";
  import { Request } from "express";

  export interface IVerifyOptions {}

  export interface IStrategyOptions {
    usernameField: string;
    passwordField: string;
    session?: boolean;
    passReqToCallback?: false;
  }

  export interface IStrategyOptionsWithRequest {
    usernameField: string;
    passwordField: string;
    session?: boolean;
    passReqToCallback: true; // 트루일 때 콜백함수의 매개변수로 리퀘스트가 존재
  }

  export interface Done {
    // 앞에가 물음표이면 뒤에도 물음표를 붙여야함
    (err: Error | null, user?: any, options?: IVerifyOptions): void;
  }
  export interface VerifyFunction {
    (username: string, password: string, done: Done): void | Promise<any>;
  }
  export interface VerifyFunctionWithRequest {
    (
      req: Request,
      username: string,
      password: string,
      done: Done
    ): void | Promise<any>;
  }

  export class Strategy extends PassportStrategy {
    // 오버로딩
    constructor(options: IStrategyOptions, verify: VerifyFunction);
    constructor(
      options: IStrategyOptionsWithRequest,
      verify: VerifyFunctionWithRequest
    );
  }
}
