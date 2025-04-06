require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const statusRoutes = require("./routes/statusRoutes");

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🔌 Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // якщо не підключено до БД — сервер не стартує
  });

// 🔗 Роутинг
app.use("/api/auth", authRoutes);             // /api/auth/register, /api/auth/login
app.use("/api/tasks", taskRoutes);            // /api/tasks, /api/tasks/:id/statuses
app.use("/api/task-statuses", statusRoutes);  // /api/task-statuses (оновлення статусу студентом)

// 🌐 Health check
app.get("/", (req, res) => {
  res.send("✅ Сервер працює! 🚀");
});

// ▶️ Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));