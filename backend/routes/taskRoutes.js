const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const { getTasks, createTask } = require('../controllers/taskController');

// 🔐 Отримати список завдань (доступно для всіх авторизованих користувачів)
router.get('/', auth, getTasks);

// 🛠️ Створити нове завдання (доступно лише для admin)
router.post('/', auth, isAdmin, createTask);

module.exports = router;