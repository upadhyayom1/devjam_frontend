function login() {
  const role = document.getElementById("role").value;

  if (role === "student") {
    window.location.href = "student.html";
  } else {
    window.location.href = "admin.html";
  }
}
