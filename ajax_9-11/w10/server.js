const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Function to read tasks from tasks.json
function readTasks(callback) {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading tasks.json:', err);
            callback(err, []);
            return;
        }
        try {
            const tasks = data ? JSON.parse(data) : [];
            callback(null, tasks);
        } catch (parseErr) {
            console.error('Error parsing tasks.json:', parseErr);
            callback(parseErr, []);
        }
    });
}

// Function to write tasks to tasks.json
function writeTasks(tasks, callback) {
    fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to tasks.json:', err);
            callback(err);
            return;
        }
        callback(null);
    });
}

// API Endpoints
// GET /api/tasks - Fetch all tasks
app.get('/api/tasks', (req, res) => {
    readTasks((err, tasks) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error reading tasks' });
            return;
        }
        res.status(200).json({ success: true, data: tasks });
    });
});

// POST /api/tasks - Add a new task
app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    if (!newTask.description) {
        res.status(400).json({ success: false, message: 'Task description is required' });
        return;
    }

    readTasks((err, tasks) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error reading tasks' });
            return;
        }

        newTask.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        tasks.push(newTask);

        writeTasks(tasks, (writeErr) => {
            if (writeErr) {
                res.status(500).json({ success: false, message: 'Error saving task' });
                return;
            }
            res.status(200).json({ success: true, data: tasks });
        });
    });
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body;

    readTasks((err, tasks) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error reading tasks' });
            return;
        }

        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

        writeTasks(tasks, (writeErr) => {
            if (writeErr) {
                res.status(500).json({ success: false, message: 'Error updating task' });
                return;
            }
            res.status(200).json({ success: true, data: tasks });
        });
    });
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    readTasks((err, tasks) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error reading tasks' });
            return;
        }

        const updatedTasks = tasks.filter(task => task.id !== taskId);

        writeTasks(updatedTasks, (writeErr) => {
            if (writeErr) {
                res.status(500).json({ success: false, message: 'Error deleting task' });
                return;
            }
            res.status(200).json({ success: true, data: updatedTasks });
        });
    });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});