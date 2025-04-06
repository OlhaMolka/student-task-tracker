const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Отримати всі завдання
router.get('/', taskController.getTasks);

// Створити нове завдання (авторизація)
router.post('/', authMiddleware, taskController.createTask);

// Редагувати завдання (авторизація)
router.put('/:id', authMiddleware, taskController.updateTask);

// Видалити завдання (авторизація)
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;