const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const BadRequestError = require("../errors/bad-request-err");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error("NotValidIdCard"))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        card.remove();
        return res.status(200).send({ message: "Карточка успешно удалена" });
      }
      return Promise.reject(new Error("YouNotOwnerCard"));
    })
    .catch((err) => {
      if (err.message === "NotValidIdCard") {
        next(new NotFoundError("Карточки с таким id не существует"));
      } else if (err.message === "YouNotOwnerCard") {
        next(new ForbiddenError("Вы не можете удалить карточку, так как вы не ее собственник"));
      } else if (err.name === "CastError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error("NotValidIdCard"))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === "NotValidIdCard") {
        next(new NotFoundError("Карточки с таким id не существует"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные для постановки лайка"));
      } else {
        next(err);
      }
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error("NotValidIdCard"))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === "NotValidIdCard") {
        next(new NotFoundError("Карточки с таким id не существует"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные для снятия лайка"));
      } else {
        next(err);
      }
    });
};
