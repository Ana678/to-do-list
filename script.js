// Abre a modal
function openModal() {
    document.getElementById('taskModal').style.display = 'flex';
    document.getElementById('taskInput').value = '';
    document.getElementById('taskInput').focus();
  }

  // Fecha a modal
  function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
  }

  // Adiciona tarefa da modal
  function addTaskFromModal() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    if (!taskText) return;

    createTaskElement(taskText);
    closeModal();
    saveTasksToLocalStorage();
  }

  // Cria elemento na lista
  function createTaskElement(text) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onchange = () => moveToDone(checkbox);
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(text));
    document.getElementById('todoList').appendChild(li);
  }

  function createTaskDoneElement(text) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    li.classList.add("li-done");
    checkbox.checked = true;
    checkbox.disabled = true;
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(text));
    document.getElementById('doneList').appendChild(li);
  }

  // Mover para lista de concluídos
  function moveToDone(checkbox) {
    const li = checkbox.parentElement;
    li.classList.add("li-done");
    checkbox.disabled = true;
    document.getElementById('doneList').appendChild(li);
    saveTasksToLocalStorage();
  }

  // LocalStorage
  function saveTasksToLocalStorage() {
    const todoList = Array.from(document.getElementById('todoList').children).map(li => li.textContent.trim());
    const doneList = Array.from(document.getElementById('doneList').children).map(li => li.textContent.trim());

    const data = {
      todo: todoList,
      done: doneList
    };
    localStorage.setItem('taskList', JSON.stringify(data));
  }

  // Carrega ao iniciar
  window.onload = function () {
    todoListElement = document.getElementById("todoList");
    doneListElement = document.getElementById("doneList");

    todoButtonElement = document.getElementById("todoListButton");
    doneButtonElement = document.getElementById("doneListButton");

    const saved = localStorage.getItem('taskList');
    if (!saved) return;
    const data = JSON.parse(saved);
    data.todo.forEach(task => createTaskElement(task));
    data.done.forEach(task => createTaskDoneElement(task));

    setTimeout(() => {
        doneListElement.style.display = "none";
    }, 0);

    todoButtonElement.addEventListener("click", () => {
        todoListElement.style.display = "flex";
        doneListElement.style.display = "none";

        todoButtonElement.classList.add("active");
        doneButtonElement.classList.remove("active");
    });

    doneButtonElement.addEventListener("click", () => {
        doneListElement.style.display = "flex";
        todoListElement.style.display = "none";

        doneButtonElement.classList.add("active");
        todoButtonElement.classList.remove("active");
    });

  };
