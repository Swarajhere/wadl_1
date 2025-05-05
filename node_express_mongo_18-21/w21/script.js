const API_BASE_URL = 'http://localhost:3000/api/books';

// Load books on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
});

// Load all books and display in table
async function loadBooks() {
    try {
        const response = await fetch(API_BASE_URL);
        const result = await response.json();
        if (result.success) {
            const tbody = document.getElementById('bookTableBody');
            tbody.innerHTML = '';
            result.data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>$${book.price.toFixed(2)}</td>
                    <td>${book.genre}</td>
                    <td>
                        <button onclick="editBook('${book._id}')">Edit</button>
                        <button onclick="deleteBook('${book._id}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error('Error loading books:', err);
    }
}

// Save or update book
async function saveBook() {
    const id = document.getElementById('bookId').value;
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: parseFloat(document.getElementById('price').value),
        genre: document.getElementById('genre').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        const result = await response.json();
        if (result.success) {
            resetForm();
            loadBooks();
        }
    } catch (err) {
        console.error('Error saving book:', err);
    }
}

// Edit book (populate form)
async function editBook(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const result = await response.json();
        if (result.success) {
            const book = result.data;
            document.getElementById('bookId').value = book._id;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('price').value = book.price;
            document.getElementById('genre').value = book.genre;
        }
    } catch (err) {
        console.error('Error editing book:', err);
    }
}

// Delete book
async function deleteBook(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            loadBooks();
        }
    } catch (err) {
        console.error('Error deleting book:', err);
    }
}

// Reset form
function resetForm() {
    document.getElementById('bookId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('price').value = '';
    document.getElementById('genre').value = '';
}