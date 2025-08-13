const { createElement } = require("react");

const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let allTodos = [];

todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addTodo();
});

function addTodo(){
    const todoText = todoInput.value.trim();
    if (todoText.length > 0 ) {
        allTodos.push(todoText);
        createTodoItem(todoText);
        todoInput.value = '';
    }
}

function createTodoItem(todo){
    const todoLi = document.createElement('li');
    todoLi.innerHTML =``
}

