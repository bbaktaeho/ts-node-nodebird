import * as express from "express";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import { isLoggedIn } from "./middleware";
import * as AWS from "aws-sdk";
import Hashtag from "../models/hashtag";
import * as path from "path";
import Post from "../models/post";
import Image from "../models/image";
import * as BlueBird from "bluebird";
import User from "../models/user";
import Comment from "../models/comment";

const router = express.Router();

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "react-nodebird",
    key(req, file, cb) {
      cb(null), `orginal/${+new Date()}${path.basename(file.originalname)}`;
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// 개시글 작성
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    // 해시태그 정규 표현식
    const hashtags: string[] = req.body.content.match(/#[^\s]+/g);
    const newPost = await Post.create({
      content: req.body.content,
      UserId: req.user!.id,
    });
    if (hashtags) {
      const promises = hashtags.map((tag) =>
        Hashtag.findOrCreate({
          where: { name: tag.slice(1).toLowerCase() },
        })
      );
      const result = await Promise.all(promises);
      await newPost.addHashtags(result.map((r) => r[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const promises: BlueBird<
          Image
        >[] = req.body.image.map((image: string) =>
          Image.create({ src: image })
        );
        const images = await Promise.all(promises);
        await newPost.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: newPost.id },
      include: [
        {
          model: User,
          attributes: ["id", "nicknmae"],
        },
        { model: Image },
        { model: User, as: "Likers", attributes: ["id"] },
      ],
    });
    return res.json(fullPost);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/images", upload.array("image"), (req, res, next) => {
  console.log(req.files);
  // req.files 이 객체 또는 배열임.
  // multerS3 에 로케이션이 들어있음
  res.json((req.files as Express.MulterS3.File[]).map((v) => v.location));
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: [
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        { model: User, as: "Likers", attributes: ["id"] },
      ],
    });
    return res.json(post);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await Post.destroy({ where: { id: req.params.id } });
    return res.send(req.params.id);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/:id/comments", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
    });
    const comments = await Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    return res.json(comments);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    const newComment = await Comment.create({
      PostId: post.id,
      UserId: req.params.id,
      content: req.body.content,
    });
    const comment = await Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    return res.json(comment);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await post.addLiker(req.user!.id);
    return res.json({ userId: req.user!.id });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.delete("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await post.removeLiker(req.user!.id);
    return res.json({ userId: req.user!.id });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/:id/retweet", isLoggedIn, async (req, res, next) => {});

export default router;
