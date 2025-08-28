async function fetchAndInsertHtml(targetId, htmlPage) {
  try {
    const target = document.getElementById(targetId);
    const resp = await fetch(htmlPage);
    const html = await resp.text();
    target.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

function openOverlay() {
  const overlay = document.querySelectorAll(".overlay");
  overlay.forEach((element) => {
    element.classList.remove("hidden");
    setTimeout(() => {
      element.classList.add("visible");
      toggleAnimation();
    }, 1);
  });
}

function closeOverlay() {
  const overlay = document.querySelectorAll(".overlay");
  overlay.forEach((element) => {
    element.classList.remove("visible");
    toggleAnimation();
    setTimeout(() => {
      element.classList.add("hidden");
    }, 250);
  });
}

function toggleAnimation() {
  const overlayWrapper = document.querySelectorAll(".overlay-wrapper");
  overlayWrapper.forEach((element) => {
    element.classList.toggle("transit");
  });
}

function onclickProtection(event) {
  event.stopPropagation();
}

async function addTask(status) {
  updateTaskStatus(status);
  openAddTask();
  await loadUsersTask();
  loadTaskFormTemplate("firstBoardAddTask", "secondBoardAddTask");
  activePriority("medium");
}

function updateTaskStatus(status) {
  if (!status) return;
  taskStatus = status;
}

async function loadHTML(link) {
  const resp = await fetch(link);
  const html = await resp.text();
  return html;
}

function openAddTask() {
  const addTask = document.getElementById("add-task-board");
  const container = document.getElementById("task-overlay");
  addTask.classList.toggle("d-none");
  setTimeout(() => {
    addTask.classList.toggle("transparent-background");
    container.classList.toggle("transit");
  }, 10);
}

function closeAddTask() {
  clearTaskFormContainers();
  const addTask = document.getElementById("add-task-board");
  const container = document.getElementById("task-overlay");
  addTask.classList.toggle("transparent-background");
  container.classList.toggle("transit");
  setTimeout(() => {
    addTask.classList.toggle("d-none");
  }, 250);
}

//---------Call up user information------------------------

async function renderUserIcon() {
  const element = document.querySelector(".profile-picture");
  let name = loadUrlParams();
  if (!name) name = "Guest";
  element.innerHTML = createAvater(name);
}

function loadUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");
  return msg;
}

function createAvater(name) {
  let myArr = name.split(" ");
  let avatar = "";
  myArr.forEach((element) => {
    avatar += element.charAt(0);
  });
  return avatar;
}

function updateLinksWithUserKey(target) {
  let name = loadUrlParams();
  if (!name) name = "Guest";
  const links = document.querySelectorAll(`[data-task="${target}"]`);
  links.forEach((element) => {
    let newLink = element.href + `?msg=${encodeURIComponent(name)}`;
    element.href = newLink;
  });
}

function isPrivacyMessage() {
  let msg = loadUrlParams();
  if (msg === "privacy") adjustLayoutForPrivacyView();
}

function adjustLayoutForPrivacyView() {
  const ul = document.querySelector(".nav-wrapper").children[0];
  const navImg = document.querySelector(".nav-imgs");
  navImg.innerHTML = "";
  ul.innerHTML = "";
  ul.innerHTML += navLink("login", "../index.html", "Log in");
}

function initializeNavbar() {
  renderUserIcon();
  updateLinksWithUserKey("navLink");
}

// function toggleMenu() {
//   const menu = document.getElementById("menu");
//   menu.classList.toggle("menu-translateX");
// }

function toggleMenu() {
  const container = document.querySelector(".menu-container");
  const menu = document.getElementById("menu");
  if (container.classList.contains("d-none")) {
    container.classList.remove("d-none");
    setTimeout(() => {
      menu.classList.toggle("menu-translateX");
    }, 50);
  } else {
    menu.classList.toggle("menu-translateX");
    setTimeout(() => {
      container.classList.add("d-none");
    }, 150);
  }
}

// Animation for mobile view

// window.addEventListener("load", () => {
//   const intro = document.getElementById("intro");
//   const main = document.getElementById("main");

//   intro.style.animation = "fadeOut 3s ease forwards";
//   intro.style.animationDelay = "2s";
  
//   setTimeout(() => {
//     intro.style.display = "none";
//     main.classList.add("show");
//   }, 3000);
// });