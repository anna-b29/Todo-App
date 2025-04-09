// Storage

// Hole alle Aufgaben aus localStorage. Falls noch keine Aufgaben gespeichert sind, gibt leeres Array zurück
function getTasksFromStorage(){
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Speichert ein Array von Aufgaben in localStorage
function saveTasksToStorage(tasks){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Fügt dem Array eine Aufgabe hinzu
function addTaskToStorage(task){
    const tasks = getTasksFromStorage();
    tasks.push(task);
    saveTasksToStorage(tasks);
}

// Filtert die Aufgabe mit der übergebenen Id heraus (diese wird gelöscht)
function removeTaskFromStorage(id){
    const tasks = getTasksFromStorage().filter(t => t.id !== id);
    saveTasksToStorage(tasks);
}

// Sucht nach Aufgabe mit derselben Id wie updatedTask, aktualisiert sie mit akuteller Aufgabe
function updateTaskInStorage(updatedTask){
    const tasks = getTasksFromStorage().map(t => 
        t.id === updatedTask.id ? updatedTask : t
    );
    saveTasksToStorage(tasks);
}


// Task UI

// Erstellt Aufgabenelement im HTML
function createTaskElement(task){
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    //Checkbox hinzufügen
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = () => {
        if (checkbox.checked) {
            updateTaskInStorage(task);
            span.style.textDecoration = "line-through";
            span.style.color = "gray";
        } else {
            span.style.textDecoration = "none";
            span.style.color = "black";
        }
    };
    checkbox.onchange();

    // Button zum Löschen von Aufgaben
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.onclick = () => {
        li.remove();
        removeTaskFromStorage(task.id);
    };

    // Button zum Bearbeiten von Aufgaben
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");

    editBtn.onclick = () => {
        //Eingabefeld für Bearbeitung
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.classList.add("editInput");
        editInput.value = task.text;

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Speichern";

        // Betätigung mit Enter
        editInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") saveBtn.click();
        });

        saveBtn.onclick = () => {
            // Falls nach dem Bearbeiten Leer, dann löschen
            // Andernfalls ersetzt alten Text mit neuen Text
            const newText = editInput.value.trim()
            if ( newText === "") {
                li.remove();
                removeTaskFromStorage(task.id);
            } else {
                task.text = newText;
                span.textContent = newText;
                updateTaskInStorage(task);
                li.replaceChild(span, editInput);
                li.replaceChild(editBtn, saveBtn);
            }
        };

        li.replaceChild(editInput, span);
        li.replaceChild(saveBtn, editBtn);
        
        //Fokus liegt sofort in Eingabefeld
        editInput.focus();
    };

    li.append(checkbox, span, editBtn, deleteBtn);
    return li;
}

// Add und Load

// Fügt eine neue Aufgabe hinzu
function addTask(){
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    const taskList = document.getElementById("taskList");

    if(text === ""){
        alert("Bitte eine Aufgabe eingeben.");
        return;
    }

    // Neues Aufgaben Objekt mit eindeutiger Id
    const newTask = {
        id: Date.now(),
        text,
        done: false
    }
    
    addTaskToStorage(newTask);
    const li = createTaskElement(newTask);
    taskList.appendChild(li);
    input.value = "";
}

// Lädt alle gespeicherten Aufgabe bei Seitenstart
function loadTasks(){
    const tasks = getTasksFromStorage();
    const taskList = document.getElementById("taskList");
    tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
}

// Init

// Übergibt Funktion loadTasks. Wird dann ausgeführt, wenn das Fenster fertig geladen wurde
window.onload = loadTasks;