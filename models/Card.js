const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  column: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Column",
    required: true
  },

  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Card", CardSchema);
