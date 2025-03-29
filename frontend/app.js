let tasks = [];

/**
 * Завантажити всі завдання з бекенду
 */
async function loadTasks() {
  try {
    const response = await fetch("http://localhost:5000/api/tasks");
    const data = await response.json();
    tasks = data;  // Зберігаємо у локальну змінну
    renderTasks();
  } catch (error) {
    console.error("Помилка завантаження завдань:", error);
  }
}

/**
 * Відмалювати список завдань
 */
function renderTasks() {
  const tasksUl = document.getElementById("tasks");
  tasksUl.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.title;

    // Кнопка видалення (пізніше можемо реалізувати)
    const btnRemove = document.createElement("button");
    btnRemove.textContent = "Видалити";
    btnRemove.style.marginLeft = "10px";
    btnRemove.onclick = () => {
      // TODO: реалізувати видалення через бекенд (DELETE /api/tasks/:id)
      alert("Функція видалення ще не реалізована");
    };

    li.appendChild(btnRemove);
    tasksUl.appendChild(li);
  });
}

/**
 * Додати нове завдання (через бекенд)
 */
async function addTask() {
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();

  if (!title) {
    alert("Введіть назву завдання!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error("Помилка створення завдання");
    }

    const newTask = await response.json();
    tasks.push(newTask); // Додаємо в локальний масив
    renderTasks();

    // Очищаємо поля
    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
  } catch (error) {
    console.error("Помилка створення завдання:", error);
  }
}

// Запускаємо завантаження завдань одразу при завантаженні сторінки
window.onload = () => {
  loadTasks();
};