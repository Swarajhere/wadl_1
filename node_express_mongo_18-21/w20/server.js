const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/employeeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Employee Schema and Model
const employeeSchema = new mongoose.Schema({
    name: String,
    department: String,
    designation: String,
    salary: Number,
    joiningDate: Date
});

const Employee = mongoose.model('Employee', employeeSchema);

// API Routes
// Add a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// View all employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json({ success: true, data: employees });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// View a single employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update an employee
app.put('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
        res.status(200).json({ success: true, message: 'Employee deleted' });
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