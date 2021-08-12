const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { celebrate, errors, Joi } = require("celebrate");
const { isURL } = require("validator");
const rateLimit = require("express-rate-limit");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const errorsRouter = require("./routes/errors");
const errorsMiddlewares = require("./middlewares/errors");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3000 } = process.env;
const method = (value) => {
  const result = isURL(value);
  if (result) {
    return value;
  }
  throw new Error("URL validation err");
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
const app = express();
app.use(helmet());
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(limiter);
app.use(requestLogger); // подключаем логгер запросов
app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(method),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);
app.use(auth);
app.use("/", usersRouter);
app.use("/", cardsRouter);
app.use("*", errorsRouter);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorsMiddlewares);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
