const { Board, User, Comment } = require("../models");
const controllerError = require("../error/controllerError");
const { sequelize } = require("../models");
const Op = require("sequelize").Op;

// exports.getBoardAll = async () => {
//     try {,.
//         const boards = await Board.findAll({
//             attributes: ['id', 'title', 'viewCount', 'likeCount', 'hateCount', 'createdAt'],
//             order: [['createdAt', 'DESC']],
//             include: {
//                 model: User,
//                 attributes: ['nick'],
//             },
//             offset: 1,
//             limit: 5
//         });
//     } catch (err) {
//         console.error(err);
//         throw new controllerError('게시글 불러오기에 실패했습니다.');
//     }
// }

exports.getBoardAll = async (limit, offset) => {
  try {
    const boards = await Board.findAll({
      attributes: [
        "id",
        "title",
        "viewCount",
        "likeCount",
        [
          sequelize.fn(
            "DATE_FORMAT",
            sequelize.col("Board.createdAt"),
            "%Y-%m-%d"
          ),
          "createdAt",
        ],
      ],

      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["nick"],
        },
        {
          model: Comment,
        },
      ],
      offset,
      limit,
    });
    return boards;
  } catch (err) {
    console.log(err);
    throw new controllerError("게시글 불러오기에 실패했습니다.");
  }
};

exports.getBoardCount = async () => {
  try {
    const count = await Board.count();
    return count;
  } catch (err) {
    console.log(err);
    throw new controllerError("게시글 수 불러오기에 실패했습니다.");
  }
};

exports.getCommentCount = async (boardId) => {
  try {
    const count = await Comment.count({
      where: { boardId },
    });
    return count;
  } catch (err) {
    console.log(err);
    throw new controllerError("댓글 수 불러오기에 실패했습니다.");
  }
};

exports.addBoard = async (id, title, content) => {
  try {
    await Board.create({
      userId: id,
      title: title,
      content: content,
    });
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("게시글 작성에 실패했습니다.");
  }
};

exports.getBoard = async (id) => {
  try {
    const board = await Board.findOne({
      where: { id: id },
      attributes: [
        "id",
        "title",
        `content`,
        "viewCount",
        "likeCount",
        "hateCount",
        "createdAt",
        "userId",
      ],
    });
    return board;
  } catch (err) {
    console.error(err);
    throw new controllerError("게시글 상세 불러오기에 실패했습니다.");
  }
};

exports.getBoardsSearchedByTitle = async (value) => {
  try {
    const boards = await Board.findAll({
      where: {
        title: {
          [Op.like]: "%" + value + "%",
        },
      },
      attributes: [
        "id",
        "title",
        `content`,
        "viewCount",
        "likeCount",
        "hateCount",
        "createdAt",
        "userId",
      ],
      order: [["createdAt", "DESC"]],
      include: {
        model: User,
        attributes: ["nick"],
      },
    });
    return boards;
  } catch (err) {
    console.error(err);
    throw new controllerError("제목으로 검색된 보드 불러오기에 실패했습니다.");
  }
};

exports.getBoardsSearchedByContent = async (value) => {
  try {
    const boards = await Board.findAll({
      where: {
        content: {
          [Op.like]: "%" + value + "%",
        },
      },
      attributes: [
        "id",
        "title",
        `content`,
        "viewCount",
        "likeCount",
        "hateCount",
        "createdAt",
        "userId",
      ],
      order: [["createdAt", "DESC"]],
      include: {
        model: User,
        attributes: ["nick"],
      },
    });
    return boards;
  } catch (err) {
    console.error(err);
    throw new controllerError("내용으로 검색된 보드 불러오기에 실패했습니다.");
  }
};

// exports.readBoard = async (id) => {
//   let t = await sequelize.transaction();
//   try {
//     const board = await Board.findOne(
//       {
//         where: { id: id },
//         attributes: [
//           "id",
//           "title",
//           `content`,
//           "viewCount",
//           "likeCount",
//           "hateCount",
//           "createdAt",
//           "userId",
//         ],
//       },
//       { transaction: t }
//     );

//     await Board.update(
//       {
//         viewCount: board.viewCount + 1,
//         title: "이거 롤백 안되서 이럼" + parseInt(board.viewCount + 1),
//       },
//       {
//         where: { id },
//       },
//       { transaction: t }
//     );

//     throw new Error();

//     const wirter = await User.findOne(
//       {
//         where: { id: id },
//         attributes: ["nick"],
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     return { board, wirter };
//   } catch (err) {
//     if (t) {
//       await t.rollback();
//       console.log("롤백!");
//     }
//     console.error(err);
//     throw new controllerError("게시글 상세 내용 불러오기에 실패했습니다.");
//   }
// };

exports.getWriter = async (id) => {
  try {
    const wirter = await User.findOne({
      where: { id: id },
      attributes: ["nick"],
    });
    return wirter;
  } catch (err) {
    console.error(err);
    throw new controllerError("게시글 작성자 닉네임 불러오기에 실패했습니다.");
  }
};

exports.increaseView = async (id, view) => {
  try {
    await Board.update(
      {
        viewCount: view,
      },
      {
        where: { id },
      }
    );
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("조회수 증가에 실패했습니다.");
  }
};

exports.increaseLike = async (id) => {
  try {
    await Board.increment(
      {
        likeCount: 1,
      },
      {
        where: { id },
      }
    );
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("좋아요 증가에 실패했습니다.");
  }
};

exports.increaseHate = async (id) => {
  try {
    await Board.increment(
      {
        hateCount: 1,
      },
      {
        where: { id },
      }
    );
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("싫어요 증가에 실패했습니다.");
  }
};

exports.getLike = async (userId, board) => {
  try {
    const like = await board.getLikeBoard({
      where: { id: userId },
    });
    return like;
  } catch (err) {
    console.error(err);
    throw new controllerError("등록된 좋아요를 불러오기 못 했습니다.");
  }
};

exports.getHate = async (userId, board) => {
  try {
    const hate = await board.getHateBoard({
      where: { id: userId },
    });
    return hate;
  } catch (err) {
    console.error(err);
    throw new controllerError("등록된 싫어요를 불러오기 못 했습니다.");
  }
};

exports.addLike = async (userId, board) => {
  try {
    await board.addLikeBoard(userId);
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("좋아요 연결에 실패했습니다.");
  }
};

exports.addHate = async (userId, board) => {
  try {
    await board.addHateBoard(userId);
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("싫어요 연결에 실패했습니다.");
  }
};

exports.updateBoard = async (id, title, content) => {
  try {
    const board = await Board.update(
      {
        title,
        content,
      },
      {
        where: { id },
      }
    );
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("게시글 수정을 실패했습니다.");
  }
};

exports.deleteBoard = async (id) => {
  try {
    await Board.destroy({
      where: { id },
    });
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("게시글 삭제를 실패했습니다.");
  }
};

exports.getCommentAll = async (boardId) => {
  try {
    const comments = await Comment.findAll({
      attributes: [
        "id",
        "content",
        "createdAt",
        "userId",
        "boardId",
        "originCommentId",
      ],
      where: { boardId },
      order: [["createdAt", "DESC"]],
      include: {
        model: User,
        attributes: ["nick"],
      },
    });
    return comments;
  } catch (err) {
    console.error(err);
    throw new controllerError("댓글 불러오기에 실패했습니다.");
  }
};

exports.getComment = async (id) => {
  try {
    const comment = await Comment.findOne({
      attributes: ["id", "userId"],
      where: { id },
    });
    return comment;
  } catch (err) {
    console.error(err);
    throw new controllerError("댓글 불러오기에 실패했습니다.");
  }
};

exports.addComment = async (userId, boardId, content) => {
  try {
    await Comment.create({
      content: content,
      userId: userId,
      boardId: boardId,
    });
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("댓글 작성에 실패했습니다.");
  }
};

exports.countComment = async (id) => {
  // await Comment.count
};

exports.deleteComment = async (id) => {
  try {
    await Comment.destroy({
      where: { id },
    });
    return;
  } catch (err) {
    console.error(err);
    throw new controllerError("댓글 삭제에 실패했습니다.");
  }
};

// try {

// } catch (err) {
//     console.error(err);
//     throw new Error('');
// }
