const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB (creates 'music' database)
mongoose.connect('mongodb://localhost:27017/music', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Song Schema and Model (creates 'songdetails' collection)
const songSchema = new mongoose.Schema({
    Songname: String,
    Film: String,
    Music_director: String,
    Singer: String,
    Actor: String,
    Actress: String
});

const Song = mongoose.model('Song', songSchema, 'songdetails');

// Insert 5 songs on startup (Task c)
const initialSongs = [
    { Songname: 'ABC', Film: 'DEF', Music_director: 'GHI', Singer: 'JKL', Actor: 'MNO', Actress: 'PQR' },
    { Songname: 'Tum Hi Ho', Film: 'Aashiqui 2', Music_director: 'Mithoon', Singer: 'Arijit Singh' },
    { Songname: 'Kal Ho Naa Ho', Film: 'Kal Ho Naa Ho', Music_director: 'Shankar-Ehsaan-Loy', Singer: 'Sonu Nigam' },
    { Songname: 'Channa Mereya', Film: 'Ae Dil Hai Mushkil', Music_director: 'Pritam', Singer: 'Arijit Singh' },
    { Songname: 'Tere Bina', Film: 'Guru', Music_director: 'A.R. Rahman', Singer: 'Chinmayi' }
];

Song.countDocuments().then(count => {
    if (count === 0) {
        Song.insertMany(initialSongs)
            .then(() => console.log('Initial songs inserted'))
            .catch(err => console.error('Error inserting songs:', err));
    }
});

// API Routes
// d) List all songs with total count
app.get('/api/songs', async (req, res) => {
    try {
        const songs = await Song.find();
        const count = await Song.countDocuments();
        res.status(200).json({ success: true, count: count, data: songs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// e) List songs by specified Music Director
app.get('/api/songs/music-director/:musicDirector', async (req, res) => {
    try {
        const songs = await Song.find({ Music_director: req.params.musicDirector });
        res.status(200).json({ success: true, data: songs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// f) List songs by specified Music Director and Singer
app.get('/api/songs/music-director-singer/:musicDirector/:singer', async (req, res) => {
    try {
        const songs = await Song.find({ 
            Music_director: req.params.musicDirector, 
            Singer: req.params.singer 
        });
        res.status(200).json({ success: true, data: songs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// g) Delete a song
app.delete('/api/songs/:id', async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) return res.status(404).json({ success: false, error: 'Song not found' });
        res.status(200).json({ success: true, message: 'Song deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// h) Add a new song
app.post('/api/songs', async (req, res) => {
    try {
        const song = new Song(req.body);
        await song.save();
        res.status(201).json({ success: true, data: song });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// i) List songs by specified Singer from specified Film
app.get('/api/songs/singer-film/:singer/:film', async (req, res) => {
    try {
        const songs = await Song.find({ 
            Singer: req.params.singer, 
            Film: req.params.film 
        });
        res.status(200).json({ success: true, data: songs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// j) Update song to add Actor and Actress (called manually via UI or script)
app.put('/api/songs/:id', async (req, res) => {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!song) return res.status(404).json({ success: false, error: 'Song not found' });
        res.status(200).json({ success: true, data: song });
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