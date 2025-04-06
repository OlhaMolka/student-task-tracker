const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const TaskStatus = require("../models/TaskStatus");

// Студент оновлює статус завдання
router.post("/", auth, async (req, res) => {
  try {
    const { taskId, status } = req.body;
    const studentId = req.user.id;

    if (!taskId || !status) {
      return res.status(400).json({ msg: "Вкажіть taskId та статус" });
    }

    let taskStatus = await TaskStatus.findOne({ taskId, studentId });

    if (!taskStatus) {
      taskStatus = new TaskStatus({ taskId, studentId, status });
      await taskStatus.save();
      return res.status(201).json(taskStatus);
    } else {
      taskStatus.status = status;
      await taskStatus.save();
      return res.json(taskStatus);
    }
  } catch (err) {
    console.error("Помилка при оновленні статусу:", err.message);
    res.status(500).json({ msg: "Помилка сервера" });
  }
});

module.exports = router;