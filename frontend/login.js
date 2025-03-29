document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Помилка логіну");
      }
  
      const data = await response.json();
      // data = { token, user: { id, name, email, role } }
  
      // Зберігаємо токен та роль
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
  
      alert("Вхід успішний!");
      // Перехід на сторінку зі списком завдань
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Невірні дані для входу");
      console.error("Login error:", error);
    }
  });
  