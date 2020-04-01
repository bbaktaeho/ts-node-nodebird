import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class Comment extends Model {}

Comment.init(
  {},
  {
    sequelize,
    modelName: "Comment",
    tableName: "Comment",
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci"
  }
);

export const associate = (db: dbType) => {};
export default Comment;
