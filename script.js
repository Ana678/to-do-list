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
    li.classList.add('fade-in-up');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    li.onclick = () => moveToDone(checkbox);
    // checkbox.onchange = () => moveToDone(checkbox);

    const label = document.createElement('label');
    label.textContent = text;

    li.appendChild(checkbox);
    li.appendChild(label);
    todoListElement.appendChild(li);

    addDragEvents(li);
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
        li.classList.add('fade-out');
        setTimeout(() => {
            deleteItemFromLocalStorage(label.textContent.trim());
            li.remove();
            updateTaskCounter();
        }, 300);
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
    li.removeAttribute('draggable');
    const label = li.querySelector('label');
    li.classList.remove("fade-in-up");
    li.classList.add("li-done");
    checkbox.checked = true;
    checkbox.disabled = true;
    li.onclick = null;

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('material-icons', 'delete-icon');
    trashIcon.textContent = 'delete';

    trashIcon.addEventListener('click', () => {
        li.classList.add('fade-out');
        setTimeout(() => {
            deleteItemFromLocalStorage(label.textContent.trim());
            li.remove();
            updateTaskCounter();
        }, 300);
    });

    li.appendChild(trashIcon);
    doneListElement.appendChild(li);

    // Atualiza visibilidade
    updateListVisibility();
    saveTasksToLocalStorage();
    updateTaskCounter();
}

// Atualiza Lista Visível: "a fazer" ou "concluído"
function updateListVisibility() {
  const todoActive = todoButtonElement.classList.contains("active");

  todoListElement.style.display = todoActive ? "flex" : "none";
  doneListElement.style.display = todoActive ? "none" : "flex";

  document.getElementById("buttonAddToList").style.display = todoActive ? "flex" : "none";
}

// Salva tarefas no localStorage
function saveTasksToLocalStorage() {
  const todoList = Array.from(todoListElement.children).map(li => {
    const label = li.querySelector('label');
    return label ? label.textContent.trim() : '';
  });
  const doneList = Array.from(doneListElement.children).map(li => {
    const label = li.querySelector('label');
    return label ? label.textContent.trim() : '';
  });

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

    // Verifica duplicata
    const allTasks = [...todoListElement.children, ...doneListElement.children]
      .map(li => li.querySelector('label')?.textContent.trim().toLowerCase());

    if (allTasks.includes(taskText.toLowerCase())) {
      alert("Essa tarefa já existe!");
      return;
    }

    createTaskElement(taskText);
    closeModal();
    saveTasksToLocalStorage();
    updateTaskCounter();
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
    enableDragAndDrop();
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
    updateTaskCounter();
  });

  doneButtonElement.addEventListener("click", () => {
    doneButtonElement.classList.add("active");
    todoButtonElement.classList.remove("active");
    updateListVisibility();
    updateTaskCounter();
  });

  // Exibe a lista "a fazer" por padrão
  todoButtonElement.classList.add("active");
  updateListVisibility();
  updateTaskCounter();
};

function updateTaskCounter() {
    const totalTasks = todoListElement.children.length + doneListElement.children.length;
    const counterElement = document.getElementById('taskCounter');
    if(doneButtonElement.classList.contains("active")){
        counterElement.textContent = `${doneListElement.children.length}/${totalTasks} • ${Math.round(doneListElement.children.length*100/totalTasks) || 0}% foram concluídas`;
    }else{
        counterElement.textContent = `${todoListElement.children.length}/${totalTasks} • ${Math.round(todoListElement.children.length*100/totalTasks) || 0}% das tarefas a serem feitas`;
    }
}

function addDragEvents(element) {
    element.setAttribute('draggable', true);

    element.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', '');
        element.classList.add('dragging');
    });

    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
        saveTasksToLocalStorage(); // salva nova ordem
    });
}

function enableDragAndDrop() {
    // Aplica os eventos a todos os itens existentes
    const tasks = todoListElement.querySelectorAll('li');
    tasks.forEach(task => addDragEvents(task));

    // Evento no container da lista para detectar posição
    todoListElement.addEventListener('dragover', e => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        const siblings = [...todoListElement.querySelectorAll('li:not(.dragging)')];

        let insertBefore = null;
        for (const sibling of siblings) {
            const box = sibling.getBoundingClientRect();
            const offset = e.clientY - box.top - box.height / 2;
            if (offset < 0) {
                insertBefore = sibling;
                break;
            }
        }

        if (insertBefore) {
            todoListElement.insertBefore(dragging, insertBefore);
        } else {
            todoListElement.appendChild(dragging);
        }
    });
}
