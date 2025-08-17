const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();
updateProgressBar(); // Add this line

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
});

function addTodo(){
    const todoText = todoInput.value.trim();
    if (todoText.length > 0 ) {
        const todoObject = {
            text: todoText,
            completed: false
        }

        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        updateProgressBar(); // Add this line
        todoInput.value = "";
    }
}

function updateTodoList(){
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex )=> {
        todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex){
    const todoLI= document.createElement('li');
    const todoId = "todo-" + todoIndex;
    const todoText = todo.text;
    todoLI.className = 'todo';
    todoLI.innerHTML =`
                <input type="checkbox" id="${todoId}">
                <label for="${todoId}" class="custom-checkbox"><svg fill = "transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></label>

                <label for="${todoId}" class="todo-text">${todoText}</label>
                <button class="delete-button"><svg fill = var(--text-color) xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
            `
    const deleteButton = todoLI.querySelector('.delete-button');
    deleteButton.addEventListener('click', function() {
        deleteTodoItem(todoIndex);
    });

    const todoCheckbox = todoLI.querySelector('input');
    todoCheckbox.addEventListener("click", ()=>{
        allTodos[todoIndex].completed = todoCheckbox.checked;
        saveTodos();
        updateProgressBar(); // Add this line
    });
    todoCheckbox.checked = todo.completed;



    return todoLI;
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, index) => index !== todoIndex);
    saveTodos();
    updateTodoList();
    updateProgressBar(); // Add this line
    
}

function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos" , todosJson);
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}



const durationButton = document.querySelector('.duration');

durationButton.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent event bubbling
    const timeList = document.querySelector('.time-list');
    timeList.style.display = timeList.style.display === 'none' ? 'flex' : 'none';
});

// Close the dropdown when clicking elsewhere
document.querySelector('.shedule').addEventListener('click', function(e) {
    if (!e.target.closest('.shedule')) {
        document.querySelector('.time-list').style.display = 'none';
    }
});


function updateProgressBar() {
    if (allTodos.length === 0) {
        document.querySelector('.progress-fill').style.width = '0%';
        document.querySelector('.progress-percent').textContent = '0%';
        return;
    }
    
    const completedCount = allTodos.filter(todo => todo.completed).length;
    const progressPercent = Math.round((completedCount / allTodos.length) * 100);
    
    document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
    document.querySelector('.progress-percent').textContent = `${progressPercent}%`;
}