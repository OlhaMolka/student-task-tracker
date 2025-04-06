const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Отримати список всіх користувачів (тільки для адміна)
router.get('/', authMiddleware, isAdmin, userController.getUsers);

// Редагувати користувача
router.put('/:id', authMiddleware, isAdmin, userController.updateUser);

// Видалити користувача
router.delete('/:id', authMiddleware, isAdmin, userController.deleteUser);

module.exports = router;