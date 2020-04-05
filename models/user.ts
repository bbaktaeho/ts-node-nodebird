import {
  Model,
  DataTypes,
  BelongsToMany,
  BelongsToManyGetAssociationsMixin,
  HasManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
} from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";
import Post from "./post";

class User extends Model {
  public readonly id!: number;
  public nickname!: string;
  public userId!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Posts?: Post[];
  public readonly Followings?: User[];
  public readonly Followers?: User[];

  public addFollowing!: BelongsToManyAddAssociationMixin<User, number>;
  public getFollowings!: BelongsToManyGetAssociationsMixin<User>;
  public getFollowers!: BelongsToManyGetAssociationsMixin<User>;
  public getPosts!: HasManyGetAssociationsMixin<Post>;
  // public getFollowing!:
  // public addFollowings!:
  // public setFollowings!:
  public removeFollowing!: BelongsToManyRemoveAssociationMixin<User, number>;
  public removeFollower!: BelongsToManyRemoveAssociationMixin<User, number>;
}

User.init(
  {
    nickname: {
      type: DataTypes.STRING(20),
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize, // 실제 디비랑 연결하려면 해야함
    modelName: "User",
    tableName: "user",
    charset: "utf8",
    collate: "utf8_general_ci", // 한글저장
  }
);

export const associate = (db: dbType) => {
  db.User.hasMany(db.Post, { as: "Posts" });
  db.User.belongsToMany(db.User, {
    // as 가 가리키는 것과 foreingkey 는 서로 반대되는 관계
    through: "Follow",
    as: "Followers",
    foreignKey: "followingId",
  });
  db.User.belongsToMany(db.User, {
    through: "Follow",
    as: "Followings",
    foreignKey: "followerId",
  });
};
export default User;
