const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookstoreDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Book Schema and Model
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    genre: String
});

const Book = mongoose.model('Book', bookSchema);

// API Routes
// Add a new book
app.post('/api/books', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Retrieve all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ success: true, data: books });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Retrieve a single book by ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
        res.status(200).json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update a book
app.put('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
        res.status(200).json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
        res.status(200).json({ success: true, message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Serve the UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});