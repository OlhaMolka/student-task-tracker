require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const statusRoutes = require("./routes/statusRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Додали новий маршрут
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// const swaggerJsdoc = require('swagger-jsdoc');

// const options = require('./swagger.config');
// const swaggerDocs = swaggerJsdoc(options);
const app = express();

// 🔧 Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// 🔌 Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// 🔗 Роутинг
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/task-statuses", statusRoutes);
app.use("/api/users", userRoutes); // ✅ Тут підключено userRoutes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 🌐 Health check
app.get("/test", (req, res) => {
  res.send("✅ Сервер працює! 🚀");
});

// ▶️ Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));