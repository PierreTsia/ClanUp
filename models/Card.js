const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Column",
    required: true
  },
  tags: {
    type: [mongoose.Schema.Types.ObjectID],
    ref: "Tag"
  },
  position: {
    type: Number,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  coverImg: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: [Comment]
  }
});

module.exports = mongoose.model("Card", CardSchema);
