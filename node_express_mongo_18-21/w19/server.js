const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/student', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Schema and Model
const studentSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  CC_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_Marks: Number
});

const Student = mongoose.model('Student', studentSchema, 'studentmarks');

// c) Insert initial data
app.post('/api/insert', async (req, res) => {
  try {
    const students = [
      { Name: "ABC", Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_Marks: 25 },
      { Name: "John Doe", Roll_No: 112, WAD_Marks: 30, CC_Marks: 35, DSBDA_Marks: 22, CNS_Marks: 28, AI_Marks: 20 },
      { Name: "Jane Smith", Roll_No: 113, WAD_Marks: 15, CC_Marks: 30, DSBDA_Marks: 18, CNS_Marks: 25, AI_Marks: 35 },
      { Name: "Alice Brown", Roll_No: 114, WAD_Marks: 40, CC_Marks: 45, DSBDA_Marks: 30, CNS_Marks: 35, AI_Marks: 50 },
      { Name: "Bob Wilson", Roll_No: 115, WAD_Marks: 20, CC_Marks: 15, DSBDA_Marks: 10, CNS_Marks: 22, AI_Marks: 30 }
    ];
    await Student.deleteMany({});
    const inserted = await Student.insertMany(students);
    console.log(`Inserted ${inserted.length} students`);
    res.json({ success: true, message: 'Data inserted', count: inserted.length });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ success: false, message: 'Failed to insert data', error: err.message });
  }
});

// d) List all students with count
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    const count = await Student.countDocuments();
    res.json({ success: true, count, students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

// e) List students with DSBDA > 20
app.get('/api/dsbda', async (req, res) => {
  try {
    const students = await Student.find({ DSBDA_Marks: { $gt: 20 } });
    res.json({ success: true, students });
  } catch (err) {
    console.error('Error fetching DSBDA students:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch DSBDA students' });
  }
});

// f) Update marks by 10
app.put('/api/update/:roll', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { Roll_No: parseInt(req.params.roll) },
      {
        $inc: {
          WAD_Marks: 10,
          CC_Marks: 10,
          DSBDA_Marks: 10,
          CNS_Marks: 10,
          AI_Marks: 10
        }
      },
      { new: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) {
    console.error('Error updating marks:', err);
    res.status(500).json({ success: false, message: 'Failed to update marks' });
  }
});

// g) List students with all subjects > 25
app.get('/api/all25', async (req, res) => {
  try {
    const students = await Student.find({
      WAD_Marks: { $gt: 25 },
      CC_Marks: { $gt: 25 },
      DSBDA_Marks: { $gt: 25 },
      CNS_Marks: { $gt: 25 },
      AI_Marks: { $gt: 25 }
    }); // Removed 'Name' projection
    res.json({ success: true, students });
  } catch (err) {
    console.error('Error fetching all25 students:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch all25 students' });
  }
});

// h) List students with WAD and CNS < 40
app.get('/api/lowmarks', async (req, res) => {
  try {
    const students = await Student.find({
      WAD_Marks: { $lt: 40 },
      CNS_Marks: { $lt: 40 }
    }); // Removed 'Name' projection
    res.json({ success: true, students });
  } catch (err) {
    console.error('Error fetching lowmarks students:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch lowmarks students' });
  }
});

// i) Delete student
app.delete('/api/delete/:roll', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ Roll_No: parseInt(req.params.roll) });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));