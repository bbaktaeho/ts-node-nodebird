import User, { associate as associateUser } from "./user";
export * from "./sequelize"; // 임포트 함과 동시에 수출

const db = {
  User,
};

export type dbType = typeof db;

associateUser(db);
