// initialization
let signUpButton = document.getElementById("signUpButton"),
	signInButton = document.getElementById("signInButton"),
	logoutButton = document.getElementById("logoutButton"),
	nickSignIn = document.getElementById("nickSignIn"),
	passSignIn = document.getElementById("passSignIn"),
	nickSignUp = document.getElementById("nickSignUp"),
	passSignUp = document.getElementById("passSignUp"),
	addNoteInput = document.getElementById("addNoteInput"),
	addNoteButton = document.getElementById("addNoteButton"),
	contactNameInput = document.getElementById("contactNameInput"),
	contactTelInput = document.getElementById("contactTelInput"),
	addContactButton = document.getElementById("addContactButton"),
	taskInput = document.getElementById("taskInput"),
	taskDateInput = document.getElementById("taskDateInput"),
	addTaskInput = document.getElementById("addTaskInput"),
	notesList = document.getElementById("notes-list"),
	contactsList = document.getElementById("contacts-list"),
	taskList = document.getElementById("tasks"),
	currentUser;

// adding event handlers
signUpButton.addEventListener("click", signUpHandler);
signInButton.addEventListener("click", signInHandler);
logoutButton.addEventListener("click", logoutHandler);
addNoteButton.addEventListener("click", addNoteHandler);
addContactButton.addEventListener("click", addContactHandler);
addTaskInput.addEventListener("click", addTaskHandler);

function signUpHandler(){
	signUpButton ? signUp(nickSignUp.value, passSignUp.value) : false;
}
function signInHandler(){
	signInButton ? signIn(nickSignIn.value, passSignIn.value) : false;
}
function logoutHandler(){
	logoutButton ? logout() : false;
}
function addNoteHandler(){
	addNoteButton ? addNote(addNoteInput.value) : false;
}
function addContactHandler(){
	addContactButton ? addContact(contactNameInput.value, contactTelInput.value, currentUser) : false;
}
function addTaskHandler(){
	addTaskInput ? addTask(taskInput.value, taskDateInput.value) : false;
}


// adding classes
class User {
	constructor(nickName, password){
		this.nickName = nickName;
		this.password = password;
	}
}
class Contact {
	constructor(contactName, contactTel){
		this.contactName = contactName;
		this.contactTel = contactTel;
	}
}
class Task {
	constructor(taskText, taskDate){
		this.taskText = taskText;
		this.taskDate = taskDate;
	}
}

function signUp(nickName, password){
	let check = getStoredUser(nickName);
	var user;
	if(nickName.length == 0 || password.length == 0){
		alert("Поля имени и пароля не должны быть пустыми");
		return;
	} else if(check == null){
		user = new User(nickName, password);
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
	} else{
		alert("Пользователь с данным именем уже существует!");
	}
}
function signIn(nickName, password){
	let check = getStoredUser(nickName);
	if((check !== null) && (password == JSON.parse(localStorage.getItem(`${nickName}Pass`))) ){
		alert("Добро пожаловать!");
		addNoteInput.removeAttribute("readonly");
		contactNameInput.removeAttribute("readonly");
		contactTelInput.removeAttribute("readonly");
		taskInput.removeAttribute("readonly");
		taskDateInput.removeAttribute("readonly");
		document.getElementById("signUp").style.display = "none";
		document.getElementById("signIn").style.display = "none";
		document.getElementById("logout").style.display = "flex";
		currentUser = nickName;
		loadAllNotes();
		loadContacts();
		loadTasks();
	} else{
		alert("Неправильный логин или пароль!");
	}
}

function logout(){
	document.getElementById("logout").style.display = "none";
	document.getElementById("signUp").style.display = "flex";
	document.getElementById("signIn").style.display = "flex";
	notesList.innerHTML = "";
	contactsList.innerHTML = "";
	taskList.innerHTML = "";
	currentUser = undefined;
}

function getStoredUser(nickKey){
	let nick = localStorage.getItem(nickKey);
	return nick;
}

//changing tabs
function changeTab(event, tab){
	let tabContent = document.getElementsByClassName("tab-content");
	for(i = 0; i < tabContent.length; i++){
		tabContent[i].style.display = "none";
	}
	let tabLinks = document.getElementsByClassName("tablinks");
	for(i = 0; i < tabLinks.length; i++){
		tabLinks[i].className = tabLinks[i].className.replace(" active", "");
	}
	document.getElementById(tab).style.display = "block";
    event.currentTarget.className += " active";
}


// notes section
function addNote(noteText){
	if(noteText.length !== 0){
		let li = document.createElement("li");
		let span = document.createElement("span");
		let deleteLink = document.createElement("a");
		//span.innerHTML = addNoteInput.value;
		deleteLink.setAttribute("class", "deleteLink");
		deleteLink.setAttribute("href", "#");
		deleteLink.innerHTML = "Удалить";
		deleteLink.addEventListener("click", deleteNote);
		notesList.appendChild(li);
		li.appendChild(span);
		li.appendChild(deleteLink);
		addNoteToStore(addNoteInput.value);

	}
}

function deleteNote(){
	let deletedNote = this.parentNode.getElementsByTagName("span")[0].innerHTML;
	let notesArray = getStoredData(`${currentUser}Notes`);
	let filteredArray = notesArray.filter(item => item != deletedNote);
	localStorage.setItem(`${currentUser}Notes`, JSON.stringify(filteredArray));
	this.parentNode.remove();
}

function addNoteToStore(note){
	let notesArray = getStoredData(`${currentUser}Notes`);
	notesArray.push(note);
	localStorage.setItem(`${currentUser}Notes`, JSON.stringify(notesArray));
}

function loadAllNotes(){
	let notesArray = getSavedNotes();
	function getSavedNotes(){
		return getStoredData(`${currentUser}Notes`);
	}
	if (notesArray != null) {
		notesArray.forEach(function(item){
			let li = document.createElement("li");
			let span = document.createElement("span");
			let deleteLink = document.createElement("a");
			notesList.appendChild(li);
			span.innerHTML = item;
			deleteLink.setAttribute("class", "deleteLink");
			deleteLink.setAttribute("href", "#");
			deleteLink.innerHTML = "Удалить";
			deleteLink.addEventListener("click", deleteNote);
			notesList.appendChild(li);
			li.appendChild(span);
			li.appendChild(deleteLink);
		});
	}
}

// contacts section
function addContact(contactName, contactTel){
	if(contactName.length !== 0 && contactTel.length !== 0){
		let contact = new Contact(contactName, contactTel);
		let li = document.createElement("li");
		let nameInput = document.createElement("input");
		let telInput = document.createElement("input");
		let deleteLink = document.createElement("a");
		let changeLink = document.createElement("a");
		deleteLink.setAttribute("class", "deleteLink");
		deleteLink.setAttribute("href", "#");
		deleteLink.innerHTML = "Удалить";
		deleteLink.addEventListener("click", deleteContact);
		changeLink.setAttribute("class", "changeLink");
		changeLink.setAttribute("href", "#");
		changeLink.innerHTML = "Изменить";
		changeLink.addEventListener("click", changeContact);
		nameInput.setAttribute("value", contactName);
		telInput.setAttribute("value", contactTel);
		nameInput.setAttribute("type", "text");
		nameInput.setAttribute("readonly", "");
		telInput.setAttribute("type", "tel");
		telInput.setAttribute("readonly", "");
		li.appendChild(nameInput);
		li.appendChild(telInput);
		li.appendChild(changeLink);
		li.appendChild(deleteLink);
		contactsList.appendChild(li);
		addContactToStore(contact);
	} else{
		alert("Введите все данные");
	}
}

function deleteContact(){
	let deletedContact = this.parentNode.getElementsByTagName("input")[0].getAttribute("value");
	let contactsArray = getStoredData(`${currentUser}Contacts`);
	let filteredArray = contactsArray.filter(item => item.contactName != deletedContact);
	localStorage.setItem(`${currentUser}Contacts`, JSON.stringify(filteredArray));
	this.parentNode.remove();
}
function changeContact(){
	let inputs = this.parentNode.getElementsByTagName("input");
	let name = this.parentNode.getElementsByTagName("input")[0].getAttribute("value");
	let tel = this.parentNode.getElementsByTagName("input")[1].getAttribute("value");
	for(i = 0; i < inputs.length; i++){
		inputs[i].setAttribute("class", "input-change");
		inputs[i].removeAttribute("readonly");
	}
	this.innerHTML = "OK";
	this.addEventListener("click", confirmChange);
	function confirmChange(){
		let changedName = this.parentNode.getElementsByTagName("input")[0].value;
		let changedTel = this.parentNode.getElementsByTagName("input")[1].value;
		let contactsArray = getStoredData(`${currentUser}Contacts`);
		contactsArray.forEach(function(item){
			if(item.contactName == name && item.contactTel == tel){
				if(name !== changedName || tel !== changedTel){
					item.contactName = changedName;
					item.contactTel = changedTel;
				}
			}
		});
		localStorage.setItem(`${currentUser}Contacts`, JSON.stringify(contactsArray));;
		for(i = 0; i < inputs.length; i++){
			inputs[i].removeAttribute("class");
			inputs[i].setAttribute("readonly", "");
		}
		this.innerHTML = "Изменить";
		this.addEventListener("click", changeContact);
	}
}

function addContactToStore(contact){
	let contactsArray = getStoredData(`${currentUser}Contacts`);
	contactsArray.push(contact);
	localStorage.setItem(`${currentUser}Contacts`, JSON.stringify(contactsArray));
}

function loadContacts(){
	let contactsArray = getSavedContacts();
	function getSavedContacts(){
		return getStoredData(`${currentUser}Contacts`);
	}
	if (contactsArray != null) {
		contactsArray.forEach(function(item){
			let li = document.createElement("li");
			let nameInput = document.createElement("input");
			let telInput = document.createElement("input");
			let deleteLink = document.createElement("a");
			let changeLink = document.createElement("a");
			deleteLink.setAttribute("class", "deleteLink");
			deleteLink.setAttribute("href", "#");
			deleteLink.innerHTML = "Удалить";
			deleteLink.addEventListener("click", deleteContact);
			changeLink.setAttribute("class", "changeLink");
			changeLink.setAttribute("href", "#");
			changeLink.innerHTML = "Изменить";
			changeLink.addEventListener("click", changeContact);
			deleteLink.addEventListener("click", deleteContact);
			nameInput.setAttribute("value", item.contactName);
			telInput.setAttribute("value", item.contactTel);
			nameInput.setAttribute("type", "text");
			telInput.setAttribute("type", "tel");
			li.appendChild(nameInput);
			li.appendChild(telInput);
			li.appendChild(changeLink);
			li.appendChild(deleteLink);
			contactsList.appendChild(li);
		});
	}
}

// ToDo section
function addTask(taskText, taskDate){
	if(taskText.length !== 0 && taskDate.length !== 0){
		let currentTime = new Date();
		let taskTime = new Date();
		let taskDates = taskDate.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})/);
		taskTime.setFullYear(parseInt(taskDates[1]));
		taskTime.setMonth(parseInt(taskDates[2]) - 1);
		taskTime.setDate(parseInt(taskDates[3]));
		taskTime.setHours(parseInt(taskDates[4]));
		taskTime.setMinutes(parseInt(taskDates[5]));
		let task = new Task(taskText, taskTime);
		let checkbox = document.createElement("input");
		let li = document.createElement("li");
		let p = document.createElement("p");
		let span = document.createElement("span");
		let deleteLink = document.createElement("a");
		deleteLink.setAttribute("class", "deleteLink");
		deleteLink.setAttribute("href", "#");
		deleteLink.innerHTML = "Удалить";
		p.innerHTML = `До ${taskDates[3]}.${taskDates[2]}.${taskDates[1]} ${taskDates[4]}:${taskDates[5]}`;
		deleteLink.addEventListener("click", deleteTask);
		checkbox.setAttribute("type", "checkbox");
		if(taskTime.getTime() - currentTime.getTime() < 0){
				checkbox.setAttribute("checked", "");
		}
		span.innerHTML = taskText;
		taskList.appendChild(li);
		li.appendChild(checkbox);
		li.appendChild(span);
		li.appendChild(p);
		li.appendChild(deleteLink);
		addTaskToStore(task);
	} else{
		alert("Введите все данные!");
	}
}

function addTaskToStore(task){
	let taskArray = getStoredData(`${currentUser}Tasks`);
	taskArray.push(task);
	localStorage.setItem(`${currentUser}Tasks`, JSON.stringify(taskArray));
}

function deleteTask(){
	let deletedTask = this.parentNode.getElementsByTagName("span")[0].innerHTML;
	let tasksArray = getStoredData(`${currentUser}Tasks`);
	let filteredArray = tasksArray.filter(item => item.taskText != deletedTask);
	localStorage.setItem(`${currentUser}Tasks`, JSON.stringify(filteredArray));
	this.parentNode.remove();
}

function loadTasks(){
	let tasksArray = getSavedTasks();
	function getSavedTasks(){
		return getStoredData(`${currentUser}Tasks`);
	}
	if(tasksArray !== null){
		tasksArray.forEach(function(item){
			let currentTime = new Date();
			let taskTime = new Date();
			let taskDates = item.taskDate.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})/);
			taskTime.setFullYear(parseInt(taskDates[1]));
			taskTime.setMonth(parseInt(taskDates[2]) - 1);
			taskTime.setDate(parseInt(taskDates[3]));
			taskTime.setHours(parseInt(taskDates[5]));
			taskTime.setMinutes(parseInt(taskDates[6]));
			let checkbox = document.createElement("input");
			let li = document.createElement("li");
			let p = document.createElement("p");
			let span = document.createElement("span");
			let deleteLink = document.createElement("a");
			deleteLink.setAttribute("class", "deleteLink");
			deleteLink.setAttribute("href", "#");
			deleteLink.innerHTML = "Удалить";
			p.innerHTML = `До ${taskDates[3]}.${taskDates[2]}.${taskDates[1]} ${taskDates[5]}:${taskDates[6]}`;
			deleteLink.addEventListener("click", deleteTask);
			checkbox.setAttribute("type", "checkbox");
			if(taskTime.getTime() - currentTime.getTime() < 0){
				checkbox.setAttribute("checked", "");
			}
			span.innerHTML = item.taskText;
			taskList.appendChild(li);
			li.appendChild(checkbox);
			li.appendChild(span);
			li.appendChild(p);
			li.appendChild(deleteLink);
		});
	}
}

function getStoredData(key){
	let dataArray = localStorage.getItem(key);
	if(dataArray == null || dataArray == ""){
		dataArray = new Array();
	} else{
		dataArray = JSON.parse(dataArray);
	}
	return dataArray;
}