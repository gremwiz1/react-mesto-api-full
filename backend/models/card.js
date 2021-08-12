const mongoose = require("mongoose");
const { isURL } = require("validator");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: "Поле link не является ссылкой",
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
    ref: "user",
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("card", cardSchema);
