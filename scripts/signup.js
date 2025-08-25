function formFields() {
  return {
    name: document.querySelector('[data-field="name"]'),
    email: document.querySelector('[data-field="email"]'),
    password: document.querySelector('[data-field="password"]'),
    confirmPassword: document.querySelector('[data-field="confirmPassword"]'),
  };
}

function errorFields() {
  return {
    name: document.querySelector('[data-field="errorName"]'),
    email: document.querySelector('[data-field="errorEmail"]'),
    password: document.querySelector('[data-field="errorPassword"]'),
  };
}

async function checkEmailExists(email) {
  const inputContainer = document.querySelectorAll(".input-container");
  let errorElements = errorFields();
  const users = await loadData("users/");
  for (const key in users) {
    if (email == users[key].email) {
      errorElements.email.innerHTML = "Email exists";
      addRedOutline(inputContainer[1]);
      return false;
    }
  }
  return true;
}

function addRedOutline(target) {
  target.classList.add("light-red-outline");
}

function comparePasswords(password, confirmPassword) {
  const inputContainer = document.querySelectorAll(".input-container");
  let errorElements = errorFields();
  const identical = password.value.trim() === confirmPassword.value.trim();
  if (!identical) {
    errorElements.password.innerHTML = "Passwords are not identical";
    addRedOutline(inputContainer[2]);
    addRedOutline(inputContainer[3]);
    return false;
  }
  if (password.value.length < 3) {
    errorElements.password.innerHTML = "Passwords length is to short";
    addRedOutline(inputContainer[2]);
    addRedOutline(inputContainer[3]);
    return false;
  }
  return identical;
}

async function addUser() {
  const inputs = formFields();
  let signUp = await checkFormFields();
  if (!signUp) return;
  await postUser(inputs.name.value, inputs.email.value, inputs.password.value);
  showSignupSuccess();
}

function showSignupSuccess() {
  openOverlay();
  setTimeout(() => {
    closeOverlay();
    openLogin();
  }, 2000);
}

function openLogin() {
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 250);
}

function openPrivacy() {
  window.location.href = "../html-templates/privacy-policy.html?msg=privacy";
}

function checkName(userName) {
  const inputContainer = document.querySelectorAll(".input-container");
  let errorElements = errorFields();
  let validate = userName.trim() <= 0 || !userName.trim() ? false : true;
  if (!validate) {
    errorElements.name.innerHTML = "Please enter your name";
    addRedOutline(inputContainer[0]);
  }
  return validate;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || !email) {
    return false;
  }
  return true;
}

function errorEmail() {
  const inputContainer = document.querySelectorAll(".input-container");
  let errorElements = errorFields();
  errorElements.email.innerHTML = "Please enter a valid email address";
  addRedOutline(inputContainer[1]);
}

async function checkFormFields() {
  let inputs = formFields();
  let nameIsValid = checkName(inputs.name.value);
  let emailIsValid = validateEmail(inputs.email.value);
  let emailAvailable = false;
  if (!emailIsValid) errorEmail();
  if (emailIsValid) {
    emailAvailable = await checkEmailExists(inputs.email.value);
  }
  let passwordsMatch = comparePasswords(inputs.password, inputs.confirmPassword);
  let checkbox = checkPrivacy();
  if (!nameIsValid || !emailIsValid || !emailAvailable || !passwordsMatch || !checkbox) return false;
  return true;
}

function checkPrivacy() {
  const checkbox = document.getElementById("privacyCheckbox");
  return checkbox.checked;
}

function toggleLockIcon(e, lockId, eyeId) {
  const lock = document.getElementById(lockId);
  const eye = document.getElementById(eyeId);
  const hasValue = e.target.value.trim().length > 0;
  lock.style.display = hasValue ? "none" : "inline";
  eye.style.display = hasValue ? "inline" : "none";
  if (!hasValue) {
    e.target.type = "password";
    eye.src = "../assets/icons/eye-icon.svg";
  }
}

function toggleInputType(e, data) {
  const input = document.querySelector(`[data-field="${data}"]`);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  e.target.src = isPassword ? "../assets/icons/eye-slash.svg" : "../assets/icons/eye-icon.svg";
}

document.addEventListener("DOMContentLoaded", () => {
  const inputs = formFields();
  const error = errorFields();
  const inputContainer = document.querySelectorAll(".input-container");
  addEventToInputs(inputs, error, inputContainer);
});

function addEventToInputs(inputs, error, inputContainer) {
  for (const key in inputs) {
    if (!inputs[key]) return;
    inputs[key].addEventListener("click", () => {
      let name = inputs[key].getAttribute("name");
      if (name == "name") removeErrorReport(error.name, inputContainer[0]);
      if (name == "email") removeErrorReport(error.email, inputContainer[1]);
      if (name == "password" || name == "confirmPassword") {
        removeErrorReport(error.password, inputContainer[2]);
        removeErrorReport(error.password, inputContainer[3]);
      }
    });
  }
}

function removeErrorReport(error, inputContainer) {
  error.innerHTML = "";
  inputContainer.classList.remove("light-red-outline");
}
