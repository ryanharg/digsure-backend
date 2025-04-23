
document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const res = await fetch("http://localhost:3000/v1/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) 
      const token = data.token;
      if (token) {
        localStorage.setItem("token", token);
        const redirectTo = localStorage.getItem("postLoginRedirect") || "index.html";
        localStorage.removeItem("postLoginRedirect");
        window.location.href = redirectTo;
      }

    else alert(data.message || "Registration failed");
});
