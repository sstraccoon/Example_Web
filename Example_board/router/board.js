const express = require("express");
const controllerError = require("../error/controllerError");
const { isLoggedIn, isNotLoggendIn, catchError } = require("./middlewares");
const {
  getBoardAll,
  getBoardCount,
  addBoard,
  getBoard,
  getWriter,
  getBoardsSearchedByTitle,
  getBoardsSearchedByContent,
  updateBoard,
  deleteBoard,
  increaseView,
  increaseLike,
  increaseHate,
  addComment,
  deleteComment,
  getComment,
  getCommentAll,
  readBoard,
  addLike,
  addHate,
  getLike,
  getHate,
} = require("../controllers/board");
// const sequelize = require("sequelize");
const router = express.Router();

const { sequelize } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    // const limit = 20;
    // const page = 1;
    // const offset = (page - 1) * limit;
    // const boards = await getBoardAll(limit, offset);
    // const boardCount = await getBoardCount();

    res.render("board/main");
  } catch (err) {
    catchError(err, "메인 화면 불러오기에 실패했습니다.", next);
  }
});

router.post("/getBoardAll", async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.body;
    //page 조건문 1이상 이여야 한다.
    const offset = (page - 1) * limit;
    const boards = await getBoardAll(limit, offset);
    const boardCount = await getBoardCount();
    res.json({ boards, boardCount, page });
  } catch (err) {
    catchError(err, "게시글 불러오기에 실패 했습니다.", next);
  }
});

router.get("/write", isLoggedIn, (req, res, next) => {
  res.render("board/write");
});

router.post("/write", isLoggedIn, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    await addBoard(req.user.id, title, content);
    res.status(200).redirect("/board");
  } catch (err) {
    catchError(err, "게시글 작성에 실패 했습니다.", next);
  }
});

// router.get("/read/:id", async (req, res, next) => {
//   try {
//     const id = parseInt(req.params.id);
//     const userId = req.user ? req.user.id : null;

//     // const result = await sequelize.transaction(async (t) => {
//     //   // await increaseView(id, t);
//     //   const board = await getBoard(id, t);
//     //   await increaseView(id, board.viewCount + 1, t);
//     //   const writer = await getWriter(board.userId, t);

//     //   res.render("board/read", { userId, writer, board });
//     // });
//     const { writer, board } = await readBoard(id, userId);
//     res.render("board/read", { userId, writer, board });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// });

router.get("/read/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user ? req.user.id : null;
    const board = await getBoard(id);
    await increaseView(id, board.viewCount + 1);
    const writer = await getWriter(board.userId);

    res.render("board/read", { userId, writer, board });
  } catch (err) {
    catchError(err, "게시글 상세 불러오기에 실패 했습니다.", next);
  }
});

router.get("/update/:id", isLoggedIn, async (req, res, next) => {
  try {
    const boardId = req.params.id;
    await isCheckWriter(req.user.id, boardId);
    const board = await getBoard(boardId);
    res.render("board/update", { board });
  } catch (err) {
    catchError(err, "게시글 수정에 실패 했습니다.", next);
  }
});

router.post("/update", isLoggedIn, async (req, res, next) => {
  try {
    const { boardId, title, content } = req.body;
    await isCheckWriter(req.user.id, boardId);
    await updateBoard(boardId, title, content);
    res.status(200).redirect("/board");
  } catch (err) {
    catchError(err, "게시글 작성에 실패 했습니다.", next);
  }
});

router.get("/delete/:id", isLoggedIn, async (req, res, next) => {
  try {
    await deleteBoard(req.params.id);
    res.status(200).redirect("/board");
  } catch (err) {
    catchError(err, "게시글 삭제에 실패 했습니다.", next);
  }
});

router.get("/like/:id", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const board = await getBoard(id);
    const result = await checkLikeHate(res, req.user.id, board);
    if (result === false) {
      return res.status(500).end("이미 좋아요 / 싫어요 를 누르셨습니다.");
    }
    await addLike(req.user.id, board);
    await increaseLike(id);
    const like = (await getBoard(id)).likeCount;
    res.status(200).json(like);
  } catch (err) {
    catchError(err, "게시글 종아요 등록에 실패 했습니다.", next);
  }
});

router.get("/hate/:id", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const board = await getBoard(id);
    const result = await checkLikeHate(res, req.user.id, board);
    if (result === false) {
      return res.status(500).end("이미 좋아요 / 싫어요 를 누르셨습니다.");
    }
    await addHate(req.user.id, board);
    await increaseHate(id);
    const hate = (await getBoard(id)).hateCount;
    res.status(200).json(hate);
  } catch (err) {
    catchError(err, "게시글 싫어요 등록에 실패 했습니다.", next);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { type, value } = req.query;
    let boards;
    if (type == "title") {
      boards = await getBoardsSearchedByTitle(value);
    } else if (type == "content") {
      boards = await getBoardsSearchedByContent(value);
    }
    res.status(202).json(boards);
  } catch (err) {
    catchError(err, "게시글 종아요 등록에 실패 했습니다.", next);
  }
});

router.post("/comment", isLoggedIn, async (req, res, next) => {
  try {
    const { boardId, content } = req.body;
    if (content == "" || content === undefined) {
      return res.status(500).end("댓글이 비어 있습니다.");
    }

    const isBoard = await getBoard(boardId);
    if (!isBoard) {
      throw new controllerError("존재하지 않는 게시글 입니다.");
    }

    await addComment(req.user.id, boardId, content);
    const comment = await getCommentAll(boardId);
    res.status(200).json(comment);
  } catch (err) {
    catchError(err, "댓글 등록에 실패 했습니다.", next);
  }
});

router.get("/comment/:boardId", async (req, res, next) => {
  try {
    const comments = await getCommentAll(req.params.boardId);
    res.status(200).json(comments);
  } catch (err) {
    catchError(err, "댓글 불러오기에 실패했습니다.", next);
  }
});

router.post("/comment/delete", isLoggedIn, async (req, res, next) => {
  try {
    const { boardId, id } = req.body;
    const comment = await getComment(id);

    if (req.user.id !== comment.userId) {
      return res.status(500).end("댓글은 작성자만 지울수 있습니다.");
    }

    await deleteComment(id);
    const comments = await getCommentAll(boardId);
    return res.status(200).json(comments);
  } catch (err) {
    catchError(err, "댓글 삭제에 실패 했습니다.", next);
  }
});

async function isCheckWriter(userId, boardId) {
  const writerId = await getBoard(boardId).userId;
  if (userId == writerId) {
    return true;
  }
  return false;
}

async function checkLikeHate(res, userId, board) {
  const likeBoard = await getLike(userId, board);
  if (likeBoard.length) {
    return false;
  }

  const hateBoard = await getHate(userId, board);
  if (hateBoard.length) {
    return false;
  }
  return true;
}

module.exports = router;
