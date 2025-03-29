const mongoose = require("mongoose");

const TaskStatusSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["на перевірці", "виконано", "зараховано", "не виконано"],
    required: true
  }
});

module.exports = mongoose.model("TaskStatus", TaskStatusSchema);