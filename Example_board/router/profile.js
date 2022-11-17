const express = require("express");
const { getUser, getBoardAll } = require("../controllers/profile");
const controllerError = require("../error/controllerError");
// const { User } = require("../models");
const { isLoggedIn, isNotLoggendIn, catchError } = require("./middlewares");

const router = express.Router();

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const user = await getUser(req.user.id);
    res.render("profile", { user });
  } catch (err) {
    catchError(err, "프로파일 화면 불러오기에 실패했습니다.");
  }
});

module.exports = router;
