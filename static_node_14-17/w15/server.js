const http = require('http');
const fs = require('fs');
const path = require('path');

// Read products from products.json
function getProducts() {
    try {
        const data = fs.readFileSync('products.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading products.json:', err);
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

    // Serve script.js (empty, but included for completeness)
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

    // Serve index.html with products
    if (req.url === '/' || req.url === '/index.html') {
        const products = getProducts();
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, template) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading page');
                return;
            }

            // Generate product HTML
            let productHtml = '';
            products.forEach(product => {
                productHtml += `
                    <div class="product">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                `;
            });

            // Inject product HTML into the template
            const html = template.replace('<!-- PRODUCTS -->', productHtml);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
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