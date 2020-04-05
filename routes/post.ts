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

export default router;
