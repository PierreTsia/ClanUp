const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  board: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Board"
  }
});

module.exports = mongoose.model("Tag", TagSchema);
