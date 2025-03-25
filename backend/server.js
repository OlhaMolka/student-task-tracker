require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Головний маршрут
app.get('/', (req, res) => {
    res.send('Сервер працює! 🚀');
});

// Роутинг
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-statuses', statusRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));