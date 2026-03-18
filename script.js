document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const statsText = document.getElementById('stats');
    const emptyState = document.getElementById('empty-state');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    };

    const updateStats = () => {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        statsText.textContent = `${remainingTasks}개의 할 일이 남았습니다`;
        
        if (tasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    };

    const renderTasks = () => {
        todoList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <div class="todo-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span>${task.text}</span>
                </div>
                <button class="delete-btn">&times;</button>
            `;

            const todoContent = li.querySelector('.todo-content');
            todoContent.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    const checkbox = li.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                }
                toggleTask(task.id);
            });

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            todoList.appendChild(li);
        });
        updateStats();
    };

    const addTask = (text) => {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    };

    const toggleTask = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            addTask(text);
            todoInput.value = '';
        }
    });

    renderTasks();
});
