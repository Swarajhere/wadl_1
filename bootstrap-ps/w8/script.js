document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const form = document.getElementById('eventForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formMessage.innerHTML = '';

        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const event = document.getElementById('event').value;
        const attendees = document.getElementById('attendees').value;
        const comments = document.getElementById('comments').value.trim();

        // Reset form validation styles
        form.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.classList.remove('is-invalid');
        });

        // Validation flags
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        // Validate Full Name
        if (!fullName) {
            document.getElementById('fullName').classList.add('is-invalid');
            isValid = false;
        }

        // Validate Email
        if (!email || !emailRegex.test(email)) {
            document.getElementById('email').classList.add('is-invalid');
            isValid = false;
        }

        // Validate Phone Number
        if (!phone || !phoneRegex.test(phone)) {
            document.getElementById('phone').classList.add('is-invalid');
            isValid = false;
        }

        // Validate Event Selection
        if (!event) {
            document.getElementById('event').classList.add('is-invalid');
            isValid = false;
        }

        // Validate Number of Attendees
        if (!attendees || attendees < 1 || attendees > 10) {
            document.getElementById('attendees').classList.add('is-invalid');
            isValid = false;
        }

        // Display result
        if (isValid) {
            formMessage.innerHTML = `
                <div class="form-success">
                    <p>Registration successful for ${fullName}!</p>
                    <p>Event: ${event}</p>
                    <p>Attendees: ${attendees}</p>
                </div>
            `;
            form.reset();
        } else {
            formMessage.innerHTML = `
                <div class="form-error">
                    <p>Please correct the errors in the form.</p>
                </div>
            `;
        }
    });
});