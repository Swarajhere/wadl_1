const API_BASE_URL = 'http://localhost:3000/api';

// Send XHR requests
function sendRequest(method, url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(JSON.parse(xhr.responseText));
            } else {
                callback({ success: false, message: `Request failed with status ${xhr.status}` });
            }
        }
    };
    xhr.onerror = () => callback({ success: false, message: 'Network error occurred' });
    xhr.send(data ? JSON.stringify(data) : null);
}

// Validate email format
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate mobile number (10 digits)
function validateMobile(mobile) {
    return /^\d{10}$/.test(mobile);
}

// Validate date of birth (age 10-120)
function validateDob(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return birthDate <= today && age >= 10 && age <= 120;
}

// Display user details
function displayUserDetails(user) {
    const userDetailsDiv = document.getElementById('userDetails');
    userDetailsDiv.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Mobile:</strong> ${user.mobile}</p>
        <p><strong>Date of Birth:</strong> ${user.dob}</p>
        <p><strong>City:</strong> ${user.city}</p>
        <p><strong>Address:</strong> ${user.address}</p>
        <p><strong>Username:</strong> ${user.username}</p>
    `;
}

// Initialize forms
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login Form Handling
    if (loginForm) {
        const loginHeader = document.getElementById('loginHeader');
        const loginMessage = document.getElementById('loginMessage');
        const loginStatus = document.getElementById('loginStatus');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            document.getElementById('loginUsernameError').textContent = '';
            document.getElementById('loginPasswordError').textContent = '';
            loginMessage.textContent = '';

            let isValid = true;
            if (!username) {
                document.getElementById('loginUsernameError').textContent = 'Username is required.';
                isValid = false;
            }
            if (!password) {
                document.getElementById('loginPasswordError').textContent = 'Password is required.';
                isValid = false;
            }

            if (isValid) {
                sendRequest('POST', `${API_BASE_URL}/login`, { username, password }, (response) => {
                    if (response.success) {
                        loginHeader.textContent = 'Welcome Back!';
                        loginForm.style.display = 'none';
                        loginMessage.style.display = 'none';
                        loginStatus.style.display = 'block';
                        displayUserDetails(response.data);
                    } else {
                        loginMessage.className = 'message error';
                        loginMessage.textContent = response.message;
                    }
                });
            }
        });
    }

    // Registration Form Handling
    if (registerForm) {
        const registerMessage = document.getElementById('registerMessage');
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const mobile = document.getElementById('mobile').value.trim();
            const dob = document.getElementById('dob').value;
            const city = document.getElementById('city').value.trim();
            const address = document.getElementById('address').value.trim();
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            registerMessage.textContent = '';

            let isValid = true;
            if (!name) {
                document.getElementById('nameError').textContent = 'Name is required.';
                isValid = false;
            }
            if (!email) {
                document.getElementById('emailError').textContent = 'Email is required.';
                isValid = false;
            } else if (!validateEmail(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address.';
                isValid = false;
            }
            if (!mobile) {
                document.getElementById('mobileError').textContent = 'Mobile number is required.';
                isValid = false;
            } else if (!validateMobile(mobile)) {
                document.getElementById('mobileError').textContent = 'Please enter a valid 10-digit mobile number.';
                isValid = false;
            }
            if (!dob) {
                document.getElementById('dobError').textContent = 'Date of birth is required.';
                isValid = false;
            } else if (!validateDob(dob)) {
                document.getElementById('dobError').textContent = 'Please enter a valid date of birth (age 10-120 years).';
                isValid = false;
            }
            if (!city) {
                document.getElementById('cityError').textContent = 'City is required.';
                isValid = false;
            }
            if (!address) {
                document.getElementById('addressError').textContent = 'Address is required.';
                isValid = false;
            }
            if (!username) {
                document.getElementById('regUsernameError').textContent = 'Username is required.';
                isValid = false;
            }
            if (!password) {
                document.getElementById('regPasswordError').textContent = 'Password is required.';
                isValid = false;
            } else if (password.length < 6) {
                document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters long.';
                isValid = false;
            }

            if (isValid) {
                const newUser = { name, email, mobile, dob, city, address, username, password };
                sendRequest('POST', `${API_BASE_URL}/register`, newUser, (response) => {
                    if (response.success) {
                        registerMessage.className = 'message success';
                        registerMessage.textContent = response.message;
                        setTimeout(() => window.location.href = 'login.html', 2000);
                    } else {
                        registerMessage.className = 'message error';
                        registerMessage.textContent = response.message;
                    }
                });
            }
        });
    }
});