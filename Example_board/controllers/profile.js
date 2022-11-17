const { Board, User, Comment } = require("../models");
const controllerError = require("../error/controllerError");
const { sequelize } = require("../models");

exports.getUser = async (id) => {
  try {
    const user = await User.findOne({
      attributes: [
        "id",
        "nick",
        [
          sequelize.fn(
            "DATE_FORMAT",
            sequelize.col("User.createdAt"),
            "%Y-%m-%d"
          ),
          "createdAt",
        ],
      ],
      where: { id },
      include: [
        {
          model: Board,
          attributes: ["id"],
        },
        {
          model: Comment,
          attributes: ["id"],
        },
      ],
    });
    return user;
  } catch (err) {
    console.error(err);
    throw new controllerError("유저 정보 불러오기에 실패했습니다.");
  }
};

exports.getBoardAll = async (user) => {
  try {
    return await user.getBoard();
  } catch (err) {
    console.error(err);
    throw new controllerError(
      "유저가 작성한 게시글 목록 불러오기에 실패했습니다"
    );
  }
};
