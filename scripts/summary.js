function countTasks(tasks) {
  const taskTodoRef = document.querySelector("[data-task='to-do']");
  const taskDoneRef = document.querySelector("[data-task='done']");
  const taskUrgentRef = document.querySelector("[data-task='urgent']");
  const taskDeadlineRef = document.querySelector("[data-task='task-deadline']");
  const totalTasksRef = document.querySelector("[data-task='total-tasks']");
  const taskProgressRef = document.querySelector("[data-task='in-progress']");
  const taskFeddbackRef = document.querySelector("[data-task='await-feedback']");

  taskTodoRef.innerText = Object.values(tasks).filter((task) => task.status === taskTodoRef.dataset.task).length;
  taskDoneRef.innerText = Object.values(tasks).filter((task) => task.status === taskDoneRef.dataset.task).length;
  checkForUrgentTasks(tasks, taskUrgentRef, taskDeadlineRef);
  totalTasksRef.innerText = Object.values(tasks).length;
  taskProgressRef.innerText = Object.values(tasks).filter((task) => task.status === taskProgressRef.dataset.task).length;
  taskFeddbackRef.innerText = Object.values(tasks).filter((task) => task.status === taskFeddbackRef.dataset.task).length;
}

function checkForUrgentTasks(tasks, taskRef, deadlineRef) {
  let urgentTask = Object.values(tasks).filter((task) => task.priority === "urgent" && task.status !== "done");
  let sortedTaskObj = urgentTask.sort((a, b) => new Date(a.date) - new Date(b.date));
  let dateFormat = { year: "numeric", month: "long", day: "numeric" };

  taskRef.innerText = urgentTask.length;

  if (sortedTaskObj.length > 0 && sortedTaskObj[0].date) {
    let dateObj = new Date(sortedTaskObj[0].date);
    deadlineRef.innerText = dateObj.toLocaleDateString("en-US", dateFormat);
  } else {
    deadlineRef.innerText = "-";
  }
}

async function initSummary() {
  let taskObj = await loadData("tasks/");
  countTasks(taskObj);
  renderGreeting();
}

function renderGreeting() {
  const name = loadUrlParams();
  const container = document.querySelector(".greeting")
  let greetings = document.createElement("h2");
  let nameTag = document.createElement("p");
  container.innerHTML = "";  
  if (name == "Guest" || !name) {
    greetings.innerHTML = getGreeting();
    container.appendChild(greetings);
  } else {
    greetings.innerHTML = getGreeting() + ",";
    nameTag.innerHTML = name;
    container.appendChild(greetings);
    container.appendChild(nameTag);
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else if (hour >= 18 && hour < 22) {
    return "Good evening";
  } else {
    return "Hello";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSummary();
});