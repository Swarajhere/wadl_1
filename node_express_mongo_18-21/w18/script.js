const API_BASE_URL = 'http://localhost:3000/api/songs';

// Load songs on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSongs();
});

// Load all songs and display in table
async function loadSongs(url = API_BASE_URL) {
    try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
            const tbody = document.getElementById('songTableBody');
            tbody.innerHTML = '';
            const songs = result.data;
            document.getElementById('totalCount').textContent = result.count || songs.length;
            songs.forEach(song => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${song.Songname}</td>
                    <td>${song.Film}</td>
                    <td>${song.Music_director}</td>
                    <td>${song.Singer}</td>
                    <td>${song.Actor || '-'}</td>
                    <td>${song.Actress || '-'}</td>
                    <td>
                        <button onclick="updateSong('${song._id}')">Update Actor/Actress</button>
                        <button onclick="deleteSong('${song._id}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error('Error loading songs:', err);
    }
}

// Add a new song
async function addSong() {
    const song = {
        Songname: document.getElementById('songname').value,
        Film: document.getElementById('film').value,
        Music_director: document.getElementById('musicDirector').value,
        Singer: document.getElementById('singer').value,
        Actor: document.getElementById('actor').value || undefined,
        Actress: document.getElementById('actress').value || undefined
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(song)
        });
        const result = await response.json();
        if (result.success) {
            resetForm();
            loadSongs();
        }
    } catch (err) {
        console.error('Error adding song:', err);
    }
}

// Update song to add Actor and Actress
async function updateSong(id) {
    const actor = prompt('Enter Actor name:');
    const actress = prompt('Enter Actress name:');
    if (actor || actress) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Actor: actor, Actress: actress })
            });
            const result = await response.json();
            if (result.success) {
                loadSongs();
            }
        } catch (err) {
            console.error('Error updating song:', err);
        }
    }
}

// Delete song
async function deleteSong(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            loadSongs();
        }
    } catch (err) {
        console.error('Error deleting song:', err);
    }
}

// Filter songs based on inputs
async function filterSongs() {
    const musicDirector = document.getElementById('filterMusicDirector').value;
    const singer = document.getElementById('filterSinger').value;
    const film = document.getElementById('filterFilm').value;

    let url = API_BASE_URL;
    if (musicDirector && singer) {
        url = `${API_BASE_URL}/music-director-singer/${musicDirector}/${singer}`;
    } else if (singer && film) {
        url = `${API_BASE_URL}/singer-film/${singer}/${film}`;
    } else if (musicDirector) {
        url = `${API_BASE_URL}/music-director/${musicDirector}`;
    }

    loadSongs(url);
}

// Reset form
function resetForm() {
    document.getElementById('songId').value = '';
    document.getElementById('songname').value = '';
    document.getElementById('film').value = '';
    document.getElementById('musicDirector').value = '';
    document.getElementById('singer').value = '';
    document.getElementById('actor').value = '';
    document.getElementById('actress').value = '';
}