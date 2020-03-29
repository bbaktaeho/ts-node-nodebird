import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class User extends Model {
  public readonly id!: number;
  public nickname!: string;
  public userId!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updateAt!: Date;
}

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
