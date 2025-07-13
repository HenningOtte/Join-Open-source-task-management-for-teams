let subtask = [];
let users = [];
let selectedPriority = "medium";
let assignedUserArr = [];

async function init() {
  let usersObj = await loadData("users");
  for (const key in usersObj) {
    users.push(usersObj[key]);
  }
}

function createSubObj(id, value) {
  return {
    id: id,
    value: value,
    edit: false,
  };
}

function preventFromSubmit(event) {
  event.preventDefault();
}

function toggleCategoryDropdown() {
  const categoryDropdown = document.getElementById("category-dropdown");
  const btn = document.getElementById("category-btn");
  const categoryContainer = document.getElementById("category-container");
  categoryDropdown.classList.toggle("d-none");
  btn.classList.toggle("rotate-180deg");
  categoryContainer.classList.toggle("boxshadow");
}

function activePriority(index) {
  const priorities = ["urgent", "medium", "low"];
  selectedPriority = priorities[index];
  priorities.forEach((priority) => {
    const btn = document.getElementById(priority);
    const icon = document.getElementById(`${priority}-btn-icon`);
    priority == priorities[index] ? prioBtnActive(btn, icon, priority) : prioBtnOff(btn, icon, priority);
  });
}

function prioBtnActive(btn, icon, priority) {
  btn.classList.add(`active-${priority}-btn`);
  icon.classList.add(`active-${priority}-icon`);
  selectedPriority = priority;
}

function prioBtnOff(btn, icon, priority) {
  btn.classList.remove(`active-${priority}-btn`);
  icon.classList.remove(`active-${priority}-icon`);
}

function addSubtask() {
  const inputElement = document.getElementById("subtask-input");
  const subList = document.getElementById("sub-list");
  if (inputElement.value.length == 0) return;
  let id = getNextFreeId();
  subtask.push(createSubObj(id, inputElement.value));
  subList.innerHTML += subListItem(inputElement.value, id);
  inputElement.value = "";
}

function getNextFreeId() {
  let i = 0;
  while (subtask.some((item) => item.id === i)) {
    i++;
  }
  return i;
}

function removeSubItem(value) {
  const newArr = subtask.filter((element) => element.id != value);
  subtask = newArr;
  reloadSubTask();
}

function reloadSubTask() {
  const subList = document.getElementById("sub-list");
  subList.innerHTML = "";
  subtask.forEach((element) => {
    if (element.edit == false) {
      subList.innerHTML += subListItem(element.value, element.id);
    } else {
      subList.innerHTML += subListItemEdit(element.value, element.id);
    }
  });
}

function editSubItem(id, editMode) {
  const input = document.getElementById(`sub-input-${id}`);
  for (let index = 0; index < subtask.length; index++) {
    if (subtask[index].id == id) {
      subtask[index].edit = editMode;
      if (input.value.length > 0) {
        subtask[index].value = input.value;
      }
      break;
    }
  }
  reloadSubTask();
}

function selectCategory(e) {
  let value = e.target.innerHTML;
  const selectCategory = document.getElementById("select-category");
  selectCategory.innerHTML = value;
  toggleCategoryDropdown();
}

function toggleAssignedDropdown() {
  const assignedDropdown = document.getElementById("assigned-dropdown");
  const btn = document.getElementById("assaign-btn");
  loadUsers();
  assignedDropdown.classList.toggle("d-none");
  btn.classList.toggle("rotate-180deg");
}

function loadUsers() {
  const assignedDropdown = document.getElementById("assigned-dropdown");
  assignedDropdown.innerHTML = "";
  users.forEach((user) => {
    let initials = initialsFromName(user.name);
    if (user.assigned) {
      assignedDropdown.innerHTML += singleUserContainer("single-user-container_select", initials, user.name, user.color);
    } else {
      assignedDropdown.innerHTML += singleUserContainer("single-user-container", initials, user.name, user.color);
    }
  });
}

function initialsFromName(user) {
  let initials = "";
  const array = user.split(" ");
  initials += array[0].charAt(0) + array[1].charAt(0);
  // console.log(user);
  // console.log(array);
  return initials;
}

function assignedUser(name) {
  let index = searchUserIndex(name);
  if (users[index].assigned === false) {
    users[index].assigned = true;
    loadUsers();
    loadAssignedUserIcons();
    assignedUserArr.push(users[index]);
  } else {
    users[index].assigned = false;
    loadUsers();
    loadAssignedUserIcons();
    removeUserFromArray(name);
  }
}

function searchUserIndex(name) {
  for (let index = 0; index < users.length; index++) {
    if (users[index].name == name) {
      return index;
    }
  }
}

function loadAssignedUserIcons() {
  const container = document.getElementById("icons-container");
  container.innerHTML = "";
  users.forEach((user) => {
    if (user.assigned) {
      let initials = initialsFromName(user.name);
      container.innerHTML += userIcon(user.color, initials, user.name);
    }
  });
}

function removeUserFromArray(name) {
  let arr = [];
  assignedUserArr.forEach((user) => {
    if (user.name != name) {
      arr.push(user);
    }
  });
  assignedUserArr = arr;
}

async function createTaskForm() {
  let title = document.getElementById("titleInput");
  let description = document.getElementById("description");
  let date = document.getElementById("date");
  let selectCategory = document.getElementById("select-category");

  let validateTask = isTaskDataValid(title, date, selectCategory);
  if (validateTask) return;
  let task = taskObjTemplate(title.value, description.value, date.value, selectedPriority, assignedUserArr, selectCategory.innerHTML, subtask);
  await createTask("tasks", task);
}

function isTaskDataValid(title, date, selectCategory) {
  let openCategory = document.getElementById("open-category-dropdown");
  let findError = false;
  if (title.value.trim().length <= 0) {
    showError(title, "title");
    findError = true;
  }
  if (selectCategory.innerHTML == "Select Task category") {
    showError(openCategory, "category");
    findError = true;
  }
  if (!date.value.trim()) {
    showError(date, "date");
    findError = true;
  }
  return findError;
}

function clearInputError(target, error) {
  target.classList.remove("light-red-outline");
  target.classList.add("blue-outline");
  error.innerHTML = "";
}

function showError(target, name) {
  let error = document.getElementById(`${name}Error`);
  target.classList.add("light-red-outline");
  target.classList.remove("blue-outline");
  error.innerHTML = "This field is required";
  target.addEventListener("click", () => {
    clearInputError(target, error);
  });
}

function taskObjTemplate(titel, description, date, priority, users, category, subtask, status = "to-do") {
  return {
    title: titel,
    description: description,
    date: date,
    priority: priority,
    assigned: users,
    category: category,
    subtask: subtask,
    status: status,
  };
}

function onFocusOut(e) {
  let target = e.target;
  target.classList.remove("light-red-outline");
  target.classList.remove("blue-outline");
}
