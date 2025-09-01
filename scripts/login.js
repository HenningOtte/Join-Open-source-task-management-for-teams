function resetSignup() {
  emailForm.error.style.display = "none";
  emailForm.success.style.display = "none";
  emailForm.input.classList.remove("error", "success");
}

function updateLoginButton() {
  const passwordInput = document.getElementById("password");
  if (isEmailValid && passwordInput.value.trim()) {
    emailForm.button.disabled = false;
    emailForm.button.style.opacity = "1";
  } else {
    emailForm.button.disabled = true;
    emailForm.button.style.opacity = "0.6";
  }
}

async function handleLogin() {
  const users = await loadData("users/");
  console.log(users);
  
  let userName = isValidLogin(users);
  if (userName) {
    startLogin(userName, "summary");
  } else {
    failLogin();
  }
}

function startLogin(name, target) {
  const params = new URLSearchParams({
    User: name,
    Status: "to-do",
  });
  window.location.href = `./html-templates/${target}.html?${params}`;
}


function failLogin() {
  const errorElements = errorFields();
  const container = document.querySelectorAll(".input-container");
  errorElements.password.innerHTML =
    "Check your email and Password. Please try again.";
  container.forEach((element) => {
    addRedOutline(element);
  });
}

function isValidLogin(users) {
  const inputs = formFields();
  let validate = false;
  for (const key in users) {
    if (
      users[key].email == inputs.email.value &&
      users[key].password == inputs.password.value
    ) {
      return users[key].name;
    }
  }
  return false;
}

function activateLogin() {
    const inputs = formFields();
    let email = validateEmail(inputs.email.value.trim());
    let password = checkPasswordLength(inputs.password.value.trim());
    updateLoginButton(email, password);
}

function checkPasswordLength(password) {
  if (password.length > 0) return true;
  return false;
}

function updateLoginButton(email, password) {
    let loginBtn = document.getElementById("login-btn");
    if (email && password) {
        loginBtn.disabled = false;
    } else loginBtn.disabled = true;
}

function removeLoginErrors() {
  const container = document.querySelectorAll(".input-container");
  const errors = errorFields();
  container.forEach((element) => {
    element.classList.remove("light-red-outline");
  });
  errors.password.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const inputs = formFields();
  for (const key in inputs) {
    if (inputs[key] == null) continue;
    inputs[key].addEventListener("click", () => {
      removeLoginErrors();
    });
  }
});
