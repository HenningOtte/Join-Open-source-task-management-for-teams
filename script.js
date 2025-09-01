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
  let params = new URLSearchParams(window.location.search);
  element.innerHTML = createAvater(params.get("User"));
}

function checkUrlParams() {
  let params = new URLSearchParams(window.location.search);
  const newParams = new URLSearchParams({
    User: "Guest",
    Status: "to-do",
  });
  if (params.size == 0) {
    let url = window.location.href;
    window.location.href = `${url}?${newParams}`;
  } else return
}

function goToAddTaskPage(status) {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("User");
  const params = new URLSearchParams({
    User: userName,
    Status: status,
  });
  window.location.href = `../html-templates/add-task.html?${params}`; 
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
  const urlParams = new URLSearchParams(window.location.search);
  const links = document.querySelectorAll(`[data-task="${target}"]`);
  links.forEach((element) => {
    let newLink = element.href + `?${encodeURI(urlParams)}`;
    element.href = newLink;
  });
}

function isPrivacyMessage() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("User") === "privacy") adjustLayoutForPrivacyView();
}

function adjustLayoutForPrivacyView() {
  const ul = document.querySelector(".nav-wrapper").children[0];
  const navImg = document.querySelector(".nav-imgs");
  navImg.innerHTML = "";
  ul.innerHTML = "";
  ul.innerHTML += navLink("login", "../index.html", "Log in");
}

function initializeNavbar() {
  checkUrlParams();
  renderUserIcon();
  updateLinksWithUserKey("navLink");
}

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
