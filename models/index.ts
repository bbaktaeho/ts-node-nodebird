import User, { associate as associateUser } from "./user";
import Image, { associate as associateImage } from "./image";
import Hashtag, { associate as associateHashtag } from "./hashtag";
import Post, { associate as associatePost } from "./post";
import Comment, { associate as asoociateComment } from "./comment";
export * from "./sequelize"; // 임포트 함과 동시에 익스포트

const db = {
  User,
  Comment,
  Hashtag,
  Image,
  Post
};

export type dbType = typeof db;

associateUser(db);
associateHashtag(db);
associateImage(db);
asoociateComment(db);
associatePost(db);
