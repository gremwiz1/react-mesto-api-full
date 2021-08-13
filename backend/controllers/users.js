const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((customer) => {
      if (customer) {
        throw new ConflictError("Пользователь с таким email уже существует в базе");
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((user) => {
          res.status(200).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(new BadRequestError(`Переданы не корректные данные: ${err}`));
          } else {
            next(err);
          }
        });
    }).catch(next);
};
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error("NotValidIdUser"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "NotValidIdUser") {
        next(new NotFoundError("Нет пользователя с таким id"));
      } else if (err.name === "CastError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    { new: true, runValidators: true, upsert: true })
    .orFail(new Error("NotValidIdUser"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "NotValidIdUser") {
        next(new NotFoundError("Нет пользователя с таким id"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new BadRequestError("Поле аватар не заполнено");
  } else {
    User.findByIdAndUpdate(req.user._id, { avatar },
      { new: true, runValidators: true, upsert: true })
      .orFail(new Error("NotValidIdUser"))
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((err) => {
        if (err.message === "NotValidIdUser") {
          next(new NotFoundError("Нет пользователя с таким id"));
        } else if (err.name === "ValidationError") {
          next(new BadRequestError(`Переданы не корректные данные: ${err}`));
        } else {
          next(err);
        }
      });
  }
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET = "dev-key" } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "IncorrectEmailOrPassword") {
        next(new UnauthorizedError("Неправильная почта или пароль"));
      } else {
        next(err);
      }
    });
};
module.exports.getInfoAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Некорректный id пользователя"));
      } else {
        next(err);
      }
    });
};
