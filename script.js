const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');

let allTodos = {
    daily: getTodos('daily') || [],
    weekly: getTodos('weekly') || [],
    monthly: getTodos('monthly') || [],
    yearly: getTodos('yearly') || [],
    custom: getTodos('custom') || []
};

let currentTimeline = 'daily';

// ▼ Add the initialization code here ▼
document.addEventListener('DOMContentLoaded', () => {
    // Load all timelines
    const timelines = ['daily', 'weekly', 'monthly', 'yearly', 'custom'];
    timelines.forEach(timeline => {
        allTodos[timeline] = getTodos(timeline) || [];
        updateTodoList(timeline);
        updateProgressBar(timeline);
    });
    
    // Show default timeline
    showTimeline('daily');
});
// ▲ End of initialization code ▲


// Initialize all timelines
Object.keys(allTodos).forEach(timeline => {
    updateTodoList(timeline);
    updateProgressBar(timeline);
});

// Show daily timeline by default
showTimeline('daily');

function showTimeline(timeline) {
    // Hide all timelines
    document.querySelectorAll('.timeline-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected timeline
    document.querySelector(`.timeline-section[data-timeline="${timeline}"]`).classList.add('active');
    currentTimeline = timeline;
    
    // Scroll to the timeline
    document.querySelector(`.timeline-section[data-timeline="${timeline}"]`).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}


todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false,
            timeline: currentTimeline, // Track which timeline this belongs to
            createdAt: new Date().toISOString()
        };
        
        allTodos[currentTimeline].push(todoObject);
        updateTodoList(currentTimeline);
        saveTodos(currentTimeline);
        updateProgressBar(currentTimeline);
        todoInput.value = "";
    }
}

function updateTodoList(timeline = currentTimeline) {
    const timelineTodoList = document.querySelector(`.timeline-section[data-timeline="${timeline}"] .todo-list`);
    timelineTodoList.innerHTML = "";
    
    allTodos[timeline].forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex, timeline);
        timelineTodoList.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex, timeline) {
    const todoLI = document.createElement('li');
    const todoId = `todo-${timeline}-${todoIndex}`;
    const todoText = todo.text;
    
    todoLI.className = 'todo';
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label for="${todoId}" class="custom-checkbox">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">${todoText}</label>
        <button class="delete-button">
            <svg fill="var(--text-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;

    const deleteButton = todoLI.querySelector('.delete-button');
    deleteButton.addEventListener('click', function() {
        deleteTodoItem(todoIndex, timeline);
    });

    const todoCheckbox = todoLI.querySelector('input');
    todoCheckbox.addEventListener("click", () => {
        allTodos[timeline][todoIndex].completed = todoCheckbox.checked;
        saveTodos(timeline);
        updateProgressBar(timeline);
    });
    todoCheckbox.checked = todo.completed;

    return todoLI;
}

function deleteTodoItem(todoIndex, timeline) {
    allTodos[timeline] = allTodos[timeline].filter((_, index) => index !== todoIndex);
    saveTodos(timeline);
    updateTodoList(timeline);
    updateProgressBar(timeline);
}

function saveTodos(timeline) {
    localStorage.setItem(`todos_${timeline}`, JSON.stringify(allTodos[timeline]));
}

function getTodos(timeline) {
    return JSON.parse(localStorage.getItem(`todos_${timeline}`) || "[]");
}

function updateProgressBar(timeline) {
    const todos = allTodos[timeline];
    const progressFill = document.querySelector(`.timeline-section[data-timeline="${timeline}"] .progress-fill`);
    const progressPercent = document.querySelector(`.timeline-section[data-timeline="${timeline}"] .progress-percent`);

    if (todos.length === 0) {
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';
        return;
    }
    
    const completedCount = todos.filter(todo => todo.completed).length;
    const percent = Math.round((completedCount / todos.length) * 100);
    
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
}

// Timeline Navigation
const durationButton = document.querySelector('.duration');
durationButton.addEventListener('click', function(e) {
    e.stopPropagation();
    const timeList = document.querySelector('.time-list');
    timeList.classList.toggle('active');
});

// Close dropdown when clicking elsewhere
document.addEventListener('click', function(e) {
    if (!e.target.closest('.time-line')) {
        document.querySelector('.time-list').classList.remove('active');
    }
});

// Timeline selection
document.querySelectorAll('.time-list li').forEach(option => {
    option.addEventListener('click', function() {
        let timeline = this.textContent.toLowerCase().trim();
        if (timeline === 'customize time') {
            timeline = 'custom';
        }
        showTimeline(timeline);
        document.querySelector('.time-list').classList.remove('active');
    });
});