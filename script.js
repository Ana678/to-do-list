// Variáveis globais
let todoListElement;
let doneListElement;
let todoButtonElement;
let doneButtonElement;

// Abre a modal
function openModal() {
  document.getElementById('taskModal').style.display = 'flex';
  const input = document.getElementById('taskInput');
  input.value = '';
  input.focus();
}

// Fecha a modal
function closeModal() {
  document.getElementById('taskModal').style.display = 'none';
}

// Cria um item da lista "a fazer"
function createTaskElement(text) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.onchange = () => moveToDone(checkbox);

  const label = document.createElement('label');
  label.textContent = text;

  li.appendChild(checkbox);
  li.appendChild(label);
  todoListElement.appendChild(li);
}

// Cria um item na lista de "concluídas"
function createTaskDoneElement(text) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.disabled = true;

  const label = document.createElement('label');
  label.textContent = text;

  const trashIcon = document.createElement('i');
  trashIcon.classList.add('material-icons', 'delete-icon');
  trashIcon.textContent = 'delete';

  // Evento de exclusão
  trashIcon.addEventListener('click', () => {
    deleteItemFromLocalStorage(text);
    li.remove();
  });


  li.classList.add("li-done");
  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(trashIcon);
  doneListElement.appendChild(li);
}

function deleteItemFromLocalStorage(taskText){
    const storedData = JSON.parse(localStorage.getItem('taskList')) || { todo: [], done: [] };
    storedData.done = storedData.done.filter(item => item.trim() !== taskText.trim());
    localStorage.setItem('taskList', JSON.stringify(storedData));
}

// Move tarefa para a lista de concluídas
function moveToDone(checkbox) {
    const li = checkbox.parentElement;
    li.classList.add("li-done");
    checkbox.disabled = true;

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('material-icons', 'delete-icon');
    trashIcon.textContent = 'delete';
    trashIcon.addEventListener('click', () => {
        deleteItemFromLocalStorage(li.textContent.trim());
        li.remove();
    });

    li.appendChild(trashIcon);
    doneListElement.appendChild(li);

    // Atualiza visibilidade
    updateListVisibility();
    saveTasksToLocalStorage();
}

// Atualiza o que está visível: "a fazer" ou "concluído"
function updateListVisibility() {
  const todoActive = todoButtonElement.classList.contains("active");

  todoListElement.style.display = todoActive ? "flex" : "none";
  doneListElement.style.display = todoActive ? "none" : "flex";
}

// Salva tarefas no localStorage
function saveTasksToLocalStorage() {
  const todoList = Array.from(todoListElement.children).map(li => li.textContent.trim());
  const doneList = Array.from(doneListElement.children).map(li => li.textContent.trim());

  const data = {
    todo: todoList,
    done: doneList
  };

  localStorage.setItem('taskList', JSON.stringify(data));
}

// Adiciona nova tarefa vinda da modal
function addTaskFromModal() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();
  if (!taskText) return;

  createTaskElement(taskText);
  closeModal();
  saveTasksToLocalStorage();
}

// Carrega tarefas ao iniciar
window.onload = function () {
  // Referência aos elementos
  todoListElement = document.getElementById("todoList");
  doneListElement = document.getElementById("doneList");
  todoButtonElement = document.getElementById("todoListButton");
  doneButtonElement = document.getElementById("doneListButton");

  // Carrega do localStorage
  const saved = localStorage.getItem('taskList');
  if (saved) {
    const data = JSON.parse(saved);
    data.todo.forEach(task => createTaskElement(task));
    data.done.forEach(task => createTaskDoneElement(task));
  }

  document.getElementById("taskInput").addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addTaskFromModal();
    }
  });

  // Botões para alternar as listas
  todoButtonElement.addEventListener("click", () => {
    todoButtonElement.classList.add("active");
    doneButtonElement.classList.remove("active");
    updateListVisibility();
  });

  doneButtonElement.addEventListener("click", () => {
    doneButtonElement.classList.add("active");
    todoButtonElement.classList.remove("active");
    updateListVisibility();
  });

  // Exibe a lista "a fazer" por padrão
  todoButtonElement.classList.add("active");
  updateListVisibility();
};
