import {
  Model,
  DataTypes,
  BelongsToManyAddAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
} from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";
import Hashtag from "./hashtag";
import Image from "./image";
import User from "./user";

// ! 는 항상 있다라는 말
class Post extends Model {
  public readonly id!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public UserId!: number;
  public readonly Retweet?: Post;
  public RetweetId?: number;

  public addHashtags!: BelongsToManyAddAssociationsMixin<Hashtag, number>;
  public addImages!: HasManyAddAssociationsMixin<Image, number>;
  public addImage!: HasManyAddAssociationMixin<Image, number>;
  public addLiker!: BelongsToManyAddAssociationMixin<User, number>;
  public removeLiker!: BelongsToManyRemoveAssociationMixin<User, number>;
}

Post.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "post",
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.Post.belongsTo(db.User); // 개시글 작성한 사람이 있을 것이고
  db.Post.hasMany(db.Comment); // 개시글은 댓글 여러 개 가지고 있을 것이고
  db.Post.hasMany(db.Image); // 개시글은 이미지를 여러 개 가지고 있을 것이고
  db.Post.belongsTo(db.Post, { as: "Retweet" }); // 개시글은 리트윗 될 수 있을 것이고
  db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // 해시태그와의 관계
  db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // 사용자와 다대다(좋아요, 내가 좋아요한 게시글) 관계
};
export default Post;
