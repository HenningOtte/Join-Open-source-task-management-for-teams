async function userExists(email) {
    let users = await loadData("/users")
    let validate = Object.values(users || {}).some(user => user.email === email.value);
    if (validate) {
        const error = document.querySelector('[data-field="errorEmail"]');
        error.innerHTML = "email already exist";
        email.style.border = "1px solid #ff8190";
        return validate;
    } else {
        email.style.border = "1px solid #ccc";
        return validate;
    }
}

async function initContactForm() {
    const form = document.querySelector("form.contact-container");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let email = document.getElementById("contact-email");
        const newUser = createUser(
            document.getElementById("contact-name").value,
            email.value,
            document.getElementById("contact-phone").value,
        );
        let checkEmail = await userExists(email);
        if (checkEmail) return
        await postData(`users`, newUser);
        loadContacts();
        closeOverlay();
    });
}

function getValue(id) {
    return document.getElementById(id)?.value.trim();
}

function getRandomColor() {
    const colors = ["#f1c40f", "#1abc9c", "#3498db", "#e67e22", "#9b59b6"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getInitials(name) {
    const trimmed = name.trim();
    const parts = trimmed.split(" ");
    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    const firstInitial = parts[0][0].toUpperCase();
    const secondInitial = parts[1][0].toUpperCase();
    return firstInitial + secondInitial;
}

function findOrCreateGroup(container, letter) {
    const allGroups = container.querySelectorAll(".contact-group");
    let group = null;

    for (let i = 0; i < allGroups.length; i++) {
        const label = allGroups[i].querySelector(".group-letter");
        if (label && label.textContent === letter) {
            group = allGroups[i];
            break;
        }
    }
    if (!group) {
        group = document.createElement("div");
        group.classList.add("contact-group");
        group.innerHTML = `<div class="group-letter">${letter}</div>`;
        container.appendChild(group);
    }
    return group;
}

async function deleteUser(path) {
    const userDetails = document.querySelector(".user-details");
    try {
        await deleteData(path);
        closeOverlay();
        userDetails.innerHTML = "";
        loadContacts();
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
    }
}

function removeUserFromHTML(path) {
    const userId = path.split("/")[1];
    const contactEl = document.querySelector(`[data-user-id="${userId}"]`);
    if (contactEl) contactEl.remove();
}

function editForm(id, user) {
    const form = document.querySelector("form.contact-container");
    editAvatar(user);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updateUser = createUser(
            document.getElementById("contact-name").value,
            document.getElementById("contact-email").value,
            document.getElementById("contact-phone").value,
            user.color,
            user.assigned,
            user.password
        );
        await putData(`users/${id}`, updateUser);
        openUserInfos(id);
        loadContacts();
        closeOverlay();
    });
}

function editAvatar(user) {
    const avatar = document.getElementById("avatar-edit");
    avatar.innerHTML = user.avatar;
    avatar.style.backgroundColor = user.color;
}

async function loadContacts() {
    let users = await loadData("users");
    let initials = getUniqueInitials(users);
    importContactGroups(users, initials);
}
loadContacts();

function getUniqueInitials(users) {
    let result = [];
    for (const key in users) {
        let initial = users[key].name.charAt(0).toUpperCase();
        if (!letterExists(result, initial)) {
            result.push(initial);
        }
    }
    result.sort();
    return result;
}

function letterExists(array, initial) {
    return array.includes(initial);
}

function importContactGroups(users, initials) {
    let contactsContainer = document.getElementById("contacts-container");
    contactsContainer.innerHTML = "";
    initials.forEach(letter => {
        let contactGroup = document.createElement("div");
        contactGroup.classList.add("contact-group");
        contactGroup = buildLetterGroup(contactGroup, letter, users);
        contactsContainer.appendChild(contactGroup);
    });
}

function buildLetterGroup(contactGroup, letter, users) {
    let groupLetter = createLetterBox(letter);
    contactGroup.appendChild(groupLetter);
    for (const key in users) {
        let initial = users[key].name.charAt(0).toUpperCase();
        if (initial === letter) {
            contactGroup.appendChild(createContactElement(users[key], key));
        }
    }
    return contactGroup;
}

function createLetterBox(letter) {
    let div = document.createElement("div");
    let span = document.createElement("span");
    div.classList.add("group-letter");
    span.innerHTML = letter;
    div.appendChild(span);
    return div
}

async function openUserInfos(id) {
    let user = await loadData(`users/${id}`);
    const contactField = document.querySelector(".contact-field");
    const usersInfo = document.querySelector(".info-container");
    contactField.style.display = "block";
    usersInfo.innerHTML = renderUserInfo(id, user);
    setTimeout(() => {
        const userDetails = document.querySelector(".user-details");
        userDetails.classList.add("translatex-user");
    }, 100);
}



function closeUserInfo() {
    const usersInfo = document.querySelector(".info-container");
    const userDetails = document.querySelector(".user-details");
    userDetails.classList.remove("translatex-user");
    setTimeout(() => {
        usersInfo.innerHTML = "";
    }, 250);
}

function openAddContact() {
    const overlay = document.getElementById("overlay");
    openOverlay();
    overlay.innerHTML = getContactOverlayTemplate();
    initContactForm();
}

async function editContactById(id) {
    const user = await loadData(`users/${id}`);
    openOverlay();
    editContactOverlay(user);
    editForm(id, user);
}

function hideContacts() {
    const contactField = document.querySelector(".contact-field");
    const infoContainer = document.querySelector(".info-container");
    infoContainer.innerHTML = "";
    contactField.style.display = "none";
    toggleContactBg();
}

function opencEditMenu() {
    const container = document.querySelector(".mobile-edit-delete");
    container.style.display = "block";
    setTimeout(() => {
        toggleEditMenu();
    }, 100)
}

function toggleEditMenu() {
    const editMenu = document.querySelector(".user-edit-container");
    editMenu.classList.toggle("edit-translateX");
}

function closeEditMenu() {
    const container = document.querySelector(".mobile-edit-delete");
    toggleEditMenu();
    setTimeout(() => {
        container.style.display = "none";
    }, 100)
}

function toggleContactBg(e) {
    const contacts = document.querySelectorAll(".contact");
    
    contacts.forEach(contact => {
        contact.classList.remove("contact-dark-blue");
    });
    if (!e) return;
    e.currentTarget.classList.add("contact-dark-blue");    
}

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("resize", () => {
        const contactField = document.querySelector(".contact-field");
        contactField.style.display = window.innerWidth > 860 ?  "block" : "none";
    });
});