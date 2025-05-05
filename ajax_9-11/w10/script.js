const API_BASE_URL = 'http://localhost:3000/api';

// Function to send XHR requests
function sendRequest(method, url, data, callback) {
    const xhr = new XMLHttpRequest();
    
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    callback(response);
                } catch (err) {
                    callback({ success: false, message: 'Error parsing response' });
                }
            } else {
                callback({ success: false, message: `Request failed with status ${xhr.status}` });
            }
        }
    };

    xhr.onerror = function () {
        callback({ success: false, message: 'Network error occurred' });
    };

    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}

// Function to render tasks
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.description;
        input.readOnly = true;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = task.completed ? 'Undo' : 'Complete';
        toggleBtn.addEventListener('click', () => toggleTask(task.id));

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editTask(task.id, input));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(input);
        li.appendChild(toggleBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    sendRequest('GET', `${API_BASE_URL}/tasks`, null, (response) => {
        if (response.success) {
            renderTasks(response.data);
        } else {
            alert(response.message);
        }
    });

    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});

// Add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const description = taskInput.value.trim();

    if (!description) {
        alert('Please enter a task description.');
        return;
    }

    const newTask = {
        description: description,
        completed: false
    };

    sendRequest('POST', `${API_BASE_URL}/tasks`, newTask, (response) => {
        if (response.success) {
            renderTasks(response.data);
            taskInput.value = '';
        } else {
            alert(response.message);
        }
    });
}

// Toggle task completion
function toggleTask(id) {
    sendRequest('GET', `${API_BASE_URL}/tasks`, null, (response) => {
        if (response.success) {
            const task = response.data.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                sendRequest('PUT', `${API_BASE_URL}/tasks/${id}`, task, (updateResponse) => {
                    if (updateResponse.success) {
                        renderTasks(updateResponse.data);
                    } else {
                        alert(updateResponse.message);
                    }
                });
            }
        } else {
            alert(response.message);
        }
    });
}

// Edit a task
function editTask(id, input) {
    if (input.readOnly) {
        input.readOnly = false;
        input.focus();
        input.parentElement.querySelector('button:nth-child(3)').textContent = 'Save';
    } else {
        const newDescription = input.value.trim();
        if (!newDescription) {
            alert('Task description cannot be empty.');
            return;
        }

        sendRequest('GET', `${API_BASE_URL}/tasks`, null, (response) => {
            if (response.success) {
                const task = response.data.find(t => t.id === id);
                if (task) {
                    task.description = newDescription;
                    sendRequest('PUT', `${API_BASE_URL}/tasks/${id}`, task, (updateResponse) => {
                        if (updateResponse.success) {
                            renderTasks(updateResponse.data);
                        } else {
                            alert(updateResponse.message);
                        }
                    });
                }
            } else {
                alert(response.message);
            }
        });
    }
}

// Delete a task
function deleteTask(id) {
    sendRequest('DELETE', `${API_BASE_URL}/tasks/${id}`, null, (response) => {
        if (response.success) {
            renderTasks(response.data);
        } else {
            alert(response.message);
        }
    });
}