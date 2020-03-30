// 모델

import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class User extends Model {
  // !는 반드시 존재
  // readonly 바뀔 일이 없는 것 (직접 바꿀 일이 없다라는 것)
  public readonly id!: number;
  public nickname!: string;
  public userId!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updateAt!: Date;
}

// init(data:{},options:{}
User.init(
  {
    nickname: {
      type: DataTypes.STRING(20)
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
    charset: "utf8",
    collate: "utf8"
  }
);

export const associate = (db: dbType) => {};
export default User;
