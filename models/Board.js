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
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: "#001A29"
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
