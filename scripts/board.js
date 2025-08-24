function renderBoard(tasks) {
  removeTasks();
  removePlaceholder();

  if (tasks) {
    let categories = {};
    // Group tasks in categories to use forEach loop
    let entries = Object.entries(tasks);

    entries.forEach((task) => {
      if (!categories[task[1].status]) categories[task[1].status] = [];
      categories[task[1].status].push(task);
    });

    for (let status in categories) {
      let column = document.querySelector(`.column[data-task="${status}"]`);
      let taskWrapper = column.querySelector(".task-wrapper");

      if (taskWrapper) {
        // "a[1].order ?? 0" means: If a[1].order is not defined or null, use 0
        let sortedTasks = categories[status].sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0));

        sortedTasks.forEach((task) => {
          let taskTemplate = createTaskTemplate(task[0], task[1]);
          taskWrapper.innerHTML += taskTemplate;
        });
      }
    }
  }
  addPlaceholdersToEmptyColumns();
}

// function removeTasks() {
//   const columns = document.querySelectorAll(".column");
//   columns.forEach((column) => {
//     column.querySelectorAll(".task").forEach((task) => task.remove());
//   });
// }

function removeTasks() {
  const taskWrappers = document.querySelectorAll(".task-wrapper");
  taskWrappers.forEach((taskWrapper) => {
    taskWrapper.querySelectorAll(".task").forEach((task) => task.remove());
  });
}

// function removePlaceholder() {
//   const columns = document.querySelectorAll(".column");
//   columns.forEach((column) => {
//     column.querySelectorAll(".empty").forEach((empty) => empty.remove());
//   });
// }

function removePlaceholder() {
  const taskWrappers = document.querySelectorAll(".task-wrapper");
  taskWrappers.forEach((taskWrapper) => {
    taskWrapper.querySelectorAll(".empty").forEach((empty) => empty.remove());
  });
}

// LÖSCHEN? NOCH STEHEN LASSEN

// const columns = document.querySelectorAll(".column");
// columns.forEach((column) => {
//   column.querySelectorAll(".task").forEach((task) => task.remove());
//   column.querySelectorAll(".empty").forEach((empty) => empty.remove());
// });

function createCategoryClass(category) {
  // from e.g. "Technical Task" to "technical-task" for correct CSS class
  return category.toLowerCase().split(" ").join("-");
}

function checkForSubtask(subtasks) {
  if (subtasks) {
    let progressHTML = "";
    const numerus = subtasks.length === 1 ? "Subtask" : "Subtasks";
    const subtaskDone = subtasks.filter((subtask) => subtask.edit);
    progressHTML += createProgressWrapper(subtasks, numerus, subtaskDone);
    return progressHTML;
  } else {
    return "";
  }
}

function checkForAssignment(assignedUserArr) {
  if (assignedUserArr) {
    let personHTML = "";
    assignedUserArr.forEach((userObj) => {
      let username = createUsernameAbbreviation(userObj);
      personHTML += createPersonTemplate(userObj, username);
    });
    return personHTML;
  } else {
    return "";
  }
}

function createUsernameAbbreviation(userObj) {
  let usernameArr = userObj.name.split(" ");
  if (usernameArr.length > 1) {
    let usernameAbbr = usernameArr[0][0] + usernameArr[1][0];
    return usernameAbbr;
  }
}

function addPlaceholdersToEmptyColumns() {
  const taskWrappers = document.querySelectorAll(".task-wrapper");
  taskWrappers.forEach((taskWrapper) => {
    if (!taskWrapper.querySelector(".task") && !taskWrapper.querySelector(".empty")) {
      if (taskWrapper.dataset.task === "done") {
        taskWrapper.innerHTML += createTaskPlaceholderDone();
      } else {
        taskWrapper.innerHTML += createTaskPlaceholder();
      }
    }
  });
}

async function renderSelectedTask(taskId) {
  const overlayRef = document.getElementById("overlay");
  const task = await loadData(`tasks/${taskId}`);

  overlayRef.innerHTML = "";
  overlayRef.innerHTML += createDetailedTaskTemplate(taskId, task);
  openOverlay();
}

function checkForAssignmentDetailView(assignedUserArr) {
  if (assignedUserArr) {
    return createPersonTemplateDetailView(assignedUserArr);
  } else {
    return "";
  }
}

function createPersonList(assignedUserArr) {
  let html = "";
  assignedUserArr.forEach((userObj) => {
    let username = createUsernameAbbreviation(userObj);
    html += createPersonListItem(userObj, username);
  });
  return html;
}

function checkForSubtasksDetailView(taskId, subtaskArr) {
  if (subtaskArr) {
    return createSubtaskTemplate(taskId, subtaskArr);
  } else {
    return "";
  }
}

function createSubtaskList(taskId, subtaskArr) {
  let html = "";
  subtaskArr.forEach((subtaskObj) => {
    html += createSubtaskListItem(taskId, subtaskObj);
  });
  return html;
}

async function checkInOutSubtask(taskId, subtaskId) {
  let taskObj = await loadData("tasks/" + taskId);
  let subtaskRef = document.querySelector(`.btn-subtask[data-id="${subtaskId}"]`);
  let subtask = taskObj.subtask.find((subtask) => subtask.id == subtaskId);
  let selectedTask = document.getElementById(`${taskId}`);
  let subtaskProgress = selectedTask.querySelector(".progress-wrapper");
  subtaskRef.classList.toggle("checked");

  if (subtask) {
    subtask.edit = !subtask.edit;
    await putData("tasks/" + taskId, taskObj);

    if (subtaskProgress) {
      const numerus = taskObj.subtask.length === 1 ? "Subtask" : "Subtasks";
      const subtaskDone = taskObj.subtask.filter((st) => st.edit);
      subtaskProgress.innerHTML = progessTemplate(taskObj.subtask, numerus, subtaskDone);
    }
  }
}

async function deleteTask(path) {
  await deleteData(path);
  closeOverlay();
  try {
    await initBoard();
  } catch (error) {
    console.error(error);
  }
}

async function searchTasks() {
  const tasks = await loadData("/tasks");
  const desktopInput = document.getElementById("search-input-desktop").value.toLowerCase();
  const mobileInput = document.getElementById("search-input-mobile").value.toLowerCase();
  const searchInput = desktopInput || mobileInput;
  const tasksObjLength = Object.keys(tasks).length;

  for (let task in tasks) {
    const taskElement = document.querySelector(`.task[data-id="${task}"]`);
    if (taskElement) {
      const isVisible = tasks[task].title.toLowerCase().includes(searchInput) || tasks[task].description.toLowerCase().includes(searchInput);
      taskElement.classList.toggle("hidden", !isVisible);
    }
  }
  document.querySelectorAll(".empty").forEach((element) => element.classList.add("hidden"));
  const taskElements = document.querySelectorAll(".task.hidden");
  checkIfNoResults(tasksObjLength, taskElements);

  if (!searchInput) {
    document.querySelectorAll(".empty").forEach((element) => element.classList.remove("hidden"));
  }
}

function checkIfNoResults(totalTaskCount, hiddenTaskElements) {
  let noResultsRef = document.querySelector(".no-results");

  if (totalTaskCount === hiddenTaskElements.length) {
    noResultsRef.classList.remove("hidden");
  } else {
    noResultsRef.classList.add("hidden");
  }
}

async function editTask(taskId) {
  const task = await loadData(`tasks/${taskId}`);
  resetTaskData();
  prepareOverlay(taskId);
  await loadUsersTask();
  importEditElements(task);
  activePriority(task.priority);
  changeCategorie(task);
  loadSubTasks(task.subtask);
  renderAssignedUsers(task);
}

function prepareOverlay(taskId) {
  const overlayWrapper = document.getElementById("overlay-wrapper");
  overlayWrapper.innerHTML = "";
  overlayWrapper.innerHTML += editTaskTpl();
  overlayWrapper.innerHTML += okBtn(taskId);
}

function resetTaskData() {
  subtask = [];
  users = [];
  assignedUserArr = [];
}

function importEditElements(task) {
  const editTaskContainer = document.querySelector(".editTask-container");
  editTaskContainer.innerHTML += titleTaskTpl(task.title);
  editTaskContainer.innerHTML += descriptionTaskTpl(task.description);
  editTaskContainer.innerHTML += dateTaskTpl(task.date);
  editTaskContainer.innerHTML += prioTaskTpl();
  editTaskContainer.innerHTML += assignedTaskTpl();
  editTaskContainer.innerHTML += categoryTaskTpl();
  editTaskContainer.innerHTML += subtaskTpl();
  taskStatus = task.status;
}

function changeCategorie(task) {
  let selectCategory = document.getElementById("select-category");
  selectCategory.innerHTML = task.category;
}

function loadSubTasks(arr) {
  const subList = document.getElementById("sub-list");
  if (!arr) return;
  arr.forEach((task) => {
    subtask.push(task);
    task.edit = false;
    subList.innerHTML += subListItem(task.value, task.id);
  });
}

function renderAssignedUsers(task) {
  if (!task.assigned) return;
  task.assigned.forEach((user) => {
    assignedUser(user.name);
  });
}

async function saveEditedTask(taskId) {
  if (!taskId) return;
  let path = "tasks/" + taskId;
  let validateTask = isTaskDataValid();
  if (!validateTask) return;
  let task = taskObjTemplate(selectedPriority, assignedUserArr, subtask, taskStatus);
  await putData(path, task);
  await initBoard();
  await renderOpenTask(taskId);
  resetTaskData();
}

async function renderOpenTask(taskId) {
  const overlayRef = document.getElementById("overlay");
  const task = await loadData(`tasks/${taskId}`);
  overlayRef.innerHTML = "";
  let taskTemplate = createDetailedTaskTemplate(taskId, task).replace("transit", "");
  overlayRef.innerHTML += taskTemplate;
}

async function renderTaskFromBoard() {
  let validate = isTaskDataValid();
  if (!validate) return;
  await createTaskForm();
  closeAddTask();
  clearTaskFormContainers();
  await initBoard();
}

function clearTaskFormContainers() {
  let firstBoardAddTask = document.getElementById("firstBoardAddTask");
  let secondBoardAddTask = document.getElementById("secondBoardAddTask");
  firstBoardAddTask.innerHTML = "";
  secondBoardAddTask.innerHTML = "";
}

/*  Drag & Drop function  */

function dragstartHandler(ev, id) {
  ev.dataTransfer.setData("text", id);
  ev.target.classList.add("dragging");
}

function dragendHandler(ev) {
  ev.target.classList.remove("dragging");
}

function dragoverHandler(ev) {
  ev.preventDefault();
  const column = ev.target.closest(".task-wrapper");
  const afterElement = getDragAfterElement(column, ev.clientY);
  const draggable = document.querySelector(".dragging");

  if (afterElement == null) {
    column.appendChild(draggable);
  } else {
    column.insertBefore(draggable, afterElement);
  }
  adjustPlaceholders();
}

function getDragAfterElement(column, y) {
  const draggableElements = [...column.querySelectorAll(".draggable:not(.dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

async function dropHandler(ev, category) {
  ev.preventDefault();
  const taskId = ev.dataTransfer.getData("text");
  const targetColumn = ev.target.closest(".task-wrapper");
  let taskObj = await loadData("tasks/" + taskId);
  taskObj.status = category;

  if (targetColumn) {
    // adjustPlaceholders();
    await putData("tasks/" + taskId, taskObj);
    await adjustTaskOrder(targetColumn);
  }
}

function adjustPlaceholders() {
  removePlaceholder();
  addPlaceholdersToEmptyColumns();
}

async function adjustTaskOrder(targetColumn) {
  const tasksInColumn = targetColumn.querySelectorAll(".draggable");

  // tasksInColumn.forEach(async (task, index) => {
  //   const taskId = task.dataset.id;
  //   let taskObj = await loadData("tasks/" + taskId);
  //   taskObj.order = index;
  //   await putData("tasks/" + taskId, taskObj);
  // });

  if (tasksInColumn.length > 0) {
    for (let i = 0; i < tasksInColumn.length; i++) {
      const taskId = tasksInColumn[i].dataset.id;
      let taskObj = await loadData("tasks/" + taskId);
      taskObj.order = i;
      await putData("tasks/" + taskId, taskObj);
    }
  }
}

/*  Initializing  */

async function initBoard() {
  let taskObj = await loadData("tasks/");
  document.getElementById("search-input-desktop").value = "";
  document.getElementById("search-input-mobile").value = "";
  renderBoard(taskObj);
}

document.addEventListener("DOMContentLoaded", () => {
  initBoard();
});
