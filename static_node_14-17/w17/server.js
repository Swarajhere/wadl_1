const http = require('http');
const fs = require('fs');
const path = require('path');

// Read employees from employees.json
function getEmployees() {
    try {
        const data = fs.readFileSync('employees.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading employees.json:', err);
        return [];
    }
}

// Create HTTP server
const server = http.createServer((req, res) => {
    // Serve CSS
    if (req.url === '/styles.css') {
        const cssPath = path.join(__dirname, 'styles.css');
        fs.readFile(cssPath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('CSS not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
        return;
    }

    // Serve script.js
    if (req.url === '/script.js') {
        const jsPath = path.join(__dirname, 'script.js');
        fs.readFile(jsPath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('JS not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
        return;
    }

    // Serve images from the images directory
    if (req.url.startsWith('/images/')) {
        const imagePath = path.join(__dirname, req.url);
        fs.readFile(imagePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
                return;
            }
            const ext = path.extname(imagePath).toLowerCase();
            const contentType = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif'
            }[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
        return;
    }

    // API endpoint: GET /api/employees
    if (req.url === '/api/employees' && req.method === 'GET') {
        const employees = getEmployees();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: employees }));
        return;
    }

    // Serve index.html
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading page');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }

    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});