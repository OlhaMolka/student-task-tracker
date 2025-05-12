const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Користувач з таким email вже існує' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ msg: 'Реєстрація успішна' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Помилка сервера' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Користувач не знайдений' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Невірний пароль' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Помилка сервера' });
    }
};