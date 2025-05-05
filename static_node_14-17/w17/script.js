const API_BASE_URL = 'http://localhost:3000/api';

// Fetch and render employees on page load
document.addEventListener('DOMContentLoaded', () => {
    const employeeList = document.getElementById('employeeList');
    const searchInput = document.getElementById('searchInput');

    // Fetch employees from the API
    fetch(`${API_BASE_URL}/employees`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const employees = data.data;
                renderEmployees(employees);

                // Filter employees based on search input
                searchInput.addEventListener('input', () => {
                    const query = searchInput.value.trim().toLowerCase();
                    const filteredEmployees = employees.filter(employee =>
                        employee.name.toLowerCase().includes(query)
                    );
                    renderEmployees(filteredEmployees);
                });
            } else {
                employeeList.innerHTML = '<p>Error loading employees.</p>';
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            employeeList.innerHTML = '<p>Error connecting to server.</p>';
        });
});

// Render employees to the DOM
function renderEmployees(employees) {
    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = '';
    employees.forEach(employee => {
        const div = document.createElement('div');
        div.className = 'employee';
        div.innerHTML = `
            <img src="${employee.profileImage}" alt="${employee.name}">
            <h3>${employee.name}</h3>
            <p>${employee.designation}</p>
            <p>Dept: ${employee.department}</p>
            <p>Salary: $${employee.salary.toLocaleString()}</p>
        `;
        employeeList.appendChild(div);
    });
}