const mongoose = require("mongoose");

const ColumnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },
  position: {
    type: Number,
    required: true,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cards: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Card"
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Column", ColumnSchema);
