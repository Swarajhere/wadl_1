const API_BASE_URL = 'http://localhost:3000/api/employees';

// Load employees on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
});

// Load all employees and display in table
async function loadEmployees() {
    try {
        const response = await fetch(API_BASE_URL);
        const result = await response.json();
        if (result.success) {
            const tbody = document.getElementById('employeeTableBody');
            tbody.innerHTML = '';
            result.data.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${employee.department}</td>
                    <td>${employee.designation}</td>
                    <td>$${employee.salary}</td>
                    <td>${new Date(employee.joiningDate).toLocaleDateString()}</td>
                    <td>
                        <button onclick="editEmployee('${employee._id}')">Edit</button>
                        <button onclick="deleteEmployee('${employee._id}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error('Error loading employees:', err);
    }
}

// Save or update employee
async function saveEmployee() {
    const id = document.getElementById('employeeId').value;
    const employee = {
        name: document.getElementById('name').value,
        department: document.getElementById('department').value,
        designation: document.getElementById('designation').value,
        salary: parseFloat(document.getElementById('salary').value),
        joiningDate: document.getElementById('joiningDate').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        const result = await response.json();
        if (result.success) {
            resetForm();
            loadEmployees();
        }
    } catch (err) {
        console.error('Error saving employee:', err);
    }
}

// Edit employee (populate form)
async function editEmployee(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const result = await response.json();
        if (result.success) {
            const employee = result.data;
            document.getElementById('employeeId').value = employee._id;
            document.getElementById('name').value = employee.name;
            document.getElementById('department').value = employee.department;
            document.getElementById('designation').value = employee.designation;
            document.getElementById('salary').value = employee.salary;
            document.getElementById('joiningDate').value = new Date(employee.joiningDate).toISOString().split('T')[0];
        }
    } catch (err) {
        console.error('Error editing employee:', err);
    }
}

// Delete employee
async function deleteEmployee(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            loadEmployees();
        }
    } catch (err) {
        console.error('Error deleting employee:', err);
    }
}

// Reset form
function resetForm() {
    document.getElementById('employeeId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('department').value = '';
    document.getElementById('designation').value = '';
    document.getElementById('salary').value = '';
    document.getElementById('joiningDate').value = '';
}