const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { isURL } = require("validator");
const {
  getUsers, getUser, updateUser, updateAvatar, getInfoAboutMe,
} = require("../controllers/users");

const method = (value) => {
  const result = isURL(value);
  if (result) {
    return value;
  }
  throw new Error("URL validation err");
};
router.get("/users", getUsers);
router.get("/users/me", getInfoAboutMe);
router.get("/users/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);
router.patch("/users/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch("/users/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(method),
  }),
}), updateAvatar);
module.exports = router;
