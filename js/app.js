// buttons
const signUpButton = document.getElementById("signUpButton"),
	signInButton = document.getElementById("signInButton"),
	logoutButton = document.getElementById("logoutButton"),
	nickSignIn = document.getElementById("nickSignIn"),
	passSignIn = document.getElementById("passSignIn"),
	nickSignUp = document.getElementById("nickSignUp"),
	passSignUp = document.getElementById("passSignUp"),
	addContactButton = document.getElementById("addContactButton"),
	addNoteButton = document.getElementById("addNoteButton"),
	addTaskButton = document.getElementById("addTaskButton");
// inputs
const addNoteInput = document.getElementById("addNoteInput"),
	contactNameInput = document.getElementById("contactNameInput"),
	contactTelInput = document.getElementById("contactTelInput"),
	taskInput = document.getElementById("taskInput"),
	taskDateInput = document.getElementById("taskDateInput");
// data lists
const notesList = document.getElementById("notes-list"),
	contactsList = document.getElementById("contacts-list"),
	taskList = document.getElementById("tasks");
// other
let notesTemplate = document.querySelector('script[data-template="note-item"]').innerHTML,
	contactsTemplate = document.querySelector('script[data-template="contact-item"]').innerHTML,
	taskTemplate = document.querySelector('script[data-template="task-item"]').innerHTML,
	currentUser;

// adding event listeners
signUpButton.onclick = () => signUp(nickSignUp.value, passSignUp.value);
signInButton.onclick = () => signIn(nickSignIn.value, passSignIn.value);
logoutButton.onclick = () => logout();
addNoteButton.onclick = () => addNote(addNoteInput.value);
addContactButton.onclick = () => addContact(contactNameInput.value, contactTelInput.value, currentUser);
addTaskButton.onclick = () => addTask(taskInput.value, taskDateInput.value);

// adding classes
class User {
	constructor(nickName, password) {
		this.nickName = nickName;
		this.password = password;
	}
}

class Contact {
	constructor(contactName, contactTel) {
		this.contactName = contactName;
		this.contactTel = contactTel;
	}
}

class Task {
	constructor(taskText, taskDate) {
		this.taskText = taskText;
		this.taskDate = taskDate;
	}
}

function signUp(nickName, password) {
	let check = getStoredUser(nickName);
	if (nickName.length === 0 || password.length === 0) {
		alert("Поля имени и пароля не должны быть пустыми");
	} else if (check === null) {
		let user = new User(nickName, password);
		localStorage.setItem(nickName, JSON.stringify(user.nickName));
		localStorage.setItem(nickName + "Pass", JSON.stringify(user.password));
		alert("Вы зарегистрировались!");
		addNoteInput.removeAttribute("readonly");
		contactNameInput.removeAttribute("readonly");
		contactTelInput.removeAttribute("readonly");
		taskInput.removeAttribute("readonly");
		taskDateInput.removeAttribute("readonly");
		document.getElementById("signUp").style.display = "none";
		document.getElementById("signIn").style.display = "none";
		document.getElementById("logout").style.display = "flex";
		currentUser = nickName;
	} else {
		alert("Пользователь с данным именем уже существует!");
	}
}

function signIn(nickName, password) {
	let check = getStoredUser(nickName);
	if ((check !== null) && (password === JSON.parse(localStorage.getItem(`${nickName}Pass`)))) {
		alert("Добро пожаловать!");
		addNoteInput.removeAttribute("readonly");
		contactNameInput.removeAttribute("readonly");
		contactTelInput.removeAttribute("readonly");
		taskInput.removeAttribute("readonly");
		taskDateInput.removeAttribute("readonly");
		document.getElementById("signUp").style.display = "none";
		document.getElementById("signIn").style.display = "none";
		document.getElementById("logout").style.display = "block";
		nickSignIn.value = "";
		passSignIn.value = "";
		currentUser = nickName;
		loadAllNotes();
		loadContacts();
		loadTasks();
	} else {
		alert("Неправильный логин или пароль!");
	}
}

function logout() {
	document.getElementById("logout").style.display = "none";
	document.getElementById("signUp").style.display = "flex";
	document.getElementById("signIn").style.display = "flex";
	notesList.innerHTML = "";
	contactsList.innerHTML = "";
	taskList.innerHTML = "";
	currentUser = undefined;
}

function getStoredUser(nickKey) {
	return localStorage.getItem(nickKey);
}

//changing tabs
function changeTab(event, tab) {
	let tabContent = document.getElementsByClassName("tab-content"),
		tabLinks = document.getElementsByClassName("tablinks");
	for (let i = 0; i < tabContent.length; i++) {
		tabContent[i].style.display = "none";
	}
	for (let i = 0; i < tabLinks.length; i++) {
		tabLinks[i].className = tabLinks[i].className.replace(" active", "");
	}
	document.getElementById(tab).style.display = "block";
	event.currentTarget.className += " active";
}


// Notes section
function addNote(noteText) {
	if (noteText.length !== 0) {
		let noteItem = notesTemplate.replace(/{{noteText}}/g, noteText);
		notesList.insertAdjacentHTML("beforeEnd", noteItem);
		addNoteToStore(addNoteInput.value);
		addNoteInput.value = "";
	}
}

function deleteNote(event) {
	let deletedNote = event.target.parentNode.querySelector("span").innerHTML,
		notesArray = getStoredData(`${currentUser}Notes`),
		filteredArray = notesArray.filter(item => item !== deletedNote);
	localStorage.setItem(`${currentUser}Notes`, JSON.stringify(filteredArray));
	event.target.parentNode.remove();
}

function addNoteToStore(note) {
	let notesArray = getStoredData(`${currentUser}Notes`);
	notesArray.push(note);
	localStorage.setItem(`${currentUser}Notes`, JSON.stringify(notesArray));
}

function loadAllNotes() {
	let notesArray = getStoredData(`${currentUser}Notes`);
	if (notesArray !== null) {
		notesArray.forEach((item) => {
			let noteItem = notesTemplate.replace(/{{noteText}}/g, item);
			notesList.insertAdjacentHTML("beforeEnd", noteItem);
		});
	}
}

// Contacts section
function addContact(contactName, contactTel) {
	if (contactName.length !== 0 && contactTel.length !== 0) {
		let contact = new Contact(contactName, contactTel),
			contactItem = contactsTemplate.replace(/{{contactName}}/g, contactName);
		contactItem = contactItem.replace(/{{contactTel}}/g, contactTel);
		contactsList.insertAdjacentHTML("beforeEnd", contactItem);
		contactNameInput.value = "";
		contactTelInput.value = "";
		addContactToStore(contact);
	} else {
		alert("Введите все данные!");
	}
}

function deleteContact(event) {
	let deletedContactName = event.target.parentNode.querySelector("input").getAttribute("value"),
		contactsArray = getStoredData(`${currentUser}Contacts`),
		filteredArray = contactsArray.filter(item => item.contactName !== deletedContactName);
	localStorage.setItem(`${currentUser}Contacts`, JSON.stringify(filteredArray));
	event.target.parentNode.remove();
}

function changeContact(event) {
	let inputs = event.target.parentNode.getElementsByTagName("input"),
		name = event.target.parentNode.getElementsByTagName("input")[0].getAttribute("value"),
		tel = event.target.parentNode.getElementsByTagName("input")[1].getAttribute("value");
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].setAttribute("class", "input-change");
		inputs[i].removeAttribute("readonly");
	}
	event.target.innerHTML = "OK";
	event.target.addEventListener("click", confirmChange);

	function confirmChange() {
		let changedName = this.parentNode.getElementsByTagName("input")[0].value,
			changedTel = this.parentNode.getElementsByTagName("input")[1].value,
			contactsArray = getStoredData(`${currentUser}Contacts`);
		contactsArray.forEach(function (item) {
			if (item.contactName === name && item.contactTel === tel) {
				if (name !== changedName || tel !== changedTel) {
					item.contactName = changedName;
					item.contactTel = changedTel;
				}
			}
		});
		localStorage.setItem(`${currentUser}Contacts`, JSON.stringify(contactsArray));
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].removeAttribute("class");
			inputs[i].setAttribute("readonly", "");
		}
		this.innerHTML = "Изменить";
		this.removeEventListener("click", confirmChange);
		this.addEventListener("click", changeContact);
	}
}

function addContactToStore(contact) {
	let contactsArray = getStoredData(`${currentUser}Contacts`);
	contactsArray.push(contact);
	localStorage.setItem(`${currentUser}Contacts`, JSON.stringify(contactsArray));
}

function loadContacts() {
	let contactsArray = getStoredData(`${currentUser}Contacts`);
	if (contactsArray !== null) {
		contactsArray.forEach((item) => {
			let contactItem = contactsTemplate.replace(/{{contactName}}/g, item.contactName);
			contactItem = contactItem.replace(/{{contactTel}}/g, item.contactTel);
			contactsList.insertAdjacentHTML("beforeEnd", contactItem);
		});
	}
}

// ToDo section
function addTask(taskText, taskDate) {
	if (taskText.length !== 0 && taskDate.length !== 0) {
		let currentTime = new Date(),
			b = taskDate.split(/\D+/),
			taskDates = new Date(b[0], --b[1], b[2], b[3], b[4], b[5] || 0, b[6] || 0),
			task = new Task(taskText, taskDates),
			check = (taskDates.getTime() - currentTime.getTime() < 0) ? "checked" : "",
			taskItem = taskTemplate.replace(/{{checked}}/g, check);
		taskItem = taskItem.replace(/{{taskText}}/g, taskText);
		taskItem = taskItem.replace(/{{taskTime}}/g, `До ${taskDates.getDate()}.${taskDates.getMonth()}.${taskDates.getFullYear()} ${taskDates.getHours()}:${taskDates.getMinutes()}`);
		taskList.insertAdjacentHTML("beforeEnd", taskItem);
		taskInput.value = "";
		taskDateInput.value = "";
		addTaskToStore(task);
	} else {
		alert("Введите все данные!");
	}
}

function addTaskToStore(task) {
	let taskArray = getStoredData(`${currentUser}Tasks`);
	taskArray.push(task);
	localStorage.setItem(`${currentUser}Tasks`, JSON.stringify(taskArray));
}

function deleteTask(event) {
	let deletedTask = event.target.parentNode.querySelector("span").innerHTML,
		tasksArray = getStoredData(`${currentUser}Tasks`),
		filteredArray = tasksArray.filter(item => item.taskText !== deletedTask);
	localStorage.setItem(`${currentUser}Tasks`, JSON.stringify(filteredArray));
	event.target.parentNode.remove();
}

function loadTasks() {
	let tasksArray = getStoredData(`${currentUser}Tasks`);
	if (tasksArray !== null) {
		tasksArray.forEach((item) => {
			let currentTime = new Date(),
				b = item.taskDate.split(/\D+/),
				taskDates = new Date(b[0], --b[1], b[2], b[3], b[4], b[5] || 0, b[6] || 0),
				check = (taskDates.getTime() - currentTime.getTime() < 0) ? "checked" : "",
				taskItem = taskTemplate.replace(/checked/g, check);
			taskItem = taskItem.replace(/{{taskText}}/g, item.taskText);
			taskItem = taskItem.replace(/{{taskTime}}/g, `До ${taskDates.getDate()}.${taskDates.getMonth()}.${taskDates.getFullYear()} ${taskDates.getHours()}:${taskDates.getMinutes()}`);
			taskList.insertAdjacentHTML("beforeEnd", taskItem);
		});
	}
}

function getStoredData(key) {
	let dataArray = localStorage.getItem(key);
	return (dataArray === null || dataArray === "") ? dataArray = [] : dataArray = JSON.parse(dataArray);
}