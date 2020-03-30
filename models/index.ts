import User, { associate as associateUser } from "./user";
export * from "./sequelize"; // 임포트 함과 동시에 익스포트

const db = {
  User
};

export type dbType = typeof db;
