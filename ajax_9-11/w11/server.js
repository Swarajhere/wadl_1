const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Function to read users from users.json
function readUsers(callback) {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.json:', err);
            callback(err, []);
            return;
        }
        try {
            const users = data ? JSON.parse(data) : [];
            callback(null, users);
        } catch (parseErr) {
            console.error('Error parsing users.json:', parseErr);
            callback(parseErr, []);
        }
    });
}

// Function to write users to users.json
function writeUsers(users, callback) {
    fs.writeFile('users.json', JSON.stringify(users, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to users.json:', err);
            callback(err);
            return;
        }
        callback(null);
    });
}

// API Endpoints
// GET /api/users - Fetch all users
app.get('/api/users', (req, res) => {
    readUsers((err, users) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error reading users' });
            return;
        }
        res.status(200).json({ success: true, data: users });
    });
});

// POST /api/register - Register a new user
app.post('/api/register', (req, res) => {
    const newUser = req.body;
    if (!newUser.name || !newUser.email || !newUser.mobile || !newUser.dob || !newUser.city || !newUser.address || !newUser.username || !newUser.password) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
    }

    readUsers((err, users) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error reading users' });
            return;
        }

        // Check if username already exists
        if (users.some(user => user.username === newUser.username)) {
            res.status(400).json({ success: false, message: 'Username already exists' });
            return;
        }

        // Assign a unique ID
        newUser.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        users.push(newUser);

        writeUsers(users, (writeErr) => {
            if (writeErr) {
                res.status(500).json({ success: false, message: 'Error saving user' });
                return;
            }
            res.status(200).json({ success: true, message: 'Registration successful! Redirecting to login...' });
        });
    });
});

// POST /api/login - Validate login credentials
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ success: false, message: 'Username and password are required' });
        return;
    }

    readUsers((err, users) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error reading users' });
            return;
        }

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful!', data: user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Serve login.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});