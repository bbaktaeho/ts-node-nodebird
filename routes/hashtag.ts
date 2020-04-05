import * as express from "express";
import * as Sequelize from "sequelize";
import Post from "../models/post";
import Hashtag from "../models/hashtag";
import User from "../models/user";
import Image from "../models/image";

const router = express.Router();

router.get("/:tag", async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: { [Sequelize.Op.lt]: parseInt(req.query.lastId, 10) },
      };
    }
    const posts = await Post.findAll({
      where,
      include: [
        //
        { model: Hashtag, where: { name: decodeURIComponent(req.params.tag) } },

        // 개시글 작성자, 비밀번호 가져오지 않도록 조심!
        { model: User, attributes: ["id", "nickname"] },

        // 개시글에 이미지도 있을 수 있으니 가져옴
        { model: Image },

        // 개시글의 좋아요 누른 것 가져오기 (좋아요 수와 아이디 필요)
        { model: User, as: "Likers", attributes: ["id"] },

        // 내 개시글이 리트윗 된건가? 리트윗 했다면 누가 했는가? 이미지도 있으니 가져옴
        {
          model: Post,
          as: "Retweet",
          include: [
            { model: User, attributes: ["id", "nickname"] },
            { model: Image },
          ],
        },
      ],
      // 정렬
      order: [["createdAt", "DESC"]],
      limit: parseInt(req.query.limit, 10),
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
