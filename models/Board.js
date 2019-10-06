const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  boardname: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  contributors: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },
  columns: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Column"
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  coverImg: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Board", BoardSchema);
