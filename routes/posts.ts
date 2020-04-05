import * as express from "express";
import * as Sequelize from "sequelize";
import Post from "../models/post";
import User from "../models/user";
import Image from "../models/image";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
      };
    }
    const posts = await Post.findAll({
      where,
      include: [
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        { model: User, as: "Likers", attributes: ["id"] },
        {
          model: Post,
          as: "Retweet",
          include: [
            { model: User, attributes: ["id", "nickname"] },
            { model: Image },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(req.query.limit, 10),
    });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
