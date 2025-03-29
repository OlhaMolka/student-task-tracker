const token = localStorage.getItem("token");
const userRole = localStorage.getItem("userRole");

if (!token) {
  // Якщо токена немає — перенаправляємо на логін
  window.location.href = "login.html";
}

// Показати admin-панель, якщо роль = admin
if (userRole === "admin") {
  document.getElementById("admin-panel").style.display = "block";
}

// Показати student-панель, якщо роль = student
if (userRole === "student") {
  document.getElementById("student-panel").style.display = "block";
}

// Завантажити список завдань
async function loadTasks() {
  try {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Помилка завантаження завдань:", error);
  }
}

function renderTasks(tasks) {
  const ul = document.getElementById("tasks");
  ul.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = `${task.title} - ${task.description || ""}`;
    ul.appendChild(li);
  });
}

// Додати нове завдання
async function addTask() {
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();

  if (!title) {
    alert("Введіть назву!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) {
      throw new Error("Помилка створення завдання");
    }
    const newTask = await res.json();
    alert("Завдання створено!");
    loadTasks(); // Перезавантажити список
  } catch (error) {
    console.error(error);
    alert("Помилка створення");
  }
}

// Функція для зміни статусу завдання
async function changeStatus() {
  const taskId = document.getElementById("task-id").value.trim();
  const newStatus = document.getElementById("new-status").value;

  if (!taskId) {
    alert("Введіть ID завдання!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/task-statuses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ taskId, status: newStatus }),
    });

    if (!res.ok) {
      throw new Error("Помилка зміни статусу");
    }

    const data = await res.json();
    alert(`Статус змінено на: ${data.status}`);
    loadTasks(); // Оновити список завдань
  } catch (error) {
    console.error("Change status error:", error);
    alert("Помилка зміни статусу");
  }
}

// Вийти (логаут)
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
}

// При завантаженні сторінки — завантажуємо список
window.onload = loadTasks;