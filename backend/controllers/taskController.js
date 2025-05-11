const Task = require('../models/Task');

// Отримати всі завдання
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: "Помилка сервера" });
    }
};

// Створити нове завдання
exports.createTask = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const task = new Task({
            title,
            description,
            deadline,
            createdBy: req.user?.id || null
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ msg: "Помилка при створенні завдання", 'err': err });
    }
};

// 🔐 Оновити завдання (тільки admin)
exports.updateTask = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Доступ заборонено: тільки для адміністратора" });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTask) {
            return res.status(404).json({ msg: "Завдання не знайдено" });
        }

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ msg: "Помилка при оновленні завдання" });
    }
};

// 🔐 Видалити завдання (тільки admin)
exports.deleteTask = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Доступ заборонено: тільки для адміністратора" });
        }

        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ msg: "Завдання не знайдено" });
        }

        res.json({ msg: "Завдання видалено", task: deletedTask });
    } catch (err) {
        res.status(500).json({ msg: "Помилка при видаленні завдання" });
    }
};