document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Помилка реєстрації");
      }
  
      alert("Реєстрація успішна!");
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
      console.error("Register error:", error);
    }
  });
  