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
require("dotenv").config();

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
const allowedCors = [
  "https://gremwiz.backend.nomoredomains.club/",
  "http://gremwiz.backend.nomoredomains.club/",
  "localhost:3000",
  "https://praktikum.tk",
  "http://praktikum.tk",
];
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
app.get("/api/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  const { methodHttp } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const requestHeaders = req.headers["access-control-request-headers"];
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header("Access-Control-Allow-Origin", origin);
  }
  if (methodHttp === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }
  return next();
});
app.post("/api/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post("/api/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(method),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);
app.use(auth);
app.use("/api", usersRouter);
app.use("/api", cardsRouter);
app.use("*", errorsRouter);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorsMiddlewares);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
