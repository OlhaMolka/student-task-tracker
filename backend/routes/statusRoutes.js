const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const TaskStatus = require("../models/TaskStatus");

const router = express.Router();

// POST /api/task-statuses — оновлення статусу завдання студентом
router.post("/", authMiddleware, async (req, res) => {
    try {
      const { taskId, status } = req.body;
      let ts = await TaskStatus.findOne({ taskId, studentId: req.user.id });
  
      if (!ts) {
        ts = new TaskStatus({ taskId, studentId: req.user.id, status });
        await ts.save();
        return res.status(201).json(ts);
      } else {
        ts.status = status;
        await ts.save();
        return res.json(ts);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Помилка сервера" });
    }
  });  

module.exports = router;
