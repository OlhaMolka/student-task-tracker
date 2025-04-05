const Task = require("../models/Task");

// Отримати всі завдання
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("createdBy", "name email");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Помилка сервера при отриманні завдань" });
  }
};

// Створити нове завдання
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Назва обов’язкова" });
    }

    const newTask = new Task({
      title,
      description,
      deadline,
      createdBy: req.user.id // з токена, після authMiddleware
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Помилка сервера при створенні завдання" });
  }
};
