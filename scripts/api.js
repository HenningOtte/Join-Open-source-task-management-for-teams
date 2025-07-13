let BASE_URL = "https://join-52020-default-rtdb.europe-west1.firebasedatabase.app/";
// const BASE_URL = "https://api-test-31660-default-rtdb.europe-west1.firebasedatabase.app/";

function createUser(name = "Unknown User", email = "unknown@example.com", color = "#FF0000", assigned = "_empty") {
  return {
    name: name,
    email: email,
    color: color,
    assigned: [assigned],
  };
}

async function loadData(link) {
  let response = await fetch(BASE_URL + link + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

async function putUser(id, user) {
  let Link = `users/${id}`;
  let response = await fetch(BASE_URL + Link + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

function generateUserID(name) {
  let string = name.replace(" ", "");
  let id = string.charAt(0).toLowerCase() + string.slice(1);
  return id;
}

async function createTask(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseToJson = await response.json();
  return responseToJson;
}
