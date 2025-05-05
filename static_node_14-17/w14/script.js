const API_BASE_URL = 'http://localhost:3000/api';

// Function to initialize data list
document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');

    // Fetch users from the API
    fetch(`${API_BASE_URL}/users`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const users = data.data;
                userList.innerHTML = '';

                users.forEach(user => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.mobile}</td>
                        <td>${user.dob}</td>
                        <td>${user.city}</td>
                        <td>${user.address}</td>
                        <td>${user.username}</td>
                    `;
                    userList.appendChild(tr);
                });
            } else {
                console.error('Error fetching users:', data.message);
                userList.innerHTML = '<tr><td colspan="7">Error loading users.</td></tr>';
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            userList.innerHTML = '<tr><td colspan="7">Error connecting to server.</td></tr>';
        });
});