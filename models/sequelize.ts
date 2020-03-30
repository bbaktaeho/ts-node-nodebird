/**
 * 기존 파일을 지우고 새로 만들어서 사용한다
 */

import { Sequelize } from "sequelize"; // class
import config from "../config/config";

const env =
  (process.env.NODE_ENV as "production" | "test" | "development") ||
  "development";

const { database, username, password } = config[env];

// db 연결을 위한 설정들
const sequelize = new Sequelize(database, username, password, config[env]);

export { sequelize };
export default sequelize;
