const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Serve static files (HTML, CSS, JS)
    if (pathname === '/' || pathname.endsWith('.html') || pathname.endsWith('.css') || pathname.endsWith('.js')) {
        let filePath;
        if (pathname === '/') {
            filePath = path.join(__dirname, 'data-list.html');
        } else {
            filePath = path.join(__dirname, pathname);
        }

        const ext = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript'
        }[ext] || 'text/plain';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
        return;
    }
    
    // API Endpoint: GET /api/users - Fetch all users
    if (pathname === '/api/users' && req.method === 'GET') {
        readUsers((err, users) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Error reading users' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: users }));
        });
        return;
    }

    // Handle 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});