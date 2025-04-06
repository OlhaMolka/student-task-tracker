const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Помилка сервера' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'Користувача не знайдено' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Помилка при оновленні користувача' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ msg: 'Користувача не знайдено' });
        }

        res.json({ msg: 'Користувача видалено', user: deleted });
    } catch (err) {
        res.status(500).json({ msg: 'Помилка при видаленні користувача' });
    }
};