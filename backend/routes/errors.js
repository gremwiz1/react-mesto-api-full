const router = require("express").Router();
const NotFoundError = require("../errors/not-found-err");

router.use("/*", (req, res, next) => {
  next(new NotFoundError("Такой страницы не существует"));
});
module.exports = router;
