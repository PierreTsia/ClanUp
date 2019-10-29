const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  color:{
    type: String
  },
});

module.exports = mongoose.model("Tag", TagSchema);
