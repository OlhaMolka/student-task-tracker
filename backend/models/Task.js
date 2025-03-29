const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  createdBy: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("Task", TaskSchema);