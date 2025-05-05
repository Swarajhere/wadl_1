const products = [
    { name: "Wireless Headphones", price: "₹7,999", description: "Noise-cancelling over-ear headphones.", image: "https://images.freeimages.com/images/large-previews/ea6/innovative-microchip-design-0410-5698015.jpg?fmt=webp&w=500" },
    { name: "Smartwatch", price: "₹12,999", description: "Fitness tracking smartwatch.", image: "https://images.freeimages.com/images/large-previews/ea6/innovative-microchip-design-0410-5698015.jpg?fmt=webp&w=500" },
    { name: "Gaming Mouse", price: "₹2,499", description: "Ergonomic gaming mouse.", image: "https://via.placeholder.com/100?text=Mouse" },
    { name: "Laptop Stand", price: "₹1,999", description: "Adjustable aluminium stand.", image: "https://via.placeholder.com/100?text=Stand" },
    { name: "Bluetooth Speaker", price: "₹4,999", description: "Portable waterproof speaker.", image: "https://via.placeholder.com/100?text=Speaker" },
    { name: "USB-C Hub", price: "₹3,499", description: "Multi-port USB-C adapter.", image: "https://via.placeholder.com/100?text=Hub" },
    { name: "Wireless Keyboard", price: "₹5,999", description: "Slim wireless keyboard.", image: "https://via.placeholder.com/100?text=Keyboard" },
    { name: "External SSD", price: "₹9,999", description: "1TB portable SSD.", image: "https://via.placeholder.com/100?text=SSD" },
    { name: "Webcam", price: "₹6,499", description: "1080p HD webcam.", image: "https://via.placeholder.com/100?text=Webcam" },
    { name: "Power Bank", price: "₹2,999", description: "20000mAh fast-charging power bank.", image: "https://via.placeholder.com/100?text=PowerBank" },
    { name: "Monitor", price: "₹14,999", description: "27-inch 4K monitor.", image: "https://via.placeholder.com/100?text=Monitor" },
    { name: "Mouse Pad", price: "₹999", description: "Large ergonomic mouse pad.", image: "https://via.placeholder.com/100?text=MousePad" }
];

const itemsPerPage = 10;
let currentPage = 1;

function displayProducts(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);

    const tbody = document.getElementById('product-body');
    tbody.innerHTML = '';

    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Product Image"><img src="${product.image}" alt="${product.name}"></td>
            <td data-label="Product Name">${product.name}</td>
            <td data-label="Price (INR ₹)">${product.price}</td>
            <td data-label="Description">${product.description}</td>
        `;
        tbody.appendChild(row);
    });

    const totalPages = Math.ceil(products.length / itemsPerPage);
    document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
    document.getElementById('prev-page').disabled = page === 1;
    document.getElementById('next-page').disabled = page === totalPages;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayProducts(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayProducts(currentPage);
    }
});

// Initial display
displayProducts(currentPage);