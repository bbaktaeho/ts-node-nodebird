declare module "passport-local" {
  import { Strategy as PassportStrategy } from "passport";

  export interface IVerifyOptions {}

  export interface IStrategyOptions {
    usernameField: string;
    passwordField: string;
  }
  export interface Done {
    // 앞에가 물음표이면 뒤에도 물음표를 붙여야함
    (err: Error | null, user?: any, options?: IVerifyOptions): void;
  }
  export interface VerifyFunction {
    (username: string, password: string, done: Done): void | Promise<any>;
  }
  export class Strategy extends PassportStrategy {
    constructor(options: IStrategyOptions, verify: VerifyFunction);
  }
}
